const express = require("express");
const router = express.Router();

const playlistsAPIController = require("../../../controllers/api/v1/playlists_api_controller");

router.get("/", playlistsAPIController.getAllPlaylists);
router.get("/:id", playlistsAPIController.getPlaylist);

module.exports = router;
