package com.jujuba.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jujuba.model.Lote;

public interface LoteRepository extends JpaRepository<Lote, Long> {
}
