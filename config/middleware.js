const { body } = require("express-validator");

//Sets the Flash Message into the Response Session
module.exports.setFlash = (req, res, next) => {
	res.locals.flash = {
		success: req.flash("success"),
		error: req.flash("error"),
	};
	next();
};

//Validates the Sign Up Form Data at the router level before sending it to the Database
module.exports.validate = (method) => {
	switch (method) {
		case "createUser": {
			return [
				body("email", "Invalid Email").exists().isEmail(),
				body("password", "Password should be at least 6 Characters Long")
					.exists()
					.isLength({ min: 6 }),
				body("name", "Name must be at least 2 Characters Long")
					.exists()
					.isLength({ min: 2 }),
				body("avatar").optional(),
			];
		}
	}
};
