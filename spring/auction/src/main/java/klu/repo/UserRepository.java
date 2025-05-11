package klu.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import klu.model.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query("SELECT COUNT(u) FROM User u WHERE u.email = :email")
    int validateEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.email = :email AND u.password = :password")
    int validateCredentials(@Param("email") String email, @Param("password") String password);
}
