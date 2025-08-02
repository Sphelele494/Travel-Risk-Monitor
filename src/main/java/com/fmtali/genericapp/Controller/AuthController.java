package com.fmtali.genericapp.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import com.fmtali.genericapp.Models.LoginRequest;
import com.fmtali.genericapp.Models.Submission;
import com.fmtali.genericapp.Models.User;
import com.fmtali.genericapp.Service.AuthService;
import com.fmtali.genericapp.Service.SubmissionService;
import com.fmtali.genericapp.Service.UserService;

import java.security.Principal;
import java.util.Comparator;

/**
 * @author Nhlamulo Mashele
 * 
 *         Controller responsible for handling authentication-related requests
 *         such as
 *         user signup, login, and accessing the dashboard.
 */
@CrossOrigin(origins = "http://localhost:5173")
@Controller
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final AuthService authService;
    private final SubmissionService submissionService;

    @Autowired
    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService,
            AuthService authService,
            SubmissionService submissionService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.authService = authService;
        this.submissionService = submissionService;
    }

    /**
     * Handles GET requests to "/signup".
     * Displays the signup form to the user.
     *
     * @param model the model to bind form data
     * @return the name of the signup template
     */
    @GetMapping("/signup")
    public String showSignupForm(Model model) {
        model.addAttribute("user", new User());
        return "signup";
    }

    /**
     * Handles POST requests to "/signup".
     * Registers a new user using the form data.
     *
     * @param user the user submitted from the signup form
     * @return redirection to the login page after successful registration
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            userService.createUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Handles GET requests to "/login".
     * Displays the login form.
     *
     * @return the name of the login template
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            return ResponseEntity.ok("Login successful");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    /**
     * Handles GET requests to "/dashboard".
     * Displays the dashboard page after successful login.
     *
     * @param model     the model to pass user data to the view
     * @param principal the authenticated user's security context
     * @return the name of the dashboard template
     */
    @GetMapping("/dashboard")
    public String dashboard(Model model, Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username).orElse(null);
        model.addAttribute("user", user);

        Submission lastSubmission = null;
        if (user != null && user.getSubmissions() != null && !user.getSubmissions().isEmpty()) {
            lastSubmission = user.getSubmissions()
                    .stream()
                    .max(Comparator.comparing(Submission::getCreatedAt))
                    .orElse(null);
        }
        model.addAttribute("lastSubmission", lastSubmission);

        // For the pothole submission form
        model.addAttribute("submission", new Submission());

        return "dashboard";
    }

    @PostMapping("/submit-pothole")
    public String submitPothole(@ModelAttribute Submission submission, Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        submissionService.createSubmission(user.getId(), submission);
        return "redirect:/dashboard";
    }

}
