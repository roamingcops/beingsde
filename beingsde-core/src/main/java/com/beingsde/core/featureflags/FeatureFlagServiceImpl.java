package com.beingsde.core.featureflags;

import com.beingsde.core.auth.User;
import com.beingsde.core.auth.UserRepository;
import com.beingsde.core.auth.UserRole;
import com.google.common.hash.Hashing;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;

@Service
public class FeatureFlagServiceImpl implements FeatureFlagService {

    private final FeatureFlagRepository flagRepo;
    private final UserRepository userRepo;

    public FeatureFlagServiceImpl(FeatureFlagRepository flagRepo, UserRepository userRepo) {
        this.flagRepo = flagRepo;
        this.userRepo = userRepo;
    }

    @Override
    @Cacheable(value = "featureflags", key = "#userId + ':' + #flagKey", unless = "#result == false")
    public boolean evaluate(String userId, String flagKey) {
        Optional<FeatureFlag> flagOpt = flagRepo.findByKey(flagKey);
        if (flagOpt.isEmpty()) {
            return false;
        }

        FeatureFlag flag = flagOpt.get();

        if (flag.isGloballyDisabled()) {
            return false;
        }

        if (flag.isGloballyEnabled()) {
            return true;
        }

        // If no user context and not globally enabled, deny access
        if (userId == null || "anonymous".equals(userId)) {
            return false;
        }

        Optional<User> userOpt = userRepo.findByEmail(userId);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();

        // Admin has universal override
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }

        // 1. Role-based check
        if (flag.getAllowedRoles() != null && !flag.getAllowedRoles().isEmpty()) {
            if (!flag.getAllowedRoles().contains(user.getRole().name())) {
                return false;
            }
        }

        // 2. Launch date check
        if (flag.getLaunchDate() != null && Instant.now().isBefore(flag.getLaunchDate())) {
            return false;
        }

        // 3. Percentage Rollout evaluation
        int rollout = flag.getRolloutPercentage();
        if (rollout <= 0) {
            return false;
        }
        if (rollout >= 100) {
            return true;
        }

        // Consistent hash of user ID + flag key
        String hashInput = flagKey + ":" + user.getId();
        int hashVal = Hashing.murmur3_32_fixed()
                .hashString(hashInput, StandardCharsets.UTF_8)
                .asInt();

        int bucket = Math.abs(hashVal) % 100;
        return bucket < rollout;
    }
}
