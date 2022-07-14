const express = require("express");
const router = express.Router();
const passport = require("passport");

const queueController = require("../controllers/queue_controller");

router.get("/", passport.checkAuthentication, queueController.getQueueData);
router.post("/add", passport.checkAuthentication, queueController.addQueueData);
router.post(
	"/add-songs",
	passport.checkAuthentication,
	queueController.addPlaylistQueue
);
router.put("/shuffle", passport.checkAuthentication, queueController.shuffle);
router.put("/volume", passport.checkAuthentication, queueController.volume);
router.put("/repeat", passport.checkAuthentication, queueController.loop);
router.put("/update", passport.checkAuthentication, queueController.update);
router.delete("/clear", passport.checkAuthentication, queueController.clear);

module.exports = router;
