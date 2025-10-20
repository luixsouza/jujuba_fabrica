"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";
import Sidebar from "../../components/sidebar";
import { useRouter } from "next/router";
import { ProdutoService } from "../services/produto-service";

export default function ProdutoCadastro() {
  const [produto, setProduto] = useState({
    descricao: "",
    descricaoDetalhada: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "",
    genero: "",
    preco: "",
    fornecedora: "",
    forma_pagamento: "",
    lote_id: "", ////
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fornecedoras, setFornecedoras] = useState([]);
  const [formasPagamento, setFormasPagamento] = useState([]);
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  // Função para gerar uma descrição detalhada mockada com base na descrição principal
  const gerarDescricaoDetalhada = (descricao) => {
    if (!descricao) return "";

    return `${descricao} com características premium. 
Este item apresenta excelente qualidade e acabamento. Fabricado com materiais de primeira linha, 
oferece durabilidade e conforto. Ideal para uso diário e ocasiões especiais. 
Disponível em estoque para entrega imediata.`;
  };

  // Atualiza a descrição detalhada quando a descrição principal mudar
  useEffect(() => {
    if (produto.descricao && !produto.descricaoDetalhada) {
      setProduto((prev) => ({
        ...prev,
        descricaoDetalhada: gerarDescricaoDetalhada(produto.descricao),
      }));
    }
  }, [produto.descricao]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fornecedorasData, formasPagamentoData] = await Promise.all([
          ProdutoService.getFornecedoras(),
          ProdutoService.getFormasPagamento(),
        ]);

        setFornecedoras(fornecedorasData);
        setFormasPagamento(formasPagamentoData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Não foi possível carregar alguns dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Formatando o preço para número antes de enviar
      const produtoFormatado = {
        ...produto,
        preco: Number.parseFloat(produto.preco) || 0,
      };

      // Usando o ProdutoService em vez de axios diretamente
      const novoProduto = await ProdutoService.createProduto(produtoFormatado);

      if (novoProduto) {
        alert("Produto cadastrado com sucesso!");
        router.push("/produtos");
      } else {
        setError("Não foi possível cadastrar o produto. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      setError("Erro ao cadastrar produto. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
    >
      <Head>
        <title>Jujuba - Cadastro Produto</title>
      </Head>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: "280px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <IconButton
            onClick={() => router.back()}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            CADASTRAR PRODUTO
          </Typography>
          <IconButton
            onClick={() => router.push("/")}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <Home />
          </IconButton>
        </Box>

        {error && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "rgba(255, 0, 0, 0.1)",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "800px",
              textAlign: "center",
            }}
          >
            {error}
          </Typography>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "800px" }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              borderRadius: "20px",
              backgroundColor: " #9AE4FF",
              p: 3,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="Descrição"
              name="descricao"
              value={produto.descricao}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  backgroundColor: "#f8f9fa",
                  fontSize: "18px",
                },
              }}
            />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Descrição detalhada:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="descricaoDetalhada"
              value={produto.descricaoDetalhada}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  name="marca"
                  value={produto.marca}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tamanho"
                  name="tamanho"
                  value={produto.tamanho}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estado de Conservação"
                  name="estadoConservacao"
                  value={produto.estadoConservacao}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gênero"
                  name="genero"
                  value={produto.genero}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  value={produto.preco}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: "R$ ",
                  }}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Fornecedora"
                  name="fornecedora"
                  value={produto.fornecedora}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecione uma fornecedora
                  </MenuItem>
                  {fornecedoras.map((fornecedora) => (
                    <MenuItem key={fornecedora.id} value={fornecedora.id}>
                      {fornecedora.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Forma de Pagamento"
                  name="forma_pagamento"
                  value={produto.forma_pagamento}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Selecione uma forma de pagamento
                  </MenuItem>
                  {formasPagamento.map((formaPagamento) => (
                    <MenuItem key={formaPagamento.id} value={formaPagamento.id}>
                      {formaPagamento.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID do Lote"
                  name="lote_id"
                  value={produto.lote_id}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Button
                type="submit"
                disabled={loading}
                sx={{
                  bgcolor: "#f8c8cc",
                  color: "black",
                  borderRadius: "30px",
                  px: 6,
                  py: 1.5,
                  fontSize: "18px",
                  fontWeight: "bold",
                  minWidth: "200px",
                  "&:hover": {
                    bgcolor: "#f8c8cc",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "black" }} />
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
    </Box>
  );
}
