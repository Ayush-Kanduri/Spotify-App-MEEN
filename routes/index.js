const express = require("express");
const router = express.Router();

const usersRouterFile = require("./users");
const homeRouterFile = require("./home");

router.use("/", usersRouterFile);
router.use("/home", homeRouterFile);

module.exports = router;
