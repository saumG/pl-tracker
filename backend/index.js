const express = require("express");
const { fetchFPLData } = require("./src/utils/fetchFPLData");
const cron = require("node-cron");
const { getPlayersData, getTeamsData } = require("./src/utils/loadDataFromDB");
const playerRoutes = require("./src/routes/playerRoutes");
const teamRoutes = require("./src/routes/teamRoutes");
const builderRoutes = require("./src/routes/builderRoutes");

//CORS
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5432;

// CORS options
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// Use CORS with options
app.use(cors(corsOptions));

// Schedule the function to run once a week. Adjust the cron pattern as needed.
// 0 0 * * 0 is for every Sunday at midnight. Adjust according to your needs.
// cron.schedule("0 0 * * 0", () => {
//   console.log("Fetching FPL data...");
//   fetchFPLData();
// });

// fetchFPLData().then(() => console.log("fetched and updated data"));

getPlayersData()
  .then(() => console.log("Initialized playersData in memory"))
  .catch((err) => console.error("Failed to initialize playersData", err));

getTeamsData()
  .then(() => console.log("Initialized teamsData in memory"))
  .catch((err) => console.error("Failed to initialize teamsData", err));

app.use(express.json());
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/builder", builderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
