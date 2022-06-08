const express = require("express");
const passport = require("passport");
const router = express.Router();
const middleware = require("../config/middleware");

const usersController = require("../controllers/users_controller");

router.get("/login", usersController.login);
router.get("/signup", usersController.signup);
router.post(
	"/create-session",
	passport.authenticate("local", { failureRedirect: "/users/login" }),
	usersController.createSession
);
router.get("/logout", usersController.destroySession);
router.post(
	"/create-user",
	middleware.validate("createUser"),
	usersController.createUser
);

module.exports = router;
