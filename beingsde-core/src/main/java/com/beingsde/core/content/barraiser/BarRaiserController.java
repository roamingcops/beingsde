package com.beingsde.core.content.barraiser;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bar-raiser")
public class BarRaiserController {

    private final BarRaiserRepository barRaiserRepository;

    public BarRaiserController(BarRaiserRepository barRaiserRepository) {
        this.barRaiserRepository = barRaiserRepository;
    }

    @GetMapping
    public ResponseEntity<List<BarRaiserQuestion>> getAll() {
        return ResponseEntity.ok(barRaiserRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BarRaiserQuestion> create(@RequestBody BarRaiserQuestion q) {
        q.setArchived(false);
        return ResponseEntity.status(HttpStatus.CREATED).body(barRaiserRepository.save(q));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody BarRaiserQuestion q) {
        if (!barRaiserRepository.existsById(id)) return ResponseEntity.notFound().build();
        q.setId(id);
        return ResponseEntity.ok(barRaiserRepository.save(q));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable String id) {
        BarRaiserQuestion q = barRaiserRepository.findById(id).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();
        q.setArchived(true);
        barRaiserRepository.save(q);
        return ResponseEntity.ok(Map.of("message", "Archived"));
    }
}
