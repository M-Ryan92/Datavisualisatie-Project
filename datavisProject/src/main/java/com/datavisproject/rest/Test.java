package com.datavisproject.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

@Path("test")
public class Test {

    @GET
    public String test() throws JSONException {
        JSONObject json = new JSONObject();
        JSONArray arr = new JSONArray();
        arr.put("hello world");
        arr.put("creepy-octo-lamp");
        
        json.put("my projects",  arr);
        return json.toString();
    }
}
