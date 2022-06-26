const express = require("express");
const router = express.Router();
const passport = require("passport");

const searchController = require("../controllers/search_controller");

router.get("/", passport.checkAuthentication, searchController.search);
router.get("/:value", passport.checkAuthentication, searchController.searchAPI);

module.exports = router;
