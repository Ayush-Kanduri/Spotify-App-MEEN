const express = require("express");
const router = express.Router();

const artistsController = require("../controllers/artists_controller");

router.get("/:id", artistsController.show);

module.exports = router;
