// TeamsController.js
const { getTeamsData } = require("../utils/loadDataFromDB"); // Ensure this is the correct path and function

exports.getAllTeams = async (req, res) => {
  console.log("Fetching all teams data");
  const teams = await getTeamsData();
  console.log("teams data:", teams); // Check what data you have
  res.json(teams);
};

exports.searchTeams = (req, res) => {
  const { name, team } = req.query;
  try {
    // Filter the teamsData array based on search parameters
    const filteredTeams = teamsData.filter((team) => {
      return !name || team.name.toLowerCase().includes(name.toLowerCase());
    });
    res.json(filteredTeams);
  } catch (error) {
    res
      .status(500)
      .send("Server error, could not search/filter amongs teamsData array");
  }
};
