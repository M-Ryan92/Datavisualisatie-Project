package com.datavisproject.util;

import java.io.IOException;
import java.util.List;
import org.codehaus.jackson.map.ObjectMapper;

public class JsonHelper {

    public static String createJsonArray(String name, List list) throws IOException {
        String jsonArray = name + ": [";
        ObjectMapper mapper = new ObjectMapper();
        for (int v = 0; v < list.size(); v++) {
            if (v + 1 < list.size()) {
                jsonArray += mapper.writeValueAsString(list.get(v)) + ",";
            } else {
                jsonArray += mapper.writeValueAsString(list.get(v)) + "]";
            }
        }
        return jsonArray;
    }
}
