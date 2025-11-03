package com.jujuba.controller;

import com.jujuba.model.Produto;
import com.jujuba.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "API para gerenciamento de produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    @Operation(summary = "Listar todos os produtos",
               description = "Retorna uma lista com todos os produtos cadastrados.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de produtos retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno ao listar produtos")
    })
    public List<Produto> listarProdutos() {
        return produtoService.listarTodos();
    }

    @GetMapping("/estoque")
    @Operation(summary = "Listar produtos com estoque disponível",
               description = "Retorna apenas produtos com quantidade maior que 0.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de produtos com estoque retornada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno ao listar produtos")
    })
    public List<Produto> listarProdutosComEstoque() {
        return produtoService.listarComEstoque();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar um produto por ID",
               description = "Busca e retorna um produto com base no ID fornecido.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Produto encontrado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno ao buscar o produto")
    })
    public ResponseEntity<Produto> buscarProduto(
        @Parameter(description = "ID do produto a ser buscado", required = true)
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir um produto por ID",
               description = "Exclui um produto do sistema com base no ID informado.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Produto excluído com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado para exclusão"),
        @ApiResponse(responseCode = "500", description = "Erro interno ao excluir o produto")
    })
    public ResponseEntity<String> excluirProduto(
        @Parameter(description = "ID do produto a ser excluído", required = true)
        @PathVariable Long id
    ) {
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}