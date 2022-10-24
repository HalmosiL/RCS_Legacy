const randomstring = require("randomstring")

module.exports = function() {
	return randomstring.generate(process.env.ACTIVASON_TOKEN_Length)
}