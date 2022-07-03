const express = require("express");
const router = express.Router();

const testAPIController = require("../../../controllers/api/v1/test_api_controller");

router.get("/", testAPIController.welcome);
router.get("/query-params", testAPIController.queryParams);
router.get("/headers", testAPIController.headers);
router.post("/body", testAPIController.body);
router.get("/:name", testAPIController.params);

module.exports = router;
