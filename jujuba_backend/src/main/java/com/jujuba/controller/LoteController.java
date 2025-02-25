package com.jujuba.controller;

import com.jujuba.model.Lote;
import com.jujuba.service.LoteService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
