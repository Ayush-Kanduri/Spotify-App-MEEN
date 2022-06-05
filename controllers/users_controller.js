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

module.exports.createSession = (req, res) => {};

module.exports.destroySession = (req, res) => {};

module.exports.createUser = (req, res) => {};
