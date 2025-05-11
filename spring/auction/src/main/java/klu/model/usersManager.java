package klu.model;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import klu.repo.UserRepository;

@Service
public class usersManager {

    @Autowired
    UserRepository UR;

    @Autowired
    JMTManager JWT;

    // Register a user
    public String addUser(User user) {
        if (UR.validateEmail(user.getEmail()) > 0) {
            return "404::Email already exists";
        }
        UR.save(user);
        return "200::User registration successful";
    }

    // Login user (and return token)
    public String validateCredentials(String email, String password) {
        if (UR.validateCredentials(email, password) > 0) {
            String token = JWT.generateToken(email);
            return "200::" + token;
        }
        return "401::Invalid credentials";
    }

    // Get user fullname from token
    public String getFullname(String token) {
        String email = JWT.validateToken(token);
        if (email.equals("401")) {
            return "401::Token Expired!";
        }

        if (email.equals("admin@gmail.com")) {
            return "Admin"; // Display "Admin" in top right
        }

        User user = UR.findById(email).orElse(null);
        if (user == null) {
            return "401::User not found";
        }

        return user.getFullname();
    }
}
