const express = require("express");
const router = express.Router();

const forgotPasswordController = require("../controllers/forgot_password_controller");

router.get("/", forgotPasswordController.forgot);
router.post("/check-user", forgotPasswordController.checkUser);
router.get("/reset-password", forgotPasswordController.reset);
router.post(
	"/reset-password/update-password",
	forgotPasswordController.updatePassword
);

module.exports = router;
