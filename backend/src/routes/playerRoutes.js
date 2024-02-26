// playersRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllPlayers,
  searchPlayers,
} = require("../controllers/playerController");

router.get("/", getAllPlayers);
router.get("/search", searchPlayers);

module.exports = router;
