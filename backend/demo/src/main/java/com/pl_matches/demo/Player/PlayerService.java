package com.pl_matches.demo.Player;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

@Service
public class PlayerService {
    @GetMapping
	public List<Player> getPlayers() {
		return List.of(new Player(
				1L, 
				"John",
				"john@gmail.com",
				LocalDate.of(2000, Month.JANUARY, 5),
				21
			)
		);
	}	
}
