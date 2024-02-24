require("dotenv").config();
const axios = require("axios");
const { Pool } = require("pg");

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, // Your DB port, PostgreSQL default port is 5432
});

const fetchFPLData = async () => {
  try {
    // Fetching the data from the FPL API
    const response = await axios.get(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    );
    const data = response.data;

    // Process teams
    const teams = data.teams.map((team) => ({
      code: team.code,
      draw: team.draw,
      form: team.form,
      id: team.id,
      loss: team.loss,
      name: team.name,
      played: team.played,
      points: team.points,
      position: team.position,
      short_name: team.short_name,
      strength: team.strength,
      strength_overall_home: team.strength_overall_home,
      strength_overall_away: team.strength_overall_away,
      strength_attack_home: team.strength_attack_home,
      strength_attack_away: team.strength_attack_away,
      strength_defence_home: team.strength_defence_home,
      strength_defence_away: team.strength_defence_away,
    }));

    // Process players
    const elementTypes = data.element_types.reduce((acc, curr) => {
      acc[curr.id] = {
        singular_name: curr.singular_name,
        singular_name_short: curr.singular_name_short,
      };
      return acc;
    }, {});

    const players = data.elements.map((player) => ({
      ...player,
      singular_name: elementTypes[player.element_type].singular_name,
      singular_name_short:
        elementTypes[player.element_type].singular_name_short,
    }));

    // Insert into PostgreSQL
    // Note: Ensure you have created the tables in your PostgreSQL database.

    // Insert teams
    for (const team of teams) {
      await pool.query(
        "INSERT INTO teams (code, draw, form, id, loss, name, played, points, position, short_name, strength, strength_overall_home, strength_overall_away, strength_attack_home, strength_attack_away, strength_defence_home, strength_defence_away) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
        Object.values(team)
      );
    }

    // Insert players
    const playerInsertQuery =
      "INSERT INTO players (chance_of_playing_next_round, chance_of_playing_this_round, code, cost_change_event, cost_change_event_fall, cost_change_start, cost_change_start_fall, dreamteam_count, element_type, ep_next, ep_this, event_points, first_name, form, in_dreamteam, news, news_added, now_cost, photo, points_per_game, second_name, selected_by_percent, special, squad_number, status, team, team_code, total_points, transfers_in, transfers_in_event, transfers_out, transfers_out_event, value_form, value_season, web_name, minutes, goals_scored, assists, clean_sheets, goals_conceded, own_goals, penalties_saved, penalties_missed, yellow_cards, red_cards, saves, bonus, bps, influence, creativity, threat, ict_index, singular_name, singular_name_short) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58) ON CONFLICT (code) DO NOTHING;";
    for (const player of players) {
      await pool.query(playerInsertQuery, Object.values(player));
    }

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error fetching or inserting data:", error);
  }
};
module.exports = { fetchFPLData };
