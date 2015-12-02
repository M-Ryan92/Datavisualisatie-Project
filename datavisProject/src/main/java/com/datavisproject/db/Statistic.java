package com.datavisproject.db;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Persistence;

public class Statistic {
	private static EntityManager em = Persistence.createEntityManagerFactory("datavis").createEntityManager();
	//90 total - 10 without usage info
	private static final int AMOUNT_OF__AVAILABLE_POSTALCODES = 80;
	private static final int AMOUNT_OF_RANGES = 3;

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
    
    public static long getElkRangeByYear(String year) throws NumberFormatException{
    	long usage = -1;
    	
    	String query = "select sum(sjv) from kleinverbruik where productsoort = 'ELK' "
    					+ "and jaar = ?;";
    	usage = Long.parseLong(em.createNativeQuery(query)
    			.setParameter(1, year)
    			.getSingleResult()
    			.toString());
    	long range = usage/AMOUNT_OF__AVAILABLE_POSTALCODES/AMOUNT_OF_RANGES;
    	return range;
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
    
    public static Map<String, String> getElkUsageRangeList(String year){
    	Map<String, String> ranges = new HashMap<>();
    	
    	//get range
    	final long range = getElkRangeByYear(year);
    	//get usages
    	Map<String, Long> usages = new HashMap<>();
		usages= getElkUsageHashListByYear(year);
		String _ret = "";
		Iterator it = usages.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry pair = (Map.Entry)it.next();
			String _range = "";
			long _usage = (long)pair.getValue();
			if(_usage == 0){
				_range = "0";
			}
			else if(_usage > 0 && _usage < range){
				_range = "1";
			}else if (_usage > range && _usage < (2*range)){
				_range = "2";
			}else{
				_range = "3";
			}
	        _ret += pair.getKey() + " = " + pair.getValue() + " <br>";
	        it.remove(); // avoids a ConcurrentModificationException
	        
	        ranges.put(pair.getKey().toString(), _range);
		}
    	
    	return ranges;
    }
}
