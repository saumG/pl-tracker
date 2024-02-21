// MatchService.java
package com.example.demo.Match;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class MatchService {
    private final MatchRepository matchRepository;

    @Autowired
    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    public List<Match> getMatches() {
        return matchRepository.findAll();
    }

    public List<Match> getFirstTenMatches() {
        return matchRepository.findAll(PageRequest.of(0, 10)).getContent();
    }

    public void addNewMatch(Match match) {
        matchRepository.save(match);
    }
}