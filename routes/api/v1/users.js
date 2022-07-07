const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportJWT = require("../../../config/passport-jwt-strategy");
const middleware = require("../../../config/middleware");

const usersAPIController = require("../../../controllers/api/v1/users_api_controller");

router.get("/", usersAPIController.getAllUsers);
router.post("/create-session", usersAPIController.createSession);
router.get("/verify", usersAPIController.verify);

//** Renew Access Token Middleware **//
//If the Access Token Expires, then Create a New Access Token, then Go Further to the Passport Authentication
//If the Access Token Exists Already, then Go Further to the Passport Authentication

//** Passport Middleware **//
//Authenticates the User using the Access Token & Sets the User in the Request

/* 
If the Access Token Exists, then it is Passed into every Request Headers towards the Next Route 
*/

router.get(
	"/logout",
	middleware.renewAccessToken,
	passport.authenticate("jwt", { session: false }),
	usersAPIController.logout
);
router.get(
	"/update/:id",
	middleware.renewAccessToken,
	passport.authenticate("jwt", { session: false }),
	usersAPIController.update
);
router.get("/:id", usersAPIController.getUser);

module.exports = router;
