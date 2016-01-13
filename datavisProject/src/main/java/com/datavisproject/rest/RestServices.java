package com.datavisproject.rest;

import com.datavisproject.db.Statistic;
import com.datavisproject.util.JsonHelper;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.codehaus.jettison.json.JSONException;

@Path("data")
public class RestServices {

    @Path("max/{type}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getMax(@PathParam("type") String type, @PathParam("year") String year) throws SQLException, JSONException, IOException {
        return Statistic.getMaxElkUsage(type, year);
    }
    
    @Path("elk/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getElkUsage(year);
        Map<String, List> elkNetworkPoints = Statistic.getElkNetworkPoints(year, "0");
        
        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usage", JsonHelper.createJsonArray(usages));
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
                put("networkPoints" , JsonHelper.createJsonObject(elkNetworkPoints));
            }
        });
    }

    @Path("elk/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkUsage(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getElkUsage(company, year);
        Map<String, List> elkNetworkPoints = Statistic.getElkNetworkPoints(year, company);
        
        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usage", JsonHelper.createJsonArray(usages));
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
                put("networkPoints" , JsonHelper.createJsonObject(elkNetworkPoints));
            }
        });
    }

    @Path("gas/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getGasUsage(year);
        Map<String, List> gasNetworkPoints = Statistic.getGasNetworkPoints(year, "0");
        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usage", JsonHelper.createJsonArray(usages));
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
                put("networkPoints" , JsonHelper.createJsonObject(gasNetworkPoints));
            }
        });
    }

    @Path("gas/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasUsage(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getGasUsage(company, year);
        Map<String, List> gasNetworkPoints = Statistic.getGasNetworkPoints(year, company);                
        
        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usage", JsonHelper.createJsonArray(usages));
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
                put("networkPoints" , JsonHelper.createJsonObject(gasNetworkPoints));
            }
        });
    }
}
