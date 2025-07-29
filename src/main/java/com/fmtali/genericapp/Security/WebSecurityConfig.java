
package com.fmtali.genericapp.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.fmtali.genericapp.Service.UserService;

/**
 * Configuration class for Spring Security in the application.
 * Handles authentication, authorization, and form login setup.
 */
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig {

    @Autowired
    private UserService userService;

private static final String[] WHITELIST = {
    "/", "/login", "/signup", "/db-console/**", "/css/**", "/js/**",
    "/images/**", "/api/users/**",
};


    /**
     * Bean for password encoding using BCrypt.
     * 
     * @return BCryptPasswordEncoder instance.
     */
    @Bean
    public static BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Defines the security filter chain for HTTP security configuration.
     * 
     * @param http the HttpSecurity object to configure.
     * @return the configured SecurityFilterChain.
     * @throws Exception in case of errors during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers(WHITELIST).permitAll()
            .anyRequest().authenticated()
            .and()
            .formLogin()
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .usernameParameter("username")
                .passwordParameter("password")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
                .permitAll()
            .and()
            .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/logout?success=true")
            .and()
            .httpBasic();

        //remove after moving from H2 database
        http.csrf().disable();
        http.headers().frameOptions().disable();

        return http.build();
    }

    /**
     * Provides the authentication provider using the custom UserService and password encoder.
     * 
     * @return DaoAuthenticationProvider configured with userService and password encoder.
     */
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Creates an authentication manager from the HttpSecurity configuration.
     * 
     * @param http the HttpSecurity object.
     * @return configured AuthenticationManager.
     * @throws Exception in case of error.
     */
    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                   .authenticationProvider(authProvider())
                   .build();
    }
}
