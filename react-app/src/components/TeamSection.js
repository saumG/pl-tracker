import axios from "axios";
import React, { useEffect, useState } from "react";

const propertyNamesMapping = {
  code: "Team Code",
  draw: "Draw",
  form: "Form",
  id: "ID",
  loss: "Loss",
  name: "Name",
  played: "Played",
  points: "Points",
  position: "Position",
  short_name: "Short Name",
  strength: "Strength",
  strength_overall_home: "Strength Overall Home",
  strength_overall_away: "Strength Overall Away",
  strength_attack_home: "Strength Attack Home",
  strength_attack_away: "Strength Attack Away",
  strength_defence_home: "Strength Defence Home",
  strength_defence_away: "Strength Defence Away",
};

const orderedProperties = [
  "name",
  "short_name",
  "strength",
  "strength_overall_home",
  "strength_overall_away",
  "strength_attack_home",
  "strength_attack_away",
  "strength_defence_home",
  "strength_defence_away",
];

const TeamSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const fetchteams = async () => {
      try {
        const response = await axios.get("http://localhost:5432/api/teams");
        setTeamData(response.data);
      } catch (error) {
        console.error("Error fetching teams data:", error);
      }
    };
    fetchteams();
  }, []);

  return (
    <div className="p-5">
      <div className="flex mb-4">
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Search teams..."
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
            {teamData
              .filter((team) =>
                team.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((team) => (
                <tr key={team.id}>
                  {orderedProperties.map((prop) => (
                    <td key={prop} className="border px-4 py-2">
                      {team[prop]}
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

export default TeamSection;
