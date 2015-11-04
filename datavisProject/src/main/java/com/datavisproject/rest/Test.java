package com.datavisproject.rest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

@Path("test")
public class Test {

    private DataSource ds;

    public Test() {
        try {
            ds = (DataSource) new InitialContext().lookup("java:comp/env/jdbc/mkyongdb");
        } catch (NamingException e) {
            e.printStackTrace();
        }
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

        @Path("db")
        @GET
        public String dbTest() throws SQLException, JSONException {
            JSONArray arr = new JSONArray();
            Connection connection1 = ds.getConnection();
            Statement stmt = connection1.createStatement();
            
            String query = "SELECT page_title FROM yavuz2datavis_db.page where page_title like 'Chicago%sky%';";
            ResultSet rs = stmt.executeQuery(query);
            while (rs.next()) {
                String _result = rs.getString(1);
                arr.put(_result);
            }

            JSONObject ob = new JSONObject();
            ob.put("Chicago", arr);
            return ob.toString();
        }
    }
