package com.jujuba.service;

import com.jujuba.exception.FornecedoraNotFoundException;
import com.jujuba.exception.InvalidDataException;
import com.jujuba.model.Fornecedora;
import com.jujuba.repository.FornecedoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FornecedoraService {
    @Autowired
    private FornecedoraRepository repository;

    public List<Fornecedora> listarTodas() {
        return repository.findAll();
    }

    public Fornecedora salvar(Fornecedora fornecedora) {
        if (fornecedora.getNome() == null || fornecedora.getNome().isEmpty()) {
            throw new InvalidDataException("O nome da fornecedora é obrigatório.");
        }
        return repository.save(fornecedora);
    }

    public Fornecedora atualizar(Long id, Fornecedora fornecedora) {
        if (!repository.existsById(id)) {
            throw new FornecedoraNotFoundException("Fornecedora não encontrada com o ID: " + id);
        }
        fornecedora.setId(id);
        return repository.save(fornecedora);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new FornecedoraNotFoundException("Fornecedora não encontrada com o ID: " + id);
        }
        repository.deleteById(id);
    }

    public Fornecedora buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new FornecedoraNotFoundException("Fornecedora não encontrada com o ID: " + id));
    }
}