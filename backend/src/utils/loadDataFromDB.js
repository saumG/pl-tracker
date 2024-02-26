const pg = require("pg");
const { Pool } = pg;

let playersData = [];
let teamsData = [];

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function loadPlayersData() {
  try {
    const players = await pool.query("SELECT * FROM players");
    playersData = players.rows; // Store the data in memory
    console.log("Players data loaded successfully");
  } catch (error) {
    console.error("Error loading players data:", error);
  }
}

async function getPlayersData() {
  await loadPlayersData();
  return playersData;
}

async function loadTeamsData() {
  try {
    const teams = await pool.query("SELECT * FROM teams");
    teamsData = teams.rows; // Store the data in memory
    console.log("Teams data loaded successfully");
  } catch (error) {
    console.error("Error loading teams data:", error);
  }
}

async function getTeamsData() {
  await loadTeamsData();
  return teamsData;
}

module.exports = { getPlayersData, getTeamsData };
