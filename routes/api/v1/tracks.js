const express = require("express");
const router = express.Router();

const tracksAPIController = require("../../../controllers/api/v1/tracks_api_controller");

router.get("/", tracksAPIController.getAllTracks);
router.get("/:id", tracksAPIController.getTrack);

module.exports = router;
