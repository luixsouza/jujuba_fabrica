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
    private static final String UPLOAD_DIR_IMAGENS = "uploads/produtos/";

    public String salvarContrato(MultipartFile contrato) throws IOException {
        return salvarArquivo(contrato, UPLOAD_DIR_CONTRATOS);
    }

    public String salvarImagem(MultipartFile imagem) throws IOException {
        return salvarArquivo(imagem, UPLOAD_DIR_IMAGENS);
    }

    private String salvarArquivo(MultipartFile arquivo, String diretorio) throws IOException {
        if (arquivo == null || arquivo.isEmpty() || arquivo.getOriginalFilename() == null) {
            throw new IOException("Arquivo inválido.");
        }

        String nomeArquivo = System.currentTimeMillis() + "_" + arquivo.getOriginalFilename();
        Path caminhoArquivo = Paths.get(diretorio, nomeArquivo);

        Files.createDirectories(caminhoArquivo.getParent());
        Files.write(caminhoArquivo, arquivo.getBytes());

        return caminhoArquivo.toString();
    }
}