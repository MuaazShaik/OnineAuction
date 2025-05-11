package klu.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Column
    private String fullname;

    @Id
    @Column
    private String email;

    @Column
    private String password;

    // Constructor
    public User() {}

    // Getters and Setters
    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ToString (optional)
    @Override
    public String toString() {
        return "User [fullname=" + fullname + ", email=" + email + ", password=" + password + "]";
    }
}
