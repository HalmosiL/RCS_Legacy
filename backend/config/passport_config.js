const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const db = require('../models/db.js')

function initialize(passport) {
	const authenticateUser = async (email, password, done) => {
		await db.findUserByEmail(email).then(async (row) => {
			if (!row || !row.length){
				return done(null, false, { message: 'No user with that email'})
			}

			try{
				if (await bcrypt.compare(password, row[0].password)){
					if (row[0].activated == true) {
						return done(null, row[0])
					} else {
						return done(null, false, { message: 'User is not activated'})
					}
				} else {
					return done(null, false, { message: 'Password incorrect'})	
				}
			} catch (e) {
				return done(e)
			}
		})
	}

	passport.use(
		new LocalStrategy({ usernameField: 'email'}
		,authenticateUser)
	)

	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser(async (id, done) => {
		await db.findUserByID(id).then((user) => {
			done(null, user)
		})
	})
}

initialize(passport)

module.exports = passport