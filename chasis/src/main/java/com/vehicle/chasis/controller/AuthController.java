package com.vehicle.chasis.controller;
import com.vehicle.chasis.entity.User;
import com.vehicle.chasis.dto.AuthResponse;
import com.vehicle.chasis.dto.LoginRequest;
import com.vehicle.chasis.dto.SignupRequest;
import com.vehicle.chasis.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vehicle.chasis.dto.UserUpdateRequest;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final AuthService authService;

    /**
     * ✅ SIGNUP with custom fields: gstNumber, companyName
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * ✅ LOGIN with username and password
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    // ✅ Simple error response class
    public record ErrorResponse(String message) {}

    @PutMapping("/admin/{id}")
public User updateAdmin(
        @PathVariable Long id,
        @RequestBody UserUpdateRequest request
) {
    return authService.updateUser(id, request);
}
}
