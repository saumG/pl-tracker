const { getPlayersData } = require("../utils/loadDataFromDB");

exports.getAllPlayers = async (req, res) => {
  console.log("Fetching all players data");
  const players = await getPlayersData();
  console.log("Players data:", players); // Check what data you have
  res.json(players);
};

// Function to recursively build the team
function buildTeam(
  scoredPlayers,
  positions,
  budget,
  preselectedPlayers,
  currentTeam,
  currentCost,
  currentIndex
) {
  if (currentIndex === scoredPlayers.length || currentTeam.length === 15) {
    return currentTeam;
  }

  let bestTeam = currentTeam;
  let bestScore = calculateTotalScore(currentTeam);

  for (let i = currentIndex; i < scoredPlayers.length; i++) {
    const player = scoredPlayers[i];

    if (
      positions[player.position].count < positions[player.position].max &&
      currentCost + player.now_cost <= budget
    ) {
      // Add player to the team
      const newTeam = [...currentTeam, player];
      const newCost = currentCost + player.now_cost;
      positions[player.position].count++;

      // Recursively build the team
      const updatedTeam = buildTeam(
        scoredPlayers,
        positions,
        budget,
        preselectedPlayers,
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
      positions[player.position].count--;
    }
  }

  return bestTeam;
}

// Function to calculate the total score of the team
function calculateTotalScore(team) {
  return team.reduce((totalScore, player) => totalScore + player.score, 0);
}

exports.getBuiltTeam = (req, res) => {
  const weights = req.body.weights;
  const preselectedPlayers = req.body.preselectedPlayers || [];

  // Calculate scores for each player based on the selected attributes and weights
  const scoredPlayers = players.map((player) => {
    let score = 0;
    for (const [attribute, weight] of Object.entries(weights)) {
      score += player[attribute] * weight;
    }
    return { ...player, score };
  });

  // Sort players by score in descending order
  scoredPlayers.sort((a, b) => b.score - a.score);

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

  // Build the team
  const selectedTeam = buildTeam(
    scoredPlayers,
    positions,
    budget,
    preselectedPlayers,
    initialTeam,
    initialCost,
    0
  );

  res.json(selectedTeam);
};
