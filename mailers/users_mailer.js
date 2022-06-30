const nodemailer = require("../config/nodemailer");
const env = require("../config/environment");

exports.newUser = (user) => {
	let htmlString = nodemailer.renderTemplate(
		{ user: user },
		"/users/new_user.ejs"
	);
	nodemailer.transporter.sendMail(
		{
			from: env.email_sender,
			to: user.email,
			subject: "User Verification | Welcome to The Spotify Clone App 🎊",
			html: htmlString,
		},
		(err, info) => {
			if (err) {
				console.log("Error in sending the email: ", err);
				return;
			}
			return;
		}
	);
};
