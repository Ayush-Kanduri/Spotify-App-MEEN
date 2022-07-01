const nodeMailer = require("../config/nodemailer");
const env = require("../config/environment");

exports.passwordReset = (resetPasswordToken) => {
	let htmlString = nodeMailer.renderTemplate(
		{ token: resetPasswordToken },
		"/users/reset_password.ejs"
	);

	let mailOptions = {
		from: env.email_sender,
		to: resetPasswordToken.user.email,
		subject: "Reset Password | The Spotify Clone App 🎊",
		html: htmlString,
	};

	nodeMailer.transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log("Error in sending the Mail: ", err);
			return;
		}
		return;
	});
};
