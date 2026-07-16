package com.beingsde.core.auth.dto;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRole;
import java.time.Instant;

public class UserProfileResponse {
    private String id;
    private String name;
    private String email;
    private UserRole role;
    private boolean emailVerified;
    private User.Profile profile;
    private Instant createdAt;

    public UserProfileResponse() {
    }

    public UserProfileResponse(String id, String name, String email, UserRole role, 
                               boolean emailVerified, User.Profile profile, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.emailVerified = emailVerified;
        this.profile = profile;
        this.createdAt = createdAt;
    }

    public static UserProfileResponse fromUser(User user) {
        return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.isEmailVerified(),
            user.getProfile(),
            user.getCreatedAt()
        );
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public UserRole getRole() { return role; }
    public boolean isEmailVerified() { return emailVerified; }
    public User.Profile getProfile() { return profile; }
    public Instant getCreatedAt() { return createdAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(UserRole role) { this.role = role; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public void setProfile(User.Profile profile) { this.profile = profile; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
