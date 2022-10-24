const express = require('express')
const router = express.Router()
const mail_service = require('../services/mail_service.js')
const db = require('../models/db.js')
const bcrypt = require('bcrypt')
const passport = require('passport')
const token_service = require('../services/token_service.js')
const checkNotAuthenticated = require('../services/auth_service').checkNotAuthenticated
const checkAuthenticated = require('../services/auth_service').checkAuthenticated

router.post('/logout', checkAuthenticated, (req, res) => {
    req.logout()
    res.status(200).send()
});

router.post('/islogedIn', checkAuthenticated, (req, res) => {
    return res.status(200)
});

router.post('/login', checkNotAuthenticated,(req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        return res.status(404).send({message: info.message })
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.status(200).send();
      });
    })(req, res, next);
});

router.post('/registrate', checkNotAuthenticated, (req, res) => {
    const err_message = "Can't registrate user something is wrong try again later"

    if(req.body.email === undefined 
        || req.body.name === undefined
        || req.body.password === undefined){
        res.status(401).send({ message: "wrong input" })
    } else {
        db.findUserByEmail(req.body.email).then(async (row) => {
            if(row && row.length){
                res.status(401).send({ message: "this email addres alredy taken" })
            } else {
                const hashedPassword = await bcrypt.hash(req.body.password, 8)

                db.registrateUser(req.body.email,req.body.name,hashedPassword)
                .then(() => {
                    const token = token_service()

                    mail_service.activasonEmail(req.body.email,token)

                    db.insertActiovasontoken(req.body.email,token).then(() => {
                        res.status(200).send({ message: "Email sent" })
                    }).catch((err) => {
                        console.error(err)
                        res.status(500).send({ message: err_message })
                    }) 
                }).catch((err) => {
                    console.error(err)
                    res.status(500).send({ message: err_message })
                })
            }
        }).catch((err) => {
            console.error(err)
            res.status(500).send({ message: err_message })
        })
    }
})

module.exports = router