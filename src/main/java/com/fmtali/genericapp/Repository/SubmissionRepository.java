package com.fmtali.genericapp.Repository;

import com.fmtali.genericapp.Models.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing {@link Submission} entities.
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    /**
     * Finds all submissions by a specific user's ID.
     */
    List<Submission> findByUserId(Long userId);
}
