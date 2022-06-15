const express = require("express");
const router = express.Router();

const homeRouterFile = require("./home");
const usersRouterFile = require("./users");
const searchRouterFile = require("./search");
const playlistsRouterFile = require("./playlists");

router.use("/", homeRouterFile);
router.use("/users", usersRouterFile);
router.use("/search", searchRouterFile);
router.use("/playlists", playlistsRouterFile);

module.exports = router;
