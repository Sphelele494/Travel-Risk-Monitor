package com.fmtali.genericapp.Models;

import lombok.*;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

/**
 * Represents a pothole submission by a user.
 * 
 * @author Nhlamulo Mashele
 */
@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    /**
     * Unique identifier for the submission.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    /**
     * Title or short description of the pothole report.
     */
    @Column(nullable = false)
    private String title;

    /**
     * Additional description about the pothole.
     */
    @Column(length = 500)
    private String content;

    /**
     * URL to the image of the pothole.
     */
    private String imageUrl;

    /**
     * address or GPS coordinates of the pothole location.
     */
    private String location;

    /**
     * When the submission was created.
     */
    private LocalDateTime createdAt;

    /**
     * Severity level of the pothole .
     */
    @Enumerated(EnumType.STRING)
    private Severity severity;

    /**
     * The user who submitted the pothole report.
     */

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Enum representing severity levels.
     */
    public enum Severity {
        LOW, MEDIUM, HIGH
    }
}
