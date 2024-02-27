require("dotenv").config();
const axios = require("axios");
const { Pool } = require("pg");

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
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

    let getPosition = (element_type) => {
      if (element_type === 1) {
        return ["Goalkeeper", "GKP"];
      } else if (element_type === 2) {
        return ["Defender", "DEF"];
      } else if (element_type === 3) {
        return ["Midfielder", "MID"];
      } else if (element_type === 4) {
        return ["Forward", "FWD"];
      }
    };

    let getTeam = (team_code) => {
      // Find the team with the matching team_code
      const team = teams.find((team) => team.code === team_code);
      // Return the short_name of the found team, or null if not found
      return team ? team.short_name : null;
    };

    // Process players
    const players = data.elements.map((player) => ({
      ...player,
      singular_name: getPosition(player.element_type)[0],
      singular_name_short: getPosition(player.element_type)[1],
      team_name: getTeam(player.team_code),
    }));

    // Insert into PostgreSQL
    // Note: Ensure you have created the tables in your PostgreSQL database.

    // Insert teams
    for (const team of teams) {
      await pool.query(
        `INSERT INTO teams (code, draw, form, id, loss, name, played, points, position, short_name, strength, strength_overall_home, strength_overall_away, strength_attack_home, strength_attack_away, strength_defence_home, strength_defence_away) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
        code = EXCLUDED.code, draw = EXCLUDED.draw, form = EXCLUDED.form, loss = EXCLUDED.loss, name = EXCLUDED.name, played = EXCLUDED.played, points = EXCLUDED.points, position = EXCLUDED.position, short_name = EXCLUDED.short_name, strength = EXCLUDED.strength, strength_overall_home = EXCLUDED.strength_overall_home, strength_overall_away = EXCLUDED.strength_overall_away, strength_attack_home = EXCLUDED.strength_attack_home, strength_attack_away = EXCLUDED.strength_attack_away, strength_defence_home = EXCLUDED.strength_defence_home, strength_defence_away = EXCLUDED.strength_defence_away`,
        Object.values(team)
      );
    }

    console.log(JSON.stringify(players[0]));

    // Insert players
    const playerInsertQuery = `
    INSERT INTO players (
        chance_of_playing_next_round, chance_of_playing_this_round, code,
        cost_change_event, cost_change_event_fall, cost_change_start, cost_change_start_fall,
        dreamteam_count, element_type, ep_next, ep_this, event_points, first_name, form,
        id, in_dreamteam, news, news_added, now_cost, photo, points_per_game,
        second_name, selected_by_percent, special, squad_number, status, team,
        team_code, total_points, transfers_in, transfers_in_event, transfers_out,
        transfers_out_event, value_form, value_season, web_name, minutes,
        goals_scored, assists, clean_sheets, goals_conceded, own_goals,
        penalties_saved, penalties_missed, yellow_cards, red_cards, saves,
        bonus, bps, influence, creativity, threat, ict_index,
        starts, expected_goals, expected_assists, expected_goal_involvements,
        expected_goals_conceded, influence_rank, influence_rank_type,
        creativity_rank, creativity_rank_type, threat_rank, threat_rank_type,
        ict_index_rank, ict_index_rank_type, corners_and_indirect_freekicks_order,
        corners_and_indirect_freekicks_text, direct_freekicks_order,
        direct_freekicks_text, penalties_order, penalties_text,
        expected_goals_per_90, saves_per_90, expected_assists_per_90,
        expected_goal_involvements_per_90, expected_goals_conceded_per_90,
        goals_conceded_per_90, now_cost_rank, now_cost_rank_type, form_rank,
        form_rank_type, points_per_game_rank, points_per_game_rank_type,
        selected_rank, selected_rank_type, starts_per_90, clean_sheets_per_90, singular_name, singular_name_short, team_name
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
        $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53,
        $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66,
        $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79,
        $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91
    )
    ON CONFLICT (id) DO UPDATE SET
        chance_of_playing_next_round = EXCLUDED.chance_of_playing_next_round,
        chance_of_playing_this_round = EXCLUDED.chance_of_playing_this_round,
        code = EXCLUDED.code,
        cost_change_event = EXCLUDED.cost_change_event,
        cost_change_event_fall = EXCLUDED.cost_change_event_fall,
        cost_change_start = EXCLUDED.cost_change_start,
        cost_change_start_fall = EXCLUDED.cost_change_start_fall,
        dreamteam_count = EXCLUDED.dreamteam_count,
        element_type = EXCLUDED.element_type,
        ep_next = EXCLUDED.ep_next,
        ep_this = EXCLUDED.ep_this,
        event_points = EXCLUDED.event_points,
        first_name = EXCLUDED.first_name,
        form = EXCLUDED.form,
        in_dreamteam = EXCLUDED.in_dreamteam,
        news = EXCLUDED.news,
        news_added = EXCLUDED.news_added,
        now_cost = EXCLUDED.now_cost,
        photo = EXCLUDED.photo,
        points_per_game = EXCLUDED.points_per_game,
        second_name = EXCLUDED.second_name,
        selected_by_percent = EXCLUDED.selected_by_percent,
        special = EXCLUDED.special,
        squad_number = EXCLUDED.squad_number,
        status = EXCLUDED.status,
        team = EXCLUDED.team,
        team_code = EXCLUDED.team_code,
        total_points = EXCLUDED.total_points,
        transfers_in = EXCLUDED.transfers_in,
        transfers_in_event = EXCLUDED.transfers_in_event,
        transfers_out = EXCLUDED.transfers_out,
        transfers_out_event = EXCLUDED.transfers_out_event,
        value_form = EXCLUDED.value_form,
        value_season = EXCLUDED.value_season,
        web_name = EXCLUDED.web_name,
        minutes = EXCLUDED.minutes,
        goals_scored = EXCLUDED.goals_scored,
        assists = EXCLUDED.assists,
        clean_sheets = EXCLUDED.clean_sheets,
        goals_conceded = EXCLUDED.goals_conceded,
        own_goals = EXCLUDED.own_goals,
        penalties_saved = EXCLUDED.penalties_saved,
        penalties_missed = EXCLUDED.penalties_missed,
        yellow_cards = EXCLUDED.yellow_cards,
        red_cards = EXCLUDED.red_cards,
        saves = EXCLUDED.saves,
        bonus = EXCLUDED.bonus,
        bps = EXCLUDED.bps,
        influence = EXCLUDED.influence,
        creativity = EXCLUDED.creativity,
        threat = EXCLUDED.threat,
        ict_index = EXCLUDED.ict_index,
        starts = EXCLUDED.starts,
        expected_goals = EXCLUDED.expected_goals,
        expected_assists = EXCLUDED.expected_assists,
        expected_goal_involvements = EXCLUDED.expected_goal_involvements,
        expected_goals_conceded = EXCLUDED.expected_goals_conceded,
        influence_rank = EXCLUDED.influence_rank,
        influence_rank_type = EXCLUDED.influence_rank_type,
        creativity_rank = EXCLUDED.creativity_rank,
        creativity_rank_type = EXCLUDED.creativity_rank_type,
        threat_rank = EXCLUDED.threat_rank,
        threat_rank_type = EXCLUDED.threat_rank_type,
        ict_index_rank = EXCLUDED.ict_index_rank,
        ict_index_rank_type = EXCLUDED.ict_index_rank_type,
        corners_and_indirect_freekicks_order = EXCLUDED.corners_and_indirect_freekicks_order,
        corners_and_indirect_freekicks_text = EXCLUDED.corners_and_indirect_freekicks_text,
        direct_freekicks_order = EXCLUDED.direct_freekicks_order,
        direct_freekicks_text = EXCLUDED.direct_freekicks_text,
        penalties_order = EXCLUDED.penalties_order,
        penalties_text = EXCLUDED.penalties_text,
        expected_goals_per_90 = EXCLUDED.expected_goals_per_90,
        saves_per_90 = EXCLUDED.saves_per_90,
        expected_assists_per_90 = EXCLUDED.expected_assists_per_90,
        expected_goal_involvements_per_90 = EXCLUDED.expected_goal_involvements_per_90,
        expected_goals_conceded_per_90 = EXCLUDED.expected_goals_conceded_per_90,
        goals_conceded_per_90 = EXCLUDED.goals_conceded_per_90,
        now_cost_rank = EXCLUDED.now_cost_rank,
        now_cost_rank_type = EXCLUDED.now_cost_rank_type,
        form_rank = EXCLUDED.form_rank,
        form_rank_type = EXCLUDED.form_rank_type,
        points_per_game_rank = EXCLUDED.points_per_game_rank,
        points_per_game_rank_type = EXCLUDED.points_per_game_rank_type,
        selected_rank = EXCLUDED.selected_rank,
        selected_rank_type = EXCLUDED.selected_rank_type,
        starts_per_90 = EXCLUDED.starts_per_90,
        clean_sheets_per_90 = EXCLUDED.clean_sheets_per_90,
        singular_name = EXCLUDED.singular_name,
        singular_name_short = EXCLUDED.singular_name_short,
        team_name = EXCLUDED.team_name
    `;

    for (const player of players) {
      await pool.query(playerInsertQuery, Object.values(player));
    }

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error fetching or inserting data:", error);
  }
};
module.exports = { fetchFPLData };

// CREATE TABLE teams (
//     code INTEGER,
//     draw INTEGER,
//     form TEXT,
//     id SERIAL PRIMARY KEY,
//     loss INTEGER,
//     name TEXT,
//     played INTEGER,
//     points INTEGER,
//     position INTEGER,
//     short_name TEXT,
//     strength INTEGER,
//     strength_overall_home INTEGER,
//     strength_overall_away INTEGER,
//     strength_attack_home INTEGER,
//     strength_attack_away INTEGER,
//     strength_defence_home INTEGER,
//     strength_defence_away INTEGER
// );

// CREATE TABLE players (
//     chance_of_playing_next_round INTEGER,
//     chance_of_playing_this_round INTEGER,
//     code BIGINT,
//     cost_change_event INTEGER,
//     cost_change_event_fall INTEGER,
//     cost_change_start INTEGER,
//     cost_change_start_fall INTEGER,
//     dreamteam_count INTEGER,
//     element_type INTEGER,
//     ep_next VARCHAR(10),
//     ep_this VARCHAR(10),
//     event_points INTEGER,
//     first_name VARCHAR(50),
//     form VARCHAR(10),
//     id SERIAL PRIMARY KEY,
//     in_dreamteam BOOLEAN,
//     news TEXT,
//     news_added TIMESTAMP WITH TIME ZONE,
//     now_cost INTEGER,
//     photo VARCHAR(50),
//     points_per_game VARCHAR(10),
//     second_name VARCHAR(50),
//     selected_by_percent VARCHAR(10),
//     special BOOLEAN,
//     squad_number INTEGER,
//     status VARCHAR(1),
//     team INTEGER,
//     team_code INTEGER,
//     total_points INTEGER,
//     transfers_in INTEGER,
//     transfers_in_event INTEGER,
//     transfers_out INTEGER,
//     transfers_out_event INTEGER,
//     value_form VARCHAR(10),
//     value_season VARCHAR(10),
//     web_name VARCHAR(50),
//     minutes INTEGER,
//     goals_scored INTEGER,
//     assists INTEGER,
//     clean_sheets INTEGER,
//     goals_conceded INTEGER,
//     own_goals INTEGER,
//     penalties_saved INTEGER,
//     penalties_missed INTEGER,
//     yellow_cards INTEGER,
//     red_cards INTEGER,
//     saves INTEGER,
//     bonus INTEGER,
//     bps INTEGER,
//     influence VARCHAR(10),
//     creativity VARCHAR(10),
//     threat VARCHAR(10),
//     ict_index VARCHAR(10),
//     starts INTEGER,
//     expected_goals VARCHAR(10),
//     expected_assists VARCHAR(10),
//     expected_goal_involvements VARCHAR(10),
//     expected_goals_conceded VARCHAR(10),
//     influence_rank INTEGER,
//     influence_rank_type INTEGER,
//     creativity_rank INTEGER,
//     creativity_rank_type INTEGER,
//     threat_rank INTEGER,
//     threat_rank_type INTEGER,
//     ict_index_rank INTEGER,
//     ict_index_rank_type INTEGER,
//     corners_and_indirect_freekicks_order INTEGER,
//     corners_and_indirect_freekicks_text TEXT,
//     direct_freekicks_order INTEGER,
//     direct_freekicks_text TEXT,
//     penalties_order INTEGER,
//     penalties_text TEXT,
//     expected_goals_per_90 NUMERIC,
//     saves_per_90 NUMERIC,
//     expected_assists_per_90 NUMERIC,
//     expected_goal_involvements_per_90 NUMERIC,
//     expected_goals_conceded_per_90 NUMERIC,
//     goals_conceded_per_90 NUMERIC,
//     now_cost_rank INTEGER,
//     now_cost_rank_type INTEGER,
//     form_rank INTEGER,
//     form_rank_type INTEGER,
//     points_per_game_rank INTEGER,
//     points_per_game_rank_type INTEGER,
//     selected_rank INTEGER,
//     selected_rank_type INTEGER,
//     starts_per_90 NUMERIC,
//     clean_sheets_per_90 NUMERIC,
//     singular_name VARCHAR(255),
//     singular_name_short VARCHAR(255),
//     team_name TEXT,
// );
