const express = require("express");
const router = express.Router();

const usersAPIController = require("../../../controllers/api/v1/users_api_controller");

router.get("/", usersAPIController.getAllUsers);
router.post("/create-session", usersAPIController.createSession);
router.get("/:id", usersAPIController.getUser);

module.exports = router;
