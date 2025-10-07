"use client";

import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/navigation";

// Material-UI
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Divider,
  Chip,
  DialogContentText,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Slide,
} from "@mui/material";

// Ícones
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarMonthIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Componentes e APIs
import Sidebar from "../../components/sidebar";
import { removerDoCarrinho, listarCarrinho } from "../api/carrinho";
import { finalizarVendaSimples } from "../api/vendas";
import { listarProdutos, buscarProdutoPorId } from "../api/produtos";

// Função de formatação segura
const formatarPreco = (valor) => {
  const numero = Number(valor);
  if (isNaN(numero)) {
    return "0,00";
  }
  return numero.toFixed(2).replace(".", ",");
};
export default function CarrinhoPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openSellModal, setOpenSellModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOptions, setSearchOptions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [openProductModal, setOpenProductModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  const handleOpenProductModal = (produto) => {
    setProdutoSelecionado(produto);
    setOpenProductModal(true);
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setProdutoSelecionado(null);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listarCarrinho();
        if (response.sucesso && response.carrinho) {
          setCartItems(response.carrinho.itens || []);
          setTotalValue(Number(response.carrinho.valorTotal) || 0);

          // CORREÇÃO: Acessar a descrição diretamente do item
          const options = (response.carrinho.itens || []).map(
            (item) => item.descricao
          );
          setSearchOptions([...new Set(options)]);
        } else {
          console.error(
            "Erro ao carregar itens do carrinho:",
            response.mensagem
          );
          setError(
            "Não foi possível carregar os itens do carrinho: " +
              response.mensagem
          );
          setCartItems([]);
          setTotalValue(0);
        }
      } catch (error) {
        console.error("Erro ao carregar itens do carrinho:", error);
        setError(
          "Não foi possível carregar os itens do carrinho. Verifique a conexão com o servidor."
        );
        setCartItems([]);
        setTotalValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleOpenSellModal = () => setOpenSellModal(true);
  const handleCloseSellModal = () => setOpenSellModal(false);
  const handleVenderParaFornecedor = () =>
    router.push("/vendas/vender_fornecedor");

  const handleConfirmDeleteItem = (id) => {
    // CORREÇÃO: Acessar o ID diretamente do item
    const item = cartItems.find((item) => item.id === id);
    setItemToDelete(item);
    setOpenDeleteConfirmation(true);
  };

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        setLoading(true);
        setError(null);
        // CORREÇÃO: Enviar o ID diretamente do item a ser deletado
        const result = await removerDoCarrinho(itemToDelete.id);

        if (result.sucesso && result.carrinho) {
          setCartItems(result.carrinho.itens || []);
          setTotalValue(Number(result.carrinho.valorTotal) || 0);
          setSnackbar({
            open: true,
            message: `"${itemToDelete.descricao}" removido do carrinho!`,
            severity: "success",
          });
        } else {
          console.error("Erro ao remover item do carrinho:", result.mensagem);
          setSnackbar({
            open: true,
            message: `Erro ao remover item: ${result.mensagem}`,
            severity: "error",
          });
        }

        if (selectedItem && selectedItem.id === itemToDelete.id) {
          setOpenViewModal(false);
        }
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        setSnackbar({
          open: true,
          message: "Erro ao remover item. Verifique a conexão.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    setOpenDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => setOpenViewModal(false);

  const handleFinalizarVenda = async () => {
    try {
      setLoading(true);
      setError(null);
      // Valida estoque atual antes de finalizar: evita vender produto sem estoque
      for (const item of cartItems) {
        try {
          const resp = await buscarProdutoPorId(item.id);
          if (resp?.sucesso && resp.produto) {
            const estoqueAtual = Number(resp.produto.quantidade) || 0;
            const qtdNoCarrinho = Number(item.quantidade) || 1;
            if (estoqueAtual < qtdNoCarrinho) {
              setSnackbar({
                open: true,
                message: `Não é possível finalizar: "${item.descricao}" possui estoque insuficiente (${estoqueAtual}).`,
                severity: "error",
              });
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          // se falhar a checagem por qualquer motivo, continuar e deixar o backend validar
          console.warn("Falha ao verificar estoque do produto", item.id, e);
        }
      }

      const result = await finalizarVendaSimples();
      if (result.sucesso) {
        setCartItems([]);
        setTotalValue(0);
        setOpenSellModal(false);
        setSnackbar({
          open: true,
          message: "Venda finalizada com sucesso!",
          severity: "success",
        });
        // Recarrega o estoque no frontend (faz uma chamada ao backend) e notifica outras páginas
        try {
          await listarProdutos();
        } catch (e) {
          // Não crítico — apenas log
          console.warn("Falha ao atualizar produtos após venda:", e);
        }
        // Dispara evento global para que a página de estoque possa escutar e recarregar
        try {
          window.dispatchEvent(new Event("estoque-atualizado"));
        } catch (e) {
          console.warn(
            "Não foi possível disparar evento de estoque atualizado:",
            e
          );
        }
        router.push("/vendas/vendas");
      } else {
        console.error("Erro ao finalizar venda:", result.mensagem);
        setSnackbar({
          open: true,
          message: `Erro ao finalizar venda: ${result.mensagem}`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      setSnackbar({
        open: true,
        message: "Erro ao finalizar venda. Verifique a conexão.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event, newValue) => setSearch(newValue || "");
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // CORREÇÃO: Filtrar usando item.descricao diretamente
  const filteredCartItems = (cartItems || []).filter((item) =>
    item?.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          marginLeft: { xs: 0, sm: "290px" },
          maxHeight: "1000px",
          overflow: "auto",
          backgroundColor: "#9AE4FF",
          paddingTop: "3rem",
          paddingX: { xs: "1rem", sm: "2rem" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "80px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", fontSize: "50px", color: "#000000" }}
          >
            Carrinho
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
            width: "100%",
          }}
        >
          <Autocomplete
            freeSolo
            options={searchOptions}
            value={search}
            onChange={handleSearch}
            onInputChange={(event, newValue) => setSearch(newValue || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pesquisar produto no carrinho"
                variant="outlined"
                size="medium"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#000000" }} />
                    </InputAdornment>
                  ),
                  sx: { height: "60px" },
                }}
                sx={{
                  width: "100%",
                  maxWidth: "1800px",
                  backgroundColor: "#F5F5F5",
                  my: "50px",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                }}
              />
            )}
            sx={{ width: "100%", maxWidth: "1800px" }}
          />
        </Box>
        <Card
          sx={{
            padding: "20px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "25px",
            backgroundColor: "#F5F5F5",
            border: "2px solid #B0B0B0",
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 700, color: "#333", fontSize: "2rem" }}
            >
              Itens no carrinho
            </Typography>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress sx={{ color: "#ffccd5" }} />
              </Box>
            )}
            {error && (
              <Box sx={{ bgcolor: "#ffebee", p: 2, borderRadius: 2, mb: 3 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}
            {!loading && !error && (
              <Table sx={{ mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "18px",
                        backgroundColor: "#FADADD",
                        borderRight: "2px solid #F5F5F5",
                      }}
                    >
                      Descrição
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "18px",
                        backgroundColor: "#FADADD",
                        borderRight: "2px solid #F5F5F5",
                      }}
                    >
                      Estado de conservação
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "18px",
                        backgroundColor: "#FADADD",
                        borderRight: "2px solid #F5F5F5",
                      }}
                    >
                      Valor
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "18px",
                        backgroundColor: "#FADADD",
                        borderRight: "2px solid #F5F5F5",
                      }}
                    >
                      Lote
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "18px", backgroundColor: "#FADADD" }}
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCartItems.length > 0 ? (
                    filteredCartItems.map((item) => (
                      // CORREÇÃO: Usar item.id e acessar propriedades diretamente
                      <TableRow key={item.id}>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell align="center">
                          {item.estadoConservacao}
                        </TableCell>
                        <TableCell align="center">
                          R$ {formatarPreco(item.preco)}
                        </TableCell>
                        <TableCell align="center">{item.lote || "-"}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenProductModal(item)}
                            sx={{ color: "#00509E" }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleConfirmDeleteItem(item.id)}
                            sx={{ color: "#00509E" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        Nenhum item no carrinho
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            {!loading && !error && (
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: "#b3e5fc",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  mb: 3,
                }}
              >
                <Typography
                  sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#333" }}
                >
                  Valor Total: R$ {formatarPreco(totalValue)}
                </Typography>
              </Box>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                onClick={handleVenderParaFornecedor}
                sx={{
                  bgcolor: "#ffc1cc",
                  color: "black",
                  "&:hover": { bgcolor: "#ffb6c1" },
                  borderRadius: 10,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                }}
              >
                Vender para fornecedor
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenSellModal}
                disabled={cartItems.length === 0 || loading}
                sx={{
                  bgcolor: "#ffc1cc",
                  color: "black",
                  "&:hover": { bgcolor: "#ffb6c1" },
                  borderRadius: 10,
                  px: 5,
                  py: 1.5,
                  fontSize: "1rem",
                  "&.Mui-disabled": { bgcolor: "#f5f5f5", color: "#999" },
                }}
              >
                Vender
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Modals (com as mesmas correções) */}
      <Dialog
        open={openProductModal}
        keepMounted
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
                backgroundColor: "#9AE4FF",
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <InventoryIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
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
                color: "#333", // cor padrão quando não selecionado
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#9AE4FF", // cor azul quando ativo
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#9AE4FF", // cor da linha embaixo da aba ativa
              },
            }}
          >
            <Tab label="Informações Básicas" />
            <Tab label="Detalhes Adicionais" />
          </Tabs>

          {/* Tab 0: Informações Básicas */}
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
                      <strong>Descrição:</strong> {produtoSelecionado.descricao}
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

          {/* Tab 1: Detalhes Adicionais */}
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
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 4,
            pb: 4,
          }}
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
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteConfirmation}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "#FFE4E1",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
            overflow: "visible",
            textAlign: "center",
            p: 3,
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", fontSize: "1.5rem", color: "#000" }}
        >
          <WarningIcon sx={{ fontSize: 50, color: "orange", mb: 2 }} />
          <br />
          Confirmar Remoção
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: "1.2rem", mb: 2 }}>
            Tem certeza que deseja remover{" "}
            <strong>{itemToDelete?.descricao}</strong> do carrinho?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              backgroundColor: "#9AE4FF",
              color: "#000",
              borderRadius: "25px",
              px: 4,
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#7ed3f9" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteItem}
            sx={{
              backgroundColor: "#FF6347",
              color: "white",
              borderRadius: "25px",
              px: 4,
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#e5533d" },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSellModal}
        onClose={handleCloseSellModal}
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
        {/* Cabeçalho */}
        <DialogTitle
          sx={{
            textAlign: "center",
            pb: 2,
            pt: 4,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseSellModal}
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
              <CheckCircleIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              Finalizar Venda
            </Typography>
          </Box>
        </DialogTitle>

        {/* Conteúdo */}
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
            <Tab label="Itens da Venda" />
            <Tab label="Resumo e Total" />
          </Tabs>

          {/* Tab 0: Itens da Venda */}
          {tabValue === 0 && (
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 300,
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff", // fundo branco igual ao segundo modal
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#FADADD" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Descrição</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Quantidade
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Preço Unitário
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Valor Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:hover": { bgcolor: "#E0E0E0" } }}
                    >
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell align="center">
                        {item.quantidade != null ? item.quantidade : 1}
                      </TableCell>
                      <TableCell align="center">
                        R$ {formatarPreco(item.preco)}
                      </TableCell>
                      <TableCell align="center">
                        R${" "}
                        {formatarPreco(
                          (item.preco || 0) *
                            (item.quantidade != null ? item.quantidade : 1)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tab 1: Resumo e Total */}
          {tabValue === 1 && (
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Typography
                sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: 2 }}
              >
                Valor Total: R$ {formatarPreco(totalValue)}
              </Typography>
              <Typography sx={{ fontSize: "1rem", color: "#555" }}>
                Confirme os detalhes antes de finalizar a venda.
              </Typography>
            </Box>
          )}
        </DialogContent>

        {/* Ações */}
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 4,
            pb: 4,
          }}
        >
          <Button
            onClick={handleCloseSellModal}
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
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>

          <Button
            onClick={handleFinalizarVenda}
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
              transition: "all 0.3s ease",
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
