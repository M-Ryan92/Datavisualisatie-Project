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

@Path("test")
public class Test {

    private EntityManager em;

    public Test() {
        em = Persistence.createEntityManagerFactory("datavis").createEntityManager();
    }

    @GET
    public String test() throws JSONException {
        JSONObject json = new JSONObject();
        JSONArray arr = new JSONArray();
        arr.put("hello world");
        arr.put("creepy-octo-lamp");

        json.put("my projects", arr);
        return json.toString();
    }

    @Path("db/{page}")
    @GET
    public String dbTest(@PathParam("page") Integer page) throws SQLException, JSONException, IOException {
        javax.persistence.criteria.CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
        cq.select(cq.from(Kleinverbruik.class));
        javax.persistence.Query q = em.createQuery(cq);
        q.setMaxResults(10 - 0 + 1);
        q.setFirstResult(page);
        List<Kleinverbruik> res = q.getResultList();

        return "{" + JsonHelper.createJsonArray(res) + "}";
    }

    @Path("verbruik")
    @GET
    public String getVerbruik() throws SQLException, JSONException, IOException {
        List<Kleinverbruik> res = em.createNativeQuery("select * from kleinverbruik where id <10;").getResultList();

        return "{" + JsonHelper.createJsonArray(res) + "}";
    }
    /*
    //gets all years and companies
    @Path("elk")
    @GET
    public String getElkHashmap() throws SQLException, JSONException, IOException {
        Map<String, Long> usages = new HashMap<>();
        usages = Statistic.getElkUsageHashList();
        String _ret = "";
        Iterator it = usages.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
            it.remove(); // avoids a ConcurrentModificationException
        }
        return _ret;
    }

    //gets all years and companies
    @Path("gas")
    @GET
    public String getGasHashmap() throws SQLException, JSONException, IOException {
        Map<String, Long> usages = new HashMap<>();
        usages = Statistic.getGasUsageHashList();
        String _ret = "";
        Iterator it = usages.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
            it.remove(); // avoids a ConcurrentModificationException
        }
        return _ret;
    }

    @Path("elk/postcode/{page}")
    @GET
    public String getElksum(@PathParam("page") String postalcode) throws SQLException, JSONException, IOException {
        long elkUsage = -1;
        try {
            //elkUsage = Statistic.getElkUsage(postalcode);
        } catch (Exception e) {
            return "Postcode doesnt exist";
        }

        return "" + elkUsage;
    }

    @Path("gas/postcode/{page}")
    @GET
    public String getGasSum(@PathParam("page") String postalcode) throws SQLException, JSONException, IOException {
        long gasUsage = -1;
        try {
            gasUsage = Statistic.getGasUsage(postalcode);
        } catch (Exception e) {
            return "Postcode doesnt exist";
        }

        return "" + gasUsage;
    }

    @Path("elk/{year}/{postalcode}")
    @GET
    public String getElksumByYear(@PathParam("year") String year, @PathParam("postalcode") String postalcode) throws SQLException, JSONException, IOException {
        long elkUsage = -1;
        try {
            elkUsage = Statistic.getElkUsage(postalcode, year);
        } catch (Exception e) {
            return "Postcode doesnt exist";
        }

        return "" + elkUsage;
    }

    @Path("gas/{year}/{postalcode}")
    @GET
    public String getGasSumByYear(@PathParam("year") String year, @PathParam("postalcode") String postalcode) throws SQLException, JSONException, IOException {
        long elkUsage = -1;
        try {
            elkUsage = Statistic.getGasUsage(postalcode, year);
        } catch (Exception e) {
            return "Postcode doesnt exist";
        }

        return "" + elkUsage;
    }
    
    @Path("elk/company/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkSumByCompany(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {
    	return JsonHelper.createJsonArray(Statistic.getElkUsageHashListByCompany(company, year));
    }
    
    @Path("gas/company/{company}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasSumByCompany(@PathParam("company") String company) throws SQLException, JSONException, IOException {
    	return JsonHelper.createJsonArray(Statistic.getGasUsageHashListByCompany(company));
    }
    
    @Path("elk/company/{company}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkSumByCompany(@PathParam("company") String company) throws SQLException, JSONException, IOException {
    	return JsonHelper.createJsonArray(Statistic.getElkUsageHashListByCompany(company));
    }
    
    @Path("gas/company/{company}/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasSumByCompany(@PathParam("company") String company, @PathParam("year") String year) throws SQLException, JSONException, IOException {
    	return JsonHelper.createJsonArray(Statistic.getGasUsageHashListByCompany(company, year));
    }

    @Path("elk/year/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getElkHashmapByYear(@PathParam("year") String year) throws SQLException, JSONException, IOException {
    	
    	List usages = Statistic.getElkUsage(year);
    	
        return JsonHelper.createJsonArrFromListArr(usages);
    }

    @Path("gas/year/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String getGasHashmapByYear(@PathParam("year") String year) throws SQLException, JSONException, IOException {
        Map<String, Long> usages = new HashMap<>();
        usages = Statistic.getGasUsageHashListByYear(year);
        String _ret = "";
        Iterator it = usages.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
            it.remove(); // avoids a ConcurrentModificationException
        }
        return _ret;
    }

    @Path("testranges/{year}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String rangesTest(@PathParam("year") String year) throws IOException {
        long max, min, diff;

        Map<String, Long> elkUsageHashListByYear = Statistic.getElkUsageHashListByYear(year)
                .entrySet().stream().filter(e -> e.getValue() != 0)
                .collect(Collectors.toMap(e -> e.getKey(), e -> e.getValue()));

        max = elkUsageHashListByYear.entrySet().stream().map(e -> e.getValue()).max(Long::compare).get();
        min = elkUsageHashListByYear.entrySet().stream().map(e -> e.getValue()).min(Long::compare).get();
        diff = (max - min) / 3;

        //some hardcoded shit :C
        long[] range0 = {min, min + diff - 1};
        long[] range1 = {min + diff, max - diff - 1};
        long[] range2 = {max - diff, max};
        Map<String,Long[]> rangeList = new HashMap() {
            {
                put("#BFBF3F",range0);
                put("#BF7F3F",range1);
                put("#BF3F3F",range2);
            }
        };
        Map<String, Long> elkUsageHashListByYear1 = Statistic.getElkUsageHashListByYear(year);
        
        return JsonHelper.createJsonObject(new HashMap<String,String>(){{
            put("range", JsonHelper.createJsonArray(rangeList));
            put("usage", JsonHelper.createJsonArray(elkUsageHashListByYear1));
        }});
    }
    @Path("testmap")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public String geoMapList(){
        
        return "";
    }
    
    @Path("elk/ranges/{year}")
    @GET
    public String getElkRangesByYear(@PathParam("year") String year) throws SQLException, JSONException, IOException {
        Map<String, String> ranges = new HashMap<>();
        ranges = Statistic.getElkUsageRangeList(year);
        String _ret = "";
        Iterator it = ranges.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
            it.remove(); // avoids a ConcurrentModificationException
        }
        return _ret;
    }*/

}
