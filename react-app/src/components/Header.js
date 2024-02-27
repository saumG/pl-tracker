import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="bg-gray-800 p-3 text-white flex align-middle justify-center">
      <NavLink to="/" className="px-3 py-2 rounded-md text-sm font-medium">
        Home
      </NavLink>
      <NavLink
        to="/players"
        className="px-3 py-2 rounded-md text-sm font-medium"
      >
        Players
      </NavLink>
      <NavLink to="/teams" className="px-3 py-2 rounded-md text-sm font-medium">
        Teams
      </NavLink>
      <NavLink
        to="/builder"
        className="px-3 py-2 rounded-md text-sm font-medium"
      >
        Team Builder
      </NavLink>
    </nav>
  );
};

export default Header;
