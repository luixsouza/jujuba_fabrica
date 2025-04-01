package com.jujuba.controller;

import com.jujuba.model.Produto;
import com.jujuba.service.CarrinhoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/carrinho")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    public CarrinhoController(CarrinhoService carrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @PostMapping("/adicionar")
    public ResponseEntity<Void> adicionarProduto(@RequestBody Produto produto) {
        carrinhoService.adicionarProduto(produto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remover/{id}")
    public ResponseEntity<Void> removerProduto(@PathVariable Long id) {
        carrinhoService.removerProduto(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        return ResponseEntity.ok(carrinhoService.listarProdutos());
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> calcularTotal() {
        return ResponseEntity.ok(carrinhoService.calcularTotal());
    }
}