const express = require("express");
const { fetchFPLData } = require("./src/utils/fetchFPLData");
const cron = require("node-cron");
const { getPlayersData, getTeamsData } = require("./src/utils/loadDataFromDB");
const playerRoutes = require("./src/routes/playerRoutes");
const teamRoutes = require("./src/routes/teamRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Schedule the function to run once a week. Adjust the cron pattern as needed.
// 0 0 * * 0 is for every Sunday at midnight. Adjust according to your needs.
// cron.schedule("0 0 * * 0", () => {
//   console.log("Fetching FPL data...");
//   fetchFPLData();
// });

getPlayersData()
  .then(() => console.log("Initialized playersData in memory"))
  .catch((err) => console.error("Failed to initialize playersData", err));

getTeamsData()
  .then(() => console.log("Initialized teamsData in memory"))
  .catch((err) => console.error("Failed to initialize teamsData", err));

app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
