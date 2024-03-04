// builderRoutes.js
const express = require("express");
const router = express.Router();
const { getBuiltTeam } = require("../controllers/builderController");

router.post("", getBuiltTeam);

module.exports = router;
