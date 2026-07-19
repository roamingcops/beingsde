package com.beingsde.core.content.lld;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lld")
public class LldController {

    private final LldRepository lldRepository;

    public LldController(LldRepository lldRepository) {
        this.lldRepository = lldRepository;
    }

    @GetMapping
    public ResponseEntity<List<LldItem>> getAll() {
        return ResponseEntity.ok(lldRepository.findAll());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        return lldRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LldItem> create(@RequestBody LldItem item) {
        item.setArchived(false);
        return ResponseEntity.status(HttpStatus.CREATED).body(lldRepository.save(item));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody LldItem item) {
        if (!lldRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        item.setId(id);
        return ResponseEntity.ok(lldRepository.save(item));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable String id) {
        LldItem item = lldRepository.findById(id).orElse(null);
        if (item == null) return ResponseEntity.notFound().build();
        item.setArchived(true);
        lldRepository.save(item);
        return ResponseEntity.ok(Map.of("message", "Archived"));
    }
}
