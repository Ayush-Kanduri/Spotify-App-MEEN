const User = require("../models/user");
const { validationResult } = require("express-validator");

module.exports.login = (req, res) => {
	return res.render("user_sign_in", {
		title: "Login",
	});
};

module.exports.signup = (req, res) => {
	return res.render("user_sign_up", {
		title: "Sign Up",
	});
};

module.exports.createSession = (req, res) => {
	// req.flash("success", "Logged In Successfully !!!");
	return res.redirect("/");
};

module.exports.destroySession = (req, res) => {};

module.exports.createUser = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = errors.array();
			console.log(error[0].msg);
			return res.redirect("back");
		}

		if (req.body.password !== req.body.confirm_password) {
			console.log("Password didn't match !!!");
			// req.flash("error", "Password didn't match !!!");
			return res.redirect("back");
		}

		const user = await User.findOne({ email: req.body.email });
		if (user) {
			console.log("Email already exists !!!");
			// req.flash("error", "Email already exists !!!");
			return res.redirect("back");
		}

		let newUser = await User.create(req.body);
		console.log("Signed Up Successfully !!!");
		// req.flash("success", "Signed Up Successfully !!!");
		return res.redirect("/users/login");
	} catch (error) {
		console.log("Error in creating the user !!!");
		// req.flash("error", "Error in creating the user !!!");
		return res.redirect("back");
	}
};
