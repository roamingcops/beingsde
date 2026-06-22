package com.beingsde.core.featureflags;

public interface FeatureFlagService {
    boolean evaluate(String userId, String flagKey);
}
