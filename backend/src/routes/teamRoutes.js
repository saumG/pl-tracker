// playersRoutes.js
const express = require("express");
const router = express.Router();
const { getAllTeams, searchTeams } = require("../controllers/teamController");

router.get("", getAllTeams);
router.get("/search", searchTeams);

module.exports = router;
