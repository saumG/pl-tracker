const express = require("express");
const { fetchFPLData } = require("./fetchData");
const cron = require("node-cron");

const app = express();
const port = process.env.PORT || 3000;

// Schedule the function to run once a week. Adjust the cron pattern as needed.
// 0 0 * * 0 is for every Sunday at midnight. Adjust according to your needs.
// cron.schedule("0 0 * * 0", () => {
//   console.log("Fetching FPL data...");
//   fetchFPLData();
// });

// For testing purposes, call directly
fetchFPLData().then(() =>
  console.log("Data fetching and insertion test complete.")
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
