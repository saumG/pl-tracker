import axios from "axios";
import React, { useEffect, useState } from "react";

const propertyNamesMapping = {
  chance_of_playing_next_round: "Next Round Play Chance",
  chance_of_playing_this_round: "This Round Play Chance",
  code: "Code",
  cost_change_event: "Cost Change Event",
  cost_change_event_fall: "Cost Change Event Fall",
  cost_change_start: "Cost Change Start",
  cost_change_start_fall: "Cost Change Start Fall",
  dreamteam_count: "Dreamteam Count",
  element_type: "Position",
  ep_next: "Expected Points Next",
  ep_this: "Expected Points This",
  event_points: "Event Points",
  first_name: "First Name",
  form: "Form",
  id: "ID",
  in_dreamteam: "In Dreamteam",
  news: "News",
  news_added: "News Added",
  now_cost: "Cost",
  photo: "Photo",
  points_per_game: "Points Per Game",
  second_name: "Second Name",
  selected_by_percent: "Selected By %",
  special: "Special",
  squad_number: "Squad Number",
  status: "Status",
  team: "Team",
  team_code: "Team Code",
  total_points: "Total Points",
  transfers_in: "Transfers In",
  transfers_in_event: "Transfers In Event",
  transfers_out: "Transfers Out",
  transfers_out_event: "Transfers Out Event",
  value_form: "Value Form",
  value_season: "Value Season",
  web_name: "Web Name",
  minutes: "Minutes",
  goals_scored: "Goals Scored",
  assists: "Assists",
  clean_sheets: "Clean Sheets",
  goals_conceded: "Goals Conceded",
  own_goals: "Own Goals",
  penalties_saved: "Penalties Saved",
  penalties_missed: "Penalties Missed",
  yellow_cards: "Yellow Cards",
  red_cards: "Red Cards",
  saves: "Saves",
  bonus: "Bonus",
  bps: "BPS",
  influence: "Influence",
  creativity: "Creativity",
  threat: "Threat",
  ict_index: "ICT Index",
  expected_goals: "xG",
  expected_assists: "xA",
  expected_goal_involvements: "x Goal Involvements",
  expected_goals_conceded: "x Goals Conceded",
  team_name: "Team Name",
  singular_name_short: "Position",
};

const orderedProperties = [
  "first_name",
  "second_name",
  "team_name",
  "singular_name_short",
  "total_points",
  "event_points",
  "now_cost",
  "selected_by_percent",
  "ict_index",
  "ep_this",
  "ep_next",
  "expected_goals",
  "expected_assists",
  "expected_goal_involvements",
  "expected_goals_conceded",
];

const PlayerSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [playerData, setPlayerData] = useState([]);

  useEffect(() => {
    // Function to fetch players
    const fetchPlayers = async () => {
      try {
        const response = await axios.get("http://localhost:5432/api/players");
        setPlayerData(response.data);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };
    fetchPlayers();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="p-5">
      <div className="flex mb-4">
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Search players..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="bg-gray-200">
            <tr>
              {orderedProperties.map((prop) => (
                <th key={prop} className="px-4 py-2">
                  {propertyNamesMapping[prop]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playerData
              .filter(
                (player) =>
                  player.first_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  player.second_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((player) => (
                <tr key={player.id}>
                  {orderedProperties.map((prop) => (
                    <td key={prop} className="border px-4 py-2">
                      {player[prop]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerSection;
