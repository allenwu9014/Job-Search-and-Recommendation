package com.laioffer.job.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laioffer.job.entity.ExampleCoordinates;
import com.laioffer.job.entity.ExampleJob;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "ExampleJobServlet", urlPatterns = {"/example_job"})
public class ExampleJobServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");

        // Database

        ObjectMapper mapper = new ObjectMapper();
        ExampleCoordinates coordinates = new ExampleCoordinates(37.485130, -122.148316);
        ExampleJob job = new ExampleJob("Software Engineer", 123456, "Aug 1, 2020", false, coordinates);
        response.getWriter().print(mapper.writeValueAsString(job));

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        JSONObject jsonRequest = new JSONObject(IOUtils.toString(request.getReader()));

       // System.out.println(IOUtils.toString(request.getReader()));

        String title = jsonRequest.getString("title");
        int salary = jsonRequest.getInt("salary");
        String starting = jsonRequest.getString("starting");
        boolean remote = jsonRequest.getBoolean("remote");

        JSONObject coordinates = (JSONObject) jsonRequest.get("coordinates");
          double latitude = coordinates.getDouble("latitude");
          double longitude = coordinates.getDouble("longitude");

        System.out.println("title: " + title);
        System.out.println("salary: " + salary);
        System.out.println("starting: " + starting);
        System.out.println("remote: " + remote);
    //   System.out.println("la: " + latitude + " longitude: " + longitude);

        ExampleJob job = new ExampleJob(jsonRequest.getString("title"), jsonRequest.getInt("salary"),
                jsonRequest.getString("starting"), jsonRequest.getBoolean("remote"),
                new ExampleCoordinates(latitude, longitude));



        response.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().print(mapper.writeValueAsString(job));
    }
}
