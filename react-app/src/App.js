import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import PlayerSection from "./components/PlayerSection";
import TeamBuilder from "./components/TeamBuilder";
import TeamSection from "./components/TeamSection";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />{" "}
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<PlayerSection />} />
            <Route path="/teams" element={<TeamSection />} />
            <Route path="/builder" element={<TeamBuilder />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
