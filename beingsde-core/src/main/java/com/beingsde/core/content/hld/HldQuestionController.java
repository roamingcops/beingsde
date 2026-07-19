package com.beingsde.core.content.hld;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/hld-questions")
public class HldQuestionController {

    private final HldQuestionRepository repository;

    public HldQuestionController(HldQuestionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<HldQuestion>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HldQuestion> create(@RequestBody HldQuestion q) {
        q.setArchived(false);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(q));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody HldQuestion q) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        q.setId(id);
        return ResponseEntity.ok(repository.save(q));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable String id) {
        HldQuestion q = repository.findById(id).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();
        q.setArchived(true);
        repository.save(q);
        return ResponseEntity.ok(Map.of("message", "Archived"));
    }
}
