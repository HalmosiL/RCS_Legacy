const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_Username,
    pass: process.env.EMAIL_Password
  }
})

module.exports = {
	activasonEmail: function (email,token) {
		var mailOptions = {
		  from: process.env.EMAIL_Username,
		  to: email,
		  subject: 'Successful registration!',
		  text: 'Activason key:' + token
		};

		transporter.sendMail(mailOptions,(error, info) => {
			console.log(error)
		});
	},

	forgotPasswordEmail :function (email,token) {
		var mailOptions = {
		  from: process.env.EMAIL_Username,
		  to: email,
		  subject: 'Password change!',
		  text: 'just then use this link if you want to change Password: http://' + process.env.DOMAIN + '/changePassword/' + token
		};

		transporter.sendMail(mailOptions, function(error, info){
		  if (error)
		    console.log(error);
		});

	}
}