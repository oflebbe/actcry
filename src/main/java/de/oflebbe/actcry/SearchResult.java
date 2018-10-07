package de.oflebbe.actcry;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class SearchResult {
    @JsonProperty("TotalResults")
    int totalresults;
    @JsonProperty("Items")
    ArrayList<Gastronomy> items;
}
