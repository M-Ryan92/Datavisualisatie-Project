package com.datavisproject.rest;

import com.datavisproject.db.Kleinverbruik;
import com.datavisproject.db.Statistic;
import com.datavisproject.util.JsonHelper;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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

		return "{" + JsonHelper.createJsonArray("results", res) + "}";
	}

	@Path("verbruik")
	@GET
	public String getVerbruik() throws SQLException, JSONException, IOException {
		List<Kleinverbruik> res = em.createNativeQuery("select * from kleinverbruik where id <10;").getResultList();

		return "{" + JsonHelper.createJsonArray("results", res) + "}";
	}
	
	//gets all years and companies
	@Path("elk")
	@GET
	public String getElkHashmap() throws SQLException, JSONException, IOException {
		Map<String, Long> usages = new HashMap<>();
		usages= Statistic.getElkUsageHashList();
		String _ret = "";
		Iterator it = usages.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
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
		usages= Statistic.getGasUsageHashList();
		String _ret = "";
		Iterator it = usages.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
	        _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
	        it.remove(); // avoids a ConcurrentModificationException
		}
		return _ret;
	}

	@Path("elk/postcode/{page}")
    @GET
    public String getElksum(@PathParam("page") String postalcode) throws SQLException, JSONException, IOException {
    	long elkUsage = -1;
    	try{
    		elkUsage= Statistic.getElkUsage(postalcode);
    	}catch(Exception e){
    		return "Postcode doesnt exist";
    	}

        return "" + elkUsage;
    }

	@Path("gas/postcode/{page}")
	@GET
	public String getGasSum(@PathParam("page") String postalcode) throws SQLException, JSONException, IOException {
		long gasUsage = -1;
		try{
			gasUsage= Statistic.getGasUsage(postalcode);
		}catch(Exception e){
			return "Postcode doesnt exist";
		}

		return "" + gasUsage;
	}
	
	@Path("elk/{year}/{postalcode}")
    @GET
    public String getElksumByYear(@PathParam("year") String year,@PathParam("postalcode")  String postalcode) throws SQLException, JSONException, IOException {
    	long elkUsage = -1;
    	try{
    		elkUsage= Statistic.getElkUsageByYear(postalcode, year);
    	}catch(Exception e){
    		return "Postcode doesnt exist";
    	}

        return "" + elkUsage;
    }
	
	@Path("gas/{year}/{postalcode}")
    @GET
    public String getGasSumByYear(@PathParam("year") String year,@PathParam("postalcode")  String postalcode) throws SQLException, JSONException, IOException {
    	long elkUsage = -1;
    	try{
    		elkUsage= Statistic.getGasUsageByYear(postalcode, year);
    	}catch(Exception e){
    		return "Postcode doesnt exist";
    	}

        return ""+elkUsage;
    }
	
	@Path("elk/year/{year}")
	@GET
	public String getElkHashmapByYear(@PathParam("year") String year) throws SQLException, JSONException, IOException {
		Map<String, Long> usages = new HashMap<>();
		usages= Statistic.getElkUsageHashListByYear(year);
		String _ret = "";
		Iterator it = usages.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
	        _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
	        it.remove(); // avoids a ConcurrentModificationException
		}
		return _ret;
	}
	
	@Path("gas/year/{year}")
	@GET
	public String getGasHashmapByYear(@PathParam("year") String year) throws SQLException, JSONException, IOException {
		Map<String, Long> usages = new HashMap<>();
		usages= Statistic.getGasUsageHashListByYear(year);
		String _ret = "";
		Iterator it = usages.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
	        _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
	        it.remove(); // avoids a ConcurrentModificationException
		}
		return _ret;
	}
	
	
}
