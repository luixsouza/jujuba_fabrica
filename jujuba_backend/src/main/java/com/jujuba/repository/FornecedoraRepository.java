package com.jujuba.repository;

import com.jujuba.model.Fornecedora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FornecedoraRepository extends JpaRepository<Fornecedora, Long> {
}
