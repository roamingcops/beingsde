package com.beingsde.core.auth;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private UserRole role;

    private boolean emailVerified;

    private String verificationToken;

    private String resetPasswordToken;

    private Instant resetPasswordExpires;

    private Profile profile;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private boolean isDeleted;

    public User() {
    }

    public User(String id, String name, String email, String passwordHash, UserRole role, boolean emailVerified,
                String verificationToken, String resetPasswordToken, Instant resetPasswordExpires, Profile profile,
                Instant createdAt, Instant updatedAt, boolean isDeleted) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.emailVerified = emailVerified;
        this.verificationToken = verificationToken;
        this.resetPasswordToken = resetPasswordToken;
        this.resetPasswordExpires = resetPasswordExpires;
        this.profile = profile;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isDeleted = isDeleted;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
    public String getResetPasswordToken() { return resetPasswordToken; }
    public void setResetPasswordToken(String resetPasswordToken) { this.resetPasswordToken = resetPasswordToken; }
    public Instant getResetPasswordExpires() { return resetPasswordExpires; }
    public void setResetPasswordExpires(Instant resetPasswordExpires) { this.resetPasswordExpires = resetPasswordExpires; }
    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class Profile {
        private String avatarUrl;
        private String headline;
        private String githubUrl;
        private String linkedinUrl;

        public Profile() {}

        public Profile(String avatarUrl, String headline, String githubUrl, String linkedinUrl) {
            this.avatarUrl = avatarUrl;
            this.headline = headline;
            this.githubUrl = githubUrl;
            this.linkedinUrl = linkedinUrl;
        }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
        public String getHeadline() { return headline; }
        public void setHeadline(String headline) { this.headline = headline; }
        public String getGithubUrl() { return githubUrl; }
        public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
        public String getLinkedinUrl() { return linkedinUrl; }
        public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    }

    public static class UserBuilder {
        private String id;
        private String name;
        private String email;
        private String passwordHash;
        private UserRole role;
        private boolean emailVerified;
        private String verificationToken;
        private String resetPasswordToken;
        private Instant resetPasswordExpires;
        private Profile profile;
        private Instant createdAt;
        private Instant updatedAt;
        private boolean isDeleted;

        UserBuilder() {}

        public UserBuilder id(String id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder role(UserRole role) { this.role = role; return this; }
        public UserBuilder emailVerified(boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public UserBuilder verificationToken(String verificationToken) { this.verificationToken = verificationToken; return this; }
        public UserBuilder resetPasswordToken(String resetPasswordToken) { this.resetPasswordToken = resetPasswordToken; return this; }
        public UserBuilder resetPasswordExpires(Instant resetPasswordExpires) { this.resetPasswordExpires = resetPasswordExpires; return this; }
        public UserBuilder profile(Profile profile) { this.profile = profile; return this; }
        public UserBuilder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }
        public UserBuilder isDeleted(boolean isDeleted) { this.isDeleted = isDeleted; return this; }

        public User build() {
            return new User(id, name, email, passwordHash, role, emailVerified, verificationToken,
                    resetPasswordToken, resetPasswordExpires, profile, createdAt, updatedAt, isDeleted);
        }
    }
}
