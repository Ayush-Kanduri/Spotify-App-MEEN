const express = require("express");
const router = express.Router();
const passport = require("passport");

const playlistsController = require("../controllers/playlists_controller");

// keep the route with route parameter `/:id` below regular routes to avoid errors
router.get("/create", playlistsController.add);
router.post(
	"/create-playlist",
	passport.checkAuthentication,
	playlistsController.create
);
router.get(
	"/custom/:id",
	passport.checkAuthentication,
	playlistsController.custom
);
router.get("/:id", playlistsController.show);

module.exports = router;
