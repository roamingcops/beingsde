package com.beingsde.core.auth;

import com.beingsde.core.auth.dto.UpdateAvatarRequest;
import com.beingsde.core.auth.dto.UserProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(@AuthenticationPrincipal String email) {
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserProfileResponse.fromUser(user));
    }

    @PutMapping("/me/avatar")
    public ResponseEntity<UserProfileResponse> updateAvatar(@AuthenticationPrincipal String email, 
                                                            @RequestBody UpdateAvatarRequest request) {
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User.Profile profile = user.getProfile();
        if (profile == null) {
            profile = new User.Profile();
        }
        
        profile.setAvatarUrl(request.getAvatarUrl());
        user.setProfile(profile);
        userRepository.save(user);

        return ResponseEntity.ok(UserProfileResponse.fromUser(user));
    }
}
