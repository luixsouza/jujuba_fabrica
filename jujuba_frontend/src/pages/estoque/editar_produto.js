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
import { ArrowBack, Home, Save } from "@mui/icons-material";
import Sidebar from "../../components/sidebar";
import { useRouter } from "next/router";
import { ProdutoService } from "../../services/produto-service";
import { getAllLotes, deleteLote } from "../api/lotes";

// Enums baseados no backend
const ESTADO_CONSERVACAO = [
  { value: "RUIM", label: "RUIM" },
  { value: "BOM", label: "BOM" },
  { value: "OTIMO", label: "OTIMO" },
  { value: "EXCELENTE", label: "EXCELENTE" },
];

const GENERO = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMININO", label: "Feminino" },
  { value: "UNISSEX", label: "Unissex" },
];

export default function ProdutoEditar() {
  const [produto, setProduto] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "",
    genero: "",
    preco: "",
    quantidade: 1,
    lote_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Carregar produto e lotes
        const [produtoData, lotesData] = await Promise.all([
          ProdutoService.getProdutoById(id),
          getAllLotes(), // Usar a função importada
        ]);

        if (!produtoData) {
          setError("Produto não encontrado");
          return;
        }

        // Debug completo do produto
        console.log("Produto completo:", produtoData);
        console.log("Lote do produto:", produtoData.lote);
        console.log("Lote ID:", produtoData.lote?.id);
        console.log("Lote_id direto:", produtoData.lote_id);

        // Tentar diferentes formas de acessar o lote
        let loteId = "";
        if (produtoData.lote?.id) {
          loteId = produtoData.lote.id.toString();
        } else if (produtoData.lote_id) {
          loteId = produtoData.lote_id.toString();
        } else if (produtoData.loteId) {
          loteId = produtoData.loteId.toString();
        }

        setProduto({
          descricao: produtoData.descricao || "",
          marca: produtoData.marca || "",
          tamanho: produtoData.tamanho || "",
          estadoConservacao: produtoData.estadoConservacao || "",
          genero: produtoData.genero || "",
          preco: produtoData.preco?.toString() || "",
          quantidade: produtoData.quantidade || 1,
          lote_id: loteId,
        });

        setLotes(lotesData || []);

        console.log("Estado do produto setado:", {
          ...produtoData,
          lote_id: loteId,
        });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar os dados. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case "descricao":
        if (!value) {
          errors.descricao = "Descrição é obrigatória";
        } else if (value.length > 300) {
          errors.descricao = "Descrição deve ter no máximo 300 caracteres";
        } else {
          delete errors.descricao;
        }
        break;
      case "marca":
        if (!value) {
          errors.marca = "Marca é obrigatória";
        } else if (value.length > 100) {
          errors.marca = "Marca deve ter no máximo 100 caracteres";
        } else {
          delete errors.marca;
        }
        break;
      case "tamanho":
        if (!value) {
          errors.tamanho = "Tamanho é obrigatório";
        } else if (value.length > 50) {
          errors.tamanho = "Tamanho deve ter no máximo 50 caracteres";
        } else {
          delete errors.tamanho;
        }
        break;
      case "preco":
        if (!value || Number.parseFloat(value) <= 0) {
          errors.preco = "Preço deve ser maior que zero";
        } else {
          delete errors.preco;
        }
        break;
      case "quantidade":
        if (!value || Number.parseInt(value) < 1) {
          errors.quantidade = "Quantidade deve ser pelo menos 1";
        } else {
          delete errors.quantidade;
        }
        break;
      case "estadoConservacao":
        if (!value) {
          errors.estadoConservacao = "Estado de conservação é obrigatório";
        } else {
          delete errors.estadoConservacao;
        }
        break;
      case "genero":
        if (!value) {
          errors.genero = "Gênero é obrigatório";
        } else {
          delete errors.genero;
        }
        break;
      case "lote_id":
        // Temporariamente não obrigatório para debug
        if (value && !lotes.find((l) => l.id.toString() === value)) {
          errors.lote_id = "Lote selecionado não é válido";
        } else {
          delete errors.lote_id;
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProduto((prev) => ({ ...prev, [name]: value }));

    // Validar campo em tempo real
    validateField(name, value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    // Validar todos os campos
    const isValid = Object.keys(produto).every((key) =>
      validateField(key, produto[key])
    );

    if (!isValid) {
      setSaving(false);
      setError("Por favor, corrija os erros no formulário.");
      return;
    }

    try {
      // Encontrar o lote completo se um ID foi selecionado
      let loteCompleto = null;
      if (produto.lote_id) {
        loteCompleto = lotes.find(
          (l) => l.id.toString() === produto.lote_id.toString()
        );
      }

      // Formatar dados para envio ao backend - seguindo exatamente o modelo Java
      const produtoFormatado = {
        id: Number.parseInt(id),
        descricao: produto.descricao.trim(),
        marca: produto.marca.trim(),
        tamanho: produto.tamanho.trim(),
        estadoConservacao: produto.estadoConservacao,
        genero: produto.genero,
        preco: Number.parseFloat(produto.preco),
        quantidade: Number.parseInt(produto.quantidade),
        // Enviar o objeto lote completo conforme esperado pelo backend
        lote: loteCompleto,
      };

      console.log("Dados sendo enviados para o backend:", produtoFormatado);
      console.log("Lote selecionado:", loteCompleto);

      const produtoAtualizado = await ProdutoService.updateProduto(
        id,
        produtoFormatado
      );

      if (produtoAtualizado) {
        alert("Produto atualizado com sucesso!");
        router.push(`/produtos/visualizar/${id}`);
      } else {
        setError("Não foi possível atualizar o produto. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro completo:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);

      if (err.response?.status === 500) {
        setError(
          `Erro interno do servidor. Detalhes: ${
            err.response?.data?.message || "Erro desconhecido"
          }`
        );
      } else {
        setError("Erro ao atualizar produto. Por favor, tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#9AE4FF",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !produto.descricao) {
    return (
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#9AE4FF",
        }}
      >
        <Paper sx={{ p: 4, maxWidth: "500px", textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button
            onClick={() => router.push("/produtos")}
            sx={{
              mt: 2,
              bgcolor: "#f8c8cc",
              color: "black",
              "&:hover": { bgcolor: "#f8c8cc" },
            }}
          >
            Voltar para Lista de Produtos
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
    >
      <Head>
        <title>Jujuba - Editar Produto</title>
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
            EDITAR PRODUTO
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
              backgroundColor: "#9AE4FF",
              p: 3,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={produto.descricao}
              onChange={handleChange}
              required
              error={!!validationErrors.descricao}
              helperText={
                validationErrors.descricao ||
                `${produto.descricao.length}/300 caracteres`
              }
              inputProps={{ maxLength: 300 }}
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

            <Grid container spacing={2}>
              {/* Marca */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  name="marca"
                  value={produto.marca}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.marca}
                  helperText={
                    validationErrors.marca ||
                    `${produto.marca.length}/100 caracteres`
                  }
                  inputProps={{ maxLength: 100 }}
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

              {/* Tamanho */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tamanho"
                  name="tamanho"
                  value={produto.tamanho}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.tamanho}
                  helperText={
                    validationErrors.tamanho ||
                    `${produto.tamanho.length}/50 caracteres`
                  }
                  inputProps={{ maxLength: 50 }}
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

              {/* Estado de Conservação */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Estado de Conservação"
                  name="estadoConservacao"
                  value={produto.estadoConservacao}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.estadoConservacao}
                  helperText={validationErrors.estadoConservacao}
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
                    Selecione o estado
                  </MenuItem>
                  {ESTADO_CONSERVACAO.map((estado) => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Gênero */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Gênero"
                  name="genero"
                  value={produto.genero}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.genero}
                  helperText={validationErrors.genero}
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
                    Selecione o gênero
                  </MenuItem>
                  {GENERO.map((genero) => (
                    <MenuItem key={genero.value} value={genero.value}>
                      {genero.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Preço */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  value={produto.preco}
                  onChange={handleChange}
                  required
                  error={!!validationErrors.preco}
                  helperText={validationErrors.preco}
                  inputProps={{ min: "0", step: "0.01" }}
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

              {/* Quantidade */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantidade"
                  name="quantidade"
                  type="number"
                  value={produto.quantidade || ""}
                  onChange={handleChange}
                  required
                  inputProps={{ min: "1", step: "1" }}
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

              {/* Lote */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Lote"
                  name="lote_id"
                  value={produto.lote_id || ""}
                  onChange={handleChange}
                  // required - removido temporariamente
                  error={!!validationErrors.lote_id}
                  helperText={
                    validationErrors.lote_id ||
                    `Valor atual: "${produto.lote_id}"`
                  }
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <MenuItem value="">Nenhum lote selecionado</MenuItem>
                  {lotes.map((lote) => (
                    <MenuItem key={lote.id} value={lote.id.toString()}>
                      {`Lote ${lote.id} - ${
                        lote.fornecedora?.nome || "Sem fornecedora"
                      }`}
                    </MenuItem>
                  ))}
                </TextField>
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
                disabled={saving || Object.keys(validationErrors).length > 0}
                startIcon={<Save />}
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
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {saving ? (
                  <CircularProgress size={24} sx={{ color: "black" }} />
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
    </Box>
  );
}
