package com.datavisproject.rest;

import com.datavisproject.db.Kleinverbruik;
import com.datavisproject.db.Statistic;
import com.datavisproject.util.JsonHelper;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

@Path("data")
public class RestServices {

    private EntityManager em;

    public RestServices() {
        em = Persistence.createEntityManagerFactory("datavis").createEntityManager();
    }

    @Path("elk/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {
    	
    	List usages = Statistic.getElkUsage(year);
    	
        return JsonHelper.createJsonArrFromListArr(usages);
    }
    
    @Path("elk/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkUsage(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {
    	String e = "";
    	e = "1;";
    	List usages = Statistic.getElkUsage(company, year);
    	
        return JsonHelper.createJsonArrFromListArr(usages);
    }
    
    @Path("gas/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {
    	
    	List usages = Statistic.getGasUsage(year);
    	
        return JsonHelper.createJsonArrFromListArr(usages);
    }
    
    @Path("gas/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasUsage(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {
    	
    	List usages = Statistic.getGasUsage(company, year);
    	
        return JsonHelper.createJsonArrFromListArr(usages);
    }
    
    
}
