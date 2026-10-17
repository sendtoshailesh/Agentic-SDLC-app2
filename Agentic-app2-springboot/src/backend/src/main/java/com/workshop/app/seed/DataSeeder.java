package com.workshop.app.seed;

import com.workshop.app.model.User;
import com.workshop.app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("test@example.com")) {
            User testUser = new User("test@example.com", passwordEncoder.encode("password123"));
            userRepository.save(testUser);
            log.info("Seeded test user: test@example.com");
        } else {
            log.info("Test user already exists — skipping seed");
        }
    }
}
