const express = require("express");
const router = express.Router();

const artistsAPIController = require("../../../controllers/api/v1/artists_api_controller");

router.get("/", artistsAPIController.getAllArtists);
router.get("/:id", artistsAPIController.getArtist);

module.exports = router;
