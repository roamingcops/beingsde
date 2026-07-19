package com.beingsde.core.admin;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.auth.UserRole;
import com.beingsde.core.auth.dto.UserProfileResponse;
import com.beingsde.core.content.TopicRepository;
import com.beingsde.core.interviews.InterviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final InterviewRepository interviewRepository;

    public AdminController(UserRepository userRepository,
                           TopicRepository topicRepository,
                           InterviewRepository interviewRepository) {
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.interviewRepository = interviewRepository;
    }

    // ─── Dashboard Stats ───────────────────────────────────────────
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        long totalTopics = topicRepository.count();
        long totalInterviews = interviewRepository.count();
        long adminCount = userRepository.countByRole(UserRole.ADMIN);
        long premiumCount = userRepository.countByRole(UserRole.PREMIUM_USER);

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalTopics", totalTopics,
                "totalInterviews", totalInterviews,
                "adminCount", adminCount,
                "premiumCount", premiumCount
        ));
    }

    // ─── Users Management ──────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<Page<UserProfileResponse>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<User> users = userRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(users.map(UserProfileResponse::fromUser));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id,
                                            @RequestBody Map<String, String> body,
                                            @AuthenticationPrincipal String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String roleStr = body.get("role");
        UserRole newRole;
        try {
            newRole = UserRole.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid role: " + roleStr));
        }

        // Prevent admin from demoting themselves
        if (user.getEmail().equals(currentAdminEmail) && newRole != UserRole.ADMIN) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "You cannot change your own admin role"));
        }

        user.setRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok(UserProfileResponse.fromUser(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> softDeleteUser(@PathVariable String id,
                                            @AuthenticationPrincipal String currentAdminEmail) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if (user.getEmail().equals(currentAdminEmail)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete your own account"));
        }
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User deactivated"));
    }
}
