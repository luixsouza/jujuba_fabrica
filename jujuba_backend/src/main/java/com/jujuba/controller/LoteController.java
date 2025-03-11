package com.jujuba.controller;

import com.jujuba.model.Lote;
import com.jujuba.service.LoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/lotes")
@RequiredArgsConstructor
public class LoteController {

    private final LoteService loteService;

    @PostMapping
    public ResponseEntity<Lote> criar(@RequestBody Lote lote) {
        Lote novoLote = loteService.salvar(lote);
        return ResponseEntity.ok(novoLote);
    }

    @GetMapping
    public ResponseEntity<List<Lote>> listarTodos() {
        List<Lote> lotes = loteService.listarTodos();
        return ResponseEntity.ok(lotes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lote> buscarPorId(@PathVariable Long id) {
        Lote lote = loteService.buscarPorId(id);
        return ResponseEntity.ok(lote);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lote> atualizar(@PathVariable Long id, @RequestBody Lote lote) {
        Lote loteAtualizado = loteService.atualizar(id, lote);
        return ResponseEntity.ok(loteAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        loteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}