"use client";

import { useState, useEffect, useMemo, useCallback, forwardRef } from "react";
import { useRouter } from "next/navigation";

// Material-UI
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Chip,
  CircularProgress,
  Avatar,
  Slide,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";

// Ícones
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";

// Componentes padronizados
import {
  PageLayout,
  PageTitle,
  SearchBar,
  SnackbarAlert,
  ConfirmDialog,
} from "../../components/ui";

// Hooks padronizados
import { useSnackbar } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING } from "../../constants";

// APIs
import { removerDoCarrinho, listarCarrinho, incrementarQuantidade, decrementarQuantidade } from "../api/carrinho";
import { finalizarVendaSimples } from "../api/vendas";
import { listarProdutos } from "../api/produtos";

// Função de formatação segura
const formatarPreco = (valor) => {
  const numero = Number(valor);
  if (isNaN(numero)) {
    return "0,00";
  }
  return numero.toFixed(2).replace(".", ",");
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CarrinhoPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSellModal, setOpenSellModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [cartItems, setCartItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [nomeCliente, setNomeCliente] = useState("");

  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Buscar itens do carrinho
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listarCarrinho();
        if (response.sucesso && response.carrinho) {
          setCartItems(response.carrinho.itens || []);
          setTotalValue(Number(response.carrinho.valorTotal) || 0);
        } else {
          setError("Não foi possível carregar os itens do carrinho: " + response.mensagem);
          setCartItems([]);
          setTotalValue(0);
        }
      } catch (err) {
        setError("Não foi possível carregar os itens do carrinho. Verifique a conexão com o servidor.");
        setCartItems([]);
        setTotalValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Opções de busca
  const searchOptions = useMemo(() => {
    return [...new Set(cartItems.map((item) => item.descricao).filter(Boolean))];
  }, [cartItems]);

  // Filtro de busca
  const filteredCartItems = useMemo(() => {
    if (!searchTerm?.trim()) return cartItems;
    const s = searchTerm.toLowerCase();
    return cartItems.filter((item) =>
      item?.descricao?.toLowerCase().includes(s)
    );
  }, [cartItems, searchTerm]);

  // Navegações
  const handleVenderParaFornecedor = () => router.push("/vendas/vender_fornecedor");

  // Modal de produto
  const handleOpenProductModal = (produto) => {
    setProdutoSelecionado(produto);
    setOpenProductModal(true);
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setProdutoSelecionado(null);
  };

  // Modal de venda
  const handleOpenSellModal = () => setOpenSellModal(true);
  const handleCloseSellModal = () => setOpenSellModal(false);

  // Modal de exclusão
  const handleDeleteClick = (item) => setDeleteModal({ open: true, item });
  const handleCloseDeleteModal = () => setDeleteModal({ open: false, item: null });

  const handleConfirmDelete = useCallback(async () => {
    if (deleteModal.item) {
      try {
        setLoading(true);
        const result = await removerDoCarrinho(deleteModal.item.id);

        if (result.sucesso && result.carrinho) {
          setCartItems(result.carrinho.itens || []);
          setTotalValue(Number(result.carrinho.valorTotal) || 0);
          showSuccess(`"${deleteModal.item.descricao}" removido do carrinho!`);
          try {
            window.dispatchEvent(new Event("estoque-atualizado"));
          } catch (e) {
            console.warn("Falha ao despachar evento estoque-atualizado:", e);
          }
        } else {
          showError(`Erro ao remover item: ${result.mensagem}`);
        }
      } catch (err) {
        showError("Erro ao remover item. Verifique a conexão.");
      } finally {
        setLoading(false);
      }
    }
    handleCloseDeleteModal();
  }, [deleteModal.item, showSuccess, showError]);

  // Incrementar quantidade (+1)
  const handleIncrement = useCallback(async (item) => {
    try {
      setLoading(true);
      const result = await incrementarQuantidade(item.id);

      if (result.sucesso && result.carrinho) {
        setCartItems(result.carrinho.itens || []);
        setTotalValue(Number(result.carrinho.valorTotal) || 0);
      } else {
        showError(`Erro ao aumentar quantidade: ${result.mensagem}`);
      }
    } catch (err) {
      showError("Erro ao aumentar quantidade. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Decrementar quantidade (-1)
  const handleDecrement = useCallback(async (item) => {
    const quantidade = item.quantidade || 1;

    if (quantidade <= 1) {
      // Se só tem 1, abre modal de confirmação para remover
      handleDeleteClick(item);
      return;
    }

    try {
      setLoading(true);
      const result = await decrementarQuantidade(item.id, quantidade);

      if (result.sucesso && result.carrinho) {
        setCartItems(result.carrinho.itens || []);
        setTotalValue(Number(result.carrinho.valorTotal) || 0);
      } else {
        showError(`Erro ao diminuir quantidade: ${result.mensagem}`);
      }
    } catch (err) {
      showError("Erro ao diminuir quantidade. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Finalizar venda
  const handleFinalizarVenda = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await finalizarVendaSimples(nomeCliente);
      if (result.sucesso) {
        setCartItems([]);
        setTotalValue(0);
        setNomeCliente("");
        setOpenSellModal(false);
        showSuccess("Venda finalizada com sucesso!");

        try {
          await listarProdutos();
        } catch (e) {
          console.warn("Falha ao atualizar produtos após venda:", e);
        }

        try {
          window.dispatchEvent(new Event("estoque-atualizado"));
        } catch (e) {
          console.warn("Não foi possível disparar evento de estoque atualizado:", e);
        }
        router.push("/vendas");
      } else {
        showError(`Erro ao finalizar venda: ${result.mensagem}`);
      }
    } catch (err) {
      showError("Erro ao finalizar venda. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  // Conteúdo do modal de confirmação de exclusão
  const deleteModalContent = deleteModal.item && (
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
          {deleteModal.item.descricao}
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.textMuted, fontSize: "14px" }}>
          R$ {formatarPreco(deleteModal.item.preco)} | Qtd: {deleteModal.item.quantidade || 1}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <PageLayout title="Carrinho">
      <PageTitle title="Carrinho" />

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar produto no carrinho"
          useAutocomplete
          options={searchOptions}
        />
      </Box>

      <Card
        sx={{
          padding: SPACING.cardPadding,
          boxShadow: SHADOWS.card,
          borderRadius: SPACING.cardBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
          border: `2px solid ${COLORS.borderMedium}`,
        }}
      >
        <CardContent sx={{ p: 1 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 700, color: COLORS.textSecondary, fontSize: "1.5rem" }}
          >
            Itens no carrinho ({filteredCartItems.length})
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress sx={{ color: COLORS.primaryPink }} />
            </Box>
          )}

          {error && (
            <Box sx={{ bgcolor: "#ffebee", p: 2, borderRadius: 2, mb: 3 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {!loading && !error && (
            <TableContainer
              component={Paper}
              sx={{
                mb: 3,
                borderRadius: "12px",
                boxShadow: "none",
                border: `1px solid ${COLORS.borderLight}`,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: COLORS.primaryPink,
                        borderRight: `2px solid ${COLORS.backgroundPaper}`,
                        color: COLORS.textSecondary,
                      }}
                    >
                      Descrição
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: COLORS.primaryPink,
                        borderRight: `2px solid ${COLORS.backgroundPaper}`,
                        color: COLORS.textSecondary,
                      }}
                    >
                      Estado
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: COLORS.primaryPink,
                        borderRight: `2px solid ${COLORS.backgroundPaper}`,
                        color: COLORS.textSecondary,
                      }}
                    >
                      Quantidade
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: COLORS.primaryPink,
                        borderRight: `2px solid ${COLORS.backgroundPaper}`,
                        color: COLORS.textSecondary,
                      }}
                    >
                      Valor
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        backgroundColor: COLORS.primaryPink,
                        color: COLORS.textSecondary,
                      }}
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCartItems.length > 0 ? (
                    filteredCartItems.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell align="center">{item.descricao}</TableCell>
                        <TableCell align="center">{item.estadoConservacao}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleDecrement(item)}
                              disabled={loading}
                              sx={{
                                bgcolor: COLORS.primaryBlue,
                                color: COLORS.textSecondary,
                                width: 28,
                                height: 28,
                                "&:hover": { bgcolor: COLORS.actionBlueHover },
                                "&.Mui-disabled": { bgcolor: COLORS.borderLight },
                              }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <Typography sx={{ fontWeight: "bold", minWidth: 24, textAlign: "center" }}>
                              {item.quantidade || 1}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleIncrement(item)}
                              disabled={loading}
                              sx={{
                                bgcolor: COLORS.primaryBlue,
                                color: COLORS.textSecondary,
                                width: 28,
                                height: 28,
                                "&:hover": { bgcolor: COLORS.actionBlueHover },
                                "&.Mui-disabled": { bgcolor: COLORS.borderLight },
                              }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="center">R$ {formatarPreco(item.preco)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenProductModal(item)}
                            sx={{ color: COLORS.actionBlue }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(item)}
                            sx={{ color: COLORS.warning }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: COLORS.textMuted }}>
                        Nenhum item no carrinho
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && !error && (
            <Box
              sx={{
                display: "inline-block",
                bgcolor: COLORS.primaryBlue,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color: COLORS.textSecondary }}>
                Valor Total: R$ {formatarPreco(totalValue)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, flexWrap: "wrap", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleVenderParaFornecedor}
              sx={{
                bgcolor: COLORS.primaryPink,
                color: COLORS.textSecondary,
                "&:hover": { bgcolor: COLORS.actionPinkHover },
                borderRadius: SPACING.buttonBorderRadius,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: SHADOWS.button,
              }}
            >
              Vender para fornecedor
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenSellModal}
              disabled={cartItems.length === 0 || loading}
              sx={{
                bgcolor: COLORS.primaryPink,
                color: COLORS.textSecondary,
                "&:hover": { bgcolor: COLORS.actionPinkHover },
                borderRadius: SPACING.buttonBorderRadius,
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: SHADOWS.button,
                "&.Mui-disabled": { bgcolor: COLORS.backgroundPaper, color: COLORS.textMuted },
              }}
            >
              Vender
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Modal de Visualização de Produto */}
      <Dialog
        open={openProductModal}
        keepMounted
        onClose={handleCloseProductModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: COLORS.backgroundPaper,
            boxShadow: SHADOWS.modal,
            overflow: "visible",
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
                width: 80,
                height: 80,
                backgroundColor: COLORS.primaryBlue,
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <InventoryIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: "bold", color: COLORS.textSecondary, textAlign: "center" }}>
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
              "& .MuiTab-root": { fontWeight: "bold", fontSize: "16px", color: COLORS.textSecondary },
              "& .MuiTab-root.Mui-selected": { color: COLORS.primaryBlue },
              "& .MuiTabs-indicator": { backgroundColor: COLORS.primaryBlue },
            }}
          >
            <Tab label="Informações Básicas" />
            <Tab label="Detalhes Adicionais" />
          </Tabs>

          {tabValue === 0 && produtoSelecionado && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: COLORS.primaryPink }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>
                      Dados do Produto
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>ID:</strong> #{produtoSelecionado.id || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Descrição:</strong> {produtoSelecionado.descricao}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Estado:</strong>{" "}
                      <Chip label={produtoSelecionado.estadoConservacao} color="success" size="small" />
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: COLORS.primaryPink }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>
                      Preço e Estoque
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 1, fontSize: "18px", fontWeight: "bold", color: "#4CAF50" }}
                    >
                      <strong>Preço:</strong> R$ {formatarPreco(produtoSelecionado.preco)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Quantidade:</strong> {produtoSelecionado.quantidade} unidades
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
                  <Paper sx={{ p: 3, backgroundColor: COLORS.primaryPink }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>
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
                  <Paper sx={{ p: 3, backgroundColor: COLORS.primaryPink }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>
                      Controle
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Data de Adição:</strong>{" "}
                      {produtoSelecionado.dataAdicao
                        ? new Date(produtoSelecionado.dataAdicao).toLocaleDateString("pt-BR")
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

        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}>
          <Button
            onClick={handleCloseProductModal}
            sx={{
              backgroundColor: COLORS.primaryPink,
              color: COLORS.textSecondary,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: SHADOWS.button,
              "&:hover": {
                backgroundColor: COLORS.actionPinkHover,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Finalizar Venda */}
      <Dialog
        open={openSellModal}
        onClose={handleCloseSellModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: COLORS.backgroundPaper,
            boxShadow: SHADOWS.modal,
            overflow: "visible",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 2, pt: 4, position: "relative" }}>
          <IconButton
            onClick={handleCloseSellModal}
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
                width: 80,
                height: 80,
                backgroundColor: COLORS.primaryBlue,
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: "bold", color: COLORS.textSecondary, textAlign: "center" }}>
              Finalizar Venda
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
              "& .MuiTab-root": { fontWeight: "bold", fontSize: "16px", color: COLORS.textSecondary },
              "& .MuiTab-root.Mui-selected": { color: COLORS.primaryBlue },
              "& .MuiTabs-indicator": { backgroundColor: COLORS.primaryBlue },
            }}
          >
            <Tab label="Itens da Venda" />
            <Tab label="Resumo e Total" />
          </Tabs>

          {tabValue === 0 && (
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 300,
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: COLORS.primaryPink }}>Descrição</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: COLORS.primaryPink }}>
                      Quantidade
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: COLORS.primaryPink }}>
                      Preço Unitário
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: COLORS.primaryPink }}>
                      Valor Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id} sx={{ "&:hover": { bgcolor: "#E0E0E0" } }}>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell align="center">{item.quantidade != null ? item.quantidade : 1}</TableCell>
                      <TableCell align="center">R$ {formatarPreco(item.preco)}</TableCell>
                      <TableCell align="center">
                        R$ {formatarPreco((item.preco || 0) * (item.quantidade != null ? item.quantidade : 1))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Nome do Cliente (opcional)"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Ex: Maria Silva"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: 2 }}>
                  Valor Total: R$ {formatarPreco(totalValue)}
                </Typography>
                <Typography sx={{ fontSize: "1rem", color: COLORS.textMuted }}>
                  Confirme os detalhes antes de finalizar a venda.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}>
          <Button
            onClick={handleCloseSellModal}
            sx={{
              backgroundColor: COLORS.primaryPink,
              color: COLORS.textSecondary,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: SHADOWS.button,
              "&:hover": {
                backgroundColor: COLORS.actionPinkHover,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>

          <Button
            onClick={handleFinalizarVenda}
            disabled={loading}
            sx={{
              backgroundColor: "#4caf50",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.4)",
              "&:hover": {
                backgroundColor: "#45a049",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(76, 175, 80, 0.6)",
              },
              "&.Mui-disabled": { bgcolor: COLORS.backgroundPaper, color: COLORS.textMuted },
              transition: "all 0.3s ease",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDialog
        open={deleteModal.open}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Remoção"
        message={`Tem certeza que deseja remover "${deleteModal.item?.descricao}" do carrinho?`}
        subMessage="O item será devolvido ao estoque."
        confirmText="Remover"
        confirmColor="danger"
        content={deleteModalContent}
      />

      {/* Snackbar de notificações */}
      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
}
