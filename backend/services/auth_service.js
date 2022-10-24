module.exports = {
	checkAuthenticated: function checkAuthenticated(req,res,next) {
		if (req.isAuthenticated()) {
			return next()
		}

		res.status(401).send({message:'you have to login'})
	},

	checkNotAuthenticated: function checkNotAuthenticated(req,res,next) {
		if (req.isAuthenticated()) {
			return res.status(401).send({message:"you have to log out"})
		}

		next()
	}
}