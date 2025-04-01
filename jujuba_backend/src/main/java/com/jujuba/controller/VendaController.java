package com.jujuba.controller;

import com.jujuba.model.Venda;
import com.jujuba.service.VendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @PostMapping("/finalizar/simples")
    public ResponseEntity<Venda> finalizarVendaSimples() {
        return ResponseEntity.ok(vendaService.finalizarVendaSimples());
    }

    @PostMapping("/finalizar/fornecedora/{fornecedoraId}")
    public ResponseEntity<Venda> finalizarVendaFornecedora(@PathVariable Long fornecedoraId) {
        return ResponseEntity.ok(vendaService.finalizarVendaFornecedora(fornecedoraId));
    }
}