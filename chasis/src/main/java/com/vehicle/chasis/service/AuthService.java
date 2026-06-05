package com.vehicle.chasis.service;

import com.vehicle.chasis.dto.AuthResponse;
import com.vehicle.chasis.dto.LoginRequest;
import com.vehicle.chasis.dto.SignupRequest;
import com.vehicle.chasis.dto.UserUpdateRequest;
import com.vehicle.chasis.entity.User;
import com.vehicle.chasis.repository.UserRepository;
import com.vehicle.chasis.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse signup(SignupRequest request) {
        // ✅ Validate username uniqueness
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username is already taken");
        }

        // ✅ Validate email uniqueness
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email is already in use");
        }

        // ✅ Create new user
        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .email(request.email())
                .gstNumber(request.gstNumber())
                .companyName(request.companyName())
                .role(User.Role.USER)  // Default role is USER
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        // ✅ Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getGstNumber(),
                savedUser.getCompanyName()
        );
    }

    public AuthResponse login(LoginRequest request) {
        try {
            // ✅ Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.username(),
                            request.password()
                    )
            );

            // ✅ Get user details from authentication
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // ✅ Generate JWT token
            String token = jwtTokenProvider.generateToken(user);

            return new AuthResponse(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getGstNumber(),
                    user.getCompanyName()
            );

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }

    public User updateUser(Long id, UserUpdateRequest request) {

    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setCompanyName(request.getCompanyName());
    user.setGstNumber(request.getGstNumber());

    if (request.getRole() != null) {
        user.setRole(User.Role.valueOf(request.getRole()));
    }

    return userRepository.save(user);
}
}
