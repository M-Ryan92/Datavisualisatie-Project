package com.datavisproject.rest;

import com.datavisproject.db.Kleinverbruik;
import com.datavisproject.util.JsonHelper;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
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
}
