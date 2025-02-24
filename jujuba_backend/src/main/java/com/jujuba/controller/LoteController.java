package com.jujuba.controller;

import com.jujuba.model.Lote;
import com.jujuba.service.LoteService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/lotes")
@RequiredArgsConstructor
public class LoteController {

    private final LoteService loteService;

    @PostMapping
    public ResponseEntity<Lote> criarLote(@RequestBody Lote lote) {
        Lote loteCriado = loteService.criarLote(lote);
        return ResponseEntity.status(HttpStatus.CREATED).body(loteCriado);
    }
}
