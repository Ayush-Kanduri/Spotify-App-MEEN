const express = require("express");
const router = express.Router();

const albumsController = require("../controllers/albums_controller");

router.get("/:id", albumsController.show);

module.exports = router;
