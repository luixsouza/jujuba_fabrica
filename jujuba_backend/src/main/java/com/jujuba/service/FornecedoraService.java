package com.jujuba.service;

import com.jujuba.dto.FornecedoraCreateDTO;
import com.jujuba.exception.FornecedoraNotFoundException;
import com.jujuba.exception.InvalidDataException;
import com.jujuba.mapper.FornecedoraMapper;
import com.jujuba.model.Fornecedora;
import com.jujuba.repository.FornecedoraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FornecedoraService {

    private final FornecedoraRepository repository;

    public List<Fornecedora> listarTodas() {
        return repository.findAll();
    }

    @Transactional
    public Fornecedora salvar(Fornecedora fornecedora) {
        if (fornecedora.getNome() == null || fornecedora.getNome().isEmpty()) {
            throw new InvalidDataException("O nome da fornecedora é obrigatório.");
        }
        return repository.save(fornecedora);
    }

    @Transactional
    public Fornecedora atualizar(Long id, FornecedoraCreateDTO fornecedoraDTO, String contratoUrl) {
        Fornecedora fornecedoraExistente = repository.findById(id)
            .orElseThrow(() -> new FornecedoraNotFoundException("Fornecedora não encontrada com o ID: " + id));

        FornecedoraMapper.updateFornecedoraFromDTO(fornecedoraExistente, fornecedoraDTO);
        
        fornecedoraExistente.setContratoUrl(contratoUrl);
        
        return repository.save(fornecedoraExistente);
    }

    @Transactional
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