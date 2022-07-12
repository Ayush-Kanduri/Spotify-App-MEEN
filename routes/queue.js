const express = require("express");
const router = express.Router();
const passport = require("passport");

const queueController = require("../controllers/queue_controller");

router.get("/", passport.checkAuthentication, queueController.getQueueData);
router.post("/add", passport.checkAuthentication, queueController.addQueueData);
router.put("/volume", passport.checkAuthentication, queueController.volume);
router.put("/update", passport.checkAuthentication, queueController.update);
router.delete("/clear", passport.checkAuthentication, queueController.clear);

router.get("/pause", passport.checkAuthentication, queueController.pause);
router.get("/next", passport.checkAuthentication, queueController.pause);
router.get("/previous", passport.checkAuthentication, queueController.pause);

module.exports = router;
