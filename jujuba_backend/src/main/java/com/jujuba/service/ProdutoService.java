package com.jujuba.service;

import com.jujuba.model.Produto;
import com.jujuba.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public List<Produto> listarTodos() {
        return repository.findAll();
    }

    public Produto salvar(Produto produto) {
        return repository.save(produto);
    }

    public Produto buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produtoExistente = buscarPorId(id);
        if (produtoExistente != null) {
            //produtoExistente.setNome(produtoAtualizado.getNome());
            produtoExistente.setDescricao(produtoAtualizado.getDescricao());
            //produtoExistente.setCodigo(produtoAtualizado.getCodigo());
            produtoExistente.setPreco(produtoAtualizado.getPreco());
            return repository.save(produtoExistente);
        }
        return null;
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
