package com.datavisproject.util;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.codehaus.jackson.map.ObjectMapper;

public class JsonHelper {

    public static String createJsonObject(Map<String, String> items) throws IOException {
        String jsonObject = "{";
        int itemRef = 0;
        for (String key : items.keySet()) {
            jsonObject += "\""+key + "\":" + items.get(key);

            if (items.size() - 1 > itemRef) {
                jsonObject += ",";
            }
            itemRef++;
        }
        jsonObject += "}";
        return jsonObject;
    }

    public static String createJsonArray(Map<?, ?> map) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(map);
    }

    public static String createJsonArray(List list) throws IOException {
        String jsonArray = "[";
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
