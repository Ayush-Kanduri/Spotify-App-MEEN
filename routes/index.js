const express = require("express");
const router = express.Router();

const homeRouterFile = require("./home");
const usersRouterFile = require("./users");
const searchRouterFile = require("./search");
const playlistsRouterFile = require("./playlists");
const artistsRouterFile = require("./artists");
const albumsRouterFile = require("./albums");
const friendsRouterFile = require("./friends");
const likesRouterFile = require("./likes");
const queueRouterFile = require("./queue");
const forgotPasswordRouterFile = require("./forgot_password");
const api = require("./api");

router.use("/", homeRouterFile);
router.use("/users", usersRouterFile);
router.use("/search", searchRouterFile);
router.use("/playlists", playlistsRouterFile);
router.use("/artists", artistsRouterFile);
router.use("/albums", albumsRouterFile);
router.use("/friends", friendsRouterFile);
router.use("/likes", likesRouterFile);
router.use("/queue", queueRouterFile);
router.use("/forgot-password", forgotPasswordRouterFile);
router.use("/api", api);

module.exports = router;
