"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Autocomplete,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Slider,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// Componentes padronizados
import {
  PageLayout,
  PageTitle,
  DataTable,
  SnackbarAlert,
  ConfirmDialog,
} from "../../components/ui";

// Hooks padronizados
import { useSnackbar } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING, FONT_SIZES } from "../../constants";

// APIs
import {
  createLote,
  getAllLotes,
  getFornecedoras,
} from "../api/lotes";
import api from "../../utils/api";

export default function CadastroLotePage() {
  const router = useRouter();
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  // Estados principais
  const [loteId, setLoteId] = useState("");
  const [fornecedoraId, setFornecedoraId] = useState("");
  const [fornecedoraSelecionada, setFornecedoraSelecionada] = useState(null);
  const [items, setItems] = useState([]);
  const [fornecedoras, setFornecedoras] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados do modal de crédito
  const [creditModal, setCreditModal] = useState(false);
  const [currentCredit, setCurrentCredit] = useState(0);
  const [creditLoading, setCreditLoading] = useState(false);
  const [percentBrecho, setPercentBrecho] = useState(60);
  const [percentFornecedor, setPercentFornecedor] = useState(40);

  // Estados do modal de visualização de produto
  const [openProductModal, setOpenProductModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Estados do modal de exclusão
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estado do formulário
  const [novoItem, setNovoItem] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "Ótimo",
    preco: "",
    genero: "Unisex",
    quantidade: 1,
  });

  // Handlers de percentual
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

  // Inicialização
  useEffect(() => {
    setLoteId(`L${String(Math.floor(Math.random() * 900) + 100)}`);
    fetchFornecedoras();
  }, []);

  const fetchFornecedoras = async () => {
    try {
      const data = await getFornecedoras();
      setFornecedoras(data);
    } catch (error) {
      console.error("Erro ao buscar fornecedoras:", error);
      showError("Não foi possível carregar as fornecedoras.");
    }
  };

  // Handlers do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoItem((prev) => ({ ...prev, [name]: value }));
  };

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

  const formatarPreco = (preco) => Number(preco).toFixed(2).replace(".", ",");

  const handleAddItem = () => {
    if (!novoItem.descricao || !novoItem.preco) {
      showError("Por favor, preencha pelo menos a descrição e o valor");
      return;
    }

    if (Number.parseFloat(novoItem.preco) <= 0) {
      showError("O valor deve ser maior que zero");
      return;
    }

    if (Number.parseInt(novoItem.quantidade) <= 0) {
      showError("A quantidade deve ser maior que zero");
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
    showSuccess("Item adicionado com sucesso!");

    setNovoItem({
      descricao: "",
      marca: "",
      tamanho: "",
      estadoConservacao: "Ótimo",
      preco: "",
      genero: "Unisex",
      quantidade: 1,
    });
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showSuccess("Item removido com sucesso!");
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      handleDeleteItem(itemToDelete.id);
      setOpenDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  // Funções de crédito
  const getFornecedoraCredit = async (fornecedoraId) => {
    try {
      const response = await api.get("/fornecedoras");
      const data = response.data;
      if (!Array.isArray(data)) return 0;
      const fornecedora = data.find((f) => f.id === fornecedoraId);
      return fornecedora ? fornecedora.creditoLoja || 0 : 0;
    } catch (error) {
      console.error("Erro ao buscar crédito da fornecedora:", error);
      return 0;
    }
  };

  const updateFornecedoraCredit = async (fornecedoraId, newCreditValue) => {
    try {
      const getFornecedoraResponse = await api.get(`/fornecedoras/${fornecedoraId}`);
      const fornecedoraData = getFornecedoraResponse.data;

      const updatedFornecedora = {
        ...fornecedoraData,
        creditoLoja: newCreditValue,
      };

      const formData = new FormData();
      formData.append("fornecedora", JSON.stringify(updatedFornecedora));

      const updateResponse = await api.put(`/fornecedoras/${fornecedoraId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return updateResponse.data;
    } catch (error) {
      console.error("Erro na edição de crédito:", error);
      throw error;
    }
  };

  const handleFinalizarLote = async () => {
    if (items.length === 0) {
      showError("Adicione pelo menos um item ao lote antes de finalizar.");
      return;
    }

    if (!fornecedoraId) {
      showError("Selecione uma fornecedora para o lote.");
      return;
    }

    try {
      setCreditLoading(true);
      const credit = await getFornecedoraCredit(fornecedoraId);
      setCurrentCredit(credit);
      setCreditModal(true);
    } catch (error) {
      showError("Erro ao buscar crédito da fornecedora");
    } finally {
      setCreditLoading(false);
    }
  };

  const handleCreditConfirm = async () => {
    try {
      setCreditLoading(true);

      if (percentBrecho + percentFornecedor !== 100) {
        showError("A soma dos percentuais deve ser 100% antes de confirmar.");
        return;
      }

      const valorTotal = calcularValorTotal();
      const creditoParaFornecedor = Number.parseFloat(
        (valorTotal * (percentFornecedor / 100)).toFixed(2)
      );

      if (creditoParaFornecedor > 0) {
        const updatedCredit = currentCredit + creditoParaFornecedor;
        await updateFornecedoraCredit(fornecedoraId, updatedCredit);
      }

      const result = await createLote(fornecedoraId, items);

      if (result.success) {
        showSuccess(`Lote finalizado com sucesso! ${items.length} itens cadastrados.`);
        setCreditModal(false);
        setPercentBrecho(60);
        setPercentFornecedor(40);

        setTimeout(() => {
          router.push("/lotes/lotes_geral");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao finalizar lote:", error);
      showError(error.message || "Não foi possível finalizar o lote. Tente novamente.");
    } finally {
      setCreditLoading(false);
    }
  };

  const calcularValorTotal = () => {
    return items.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  // Configuração das colunas da tabela
  const columns = [
    { id: "descricao", label: "Descrição", wordWrap: true, maxWidth: 150 },
    { id: "estadoConservacao", label: "Estado", hideOnMobile: true },
    {
      id: "preco",
      label: "Valor",
      render: (row) => `R$ ${row.preco.toFixed(2).replace(".", ",")}`,
    },
    { id: "quantidade", label: "Qtd" },
    { id: "marca", label: "Marca", hideOnMobile: true, render: (row) => row.marca || "-" },
    { id: "tamanho", label: "Tamanho", hideOnMobile: true, render: (row) => row.tamanho || "-" },
    { id: "genero", label: "Gênero", hideOnMobile: true },
    {
      id: "acoes",
      label: "Ações",
      width: 100,
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenProductModal(row);
            }}
            sx={{ color: COLORS.actionBlue }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setItemToDelete(row);
              setOpenDeleteDialog(true);
            }}
            sx={{ color: COLORS.error }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Estilo comum para inputs
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: SPACING.inputBorderRadius,
      backgroundColor: COLORS.backgroundPaper,
      "& fieldset": { borderColor: COLORS.borderLight, borderWidth: 2 },
      "&:hover fieldset": { borderColor: COLORS.primaryPink },
      "&.Mui-focused fieldset": { borderColor: COLORS.primaryPink, borderWidth: 2 },
    },
  };

  return (
    <PageLayout title="Cadastrar Lote">
      <PageTitle title="Cadastrar Lote" />

      <Typography
        sx={{
          textAlign: "center",
          mb: 3,
          color: COLORS.textMuted,
          fontSize: FONT_SIZES.body,
        }}
      >
        Lote: {loteId}
      </Typography>

      {/* Formulário de adicionar item */}
      <Paper
        sx={{
          p: SPACING.cardPadding,
          mb: 3,
          borderRadius: SPACING.cardBorderRadius,
          boxShadow: SHADOWS.card,
          border: `2px solid ${COLORS.borderMedium}`,
          backgroundColor: COLORS.backgroundWhite,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: COLORS.textSecondary,
            textAlign: "center",
            pb: 2,
            borderBottom: `2px solid ${COLORS.primaryPink}`,
            fontSize: FONT_SIZES.sectionTitle,
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
              sx={inputStyle}
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
              sx={inputStyle}
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
              sx={inputStyle}
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
                  borderRadius: SPACING.inputBorderRadius,
                  backgroundColor: COLORS.backgroundPaper,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.borderLight,
                    borderWidth: 2,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.primaryPink,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.primaryPink,
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
              sx={inputStyle}
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
              sx={inputStyle}
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
                  borderRadius: SPACING.inputBorderRadius,
                  backgroundColor: COLORS.backgroundPaper,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.borderLight,
                    borderWidth: 2,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.primaryPink,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: COLORS.primaryPink,
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
                .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                .slice(0, 10)}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option?.nome || ""
              }
              value={
                fornecedoras.find((f) => String(f.id) === String(fornecedoraId)) ||
                fornecedoraSelecionada ||
                null
              }
              onChange={(event, newValue) => {
                setFornecedoraId(newValue ? String(newValue.id ?? newValue) : "");
                setFornecedoraSelecionada(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fornecedora"
                  variant="outlined"
                  sx={inputStyle}
                />
              )}
              isOptionEqualToValue={(option, value) => {
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
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            disabled={loading}
            sx={{
              backgroundColor: COLORS.primaryPink,
              color: COLORS.textSecondary,
              "&:hover": {
                backgroundColor: COLORS.actionPinkHover,
                transform: "translateY(-2px)",
              },
              px: { xs: 4, md: 6 },
              py: 2,
              borderRadius: SPACING.buttonBorderRadius,
              fontSize: FONT_SIZES.button,
              fontWeight: 600,
              boxShadow: SHADOWS.button,
              transition: "all 0.3s ease",
              textTransform: "none",
            }}
          >
            Adicionar Item
          </Button>
        </Box>
      </Paper>

      {/* Tabela de itens */}
      <Card
        sx={{
          padding: SPACING.cardPadding,
          boxShadow: SHADOWS.card,
          borderRadius: SPACING.cardBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
          border: `2px solid ${COLORS.borderMedium}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: COLORS.textSecondary,
            textAlign: "center",
            pb: 2,
            borderBottom: `2px solid ${COLORS.primaryPink}`,
            fontSize: FONT_SIZES.sectionTitle,
          }}
        >
          Itens do Lote ({items.length})
        </Typography>

        <DataTable
          columns={columns}
          data={items}
          loading={false}
          emptyMessage="Nenhum item adicionado ao lote"
          rowKeyExtractor={(row) => row.id}
          showPagination={false}
          maxHeight={{ xs: 350, sm: 450, md: 500 }}
        />

        {items.length > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: COLORS.recentItemBackground,
              borderRadius: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: FONT_SIZES.body }}>
              Total:
            </Typography>
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: FONT_SIZES.sectionTitle,
                color: COLORS.success,
              }}
            >
              R$ {calcularValorTotal().toFixed(2).replace(".", ",")}
            </Typography>
          </Box>
        )}
      </Card>

      {/* Botão finalizar */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleFinalizarLote}
          disabled={loading || items.length === 0 || !fornecedoraId}
          sx={{
            backgroundColor: items.length > 0 && fornecedoraId ? COLORS.primaryPink : "#e0e0e0",
            color: items.length > 0 && fornecedoraId ? COLORS.textSecondary : COLORS.textMuted,
            "&:hover": {
              backgroundColor: items.length > 0 && fornecedoraId ? COLORS.actionPinkHover : "#e0e0e0",
              transform: items.length > 0 && fornecedoraId ? "translateY(-2px)" : "none",
            },
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: COLORS.textMuted,
            },
            px: { xs: 6, md: 8 },
            py: 2.5,
            borderRadius: SPACING.buttonBorderRadius,
            fontSize: FONT_SIZES.button,
            fontWeight: 700,
            boxShadow: SHADOWS.button,
            transition: "all 0.3s ease",
            textTransform: "none",
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 2, color: COLORS.textSecondary }} />
              Processando...
            </>
          ) : (
            "Finalizar Lote"
          )}
        </Button>
      </Box>

      {/* Modal de Crédito */}
      <Dialog
        open={creditModal}
        onClose={() => !creditLoading && setCreditModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: SPACING.modalBorderRadius,
            boxShadow: SHADOWS.modal,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: FONT_SIZES.sectionTitle,
            fontWeight: 700,
            color: COLORS.textSecondary,
            borderBottom: `2px solid ${COLORS.primaryPink}`,
            pb: 2,
          }}
        >
          Gerenciar Crédito do Fornecedor
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
              Fornecedor: {fornecedoraSelecionada?.nome}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: COLORS.textMuted, fontSize: FONT_SIZES.bodySmall }}>
              Crédito atual: <strong>R$ {currentCredit.toFixed(2).replace(".", ",")}</strong>
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Percentual Brechó (%)"
                type="number"
                size="small"
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
                size="small"
                value={percentFornecedor}
                onChange={(e) => handlePercentFornecedorChange(e.target.value)}
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
                  sx={{ color: COLORS.primaryPink }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="caption">0%</Typography>
                  <Typography variant="caption">100%</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 1, fontSize: FONT_SIZES.bodySmall }}>
              Valor total do lote: <strong>R$ {calcularValorTotal().toFixed(2).replace(".", ",")}</strong>
            </Typography>

            {percentBrecho + percentFornecedor !== 100 && (
              <Alert severity="warning" sx={{ mb: 1 }}>
                A soma dos percentuais deve ser 100% (atualmente {percentBrecho + percentFornecedor}%).
              </Alert>
            )}

            <Alert severity="info">
              Crédito calculado para a fornecedora:{" "}
              <strong>
                R$ {(calcularValorTotal() * (percentFornecedor / 100)).toFixed(2).replace(".", ",")}
              </strong>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setCreditModal(false)}
            disabled={creditLoading}
            sx={{
              color: COLORS.textMuted,
              "&:hover": { backgroundColor: COLORS.backgroundPaper },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreditConfirm}
            variant="contained"
            disabled={creditLoading || percentBrecho + percentFornecedor !== 100}
            sx={{
              backgroundColor: COLORS.primaryPink,
              color: COLORS.textSecondary,
              "&:hover": { backgroundColor: COLORS.actionPinkHover },
              px: 4,
              borderRadius: SPACING.buttonBorderRadius,
              textTransform: "none",
            }}
          >
            {creditLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: COLORS.textSecondary }} />
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
            borderRadius: SPACING.modalBorderRadius,
            background: COLORS.backgroundPaper,
            boxShadow: SHADOWS.modal,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 2, pt: 4, position: "relative" }}>
          <IconButton
            onClick={handleCloseProductModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: COLORS.textMuted,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                backgroundColor: COLORS.primaryBlue,
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <InventoryIcon sx={{ fontSize: { xs: 30, md: 40 }, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: COLORS.textSecondary, textAlign: "center", fontSize: FONT_SIZES.sectionTitle }}
            >
              {produtoSelecionado?.descricao || "Produto"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, md: 4 }, pb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: FONT_SIZES.body,
                color: COLORS.textSecondary,
                minWidth: { xs: 100, sm: 160 },
              },
              "& .MuiTab-root.Mui-selected": { color: COLORS.primaryBlue },
              "& .MuiTabs-indicator": { backgroundColor: COLORS.primaryBlue },
            }}
          >
            <Tab label="Informações Básicas" />
            <Tab label="Detalhes Adicionais" />
          </Tabs>

          {tabValue === 0 && produtoSelecionado && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: COLORS.primaryPink, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                    Dados do Produto
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>ID:</strong> #{produtoSelecionado.id || "N/A"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Descrição:</strong> {produtoSelecionado.descricao}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Estado:</strong>{" "}
                    <Chip label={produtoSelecionado.estadoConservacao} color="success" size="small" />
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: COLORS.primaryPink, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                    Preço e Estoque
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, fontSize: FONT_SIZES.body, fontWeight: "bold", color: COLORS.success }}
                  >
                    <strong>Preço:</strong> R$ {formatarPreco(produtoSelecionado.preco)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Quantidade:</strong> {produtoSelecionado.quantidade} unidades
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Tamanho:</strong> {produtoSelecionado.tamanho || "-"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && produtoSelecionado && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: COLORS.primaryPink, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                    Características
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Marca:</strong> {produtoSelecionado.marca || "-"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Gênero:</strong> {produtoSelecionado.genero}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: COLORS.primaryPink, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                    Controle
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Data de Adição:</strong>{" "}
                    {produtoSelecionado.dataAdicao
                      ? new Date(produtoSelecionado.dataAdicao).toLocaleDateString("pt-BR")
                      : "Não informada"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.bodySmall }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={produtoSelecionado.ativo !== false ? "Ativo" : "Inativo"}
                      color={produtoSelecionado.ativo !== false ? "success" : "error"}
                      size="small"
                    />
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}>
          <Button
            onClick={handleCloseProductModal}
            sx={{
              backgroundColor: COLORS.primaryPink,
              color: COLORS.textSecondary,
              fontWeight: "bold",
              fontSize: FONT_SIZES.button,
              borderRadius: SPACING.buttonBorderRadius,
              padding: { xs: "10px 24px", md: "12px 32px" },
              textTransform: "none",
              boxShadow: SHADOWS.button,
              "&:hover": {
                backgroundColor: COLORS.actionPinkHover,
                transform: "translateY(-2px)",
              },
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja remover o produto "${itemToDelete?.descricao}" do lote?`}
        subMessage="Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="danger"
        content={
          itemToDelete && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: "16px 24px",
                borderRadius: "15px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                border: `2px solid rgba(154, 228, 255, 0.5)`,
              }}
            >
              <Avatar sx={{ backgroundColor: COLORS.primaryBlue, width: 50, height: 50 }}>
                <InventoryIcon sx={{ color: "white" }} />
              </Avatar>
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS.textSecondary, mb: 0.5 }}>
                  {itemToDelete.descricao}
                </Typography>
                <Typography variant="body2" sx={{ color: COLORS.textMuted, fontSize: "14px" }}>
                  R$ {itemToDelete.preco?.toFixed(2).replace(".", ",")} | Qtd: {itemToDelete.quantidade}
                </Typography>
              </Box>
            </Box>
          )
        }
      />

      {/* Snackbar de notificações */}
      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
}
