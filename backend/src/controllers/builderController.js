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
  console.log(`Fetched ${players.length} players data`);

  // Find full details for preselected players
  const preselectedPlayers = getFullPlayerDetails(
    preselectedPlayerIds.map((id) => ({ id })),
    players
  );
  console.log(
    `Found full details for ${preselectedPlayers.length} preselected players`
  );

  // Normalize stats values for all players
  const normalizedPlayers = normalizeStats(players, weights);

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

  const unselectedPlayers = scoredPlayers.filter(
    (player) => !preselectedPlayerIds.includes(player.id)
  );
  console.log(
    `Filtered out preselected players, ${unselectedPlayers.length} players remaining`
  );

  const unselectedPlayersIds = unselectedPlayers.map((player) => player.id);

  // Create simplified player objects
  const simplifiedPlayers = unselectedPlayers.reduce((acc, player) => {
    // Initialize the player object with common attributes
    let playerObj = {
      id: player.id,
      firstName: player.first_name,
      lastName: player.second_name,
      score: player.score,
      cost: player.now_cost,
      GKP: player.singular_name_short === "GKP" ? 1 : 0,
      DEF: player.singular_name_short === "DEF" ? 1 : 0,
      MID: player.singular_name_short === "MID" ? 1 : 0,
      FWD: player.singular_name_short === "FWD" ? 1 : 0,
    };

    // Add a binary indicator for each player ID
    unselectedPlayersIds.forEach((otherPlayerId) => {
      playerObj[`pl_${otherPlayerId}`] = player.id === otherPlayerId ? 1 : 0;
    });

    // Add this player object to the accumulator
    acc[`player_${player.id}`] = playerObj;
    return acc;
  }, {});
  console.log(
    `Created simplified players objects, total count: ${
      Object.keys(simplifiedPlayers).length
    }`
  );

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

  const remainingBudget = budget - initialCost;

  console.log(
    `initial team cost is ${initialCost}. remaining budget is ${remainingBudget}`
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

  const solver = require("javascript-lp-solver");

  // Create the model for the javascript-lp-solver
  let model = {
    optimize: "score",
    opType: "max",
    constraints: {
      cost: { max: remainingBudget },
      GKP: { equal: positions.GKP.max - positions.GKP.count },
      DEF: { equal: positions.DEF.max - positions.DEF.count },
      MID: { equal: positions.MID.max - positions.MID.count },
      FWD: { equal: positions.FWD.max - positions.FWD.count },
    },
    variables: simplifiedPlayers,
    ints: {},
  };

  Object.keys(simplifiedPlayers).forEach((playerId) => {
    const player = simplifiedPlayers[playerId];
    model.constraints[`pl_${player.id}`] = { max: 1 };
    model.ints[`player_${player.id}`] = 1; // This ensures that solution variables will be integer values
  });

  // Solve the problem
  const solution = solver.Solve(model);
  console.log("Solution:", solution);

  // Initialize a map to keep track of the number of players encountered for each position
  const positionCount = { GKP: 0, DEF: 0, MID: 0, FWD: 0 };

  // Add total_rank and position_rank to each player
  scoredPlayers.forEach((player, index) => {
    // The total rank is just the index + 1 (since the array is 0-indexed but ranks start at 1)
    player.total_rank = index + 1;

    // Increment the position count for this player's position and assign the position rank
    // player.singular_name_short should be one of 'GKP', 'DEF', 'MID', 'FWD'
    const position = player.singular_name_short;
    positionCount[position]++;
    player.position_rank = positionCount[position];
  });
  // Extract IDs from the solution for selected players
  const selectedPlayerIds = Object.keys(solution)
    .filter((key) => key.startsWith("player_") && solution[key] === 1)
    .map((key) => key.split("_")[1]);

  // Convert all preselectedPlayerIds to strings
  const preselectedPlayerIdsStr = preselectedPlayerIds.map((id) =>
    id.toString()
  );

  console.log(preselectedPlayerIdsStr);
  console.log(selectedPlayerIds);

  // Combine these IDs with the IDs from the initial team
  const completeTeamIds = [
    ...new Set([...preselectedPlayerIdsStr, ...selectedPlayerIds]),
  ]; // Using Set to avoid duplicate IDs

  console.log(completeTeamIds);

  // Create the complete team details
  const completeTeam = {};
  completeTeamIds.forEach((id) => {
    // Find this player in the scoredPlayers array
    const player =
      scoredPlayers.find((p) => p.id.toString() === id) ||
      preselectedPlayers.find((p) => p.id.toString() === id);
    if (player) {
      completeTeam[player.id] = {
        first_name: player.first_name,
        second_name: player.second_name,
        id: player.id,
        score: player.score,
        total_rank: player.total_rank,
        position_rank: player.position_rank,
        cost: player.now_cost,
      };
    }
  });

  console.log(`Final team (Details):`, completeTeam);

  // Return the final team
  res.json({ team: completeTeam });
};
