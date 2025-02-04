package com.jujuba.service;

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
        return repository.save(fornecedora);
    }

    public Fornecedora atualizar(Long id, Fornecedora fornecedora) {
        fornecedora.setId(id);
        return repository.save(fornecedora);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }

    public Fornecedora buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }


}
