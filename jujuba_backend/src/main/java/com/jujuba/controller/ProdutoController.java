package com.jujuba.controller;

import com.jujuba.model.Produto;
import com.jujuba.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService service;

    @GetMapping
    public List<Produto> listarProdutos() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto produto) {
        Produto produtoSalvo = service.salvar(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoSalvo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProduto(@PathVariable Long id) {
        Produto produto = service.buscarPorId(id);
        if (produto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        Produto produtoAtualizadoSalvo = service.atualizar(id, produtoAtualizado);
        if (produtoAtualizadoSalvo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(produtoAtualizadoSalvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirProduto(@PathVariable Long id) {
        Produto produto = service.buscarPorId(id);
        if (produto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
        }
        service.excluir(id);
        return ResponseEntity.ok("Produto excluído com sucesso!");
    }
}
