const express = require("express");
const router = express.Router();

const albumsAPIController = require("../../../controllers/api/v1/albums_api_controller");

router.get("/", albumsAPIController.getAllAlbums);
router.get("/:id", albumsAPIController.getAlbum);

module.exports = router;
