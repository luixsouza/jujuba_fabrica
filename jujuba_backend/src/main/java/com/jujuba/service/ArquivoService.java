package com.jujuba.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ArquivoService {
    private static final String UPLOAD_DIR_CONTRATOS = "uploads/contratos/";

    public String salvarContrato(MultipartFile contrato) throws IOException {
        if (contrato == null || contrato.isEmpty() || contrato.getOriginalFilename() == null) {
            throw new IOException("Arquivo inválido.");
        }

        String nomeArquivo = System.currentTimeMillis() + "_" + contrato.getOriginalFilename();
        Path caminhoArquivo = Paths.get(UPLOAD_DIR_CONTRATOS, nomeArquivo);

        Files.createDirectories(caminhoArquivo.getParent());
        Files.write(caminhoArquivo, contrato.getBytes());

        return "/uploads/contratos/" + nomeArquivo;
    }
}