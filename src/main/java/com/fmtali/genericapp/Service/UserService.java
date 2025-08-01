package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.User;
import com.fmtali.genericapp.Repository.UserRepository;
import com.fmtali.genericapp.util.constants.Roles;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for managing {@link User} entities.
 */
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Creates and saves a new user.
     */
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encrypt the password
        // to do: addvalidation logic
        user.setRole(Roles.USER.getRole());
        return userRepository.save(user);
    }

    /**
     * Returns a user by ID.
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Returns all users.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Updates an existing user.
     */
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUsername(updatedUser.getUsername());
                    user.setFullName(updatedUser.getFullName());
                    user.setEmail(updatedUser.getEmail());
                    user.setPassword(updatedUser.getPassword());
                    user.setRole(updatedUser.getRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    /**
     * Deletes a user by ID.
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Todo: Implement user authentication logic.
     * Authenticates a user by username and password.
     */

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }// Sfiso will do this method so delete before pushing

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        User user = userOptional.get();

        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
        // You can add authorities based on user roles if needed
        grantedAuthorities.add(new SimpleGrantedAuthority(user.getRole()));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                grantedAuthorities // You can set authorities based on user.getRole() if needed
        );

    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}
