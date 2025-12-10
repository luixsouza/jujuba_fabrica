"use client";

import { Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from "@mui/icons-material/Inventory";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
} from "@mui/material";
import { Tabs, Tab, Chip, Avatar, Slider } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  ArrowBack,
  Home,
  Delete,
  Visibility,
  Add,
  BugReport,
} from "@mui/icons-material";
import {
  createLote,
  getAllLotes,
  getFornecedoras,
  testApiConnection,
} from "../api/lotes";
import Sidebar from "../../components/sidebar";
import api from "../../utils/api";

export default function CadastroLotePage() {
  const router = useRouter();
  const [loteId, setLoteId] = useState("");
  const [fornecedoraId, setFornecedoraId] = useState("");
  const [fornecedoraSelecionada, setFornecedoraSelecionada] = useState(null);
  const [items, setItems] = useState([]);
  const [lotesSidebar, setLotesSidebar] = useState([]);
  const [fornecedoras, setFornecedoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [debugDialog, setDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const [creditModal, setCreditModal] = useState(false);
  const [currentCredit, setCurrentCredit] = useState(0);
  const [newCredit, setNewCredit] = useState("");
  const [creditLoading, setCreditLoading] = useState(false);
  const [percentBrecho, setPercentBrecho] = useState(60);
  const [percentFornecedor, setPercentFornecedor] = useState(40);

  // Handlers that keep the two percent fields in sync (bidirectional)
  const clampPercent = (v) => {
    let n = Number(v);
    if (Number.isNaN(n)) return 0;
    n = Math.round(n);
    if (n < 0) n = 0;
    if (n > 100) n = 100;
    return n;
  };

  const handlePercentBrechoChange = (value) => {
    const v = clampPercent(value);
    setPercentBrecho(v);
    setPercentFornecedor(100 - v);
  };

  const handlePercentFornecedorChange = (value) => {
    const v = clampPercent(value);
    setPercentFornecedor(v);
    setPercentBrecho(100 - v);
  };

  // Estados para o modal de visualização de produto
  const [openProductModal, setOpenProductModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [novoItem, setNovoItem] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "Ótimo",
    preco: "",
    genero: "Unisex",
    quantidade: 1,
  });

  useEffect(() => {
    // Gerar ID do lote
    setLoteId(`L${String(Math.floor(Math.random() * 900) + 100)}`);

    // Carregar dados iniciais
    fetchLotes();
    fetchFornecedoras();
  }, []);

  const fetchLotes = async () => {
    try {
      const lotes = await getAllLotes();
      if (lotes && Array.isArray(lotes)) {
        const lotesFormatados = lotes
          .map((lote) => ({
            id: lote.id,
            codigo: `L${lote.id}`,
            data: new Date(lote.dataCriacao).toLocaleDateString("pt-BR"),
          }))
          .slice(0, 5);

        setLotesSidebar(lotesFormatados);
      }
    } catch (error) {
      console.error("Erro ao buscar lotes:", error);
      setError("Não foi possível carregar os lotes.");
    }
  };

  const fetchFornecedoras = async () => {
    try {
      const data = await getFornecedoras();
      setFornecedoras(data);
    } catch (error) {
      console.error("Erro ao buscar fornecedoras:", error);
      setError("Não foi possível carregar as fornecedoras.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handlers para o modal de visualização
  const handleOpenProductModal = (item) => {
    setProdutoSelecionado(item);
    setOpenProductModal(true);
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setProdutoSelecionado(null);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatarPreco = (preco) => Number(preco).toFixed(2);

  const handleAddItem = () => {
    // Validação
    if (!novoItem.descricao || !novoItem.preco) {
      setError("Por favor, preencha pelo menos a descrição e o valor");
      return;
    }

    if (Number.parseFloat(novoItem.preco) <= 0) {
      setError("O valor deve ser maior que zero");
      return;
    }

    if (Number.parseInt(novoItem.quantidade) <= 0) {
      setError("A quantidade deve ser maior que zero");
      return;
    }

    const newItem = {
      id: Date.now(),
      descricao: novoItem.descricao.trim(),
      marca: novoItem.marca.trim(),
      tamanho: novoItem.tamanho.trim(),
      estadoConservacao: novoItem.estadoConservacao,
      preco: Number.parseFloat(novoItem.preco),
      genero: novoItem.genero || "Unisex",
      quantidade: Number.parseInt(novoItem.quantidade) || 1,
    };

    setItems((prev) => [...prev, newItem]);
    setError(null);
    setSuccess("Item adicionado com sucesso!");

    // Limpar formulário
    setNovoItem({
      descricao: "",
      marca: "",
      tamanho: "",
      estadoConservacao: "Ótimo",
      preco: "",
      genero: "Unisex",
      quantidade: 1,
    });

    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSuccess("Item removido com sucesso!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      handleDeleteItem(itemToDelete.id); // Chama a deleção original
      setOpenDeleteDialog(false); // Fecha o modal
      setItemToDelete(null); // Limpa o item selecionado
    }
  };

  // Handler atualizado para visualização (agora abre o modal em vez de alert)
  const handleViewItem = (id) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      handleOpenProductModal(item);
    }
  };

  const getFornecedoraCredit = async (fornecedoraId) => {
    try {
      const response = await api.get("/fornecedoras");
      const data = response.data;
      
      // Verificar se data é um array antes de usar find
      if (!Array.isArray(data)) {
        console.error("Resposta da API não é um array:", data);
        return 0;
      }
      
      const fornecedora = data.find((f) => f.id === fornecedoraId);
      return fornecedora ? fornecedora.creditoLoja || 0 : 0;
    } catch (error) {
      console.error("Erro ao buscar crédito da fornecedora:", error);
      return 0;
    }
  };

  const updateFornecedoraCredit = async (fornecedoraId, newCreditValue) => {
    try {
      console.log("[v0] === INICIANDO EDIÇÃO DE CRÉDITO ===");
      console.log("[v0] ID:", fornecedoraId);
      console.log("[v0] Novo valor de crédito:", newCreditValue);

      const getFornecedoraResponse = await api.get(`/fornecedoras/${fornecedoraId}`);

      const fornecedoraData = getFornecedoraResponse.data;
      console.log("[v0] Dados atuais da fornecedora:", fornecedoraData);

      const updatedFornecedora = {
        ...fornecedoraData,
        creditoLoja: newCreditValue,
      };

      const formData = new FormData();
      formData.append("fornecedora", JSON.stringify(updatedFornecedora));

      const updateResponse = await api.put(`/fornecedoras/${fornecedoraId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("[v0] === RESPOSTA DA API ===");
      console.log("[v0] Status:", updateResponse.status);

      const result = updateResponse.data;
      console.log("[v0] Data:", result);

      return result;
    } catch (error) {
      console.error("[v0] === ERRO COMPLETO NA EDIÇÃO DE CRÉDITO ===", error);
      throw error;
    }
  };

  const handleFinalizarLote = async () => {
    if (items.length === 0) {
      setError("Adicione pelo menos um item ao lote antes de finalizar.");
      return;
    }

    if (!fornecedoraId) {
      setError("Selecione uma fornecedora para o lote.");
      return;
    }

    // Get current credit and open modal
    try {
      setCreditLoading(true);
      const credit = await getFornecedoraCredit(fornecedoraId);
      setCurrentCredit(credit);
      setCreditModal(true);
    } catch (error) {
      setError("Erro ao buscar crédito da fornecedora");
    } finally {
      setCreditLoading(false);
    }
  };

  const handleCreditConfirm = async () => {
    try {
      setCreditLoading(true);
      setError(null);

      console.log("[v0] Starting credit confirmation process");
      console.log("[v0] Current credit:", currentCredit);
      console.log("[v0] PercentFornecedor:", percentFornecedor);
      console.log("[v0] Fornecedora ID:", fornecedoraId);

      // Update credit if new value is provided
      // Validate percentage split
      if (percentBrecho + percentFornecedor !== 100) {
        setError("A soma dos percentuais deve ser 100% antes de confirmar.");
        return;
      }

      const valorTotal = calcularValorTotal();
      const creditoParaFornecedor = Number.parseFloat(
        (valorTotal * (percentFornecedor / 100)).toFixed(2)
      );

      if (creditoParaFornecedor > 0) {
        const updatedCredit = currentCredit + creditoParaFornecedor;
        console.log("[v0] Calculated updated credit:", updatedCredit);
        await updateFornecedoraCredit(fornecedoraId, updatedCredit);
        console.log("[v0] Credit updated successfully");
      }

      // Create the batch
      console.log("[v0] Creating lote with items:", items.length);
      const result = await createLote(fornecedoraId, items);
      console.log("[v0] Lote creation result:", result);

      if (result.success) {
        setSuccess(
          `Lote finalizado com sucesso! ${items.length} itens cadastrados.`
        );
        setCreditModal(false);
        setNewCredit("");
        setPercentBrecho(60);
        setPercentFornecedor(40);

        // Redirect after success
        setTimeout(() => {
          router.push("/lotes/lotes_geral");
        }, 2000);
      }
    } catch (error) {
      console.error("[v0] Erro ao finalizar lote:", error);
      setError(
        error.message || "Não foi possível finalizar o lote. Tente novamente."
      );
    } finally {
      setCreditLoading(false);
    }
  };

  const calcularValorTotal = () => {
    return items.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  };

  // Últimas 10 fornecedoras (supondo que fornecedoras já estejam ordenadas pela data desc)
  const ultimasFornecedoras = fornecedoras.slice(0, 10);

  return (
    <Box sx={{ display: "flex" }}>
      <Head>
        <title>Jujuba - Cadastrar Lote</title>
      </Head>
      <Sidebar lotes={lotesSidebar} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "244px",
          backgroundColor: "#9AE4FF",
          p: 4,
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            mb: 4,
          }}
        >
          <Toolbar sx={{ justifyContent: "center", position: "relative" }}>
            <IconButton
              onClick={() => router.push("/lotes/lotes_geral")}
              sx={{ color: "#333", position: "absolute", left: 0 }}
            >
              <ArrowBack />
            </IconButton>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#333",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                CADASTRAR LOTE
              </Typography>
              <Typography variant="h6" sx={{ color: "#666" }}>
                Lote: {loteId}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Alertas */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        <Paper
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 3,
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
            border: "2px solid #e0e0e0",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#333",
              textAlign: "center",
              pb: 2,
              borderBottom: "2px solid #FADADD",
            }}
          >
            Adicionar Novo Item
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Descrição do item"
                name="descricao"
                value={novoItem.descricao}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Marca"
                name="marca"
                value={novoItem.marca}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tamanho"
                name="tamanho"
                value={novoItem.tamanho}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado de Conservação</InputLabel>
                <Select
                  name="estadoConservacao"
                  value={novoItem.estadoConservacao}
                  onChange={handleInputChange}
                  label="Estado de Conservação"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="Ótimo">Ótimo</MenuItem>
                  <MenuItem value="Excelente">Excelente</MenuItem>
                  <MenuItem value="Bom">Bom</MenuItem>
                  <MenuItem value="Ruim">Ruim</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Valor (R$)"
                name="preco"
                type="number"
                value={novoItem.preco}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ step: 0.01, min: 0.01 }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantidade"
                name="quantidade"
                type="number"
                value={novoItem.quantidade}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ min: 1 }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gênero</InputLabel>
                <Select
                  name="genero"
                  value={novoItem.genero}
                  onChange={handleInputChange}
                  label="Gênero"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Unisex">Unisex</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={fornecedoras
                  .slice()
                  .sort(
                    (a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)
                  )
                  .slice(0, 10)}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option?.nome || ""
                }
                value={
                  // value can be stored as an id (string/number) or as the selected object
                  // find matching object in fornecedoras when fornecedoraId is set
                  fornecedoras.find(
                    (f) => String(f.id) === String(fornecedoraId)
                  ) ||
                  fornecedoraSelecionada ||
                  null
                }
                onChange={(event, newValue) => {
                  // newValue may be an object or null
                  setFornecedoraId(
                    newValue ? String(newValue.id ?? newValue) : ""
                  );
                  setFornecedoraSelecionada(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fornecedora"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        "& fieldset": {
                          borderColor: "#d0d0d0",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "#FADADD",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FADADD",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => {
                  // value could be an object with id or the id itself (string/number)
                  if (value == null) return false;
                  const valueId = typeof value === "object" ? value.id : value;
                  return String(option.id) === String(valueId);
                }}
                noOptionsText="Nenhuma fornecedora encontrada"
                clearOnEscape
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              disabled={loading}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#f8a8c8",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 20px rgba(250, 218, 221, 0.4)",
                },
                px: 6,
                py: 2,
                borderRadius: 25,
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow: "0px 4px 15px rgba(250, 218, 221, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Adicionar Item
            </Button>
          </Box>
        </Paper>

        <Card
          sx={{
            padding: "25px",
            bgcolor: "white",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            width: "100%",
            margin: "0 auto",
            border: "3px solid #e0e0e0",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#333",
              textAlign: "center",
              pb: 2,
              borderBottom: "3px solid #FADADD",
            }}
          >
            Itens do Lote
          </Typography>

          <TableContainer
            sx={{
              maxHeight: "600px",
              borderRadius: "15px",
              overflow: "auto",
              backgroundColor: "#ffffff",
              width: "100%",
              border: "2px solid #f0f0f0",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Descrição
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Valor
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Quantidade
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Marca
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Tamanho
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Gênero
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{ py: 4, fontSize: "1.1rem", color: "#666" }}
                    >
                      Nenhum item adicionado ao lote
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                    >
                      <TableCell sx={{ fontSize: "16px" }}>
                        {item.descricao}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>
                        {item.estadoConservacao}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px", fontWeight: 600 }}>
                        R$ {item.preco.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>
                        {item.quantidade}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>
                        {item.marca || "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>
                        {item.tamanho || "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>
                        {item.genero}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleOpenProductModal(item)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setItemToDelete(item); // Armazena o item para exibir no modal
                            setOpenDeleteDialog(true); // Abre o modal de confirmação
                          }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {items.length > 0 && (
                  <TableRow sx={{ backgroundColor: "#f0f8ff" }}>
                    <TableCell
                      colSpan={2}
                      align="right"
                      sx={{ fontWeight: "bold", fontSize: "18px" }}
                    >
                      Total:
                    </TableCell>
                    <TableCell
                      colSpan={6}
                      sx={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: "#2e7d32",
                      }}
                    >
                      R$ {calcularValorTotal().toFixed(2).replace(".", ",")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleFinalizarLote}
            disabled={loading || items.length === 0 || !fornecedoraId}
            sx={{
              backgroundColor: "#ffd0e8",
              color: "#333",
              "&:hover": {
                backgroundColor: "#ffb0d8",
                transform: "translateY(-3px)",
                boxShadow: "0px 8px 25px rgba(255, 208, 232, 0.4)",
              },
              "&:disabled": {
                backgroundColor: "#e0e0e0",
                color: "#999",
              },
              px: 8,
              py: 2.5,
              borderRadius: 30,
              fontSize: "1.2rem",
              fontWeight: 700,
              boxShadow: "0px 6px 20px rgba(255, 208, 232, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 2, color: "#333" }} />
                Processando...
              </>
            ) : (
              "Finalizar Lote"
            )}
          </Button>
        </Box>

        <Dialog
          open={creditModal}
          onClose={() => !creditLoading && setCreditModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#333",
              borderBottom: "2px solid #FADADD",
              pb: 2,
            }}
          >
            Gerenciar Crédito do Fornecedor
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
                Fornecedor: {fornecedoraSelecionada?.nome}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
                Crédito atual:{" "}
                <strong>R$ {currentCredit.toFixed(2).replace(".", ",")}</strong>
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Percentual Brechó (%)"
                  type="number"
                  value={percentBrecho}
                  onChange={(e) => handlePercentBrechoChange(e.target.value)}
                  inputProps={{ step: 1, min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Percentual Fornecedora (%)"
                  type="number"
                  value={percentFornecedor}
                  onChange={(e) =>
                    handlePercentFornecedorChange(e.target.value)
                  }
                  inputProps={{ step: 1, min: 0, max: 100 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={percentBrecho}
                    onChange={(_, v) => handlePercentBrechoChange(v)}
                    aria-label="percentual-brechó"
                    valueLabelDisplay="auto"
                    min={0}
                    max={100}
                    sx={{ color: "#f48fb1" }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption">0%</Typography>
                    <Typography variant="caption">100%</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Mostrar cálculo automático do crédito para a fornecedora */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                Valor total do lote:{" "}
                <strong>
                  R$ {calcularValorTotal().toFixed(2).replace(".", ",")}
                </strong>
              </Typography>

              {percentBrecho + percentFornecedor !== 100 ? (
                <Alert severity="warning" sx={{ mb: 1 }}>
                  A soma dos percentuais deve ser 100% (atualmente{" "}
                  {percentBrecho + percentFornecedor}%).
                </Alert>
              ) : null}

              <Alert severity="info">
                Crédito calculado para a fornecedora:{" "}
                <strong>
                  R${" "}
                  {(calcularValorTotal() * (percentFornecedor / 100))
                    .toFixed(2)
                    .replace(".", ",")}
                </strong>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setCreditModal(false)}
              disabled={creditLoading}
              sx={{
                color: "#666",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreditConfirm}
              variant="contained"
              disabled={creditLoading}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#f8a8c8",
                },
                px: 4,
                borderRadius: 2,
              }}
            >
              {creditLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "#333" }} />
                  Processando...
                </>
              ) : (
                "Confirmar e Finalizar"
              )}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Modal de Visualização de Produto */}
        <Dialog
          open={openProductModal}
          onClose={handleCloseProductModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background: "#F5F5F5",
              boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
              overflow: "visible",
              maxHeight: "90vh",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              pb: 2,
              pt: 4,
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleCloseProductModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#666",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#9AE4FF",
                  boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
                }}
              >
                <InventoryIcon sx={{ fontSize: 40, color: "white" }} />
              </Avatar>

              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
              >
                {produtoSelecionado?.descricao || "Produto"}
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 4, pb: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 3,
                "& .MuiTab-root": {
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#333",
                },
                "& .MuiTab-root.Mui-selected": { color: "#9AE4FF" },
                "& .MuiTabs-indicator": { backgroundColor: "#9AE4FF" },
              }}
            >
              <Tab label="Informações Básicas" />
              <Tab label="Detalhes Adicionais" />
            </Tabs>

            {tabValue === 0 && produtoSelecionado && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                      >
                        Dados do Produto
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>ID:</strong> #{produtoSelecionado.id || "N/A"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Descrição:</strong>{" "}
                        {produtoSelecionado.descricao}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Estado:</strong>{" "}
                        <Chip
                          label={produtoSelecionado.estadoConservacao}
                          color="success"
                          size="small"
                        />
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                      >
                        Preço e Estoque
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 1,
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#4CAF50",
                        }}
                      >
                        <strong>Preço:</strong> R${" "}
                        {formatarPreco(produtoSelecionado.preco)}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Quantidade:</strong>{" "}
                        {produtoSelecionado.quantidade} unidades
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Tamanho:</strong> {produtoSelecionado.tamanho}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === 1 && produtoSelecionado && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: "#FADADD" }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                      >
                        Características
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Marca:</strong> {produtoSelecionado.marca}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Gênero:</strong> {produtoSelecionado.genero}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, backgroundColor: "#FADADD" }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                      >
                        Controle
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Data de Adição:</strong>{" "}
                        {produtoSelecionado.dataAdicao
                          ? new Date(
                              produtoSelecionado.dataAdicao
                            ).toLocaleDateString("pt-BR")
                          : "Não informada"}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Status:</strong>{" "}
                        <Chip
                          label={produtoSelecionado.ativo ? "Ativo" : "Inativo"}
                          color={produtoSelecionado.ativo ? "success" : "error"}
                          size="small"
                        />
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <DialogActions
            sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}
          >
            <Button
              onClick={handleCloseProductModal}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                fontWeight: "bold",
                fontSize: "16px",
                borderRadius: "25px",
                padding: "12px 32px",
                minWidth: "120px",
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
                "&:hover": {
                  backgroundColor: "#FFB6C1",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
                },
              }}
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
        {/* Modal de Confirmação de Exclusão de Produto */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background: "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
              boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
              overflow: "visible",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              pb: 2,
              pt: 4,
              position: "relative",
            }}
          >
            <IconButton
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#666",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#ff5722",
                  boxShadow: "0px 8px 20px rgba(255, 87, 34, 0.3)",
                }}
              >
                <WarningAmberIcon sx={{ fontSize: 40, color: "white" }} />
              </Avatar>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "center",
                }}
              >
                Confirmar Exclusão
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
            <Typography
              variant="body1"
              sx={{
                color: "#555",
                fontSize: "18px",
                lineHeight: 1.6,
                maxWidth: "400px",
                mx: "auto",
              }}
            >
              Tem certeza que deseja remover o produto "
              <strong>{itemToDelete?.descricao}</strong>" do lote?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 2,
              px: 4,
              pb: 4,
            }}
          >
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                backgroundColor: "#9AE4FF",
                color: "#333",
                fontWeight: "bold",
                fontSize: "16px",
                borderRadius: "25px",
                padding: "12px 32px",
                minWidth: "120px",
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
                "&:hover": {
                  backgroundColor: "#7DD3FC",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
                },
              }}
            >
              Cancelar
            </Button>

            <Button
              onClick={confirmDeleteItem}
              sx={{
                backgroundColor: "#ff5722",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                borderRadius: "25px",
                padding: "12px 32px",
                minWidth: "120px",
                textTransform: "none",
                boxShadow: "0px 4px 12px rgba(255, 87, 34, 0.4)",
                "&:hover": {
                  backgroundColor: "#e64a19",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 16px rgba(255, 87, 34, 0.6)",
                },
              }}
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
