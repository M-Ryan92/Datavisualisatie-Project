package com.datavisproject.rest;

import com.datavisproject.db.Statistic;
import com.datavisproject.util.JsonHelper;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.codehaus.jettison.json.JSONException;

@Path("data")
public class RestServices {

    private String formatYear(String year) {
        String paramLine = "";
        if (year.contains(",")) {
            String[] split = year.split(",");
            for (String s : split) {
                paramLine += "´" + s + "´,";
            }
        }
        if (paramLine.length() == 0) {
            paramLine = year;
        } else {
            paramLine = paramLine.substring(0, paramLine.length() - 1);
        }
        return paramLine;
    }

    @Path("elk/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getElkUsage(formatYear(year));

        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
            }
        });
    }

    @Path("elk/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkUsage(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getElkUsage(company, formatYear(year));

        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
            }
        });
    }

    @Path("gas/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getGasUsage(formatYear(year));

        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
            }
        });
    }

    @Path("gas/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasUsage(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {

        Map<String, Long> usages = Statistic.getGasUsage(company, formatYear(year));

        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
            {
                put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
            }
        });
    }
}
