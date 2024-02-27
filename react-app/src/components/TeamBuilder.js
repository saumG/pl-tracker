import React, { useState } from "react";

const TeamBuilder = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-5 flex align-middle justify-center">
      <div className="w-1/2 pr-2">
        <h2 className="text-xl font-bold mb-3">Set Your Weights</h2>
        {/* Form elements for setting weights */}
      </div>
      <div className="w-1/2 pl-2">
        <div className="flex mb-4">
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Search players..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Tables for GK, DEF, MID, FWD */}
      </div>
    </div>
  );
};

export default TeamBuilder;
