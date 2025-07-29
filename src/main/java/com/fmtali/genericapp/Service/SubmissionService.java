package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.Submission;
import com.fmtali.genericapp.Repository.SubmissionRepository;
import com.fmtali.genericapp.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing {@link Submission} entities.
 */
@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public Submission createSubmission(Long userId, Submission submission) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        submission.setUser(user);
        submission.setCreatedAt(LocalDateTime.now());
        return submissionRepository.save(submission);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> getSubmissionsByUserId(Long userId) {
        return submissionRepository.findByUserId(userId);
    }

    public Submission updateSubmission(Long id, Submission updatedSubmission) {
        return submissionRepository.findById(id)
                .map(submission -> {
                    submission.setTitle(updatedSubmission.getTitle());
                    submission.setContent(updatedSubmission.getContent());
                    submission.setCreatedAt(LocalDateTime.now());
                    return submissionRepository.save(submission);
                })
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + id));
    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }



    
}
