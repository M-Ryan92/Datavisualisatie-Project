package com.datavisproject.db;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;
import javax.persistence.Persistence;

public class Statistic {
	private static EntityManager em = Persistence.createEntityManagerFactory("datavis").createEntityManager();

    public Statistic() {
        
    }
    
    public static Map<String, Long> getElkUsage(String year) throws NumberFormatException{
    	List usages;
    	String query = "call getElkusage(?);";
    	usages = em.createNativeQuery(query)
    			.setParameter(1, year)
    			.getResultList();
    	
    	
    	return convertListtoMap(usages);
    }
    
    public static Map<String, Long> getElkUsage(String company, String year) throws NumberFormatException{
    	List usages;
    	String query = "call getNetBeheerElkUsage(?, ?);";
    	usages = em.createNativeQuery(query)
    			.setParameter(1, company)
    			.setParameter(2, year)
    			.getResultList();
    	return convertListtoMap(usages);
    }
    
    public static Map<String, Long> getGasUsage(String year) throws NumberFormatException{
    	List usages;
    	String query = "call getGasUsage(?);";
    	usages = em.createNativeQuery(query)
    			.setParameter(1, year)
    			.getResultList();
    	return convertListtoMap(usages);
    }
    
    
    
    public static Map<String, Long> getGasUsage(String company, String year) throws NumberFormatException{
    	List usages;
    	String query = "call getNetBeheerGasUsage(?, ?);";
    	usages = em.createNativeQuery(query)
    			.setParameter(1, company)
    			.setParameter(2, year)
    			.getResultList();
    	return convertListtoMap(usages);
    }
    
    private static Map<String, Long> convertListtoMap(List list){
    	Map<String, Long> map = new HashMap<String, Long>();
    	
    	for(int i= 0; i< list.size(); i++){
    		Object[] _arr = (Object[]) list.get(i);
    		map.put(_arr[0].toString(), ((BigDecimal)_arr[1]).longValue());
    	}
    	
    	return map;
    }
    
    public static Map<String, String> calculateScale(Map<String, Long> usages){
    	Map<String, String> newMap = new HashMap<String, String>();
    	long avarageUsage, range = -1;
    	long total = 0;
    	int size = 0, amountOfFirstRange = 0, amountOfSecondRange = 0, amountOfThirdRange = 0;
    	size = usages.size();
    	
        Iterator it = usages.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pair = (Map.Entry) it.next();
            total += (long)pair.getValue();
            //it.remove(); // avoids a ConcurrentModificationException
        }
        
    	avarageUsage = (total/size);
    	range = avarageUsage*2/3;
    	System.out.println("range is: " + range);
    	Iterator it2 = usages.entrySet().iterator();
        while (it2.hasNext()) {
            Map.Entry pair = (Map.Entry) it2.next();
            long _range = (long) pair.getValue();
    		String strRange = "";
    		if(_range < range){
    			amountOfFirstRange++;
    			strRange = "#BFBF3F";
    		}else if(_range > range && _range < range*2){
    			amountOfSecondRange++;
    			strRange = "#BF7F3F";
    		}else if (_range > range*2){
    			amountOfThirdRange++;
    			strRange = "#BF3F3F";
    		}
            newMap.put(pair.getKey().toString(), strRange);
        }
    	
    	System.out.println("avarage is: "+avarageUsage + " \n " 
    	        + " size is: " + size + " \n " 
    	        + "total is: " + total + " \n "
    	        + "amountOfFirstRange is: " + amountOfFirstRange + " \n "
    	        + "amountOfSecondRange is: " + amountOfSecondRange + " \n "
    	        + "amountOfThirdRange is: " + amountOfThirdRange + " \n ");
    	return newMap;
    }
    
    
    

    /*
    public static long getElkUsage(String postalcode, String year) throws NumberFormatException{
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
    
    public static long getGasUsage(String postalcode, String year) throws NumberFormatException{
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
    	AMOUNT_OF_AVAILABLE_POSTALCODES = getElkUsageHashListByYear(year).size();
    	long range = usage/AMOUNT_OF_AVAILABLE_POSTALCODES/AMOUNT_OF_RANGES;
    	return range;
    }
    
    public static long getElkUsageByCompany(String company, String postalcode){
    	long usage = -1;
    	
    	String query = "select sum(sjv) from kleinverbruik where productsoort = 'ELK' " + 
    			"and lower(netbeheerder) like ? and (postcode_van like ? or postcode_tot like ?);";
    	usage = Long.parseLong(em.createNativeQuery(query)
    			.setParameter(1, '%'+company.toLowerCase()+'%')
    			.setParameter(2, postalcode + "%")
    			.setParameter(3, postalcode + "%")
    			.getSingleResult().toString());
    	
    	return usage;
    }
    
    public static long getElkUsageByCompany(String company, String year, String postalcode){
    	long usage = -1;

		String query = "select sum(sjv) from kleinverbruik where productsoort = 'ELK' " + 
		"and jaar = ? and lower(netbeheerder) like ? and (postcode_van like ? or postcode_tot like ?);";
		usage = Long.parseLong(em.createNativeQuery(query)
				.setParameter(1, year)
				.setParameter(2, '%'+company.toLowerCase()+'%')
				.setParameter(3, postalcode + "%")
				.setParameter(4, postalcode + "%")
				.getSingleResult().toString());
		
		return usage;
    }

    public static long getGasUsageByCompany(String company, String postalcode){
    	long usage = -1;

		String query = "select sum(sjv) from kleinverbruik where productsoort = 'GAS' " + 
		"lower(netbeheerder) like ? and (postcode_van like ? or postcode_tot like ?);";
		usage = Long.parseLong(em.createNativeQuery(query)
				.setParameter(1, '%'+company.toLowerCase()+'%')
				.setParameter(2, postalcode + "%")
				.setParameter(3, postalcode + "%")
				.getSingleResult().toString());
		
		return usage;
    }
    
    public static long getGasUsageByCompany(String company, String year, String postalcode){
    	long usage = -1;

		String query = "select sum(sjv) from kleinverbruik where productsoort = 'GAS' " + 
		"and jaar = ? and lower(netbeheerder) like ? and (postcode_van like ? or postcode_tot like ?);";
		usage = Long.parseLong(em.createNativeQuery(query)
				.setParameter(1, year)
				.setParameter(2, '%'+company.toLowerCase()+'%')
				.setParameter(3, postalcode + "%")
				.setParameter(4, postalcode + "%")
				.getSingleResult().toString());
		
		return usage;
    }
    
    public static Map<String, Long> getElkUsageHashList(){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			//_usage = getElkUsage(""+i);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getGasUsageHashList(){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getGasUsage(""+i);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getElkUsageHashListByYear(String year){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getElkUsage(""+i, year);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getGasUsageHashListByYear(String year){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getGasUsage(""+i, year);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getElkUsageHashListByCompany(String company){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getElkUsageByCompany(company, ""+i);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getElkUsageHashListByCompany(String company, String year){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getElkUsageByCompany(company, year, ""+i);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getGasUsageHashListByCompany(String company){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getGasUsageByCompany(company, ""+i);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
    	}
    	
    	return usages;
    }
    
    public static Map<String, Long> getGasUsageHashListByCompany(String company, String year){
    	Map<String, Long> usages = new HashMap<>();
    	for(int i = 10; i < 100; i++){
    		long _usage = 0;
    		try{
    			_usage = getGasUsageByCompany(company, year, ""+i);
    			usages.put(""+i, _usage);
    		}catch(Exception e){
    			//no record for this postal code
    		}
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
    
    */
}
