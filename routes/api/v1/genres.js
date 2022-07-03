const express = require("express");
const router = express.Router();

const genresAPIController = require("../../../controllers/api/v1/genres_api_controller");

router.get("/", genresAPIController.getAllGenres);
router.get("/:id", genresAPIController.getGenre);

module.exports = router;
