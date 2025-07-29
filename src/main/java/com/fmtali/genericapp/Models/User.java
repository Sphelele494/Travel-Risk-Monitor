package com.fmtali.genericapp.Models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.*;

/**
 * Represents a user in the system.
 * 
 * This class maps to the {@code users} table in the database and includes
 * user-specific
 * details such as username, email, full name, and associated submissions.
 * It also defines a role, which can be either 'User' or 'Admin'.
 * 
 * The {@Data annotation} generates getters, setters,
 * {@code toString}, {@code equals}, and {@code hashCode} methods automatically.
 * 
 * It maintains a one-to-many relationship with {@link Submission} entities.
 * 
 
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    /**
     * The unique identifier for the user.
     * This is the primary key and is auto-generated.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column
    private Long id;

    /**
     * The username of the user.
     * Must be unique and cannot be null.
     */
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * The full name of the user.
     * Cannot be null.
     */
    @Column(nullable = false)
    private String fullName;

    /**
     * The email address of the user.
     * Must be unique and cannot be null.
     */
    @Column(nullable = false, unique = true)
    private String email;

    /**
     * The password for the user's account.
     * Cannot be null.
     */
    @Column(nullable = false)
    private String password;

    /**
     * The role assigned to the user.
     * Default role is 'User', but can also be 'Admin'.
     */
    private String role;

    /**
     * The list of submissions made by this user.
     * Represents a one-to-many relationship with the Submission entity.
     */

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Submission> submissions = new ArrayList<>();
}
