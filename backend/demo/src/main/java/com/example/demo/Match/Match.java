// Match.java
package com.example.demo.Match;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table
public class Match {
    @Id
    @SequenceGenerator(name = "match_sequence", sequenceName = "match_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "match_sequence")
    private Long id;
    private Integer matchNum;
    private LocalDate date;
    private LocalTime time;
    private String comp;
    private String round;
    private String day;
    private String venue;
    private String result;
    private Double gf;
    private Double ga;
    private String opponent;
    private Double xg;
    private Double xga;
    private Double poss;
    private Double attendance;
    private String captain;
    private String formation;
    private String referee;
    private String matchReport;
    private String notes;
    private Double sh;
    private Double sot;
    private Double dist;
    private Double fk;
    private Integer pk;
    private Integer pkatt;
    private Integer season;
    private String team;

    // Constructors, getters, and setters

    public Match() {
    }

    public Match(Long id, Integer matchNum, LocalDate date, LocalTime time, String comp, String round, String day, String venue, String result, Double gf, Double ga, String opponent, Double xg, Double xga, Double poss, Double attendance, String captain, String formation, String referee, String matchReport, String notes, Double sh, Double sot, Double dist, Double fk, Integer pk, Integer pkatt, Integer season, String team) {
        this.id = id;
        this.matchNum = matchNum;
        this.date = date;
        this.time = time;
        this.comp = comp;
        this.round = round;
        this.day = day;
        this.venue = venue;
        this.result = result;
        this.gf = gf;
        this.ga = ga;
        this.opponent = opponent;
        this.xg = xg;
        this.xga = xga;
        this.poss = poss;
        this.attendance = attendance;
        this.captain = captain;
        this.formation = formation;
        this.referee = referee;
        this.matchReport = matchReport;
        this.notes = notes;
        this.sh = sh;
        this.sot = sot;
        this.dist = dist;
        this.fk = fk;
        this.pk = pk;
        this.pkatt = pkatt;
        this.season = season;
        this.team = team;
    }


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMatchNum() {
        return this.matchNum;
    }

    public void setMatchNum(Integer matchNum) {
        this.matchNum = matchNum;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return this.time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getComp() {
        return this.comp;
    }

    public void setComp(String comp) {
        this.comp = comp;
    }

    public String getRound() {
        return this.round;
    }

    public void setRound(String round) {
        this.round = round;
    }

    public String getDay() {
        return this.day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getVenue() {
        return this.venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getResult() {
        return this.result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Double getGf() {
        return this.gf;
    }

    public void setGf(Double gf) {
        this.gf = gf;
    }

    public Double getGa() {
        return this.ga;
    }

    public void setGa(Double ga) {
        this.ga = ga;
    }

    public String getOpponent() {
        return this.opponent;
    }

    public void setOpponent(String opponent) {
        this.opponent = opponent;
    }

    public Double getXg() {
        return this.xg;
    }

    public void setXg(Double xg) {
        this.xg = xg;
    }

    public Double getXga() {
        return this.xga;
    }

    public void setXga(Double xga) {
        this.xga = xga;
    }

    public Double getPoss() {
        return this.poss;
    }

    public void setPoss(Double poss) {
        this.poss = poss;
    }

    public Double getAttendance() {
        return this.attendance;
    }

    public void setAttendance(Double attendance) {
        this.attendance = attendance;
    }

    public String getCaptain() {
        return this.captain;
    }

    public void setCaptain(String captain) {
        this.captain = captain;
    }

    public String getFormation() {
        return this.formation;
    }

    public void setFormation(String formation) {
        this.formation = formation;
    }

    public String getReferee() {
        return this.referee;
    }

    public void setReferee(String referee) {
        this.referee = referee;
    }

    public String getMatchReport() {
        return this.matchReport;
    }

    public void setMatchReport(String matchReport) {
        this.matchReport = matchReport;
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Double getSh() {
        return this.sh;
    }

    public void setSh(Double sh) {
        this.sh = sh;
    }

    public Double getSot() {
        return this.sot;
    }

    public void setSot(Double sot) {
        this.sot = sot;
    }

    public Double getDist() {
        return this.dist;
    }

    public void setDist(Double dist) {
        this.dist = dist;
    }

    public Double getFk() {
        return this.fk;
    }

    public void setFk(Double fk) {
        this.fk = fk;
    }

    public Integer getPk() {
        return this.pk;
    }

    public void setPk(Integer pk) {
        this.pk = pk;
    }

    public Integer getPkatt() {
        return this.pkatt;
    }

    public void setPkatt(Integer pkatt) {
        this.pkatt = pkatt;
    }

    public Integer getSeason() {
        return this.season;
    }

    public void setSeason(Integer season) {
        this.season = season;
    }

    public String getTeam() {
        return this.team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

}
