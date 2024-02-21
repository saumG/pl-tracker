
// MatchConfig.java
package com.example.demo.Match;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class MatchConfig {
    @SuppressWarnings("null")
    @Bean
    CommandLineRunner commandLineRunner(MatchRepository repository) {
        return args -> {
            // Path to your CSV file
            List<Match> matches = Files.readAllLines(Paths.get("/Users/saumgupta/repos/pl-tracker/react-app/python_scripts/matches.csv")).stream()
                .skip(1) // Skip CSV header
                .map(line -> {
                    String[] details = line.split(",");
                    // Convert and parse each field from CSV to match the Match class
                    Match match = new Match();
                    match.setMatchNum(Integer.parseInt(details[0]));
                    match.setDate(LocalDate.parse(details[1], DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    match.setTime(LocalTime.parse(details[2], DateTimeFormatter.ofPattern("HH:mm")));
                    match.setComp(details[3]);
                    match.setRound(details[4]);
                    match.setDay(details[5]);
                    match.setVenue(details[6]);
                    match.setResult(details[7]);
                    match.setGf(Double.parseDouble(details[8]));
                    match.setGa(Double.parseDouble(details[9]));
                    match.setOpponent(details[10]);
                    match.setXg(Double.parseDouble(details[11]));
                    match.setXga(Double.parseDouble(details[12]));
                    match.setPoss(Double.parseDouble(details[13]));    
                    match.setAttendance(details[14].isEmpty() ? 0.0 : Double.parseDouble(details[14]));
                    match.setCaptain(details[15]);
                    match.setFormation(details[16]);
                    match.setReferee(details[17]);
                    match.setMatchReport(details[18]);
                    match.setNotes(details[19].isEmpty() ? "none" : details[19]); // Check if notes is empty and replace with "none"
                    match.setSh(Double.parseDouble(details[20]));
                    match.setSot(Double.parseDouble(details[21]));
                    match.setDist(Double.parseDouble(details[22]));
                    match.setFk(Double.parseDouble(details[23]));
                    match.setPk(Integer.parseInt(details[24]));
                    match.setPkatt(Integer.parseInt(details[25]));
                    match.setSeason(Integer.parseInt(details[26]));
                    match.setTeam(details[27]);
                    return match;
                })
                .collect(Collectors.toList());

            repository.saveAll(matches);
        };
    }
}