import axios from "axios";
import React, { useEffect, useState } from "react";

const TeamBuilder = () => {
  const initialStatsOptions = {
    chance_of_playing_next_round: {
      name: "Next Round Play Chance",
      selected: false,
    },
    chance_of_playing_this_round: {
      name: "This Round Play Chance",
      selected: false,
    },
    dreamteam_count: { name: "Dreamteam Count", selected: false },
    ep_next: { name: "Expected Points Next", selected: false },
    ep_this: { name: "Expected Points This", selected: false },
    points_per_game: { name: "Points Per Game", selected: false },
    total_points: { name: "Total Points", selected: false },
    transfers_in: { name: "Transfers In", selected: false },
    transfers_out: { name: "Transfers Out", selected: false },
    value_form: { name: "Value Form", selected: false },
    minutes: { name: "Minutes", selected: false },
    goals_scored: { name: "Goals Scored", selected: false },
    assists: { name: "Assists", selected: false },
    clean_sheets: { name: "Clean Sheets", selected: false },
    own_goals: { name: "Own Goals", selected: false },
    penalties_saved: { name: "Penalties Saved", selected: false },
    penalties_missed: { name: "Penalties Missed", selected: false },
    yellow_cards: { name: "Yellow Cards", selected: false },
    red_cards: { name: "Red Cards", selected: false },
    saves: { name: "Saves", selected: false },
    bonus: { name: "Bonus", selected: false },
    bps: { name: "BPS", selected: false },
    influence: { name: "Influence", selected: false },
    creativity: { name: "Creativity", selected: false },
    threat: { name: "Threat", selected: false },
    ict_index: { name: "ICT Index", selected: false },
    expected_goals: { name: "xG", selected: false },
    expected_assists: { name: "xA", selected: false },
    expected_goal_involvements: { name: "xGI", selected: false },
    expected_goals_conceded: { name: "xGA", selected: false },
    expected_goals_per_90: { name: "xG per 90", selected: false },
    saves_per_90: { name: "Saves per 90", selected: false },
    expected_assists_per_90: { name: "xA per 90", selected: false },
    expected_goal_involvements_per_90: { name: "xGI per 90", selected: false },
    goals_conceded_per_90: { name: "Goals Conceded per 90", selected: false },
    clean_sheets_per_90: { name: "Clean Sheets per 90", selected: false },
  };

  const [allPlayers, setAllPlayers] = useState([]); // Assuming you fetch this data
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [statsOptions, setStatsOptions] = useState(initialStatsOptions);
  const [stats, setStats] = useState([
    {
      id: 1,
      stat: "expected_goals",
      weight: 1,
      percentage: 100,
    },
  ]);

  const addStat = () => {
    setStats([
      ...stats,
      { id: stats.length + 1, stat: "", weight: "", percentage: 0 },
    ]);
  };

  const removeStat = (id) => {
    const newStats = stats.filter((stat) => stat.id !== id);
    setStats(newStats);

    const removedStat = stats.find((stat) => stat.id === id);
    if (removedStat) {
      setStatsOptions({
        ...statsOptions,
        [removedStat.stat]: {
          ...statsOptions[removedStat.stat],
          selected: false,
        },
      });
    }
  };

  const updateStat = (id, value) => {
    const newStats = stats.map((stat) => {
      if (stat.id === id) {
        return { ...stat, stat: value, weight: 1 }; // Default weight to 1 when stat changes
      }
      return stat;
    });
    setStats(newStats);
  };

  const updateWeight = (id, value) => {
    const newStats = stats.map((stat) => {
      if (stat.id === id) {
        const newWeight = Number(value); // Ensure it's a number
        return newWeight !== stat.weight
          ? { ...stat, weight: newWeight }
          : stat;
      }
      return stat;
    });
    // Only update if there's an actual change
    if (JSON.stringify(newStats) !== JSON.stringify(stats)) {
      setStats(newStats);
    }
  };

  const calculatePercentages = (statsWithWeights) => {
    const totalWeight = statsWithWeights.reduce(
      (total, stat) => total + Number(stat.weight || 0),
      0
    );
    return statsWithWeights.map((stat) => ({
      ...stat,
      percentage: totalWeight
        ? ((Number(stat.weight || 0) / totalWeight) * 100).toFixed(2)
        : 0,
    }));
  };

  useEffect(() => {
    // First, recalculate percentages for stats
    const newStatsWithPercentages = calculatePercentages(stats);
    if (JSON.stringify(newStatsWithPercentages) !== JSON.stringify(stats)) {
      setStats(newStatsWithPercentages);
    }

    // Then, update selection status in statsOptions
    const updatedOptions = { ...statsOptions };
    let changesMade = false;

    Object.keys(updatedOptions).forEach((key) => {
      const isSelected = newStatsWithPercentages.some(
        (stat) => stat.stat === key
      );
      if (updatedOptions[key].selected !== isSelected) {
        updatedOptions[key].selected = isSelected;
        changesMade = true;
      }
    });

    if (changesMade) {
      setStatsOptions(updatedOptions);
    }
  }, [stats]);

  const [team, setTeam] = useState({
    GKP: Array(2).fill(null), // Initialize with empty slots
    DEF: Array(5).fill(null),
    MID: Array(5).fill(null),
    FWD: Array(3).fill(null),
  });

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5432/api/players/trimmed"
      );
      setAllPlayers(response.data);
      console.log("fetched trimmed players");
    } catch (error) {
      console.error("Error fetching trimmed player data:", error);
    }
  };

  const calculateBestTeam = async () => {
    const requestBody = {
      weights: stats,
      preselectedPlayers: team, // Replace this with actual IDs from your state
    };

    try {
      const response = await axios.post(
        "http://localhost:5432/api/builder",
        requestBody
      );
      console.log("Team built successfully:", response.data);
    } catch (error) {
      console.error(
        "Error building team:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setSearchTerm(value);
    if (value) {
      const newFilteredPlayers = allPlayers.filter((player) => {
        const playerName = `${player.first_name.toLowerCase()} ${player.second_name.toLowerCase()}`;
        return playerName.includes(value) && !isPlayerInTeam(player);
      });
      setFilteredPlayers(newFilteredPlayers);
    } else {
      // When there's no search term, don't show already selected players
      setFilteredPlayers(
        allPlayers.filter((player) => !isPlayerInTeam(player))
      );
    }
  };

  const isPlayerInTeam = (player) => {
    return Object.values(team).some((position) =>
      position.some((teamPlayer) => teamPlayer && teamPlayer.id === player.id)
    );
  };

  const addToTeam = (player) => {
    setTeam((prevTeam) => {
      // Creating a deep copy of the team object to ensure immutability
      const newTeam = JSON.parse(JSON.stringify(prevTeam));
      console.log("deep copy of newTeam" + JSON.stringify(newTeam));

      // Find the correct position array to update
      if (newTeam[player.position]) {
        const index = newTeam[player.position].findIndex((p) => p === null);
        if (index !== -1) {
          // Check if there is an empty spot
          newTeam[player.position][index] = { ...player }; // Spread to ensure a new object
          return newTeam; // Return the updated team
        }
      }
      return prevTeam; // Return the previous state if no update is needed
    });
  };

  const removeFromTeam = (player, position) => {
    setTeam((prevTeam) => {
      const newTeam = JSON.parse(JSON.stringify(prevTeam));
      const playerIndex = newTeam[position].findIndex(
        (p) => p && p.id === player.id
      );

      if (playerIndex !== -1) {
        newTeam[position][playerIndex] = null; // Remove player from team
        return newTeam;
      }
      return prevTeam;
    });
  };

  return (
    <div className="flex">
      <div className="stat-section p-5">
        <div className="add-stat-btn mb-4">
          <button
            onClick={addStat}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Stat
          </button>
          <button
            onClick={calculateBestTeam}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Calculate Best Team
          </button>
        </div>
        <div className="stat-table overflow-x-auto">
          <table className="table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-1 py-2">Stat</th>
                <th className="px-1 py-2">Weight</th>
                <th className="px-2 py-2">Percentage</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.id}>
                  <td className="border px-4 py-2">
                    <select
                      className="p-2 border rounded"
                      value={stat.stat}
                      onChange={(e) => updateStat(stat.id, e.target.value)}
                    >
                      {stat.stat ? (
                        <option value={stat.stat}>
                          {statsOptions[stat.stat]?.name}
                        </option>
                      ) : (
                        <option value="">Select a stat</option>
                      )}
                      {Object.entries(statsOptions).map(([key, option]) =>
                        !option.selected ? (
                          <option key={key} value={key}>
                            {option.name}
                          </option>
                        ) : null
                      )}
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="number"
                      className="p-2 border rounded"
                      value={stat.weight}
                      onChange={(e) => updateWeight(stat.id, e.target.value)}
                    />
                  </td>
                  <td className="border px-4 py-2">{stat.percentage}%</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => removeStat(stat.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="built-team-section p-5">
        <div className="player-search mb-4">
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Search players..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="search-results">
            {filteredPlayers.map((player) => (
              <div key={player.id} className="search-result-item">
                {player.first_name} {player.second_name}
                <button
                  className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => addToTeam(player)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="team-tables">
          {Object.entries(team).map(([position, players]) => (
            <div key={position} className="team-table mb-4">
              <h3 className="text-lg font-bold text-center">{position}</h3>
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">Player Name</th>
                    <th className="px-4 py-2">Position Rank</th>
                    <th className="px-4 py-2">Total Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={index} className={player ? "bg-green-100" : ""}>
                      <td className="border px-4 py-2 text-center">
                        {player
                          ? `${player.first_name} ${player.second_name}`
                          : ""}
                      </td>
                      <td className="border px-4 py-2 text-center">...</td>{" "}
                      {/* Your other cells */}
                      <td className="border px-4 py-2 text-center">
                        {player && (
                          <button
                            onClick={() => removeFromTeam(player, position)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
