package de.oflebbe.actcry;


import com.fasterxml.jackson.annotation.JsonProperty;

public class Gastronomy {
    @JsonProperty("Longitude")
    double longitude;
    @JsonProperty("Latitude")
    double latitude;
    @JsonProperty("Shortname")
    String shortname;
}

