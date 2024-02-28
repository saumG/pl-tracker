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

  const [statsOptions, setStatsOptions] = useState(initialStatsOptions);
  const [stats, setStats] = useState([
    {
      id: 1,
      stat: "expected_goals",
      weight: 1,
      percentage: 100,
    },
  ]);

  // Update initial selection based on stats
  useEffect(() => {
    const updatedOptions = { ...statsOptions };
    stats.forEach((stat) => {
      if (updatedOptions[stat.stat]) {
        updatedOptions[stat.stat].selected = true;
      }
    });
    setStatsOptions(updatedOptions);
  }, [stats, statsOptions]);

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
        return { ...stat, weight: value };
      }
      return stat;
    });
    setStats(newStats);
  };

  // Recalculate percentages whenever stats change
  useEffect(() => {
    const totalWeight = stats.reduce(
      (total, stat) => total + Number(stat.weight || 0),
      0
    );
    const newStats = stats.map((stat) => ({
      ...stat,
      percentage: totalWeight
        ? ((Number(stat.weight || 0) / totalWeight) * 100).toFixed(2)
        : 0,
    }));
    setStats(newStats);
  }, [stats]);

  useEffect(() => {
    const updatedOptions = { ...statsOptions };
    Object.keys(updatedOptions).forEach((key) => {
      updatedOptions[key].selected = stats.some((stat) => stat.stat === key);
    });
    setStatsOptions(updatedOptions);
  }, [stats, statsOptions]);

  return (
    <div className="p-5">
      <div className="mb-4">
        <button
          onClick={addStat}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Stat
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Stat</th>
              <th className="px-4 py-2">Weight</th>
              <th className="px-4 py-2">Percentage</th>
              <th className="px-4 py-2">Actions</th>
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
  );
};

export default TeamBuilder;
