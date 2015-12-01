package com.datavisproject.db;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;

public class Statistic {
	private static EntityManager em = Persistence.createEntityManagerFactory("datavis").createEntityManager();

    public Statistic() {
        
    }
    
    public static long getElkUsage(String postalcode) throws NumberFormatException{
    	long usage = -1;
    	
    	String query = "select sum(sjv) from kleinverbruik where productsoort = 'ELK' "
    			+ "and (postcode_tot like ? or postcode_van like ?);";
    	usage = Long.parseLong(em.createNativeQuery(query)
    			.setParameter(1, postalcode + "%")
    			.setParameter(2, postalcode + "%")
    			.getSingleResult()
    			.toString());
    	
    	return usage;
    }
    
    public static long getGasUsage(String postalcode) throws NumberFormatException{
    	long usage = -1;
    	
    	String query = "select sum(sjv) from kleinverbruik where productsoort = 'GAS' "
    			+ "and (postcode_tot like ? or postcode_van like ?);";
    	usage = Long.parseLong(em.createNativeQuery(query)
    			.setParameter(1, postalcode + "%")
    			.setParameter(2, postalcode + "%")
    			.getSingleResult()
    			.toString());
    	
    	return usage;
    }
    
    public static long getElkUsageByYear(String postalcode, String year) throws NumberFormatException{
    	long usage = -1;
    	
    	String query = "select sum(sjv) from kleinverbruik where productsoort = 'ELK' "
    			+ "and (postcode_tot like ? or postcode_van like ?) "
    					+ "and jaar = ?;";
    	usage = Long.parseLong(em.createNativeQuery(query)
    			.setParameter(1, postalcode + "%")
    			.setParameter(2, postalcode + "%")
    			.setParameter(3, year)
    			.getSingleResult()
    			.toString());
    	
    	return usage;
    }
    
    public static long getGasUsageByYear(String postalcode, String year) throws NumberFormatException{
    	long usage = -1;
    	
    	String query = "select sum(sjv) from kleinverbruik where productsoort = 'GAS' "
    			+ "and (postcode_tot like ? or postcode_van like ?) "
    					+ "and jaar = ?;";
    	usage = Long.parseLong(em.createNativeQuery(query)
    			.setParameter(1, postalcode + "%")
    			.setParameter(2, postalcode + "%")
    			.setParameter(3, year)
    			.getSingleResult()
    			.toString());
    	
    	return usage;
    }
    
    public static Map<String, Long> getElkUsageHashList(){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getElkUsage(""+i);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    		usages.put(""+i, _usage);
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getGasUsageHashList(){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getGasUsage(""+i);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    		usages.put(""+i, _usage);
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getElkUsageHashListByYear(String year){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getElkUsageByYear(""+i, year);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    		usages.put(""+i, _usage);
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getGasUsageHashListByYear(String year){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getGasUsageByYear(""+i, year);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    		usages.put(""+i, _usage);
    	}
    	
    	return usages;
    }
}
