const { getPlayersData } = require("../utils/loadDataFromDB");

exports.getAllPlayers = async (req, res) => {
  console.log("Fetching all players data");
  const players = await getPlayersData();
  console.log("Players data:", players); // Check what data you have
  res.json(players);
};

let counter = 0;

// Function to recursively build the team
function buildTeam(
  scoredPlayers,
  positions,
  budget,
  currentTeam,
  currentCost,
  currentIndex
) {
  if (currentIndex >= scoredPlayers.length || currentTeam.length === 15) {
    console.log(`found a complete team ${JSON.stringify(currentTeam)}`);
    return currentTeam;
  }

  let bestTeam = [...currentTeam];
  let bestScore = calculateTotalScore(currentTeam);

  if (counter <= 100) {
    counter += 1;
    console.log(
      `best score so far is ${bestScore}, number of players ${
        currentTeam.length
      }, positions ${JSON.stringify(positions)}`
    );
  }

  for (let i = currentIndex; i < scoredPlayers.length; i++) {
    const player = scoredPlayers[i];
    const position = player.singular_name_short;

    if (positions[position]) {
      if (
        positions[position].count < positions[position].max &&
        currentCost + player.now_cost <= budget
      ) {
        // Add player to the team
        const newTeam = [...currentTeam, player];
        const newCost = currentCost + player.now_cost;
        positions[position].count++;

        // Recursively build the team
        const updatedTeam = buildTeam(
          scoredPlayers,
          positions,
          budget,
          newTeam,
          newCost,
          i + 1
        );
        const updatedScore = calculateTotalScore(updatedTeam);

        // Update best team if the score is higher
        if (updatedScore > bestScore) {
          bestTeam = updatedTeam;
          bestScore = updatedScore;
        }

        // Backtrack
        positions[position].count--;
      }
    } else {
      console.warn(
        `Undefined position for player: ${player.id} with position ${player.singular_name_short}`
      );
    }
  }

  return bestTeam;
}

function calculateTotalScore(team) {
  return team.reduce((totalScore, player) => {
    const playerScore = parseFloat(player.score); // Ensure the score is treated as a float
    return totalScore + (isNaN(playerScore) ? 0 : playerScore);
  }, 0);
}

// Function to match trimmedPlayers with full player details
function getFullPlayerDetails(trimmedPlayers, allPlayers) {
  return trimmedPlayers.map((trimmedPlayer) => {
    const fullPlayerDetails = allPlayers.find(
      (player) => player.id === trimmedPlayer.id
    );
    return fullPlayerDetails || null; // Return null or some default object if no match is found
  });
}

// Function to normalize stats values
function normalizeStats(players, weights) {
  // Initialize min and max objects
  const mins = {};
  const maxes = {};

  // Find min and max for each weighted stat
  players.forEach((player) => {
    weights.forEach((weight) => {
      if (
        mins[weight.stat] === undefined ||
        player[weight.stat] < mins[weight.stat]
      ) {
        mins[weight.stat] = player[weight.stat];
      }
      if (
        maxes[weight.stat] === undefined ||
        player[weight.stat] > maxes[weight.stat]
      ) {
        maxes[weight.stat] = player[weight.stat];
      }
    });
  });

  // Normalize player stats
  const normalizedPlayers = players.map((player) => {
    const normalizedStats = {};
    weights.forEach((weight) => {
      // Avoid division by zero
      if (maxes[weight.stat] !== mins[weight.stat]) {
        normalizedStats[weight.stat] =
          (player[weight.stat] - mins[weight.stat]) /
          (maxes[weight.stat] - mins[weight.stat]);
      } else {
        normalizedStats[weight.stat] = 0; // Or some default value in case all players have the same stat value
      }
    });
    return { ...player, normalizedStats };
  });

  return normalizedPlayers;
}

exports.getBuiltTeam = async (req, res) => {
  console.log("Request body:", req.body); // This should log the entire request body
  console.log("Weights from request:", req.body.weights);
  console.log("Preselected players from request:", req.body.preselectedPlayers);
  const weights = req.body.weights;
  const preselectedTeam = req.body.preselectedPlayers || []; // Assuming this comes as an array of IDs

  const preselectedPlayerIds = []
    .concat(...Object.values(preselectedTeam))
    .map((player) => player.id);

  // Fetch all players data
  const players = await getPlayersData(); // Assuming this retrieves full player details

  // Find full details for preselected players
  const preselectedPlayers = getFullPlayerDetails(
    preselectedPlayerIds.map((id) => ({ id })),
    players
  );

  // Normalize stats values for all players
  const normalizedPlayers = normalizeStats(players, weights);

  // console.log(JSON.stringify(normalizedPlayers));

  // Calculate scores for each player based on the selected attributes and weights
  const scoredPlayers = normalizedPlayers.map((player) => {
    let score = 0;
    weights.forEach((weight) => {
      score += player.normalizedStats[weight.stat] * weight.weight;
    });
    return { ...player, score };
  });

  // Sort players by score in descending order
  scoredPlayers.sort((a, b) => b.score - a.score);

  console.log(JSON.stringify(scoredPlayers[0]));

  // Select team composition (2 goalkeepers, 5 defenders, 5 midfielders, and 3 forwards)
  const positions = {
    GKP: { count: 0, max: 2 },
    DEF: { count: 0, max: 5 },
    MID: { count: 0, max: 5 },
    FWD: { count: 0, max: 3 },
  };
  const budget = 1000;
  const initialTeam = preselectedPlayers;
  const initialCost = initialTeam.reduce(
    (totalCost, player) => totalCost + player.now_cost,
    0
  );

  // Update positions object based on preselected players
  preselectedPlayers.forEach((player) => {
    if (player) {
      const position = player.singular_name_short;
      if (positions[position]) {
        positions[position].count += 1;
      } else {
        console.warn(
          `Preselected player with ID: ${player.id} has undefined or invalid position: ${position}`
        );
      }
    }
  });

  console.log(`inital cost of the team is ${initialCost}`);

  // Build the team
  const selectedTeam = {};

  console.log(selectedTeam);

  res.json(selectedTeam);
};
