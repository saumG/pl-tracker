// playersController.js
const { getPlayersData } = require("../utils/loadDataFromDB"); // Ensure this is the correct path and function

exports.getAllPlayers = async (req, res) => {
  console.log("Fetching all players data");
  const players = await getPlayersData();
  console.log("Players data:", players); // Check what data you have
  res.json(players);
};

exports.searchPlayers = (req, res) => {
  const { name, team } = req.query;
  try {
    // Filter theplayers array based on search parameters
    const filteredPlayers = players.filter((player) => {
      return (
        (!name || player.name.toLowerCase().includes(name.toLowerCase())) &&
        (!team || player.team === team)
      );
    });
    res.json(filteredPlayers);
  } catch (error) {
    res
      .status(500)
      .send("Server error, could not search/filter amongst players array");
  }
};
