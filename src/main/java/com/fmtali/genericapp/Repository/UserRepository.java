package com.fmtali.genericapp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fmtali.genericapp.Models.User;

import java.util.Optional;

/**
 * Repository interface for {@link User} entities.
 * 
 * Provides built-in CRUD operations through Spring Data JPA.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their username.
     * 
     * @param username the username to search for
     * @return an Optional containing the User if found
     */
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
