package com.datavisproject.rest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

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
    
    @Path("db")
    @GET
    public String dbTest() throws SQLException, JSONException{
    	System.out.println("-------- MySQL JDBC Connection Testing ------------");

    	try {
    		Class.forName("com.mysql.jdbc.Driver");
    	} catch (ClassNotFoundException e) {
    		e.printStackTrace();
    		return("Where is your MySQL JDBC Driver?");
    	}

    	System.out.println("MySQL JDBC Driver Registered!");
    	Connection connection = null;

    	try {
    		connection = DriverManager
    		.getConnection("jdbc:mysql://185.41.126.25:9150/Yavuz2datavis_db","Yavuz2datavis", "qwe123456");

    	} catch (SQLException e) {
    		e.printStackTrace();
    		return "Connection Failed! Check output console";
    	}

    	if (connection != null) {
    		//return "You made it, take control your database now!";
    	} else {
    		return "Failed to make connection!";
    	}
    	
    	JSONArray arr = new JSONArray();
    	
    	Statement stmt = connection.createStatement() ;
    	String query = "SELECT page_title FROM yavuz2datavis_db.page where page_title like 'Chicago%sky%';" ;
    	ResultSet rs = stmt.executeQuery(query) ;
    	while(rs.next()){
    		String _result = rs.getString(1);
    		arr.put(_result);
    	}
    	
    	JSONObject ob = new JSONObject();
    	ob.put("Chicago", arr);
    	return ob.toString();
    }
}
