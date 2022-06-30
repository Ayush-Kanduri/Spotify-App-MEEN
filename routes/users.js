const express = require("express");
const passport = require("passport");
const router = express.Router();
const middleware = require("../config/middleware");

const usersController = require("../controllers/users_controller");

router.get("/login", usersController.login);
router.get("/verify_email", usersController.verifyEmail);
router.get("/signup", usersController.signup);
router.post(
	"/create-session",
	passport.authenticate("local", { failureRedirect: "/users/login" }),
	usersController.createSession
);
router.get(
	"/logout",
	passport.checkAuthentication,
	usersController.destroySession
);
router.get(
	"/recommendations",
	passport.checkAuthentication,
	usersController.recommendations
);
router.get(
	"/profile/:id",
	passport.checkAuthentication,
	usersController.profile
);
router.post(
	"/update/:id",
	passport.checkAuthentication,
	usersController.update
);
router.get("/library", passport.checkAuthentication, usersController.library);
router.get(
	"/liked-songs",
	passport.checkAuthentication,
	usersController.likedSongs
);
router.get("/share", passport.checkAuthentication, usersController.share);
router.post(
	"/create-user",
	middleware.validate("createUser"),
	usersController.createUser
);
router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/users/login" }),
	usersController.createSession
);
router.get(
	"/auth/spotify",
	passport.authenticate("spotify", {
		scope: [
			"user-read-email",
			"user-read-private",
			"playlist-read-collaborative",
			"user-library-read",
			"playlist-read-private",
		],
		showDialog: true,
	})
);
router.get(
	"/auth/spotify/callback",
	passport.authenticate("spotify", { failureRedirect: "/users/login" }),
	usersController.createSession
);

module.exports = router;
