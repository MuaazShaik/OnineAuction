package klu.controller;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import klu.model.User;
import klu.model.usersManager;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173") // React frontend port
public class UserController {

    @Autowired
    usersManager UM;

    // Registration endpoint
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        return UM.addUser(user);
    }

    // Login endpoint
    @PostMapping("/signin")
    public String signin(@RequestBody User user) {
        return UM.validateCredentials(user.getEmail(), user.getPassword());
    }

    // Get fullname from token (for dashboard display)
    @PostMapping("/getfullname")
    public String getFullname(@RequestBody Map<String, String> data) {
        return UM.getFullname(data.get("csrid"));
    }
}
