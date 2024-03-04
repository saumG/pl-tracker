// playersController.js
const { getPlayersData } = require("../utils/loadDataFromDB"); // Ensure this is the correct path and function

let cachedPlayers = null; // This will store the full players data
const cacheDuration = 60000; // Cache duration in milliseconds, e.g., 60000ms for 1 minute
let lastFetchTime = 0; // This will track when the last database fetch occurred

async function fetchOrGetCachedPlayers() {
  const currentTime = Date.now();
  // Check if we have cached data and it's still valid
  if (cachedPlayers && currentTime - lastFetchTime < cacheDuration) {
    return cachedPlayers; // Return cached data
  } else {
    // Fetch new data from the database
    const players = await getPlayersData();
    cachedPlayers = players; // Update the cache with the new data
    lastFetchTime = currentTime; // Update the time of the last fetch
    return players;
  }
}

// Function to extract trimmed player details from full player details
createTrimmedPlayersList = (fullPlayersList) => {
  return fullPlayersList.map((player) => ({
    id: player.id,
    first_name: player.first_name,
    second_name: player.second_name,
    position: player.singular_name_short,
  }));
};

exports.getAllPlayers = async (req, res) => {
  console.log("Fetching all players data");
  const players = await fetchOrGetCachedPlayers();
  console.log("Players data:", players); // Check what data you have
  res.json(players);
};

exports.getAllTrimmedPlayers = async (req, res) => {
  try {
    console.log("Fetching all trimmed players data");
    const fullPlayers = await fetchOrGetCachedPlayers();
    const trimmedPlayers = createTrimmedPlayersList(fullPlayers);
    res.json(trimmedPlayers);
  } catch (error) {
    console.error("Error fetching trimmed players:", error);
    res.status(500).send("Server error");
  }
};
