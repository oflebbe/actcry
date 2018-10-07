package de.oflebbe.actcry;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicLong;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import javax.annotation.Resource;


@RestController
public class ActCryController {

    @Resource
    Environment environment;

    @RequestMapping("/bier")
    public String beer(@RequestParam(value = "latitude") double lat, @RequestParam(value = "longitude") double lon,
                       @RequestParam(value = "radius") int rad) {

        System.out.printf("lat=%f, lot=%f, rad=%d", lat, lon, rad);
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        headers.add("Authorization", "Bearer " + environment.getProperty( "bearer"));
        HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);
        ResponseEntity<String> response = restTemplate.exchange(
                String.format(Locale.US,"https://api.yelp.com/v3/businesses/search?longitude=%f&latitude=%f&radius=%d",
                        lon, lat, rad), HttpMethod.GET, entity, String.class);
        // gastro.Latitude, gastro.Longitude, gastro.Shortname
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody().getBytes());
            ArrayList<Gastronomy> gl = new ArrayList<Gastronomy>();
            JsonNode idNode = rootNode.path("businesses");
            Iterator<JsonNode> ptr = idNode.elements();
            while (ptr.hasNext()) {
                JsonNode business = ptr.next();
                JsonNode coord = business.path("coordinates");
                Gastronomy g = new Gastronomy();
                g.latitude = coord.path("latitude").asDouble();
                g.longitude = coord.path("longitude").asDouble();
                g.shortname = business.path("name").asText();
                gl.add(g);
            }
            SearchResult sr = new SearchResult();
            sr.totalresults = gl.size();
            sr.items = gl;
            ObjectMapper outMapper = new ObjectMapper();
            String res = outMapper.writeValueAsString( sr);
            return res;


        }
        catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    }
}