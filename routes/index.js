const express = require("express");
const router = express.Router();

const homeRouterFile = require("./home");
const usersRouterFile = require("./users");

router.use("/", homeRouterFile);
router.use("/users", usersRouterFile);

module.exports = router;
