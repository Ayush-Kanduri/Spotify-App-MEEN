const express = require("express");
const router = express.Router();

const usersAPIRouterFile = require("./users");
const testAPIRouterFile = require("./test");
const albumsAPIRouterFile = require("./albums");
const artistsAPIRouterFile = require("./artists");
const playlistsAPIRouterFile = require("./playlists");
const genresAPIRouterFile = require("./genres");
const tracksAPIRouterFile = require("./tracks");

router.use("/test", testAPIRouterFile);
router.use("/users", usersAPIRouterFile);
router.use("/albums", albumsAPIRouterFile);
router.use("/genres", genresAPIRouterFile);
router.use("/tracks", tracksAPIRouterFile);
router.use("/artists", artistsAPIRouterFile);
router.use("/playlists", playlistsAPIRouterFile);

module.exports = router;
