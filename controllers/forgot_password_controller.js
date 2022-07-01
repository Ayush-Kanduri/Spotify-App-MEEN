const User = require("../models/user");
const ResetPasswordToken = require("../models/resetPasswordToken");
const crypto = require("crypto");
const queue = require("../config/kue");
const passwordsResetMailer = require("../mailers/password_reset_mailer");
const passwordResetEmailWorker = require("../workers/reset_password_email_worker");

module.exports.forgot = (req, res) => {
	return res.render("forgot_password", {
		title: "Forgot Password",
	});
};

module.exports.checkUser = async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });

		if (!user) {
			req.flash("error", "Email does not exist in our Database!");
			return res.redirect("/forgot-password");
		}

		let resetPasswordToken = await ResetPasswordToken.create({
			access_token: crypto.randomBytes(20).toString("hex"),
			isValid: true,
			user: user._id,
		});

		resetPasswordToken.expire_at = resetPasswordToken.createdAt;
		resetPasswordToken.save();

		if (!resetPasswordToken) {
			req.flash("error", "Error in creating the Reset Password Token!");
			return res.redirect("/forgot-password");
		}

		resetPasswordToken = await resetPasswordToken.populate({
			path: "user",
			select: "name email",
		});

		resetPasswordToken = resetPasswordToken.toObject();

		let url = `${req.protocol}://${req.get(
			"host"
		)}/forgot-password/reset-password/?accessToken=${
			resetPasswordToken.access_token
		}`;
		resetPasswordToken.url = url;

		let job = queue
			.create("passwordResetEmails", resetPasswordToken)
			.save((err) => {
				if (err) {
					console.log("Error in sending the Job to the Queue: ", err);
					return;
				}
			});
		req.flash("success", "Password Reset Link has been sent to your Email!");
		return res.redirect("/users/login");
	} catch (err) {
		console.log(err);
		req.flash("error", "Error in Finding the User");
		return res.redirect("/forgot-password");
	}
};

module.exports.reset = async (req, res) => {
	try {
		let resetPasswordToken = await ResetPasswordToken.findOne({
			access_token: req.query.accessToken,
		});
		return res.render("reset_password", {
			title: "Reset Password",
			accessToken: resetPasswordToken.access_token,
			isValid: resetPasswordToken.isValid,
		});
	} catch (err) {
		console.log(err);
		return res.redirect("/users/login");
	}
};

module.exports.updatePassword = async (req, res) => {
	try {
		const { password, confirm_password, token } = req.body;
		let resetPasswordToken = await ResetPasswordToken.findOne({
			access_token: token,
		});

		if (!resetPasswordToken) {
			req.flash("error", "Invalid Access Token!");
			return res.redirect("/users/login");
		}
		if (!resetPasswordToken.isValid) {
			req.flash("error", "Access Token has Expired!");
			return res.redirect("/users/login");
		}
		if (password !== confirm_password) {
			req.flash("error", "Password didn't match!");
			return res.redirect("back");
		}

		resetPasswordToken = await resetPasswordToken.populate("user");
		let user = resetPasswordToken.user;
		await User.findByIdAndUpdate(user._id, {
			password: password,
		});
		let result = await ResetPasswordToken.findOne({ access_token: token });
		result.isValid = false;
		result.save();
		req.flash("success", "Password has been Reset Successfully 🎉");
		return res.redirect("/users/login");
	} catch (err) {
		console.log(err);
		return res.redirect("/users/login");
	}
};
