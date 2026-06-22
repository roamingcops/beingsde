package com.beingsde.core.featureflags;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/feature-flags")
@PreAuthorize("hasRole('ADMIN')")
public class FeatureFlagController {

    private final FeatureFlagRepository flagRepo;

    public FeatureFlagController(FeatureFlagRepository flagRepo) {
        this.flagRepo = flagRepo;
    }

    @PostMapping
    @CacheEvict(value = "featureflags", allEntries = true)
    public ResponseEntity<FeatureFlag> createOrUpdateFlag(@RequestBody FeatureFlag flag) {
        FeatureFlag existing = flagRepo.findByKey(flag.getKey()).orElse(null);
        if (existing != null) {
            flag.setId(existing.getId());
        }
        FeatureFlag saved = flagRepo.save(flag);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{key}")
    @CacheEvict(value = "featureflags", allEntries = true)
    public ResponseEntity<Void> deleteFlag(@PathVariable String key) {
        FeatureFlag existing = flagRepo.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Flag not found"));
        flagRepo.delete(existing);
        return ResponseEntity.noContent().build();
    }
}
