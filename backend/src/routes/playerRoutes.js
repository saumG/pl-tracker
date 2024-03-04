// playersRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllPlayers,
  getAllTrimmedPlayers,
} = require("../controllers/playerController");

router.get("/", getAllPlayers);
router.get("/trimmed", getAllTrimmedPlayers);

module.exports = router;
