const express = require("express");
const router = express.Router();
const passport = require("passport");

const shareController = require("../controllers/share_controller");

//Creates a new share link
router.get("/", passport.checkAuthentication, shareController.createShareLink);
//Shows the Shared Link Page 
router.get("/:id", shareController.share);

module.exports = router;
