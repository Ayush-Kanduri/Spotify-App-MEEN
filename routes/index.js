const express = require("express");
const router = express.Router();

const homeRouterFile = require("./home");
const usersRouterFile = require("./users");
const searchRouterFile = require("./search");
const playlistsRouterFile = require("./playlists");
const artistsRouterFile = require("./artists");
const albumsRouterFile = require("./albums");
const friendsRouterFile = require("./friends");

router.use("/", homeRouterFile);
router.use("/users", usersRouterFile);
router.use("/search", searchRouterFile);
router.use("/playlists", playlistsRouterFile);
router.use("/artists", artistsRouterFile);
router.use("/albums", albumsRouterFile);
router.use("/friends", friendsRouterFile);

module.exports = router;
