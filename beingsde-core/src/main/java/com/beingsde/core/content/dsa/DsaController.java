package com.beingsde.core.content.dsa;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dsa")
public class DsaController {

    private final DsaRepository dsaRepository;

    public DsaController(DsaRepository dsaRepository) {
        this.dsaRepository = dsaRepository;
    }

    @GetMapping
    public ResponseEntity<List<DsaQuestion>> getAll() {
        return ResponseEntity.ok(dsaRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DsaQuestion> create(@RequestBody DsaQuestion q) {
        q.setArchived(false);
        return ResponseEntity.status(HttpStatus.CREATED).body(dsaRepository.save(q));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody DsaQuestion q) {
        if (!dsaRepository.existsById(id)) return ResponseEntity.notFound().build();
        q.setId(id);
        return ResponseEntity.ok(dsaRepository.save(q));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable String id) {
        DsaQuestion q = dsaRepository.findById(id).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();
        q.setArchived(true);
        dsaRepository.save(q);
        return ResponseEntity.ok(Map.of("message", "Archived"));
    }
}
