package com.beingsde.core.interviews.aspects;

import com.beingsde.core.featureflags.FeatureFlagService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Map;

@Aspect
@Component
public class PremiumFeatureAspect {

    private static final String FEATURE_FLAG = "feature_premium_mock_interviews";
    private final FeatureFlagService featureFlagService;

    public PremiumFeatureAspect(FeatureFlagService featureFlagService) {
        this.featureFlagService = featureFlagService;
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return (String) auth.getPrincipal();
        }
        return "anonymous";
    }

    @Around("@annotation(com.beingsde.core.interviews.annotations.RequiresPremium)")
    public Object checkPremiumAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        String email = getCurrentUserEmail();
        
        if (!featureFlagService.evaluate(email, FEATURE_FLAG)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "type", "https://api.beingsde.com/errors/insufficient-permissions",
                            "title", "Premium Feature",
                            "status", 403,
                            "detail", "Mock interviews are a premium feature. Please upgrade your subscription.",
                            "instance", "/api/v1/interviews"
                    ));
        }

        return joinPoint.proceed();
    }
}
