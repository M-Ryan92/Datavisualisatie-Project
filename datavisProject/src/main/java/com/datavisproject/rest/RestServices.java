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

    @Path("elk/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {

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

        Map<String, Long> usages = Statistic.getElkUsage(paramLine);

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
        Map<String, Long> usages = Statistic.getElkUsage(company, year);

        return JsonHelper.createJsonObject(
                new HashMap<String, String>() {
                    {
                        put("usagescale", JsonHelper.createJsonArray(Statistic.calculateScale(usages)));
                    }
                });
    }
    /*
     @Path("gas/{year}")
     @Produces(MediaType.APPLICATION_JSON)
     @GET
     public String getGasUsage(@PathParam("year") String year) throws SQLException, JSONException, IOException {
    	
     List usages = Statistic.getGasUsage(year);
     usages = Statistic.calculateScale(usages);
     return JsonHelper.createJsonArrFromListArr(usages);
     }
    
     @Path("gas/{company}/{year}")
     @Produces(MediaType.APPLICATION_JSON)
     @GET
     public String getGasUsage(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {
    	
     List usages = Statistic.getGasUsage(company, year);
     usages = Statistic.calculateScale(usages);
     return JsonHelper.createJsonArrFromListArr(usages);
     }
    
     @Path("test/{year}")
     @GET
     public String test(@PathParam("year") String year) throws SQLException, JSONException, IOException {
     String _return = "";
     long avarageUsage, range = -1;
     long total = 0;
     int size = 0, amountOfFirstRange = 0, amountOfSecondRange = 0, amountOfThirdRange = 0;
     List usages = Statistic.getGasUsage(year);
     size = usages.size();
     for(int i=0; i< size; i ++){
     Object[] _arr = (Object[]) usages.get(i);
     total+= ((BigDecimal) _arr[1]).longValue();
     _return += _arr[0] + " "  + _arr[1] + "<br>";
     }
     avarageUsage = (total/size);
     range = avarageUsage*2/3;
    	
     for(int i=0; i< size; i ++){
     Object[] _arr = (Object[]) usages.get(i);
     long _range = ((BigDecimal) _arr[1]).longValue();
     if(_range < range){
     amountOfFirstRange++;
     }else if(_range > range && _range < range*2){
     amountOfSecondRange++;
     }else if (_range > range*2){
     amountOfThirdRange++;
     }
     }
    	
    	
     _return = "avarage is: "+avarageUsage + " <br> " 
     + " size is: " + size + " <br> " 
     + "total is: " + total + " <br> "
     + "amountOfFirstRange is: " + amountOfFirstRange + " <br> "
     + "amountOfSecondRange is: " + amountOfSecondRange + " <br> "
     + "amountOfThirdRange is: " + amountOfThirdRange + " <br> "
     +_return;
     return _return;
     }*/

}
