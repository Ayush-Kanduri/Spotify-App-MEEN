const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/login", usersController.login);
router.get("/signup", usersController.signup);
router.get("/create-session", usersController.createSession);
router.get("/logout", usersController.destroySession);
router.get("/create-user", usersController.createUser);

module.exports = router;
