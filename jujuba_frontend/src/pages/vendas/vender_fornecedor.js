"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Material-UI
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Grid,
  Divider,
  DialogContentText,
  Snackbar,
  Alert,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// Ícones
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  CreditCard as CreditCardIcon,
  Key as KeyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

// Componentes e APIs locais
import Sidebar from "../../components/sidebar";
import { listarCarrinho } from "../api/carrinho";
import { finalizarVendaFornecedora } from "../api/vendas";
import { listarProdutos, buscarProdutoPorId } from "../api/produtos";

export default function FornecedoresPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [openFinalizarModal, setOpenFinalizarModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);
  const [selectedFornecedorForSale, setSelectedFornecedorForSale] =
    useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [fornecedorToDelete, setFornecedorToDelete] = useState(null);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carrinhoItems, setCarrinhoItems] = useState([]);
  const [totalVenda, setTotalVenda] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [orderRef, setOrderRef] = useState(null);
  const [confirmedReview, setConfirmedReview] = useState(false);
  const [paymentDinheiro, setPaymentDinheiro] = useState(0);
  const [paymentCartao, setPaymentCartao] = useState(0);
  const [paymentPix, setPaymentPix] = useState(0);

  const handleDownloadContrato = () => {
    if (selectedFornecedor?.contratoUrl) {
      window.open(selectedFornecedor.contratoUrl, "_blank");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Função para formatar valor monetário
  const formatarValor = (valor) => {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return "0,00";
    }
    return Number(valor).toFixed(2).replace(".", ",");
  };

  // Função para obter valor seguro
  const obterValorSeguro = (valor) => {
    return valor !== null && valor !== undefined && !isNaN(valor)
      ? Number(valor)
      : 0;
  };

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/fornecedoras", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Falha ao buscar fornecedores");
        }
        const data = await response.json();
        setFornecedores(data);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFornecedores();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await listarCarrinho();
        if (response.sucesso && response.carrinho) {
          const items = response.carrinho.itens || [];
          setCarrinhoItems(items);
          setTotalVenda(Number(response.carrinho.valorTotal) || 0);
          console.log("Carrinho carregado via API:", items);
        } else {
          console.error("Erro ao carregar carrinho:", response.mensagem);
          setCarrinhoItems([]);
          setTotalVenda(0);
        }
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        setCarrinhoItems([]);
        setTotalVenda(0);
      }
    };

    fetchCartItems();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  // Apenas atualiza os estados de pesquisa; a filtragem é feita localmente via fornecedoresFiltrados
  const handleSearch = (event, newValue) => {
    setSearch(newValue || "");
    setSearchTerm(newValue || "");
  };

  const handleViewFornecedor = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/fornecedoras/${id}`,
        { credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Falha ao buscar detalhes do fornecedor");
      }

      const fornecedor = await response.json();
      setSelectedFornecedor(fornecedor);
      setOpenViewModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes do fornecedor:", error);
      setError(error.message);
    }
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleDeleteFornecedor = (id) => {
    const fornecedor = fornecedores.find((f) => f.id === id);
    setFornecedorToDelete(fornecedor);
    setOpenDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (fornecedorToDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/fornecedoras/${fornecedorToDelete.id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Falha ao excluir fornecedor");
        }

        setFornecedores(
          fornecedores.filter((f) => f.id !== fornecedorToDelete.id)
        );
        setOpenDeleteConfirmation(false);
        setFornecedorToDelete(null);
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        setError(error.message);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteConfirmation(false);
    setFornecedorToDelete(null);
  };

  const handleFinalizarCompra = () => {
    if (!selectedFornecedorForSale) {
      alert("Por favor, selecione um fornecedor antes de finalizar a compra.");
      return;
    }
    // generate order reference and reset confirmation state
    setOrderRef(`VND-${Date.now()}`);
    setConfirmedReview(false);
    setOpenFinalizarModal(true);
  };

  const handleCloseFinalizarModal = () => {
    setOpenFinalizarModal(false);
  };

  const handleConfirmarCompra = async () => {
    if (!selectedFornecedorForSale || carrinhoItems.length === 0) return;

    try {
      setIsLoading(true);

      // Verifica estoque atual para cada item do carrinho
      for (const item of carrinhoItems) {
        try {
          const resp = await buscarProdutoPorId(item.id);
          if (resp?.sucesso && resp.produto) {
            const estoqueAtual = Number(resp.produto.quantidade) || 0;
            const qtdNoCarrinho = Number(item.quantidade) || 1;
            if (estoqueAtual < qtdNoCarrinho) {
              setError(
                `Não é possível finalizar: "${item.descricao}" possui estoque insuficiente (${estoqueAtual}).`
              );
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("Falha ao verificar estoque do produto", item.id, e);
        }
      }

      // Before finalizing, check if supplier credit is enough or payments were provided
      const deficit = calcularDeficit();
      let resultado = null;
      if (deficit > 0) {
        const totalPago = pagamentoTotal();
        if (totalPago < deficit) {
          setError(
            "Complete o valor do pagamento para cobrir o déficit do fornecedor."
          );
          setIsLoading(false);
          return;
        }

        // send payments breakdown to backend
        resultado = await finalizarVendaFornecedora(
          selectedFornecedorForSale.id.toString(),
          { dinheiro: paymentDinheiro, cartao: paymentCartao, pix: paymentPix }
        );

        if (!resultado.sucesso) {
          throw new Error(
            resultado.mensagem || "Falha ao finalizar venda com pagamento"
          );
        }
      } else {
        resultado = await finalizarVendaFornecedora(
          selectedFornecedorForSale.id.toString(),
          { dinheiro: 0, cartao: 0, pix: 0 }
        );

        if (!resultado.sucesso) {
          throw new Error(resultado.mensagem || "Falha ao finalizar venda");
        }
      }

      if (!resultado || !resultado.sucesso) {
        throw new Error(resultado?.mensagem || "Falha ao finalizar venda");
      }

      // Limpar carrinho apenas após sucesso no backend
      localStorage.removeItem("carrinho");
      setCarrinhoItems([]);

      setOpenFinalizarModal(false);
      setOpenSuccessMessage(true);
      // atualizar estoque no frontend e notificar páginas
      try {
        await listarProdutos();
      } catch (e) {
        console.warn(
          "Falha ao atualizar produtos após venda para fornecedor",
          e
        );
      }
      try {
        window.dispatchEvent(new Event("estoque-atualizado"));
      } catch (e) {
        /* noop */
      }
      setTimeout(() => {
        router.push("/vendas");
      }, 2000);
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      setError(
        error.message ||
          "Falha ao finalizar a venda. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
      // reset payment inputs
      setPaymentDinheiro(0);
      setPaymentCartao(0);
      setPaymentPix(0);
    }
  };

  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false);
  };

  const calcularCreditoFinal = () => {
    if (!selectedFornecedorForSale) return 0;
    const credito = obterValorSeguro(
      selectedFornecedorForSale.creditoLoja ??
        selectedFornecedorForSale.valorCredito
    );
    // Include any payments entered to top up the supplier's credit before deducting the sale
    const totalPago = pagamentoTotal();
    return credito + totalPago - totalVenda;
  };

  const calcularDeficit = () => {
    const credito = obterValorSeguro(
      selectedFornecedorForSale?.creditoLoja ??
        selectedFornecedorForSale?.valorCredito
    );
    const deficit = Number(totalVenda) - credito;
    return deficit > 0 ? deficit : 0;
  };

  const pagamentoTotal = () => {
    return (
      (Number(paymentDinheiro) || 0) +
      (Number(paymentCartao) || 0) +
      (Number(paymentPix) || 0)
    );
  };

  const handleSelectFornecedorForSale = async (fornecedorOrId) => {
    try {
      const id =
        typeof fornecedorOrId === "object" ? fornecedorOrId.id : fornecedorOrId;
      if (!id) return;
      // fetch detailed fornecedor data (includes creditoLoja)
      const resp = await fetch(`http://localhost:8080/api/fornecedoras/${id}`, {
        credentials: "include",
      });
      if (!resp.ok) throw new Error("Falha ao buscar dados da fornecedora");
      const data = await resp.json();
      setSelectedFornecedorForSale(data);
    } catch (e) {
      console.error("Erro ao selecionar fornecedora:", e);
      // fallback: if an object was passed, use it
      if (typeof fornecedorOrId === "object")
        setSelectedFornecedorForSale(fornecedorOrId);
    }
  };

  const fornecedoresFiltrados =
    searchTerm && typeof searchTerm === "string" && searchTerm.trim() !== ""
      ? fornecedores.filter((f) => {
          if (!f) return false;
          const s = searchTerm.toLowerCase();
          const id = f.id ? String(f.id).toLowerCase() : "";
          const nome = f.nome ? f.nome.toLowerCase() : "";
          const contato = f.contato ? f.contato.toLowerCase() : "";
          const endereco = f.endereco ? f.endereco.toLowerCase() : "";
          const chavePix = f.chavePix ? f.chavePix.toLowerCase() : "";
          const credito =
            f.creditoLoja ?? f.valorCredito
              ? String(f.creditoLoja ?? f.valorCredito).toLowerCase()
              : "";

          return (
            id.includes(s) ||
            nome.includes(s) ||
            contato.includes(s) ||
            endereco.includes(s) ||
            chavePix.includes(s) ||
            credito.includes(s)
          );
        })
      : fornecedores;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#a8e1ff" }}>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <Box
        sx={{
          ml: "244px",
          flex: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton onClick={handleGoBack} sx={{ color: "black", mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              flex: 1,
              color: "#333",
            }}
          >
            FORNECEDORES
          </Typography>
          <Box sx={{ width: 48 }} />
        </Box>

        {selectedFornecedorForSale && (
          <Card
            sx={{
              mb: 3,
              maxWidth: "1200px",
              mx: "auto",
              backgroundColor: "#F5F5F5",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#9ae4ffff", width: 44, height: 44 }}>
                    <PersonIcon sx={{ color: "#fff" }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: "bold", color: "#333" }}>
                      {selectedFornecedorForSale.nome}
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", color: "#555" }}>
                      Crédito disponível: R${" "}
                      {formatarValor(
                        selectedFornecedorForSale.creditoLoja ??
                          selectedFornecedorForSale.valorCredito ??
                          0
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedFornecedorForSale(null)}
                  sx={{ color: "#666", borderColor: "#666" }}
                >
                  Desselecionar
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Autocomplete
            freeSolo
            options={[
              ...new Set(
                fornecedores
                  .flatMap((f) => [
                    f?.nome || "",
                    f?.contato || "",
                    f?.endereco || "",
                    f?.chavePix || "",
                    f?.id ? String(f.id) : "",
                  ])
                  .filter(Boolean)
              ),
            ]}
            value={search}
            onChange={handleSearch}
            onInputChange={(event, newValue) => {
              setSearch(newValue || "");
              setSearchTerm(newValue || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pesquisar fornecedores"
                variant="outlined"
                size="medium"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#000000", fontSize: 24 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    height: "60px",
                    display: "flex",
                    alignItems: "center", // garante centralização vertical
                    pl: 1,
                  },
                }}
                sx={{
                  width: "100%",
                  maxWidth: "1800px",
                  backgroundColor: "#F5F5F5",
                  marginBottom: "50px",
                  marginTop: "50px",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    borderRadius: "10px",
                    "& fieldset": {
                      borderColor: "#CCCCCC",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00509E",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00509E",
                    },
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                  },
                  "& .MuiInputBase-input": {
                    padding: "14px 20px", // altura e alinhamento horizontal
                    fontSize: "18px",
                  },
                }}
              />
            )}
            sx={{
              width: "100%",
              maxWidth: "1800px",
            }}
          />
        </Box>

        <TableContainer
          sx={{
            padding: "20px",
            bgcolor: "white",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "25px",
            backgroundColor: "#F5F5F5",
            width: "100%",
            margin: "0 auto",
            border: "'2px solid #B0B0B0'",
          }}
        >
          <TableContainer
            sx={{
              maxHeight: "600px",
              borderRadius: "10px",
              overflow: "auto",
              backgroundColor: "#F5F5F5",
              width: "100%",
            }}
          ></TableContainer>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
                color: "error.main",
              }}
            >
              <Typography>{error}</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow
                  align="center"
                  sx={{
                    fontSize: "18px",
                    textAlign: "center",
                    backgroundColor: "#FADADD",
                    borderRight: "2px solid #F5F5F5", // LINHA BRANCA ENTRE COLUNAS
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5", // LINHA BRANCA ENTRE COLUNAS
                    }}
                  >
                    Fornecedores
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5", // LINHA BRANCA ENTRE COLUNAS
                    }}
                  >
                    Contato
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5", // LINHA BRANCA ENTRE COLUNAS
                    }}
                  >
                    Valor de Crédito da loja
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5", // LINHA BRANCA ENTRE COLUNAS
                    }}
                  >
                    Chave Pix
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5", // LINHA BRANCA ENTRE COLUNAS
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fornecedoresFiltrados.length > 0 ? (
                  fornecedoresFiltrados.map((fornecedor) => (
                    <TableRow
                      key={fornecedor.id}
                      onClick={() => handleSelectFornecedorForSale(fornecedor)}
                      sx={{
                        bgcolor:
                          selectedFornecedorForSale?.id === fornecedor.id
                            ? "#e8f5e8"
                            : "#F5F5F5",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor:
                            selectedFornecedorForSale?.id === fornecedor.id
                              ? "#D4EDDA"
                              : "#E0E0E0",
                        },
                        border:
                          selectedFornecedorForSale?.id === fornecedor.id
                            ? "2px solid #4caf50"
                            : "none",
                      }}
                    >
                      <TableCell
                        sx={{
                          fontSize: "0.95rem",
                          color:
                            selectedFornecedorForSale?.id === fornecedor.id
                              ? "#2e7d32"
                              : "#555",
                          fontWeight:
                            selectedFornecedorForSale?.id === fornecedor.id
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {fornecedor.nome || "N/A"}
                        {selectedFornecedorForSale?.id === fornecedor.id && (
                          <Box
                            component="span"
                            sx={{ ml: 1, color: "#4caf50" }}
                          >
                            ✓
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.95rem", color: "#555" }}>
                        {fornecedor.contato || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.95rem",
                          textAlign: "center",
                          color: "#555",
                        }}
                      >
                        R${" "}
                        {formatarValor(
                          fornecedor.creditoLoja ?? fornecedor.valorCredito ?? 0
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.95rem",
                          textAlign: "center",
                          color: "#555",
                        }}
                      >
                        {fornecedor.chavePix || "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewFornecedor(fornecedor.id);
                            }}
                            sx={{ color: "#00509E" }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                      Nenhum fornecedor encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleFinalizarCompra}
            disabled={!selectedFornecedorForSale}
            sx={{
              bgcolor: selectedFornecedorForSale ? "#ffccd5" : "#e0e0e0",
              color: selectedFornecedorForSale ? "black" : "#999",
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 3,
              "&:hover": {
                bgcolor: selectedFornecedorForSale ? "#ffb3c1" : "#e0e0e0",
              },
            }}
          >
            {selectedFornecedorForSale
              ? "Finalizar compra"
              : "Selecione um fornecedor"}
          </Button>
        </Box>

        <Box
          sx={{ textAlign: "center", mb: 2, fontSize: "0.8rem", color: "#666" }}
        >
          <Typography>
            Fornecedor selecionado: {selectedFornecedorForSale ? "✓" : "✗"} |
            Itens no carrinho: {carrinhoItems.length}
          </Typography>
        </Box>
      </Box>

      {/* Modal de Visualização */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            backgroundColor: "#FADADD", // fundo rosa do modal
            p: 3,
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center", // centraliza o título
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem" },
            color: "#333",
            position: "relative",
            pb: 2,
          }}
        >
          Visualizar Fornecedor
          <IconButton
            onClick={handleCloseViewModal}
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
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: "#FADADD", // altere para fundo rosa
            borderRadius: 2,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Chip
              label={`ID: ${selectedFornecedor?.id || "Carregando..."}`}
              sx={{
                backgroundColor: "#fff", // fundo branco no chip
                color: "#333",
                fontWeight: "bold",
              }}
            />
          </Box>

          <Grid container spacing={3}>
            {/* Nome */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Nome
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.nome || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{
                  backgroundColor: "#fff", // fundo branco nos campos
                }}
              />
            </Grid>

            {/* Data de Nascimento */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Data de Nascimento
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.dataNascimento || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>

            {/* Contato */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Contato
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.contato || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>

            {/* Endereço */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Endereço
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.endereco || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>

            {/* Chave Pix */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Chave Pix
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.chavePix || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>

            {/* Crédito na Loja */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Crédito na Loja
              </Typography>
              <TextField
                fullWidth
                value={
                  selectedFornecedor?.creditoLoja
                    ? `R$ ${parseFloat(selectedFornecedor.creditoLoja)
                        .toFixed(2)
                        .replace(".", ",")}`
                    : "R$ 0,00"
                }
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: "#fff" }}
              />
            </Grid>

            {/* Contrato */}
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Contrato
              </Typography>
              {selectedFornecedor?.contratoUrl ? (
                <Button
                  onClick={handleDownloadContrato}
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                >
                  Visualizar Contrato
                </Button>
              ) : (
                <Typography>Contrato não disponível</Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openFinalizarModal}
        keepMounted
        onClose={handleCloseFinalizarModal}
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
            onClick={handleCloseFinalizarModal}
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
            <Tab label="Resumo e Total" />
            <Tab label="Fornecedor" />
          </Tabs>
          {/* Tab 0: Resumo e Total (enhanced) */}
          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2">
                    Ref: {orderRef || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Data: {new Date().toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="subtitle2">
                    Itens: {carrinhoItems.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qtd total:{" "}
                    {carrinhoItems.reduce(
                      (s, it) => s + (Number(it.quantidade) || 1),
                      0
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                {carrinhoItems.map((item, index) => {
                  const quantidade = Number(item.quantidade || 1);
                  const precoUnit = Number(item.preco || 0);
                  const subtotal = quantidade * precoUnit;
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        px: 1,
                        bgcolor: index % 2 === 0 ? "#fff" : "#f7f7f7",
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {item.descricao}
                        </Typography>
                      </Box>
                      <Box sx={{ width: 160, textAlign: "right" }}>
                        <Typography variant="body2">
                          {quantidade} × R$ {formatarValor(precoUnit)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          R$ {formatarValor(subtotal)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ borderTop: "1px solid #ddd", pt: 2, mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">
                    R$ {formatarValor(totalVenda)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    R$ {formatarValor(totalVenda)}
                  </Typography>
                </Box>

                {selectedFornecedorForSale && (
                  <Box
                    sx={{ mt: 1, bgcolor: "#f3f6f4", p: 2, borderRadius: 1 }}
                  >
                    <Typography variant="body2">
                      <strong>Fornecedor:</strong>{" "}
                      {selectedFornecedorForSale.nome}
                    </Typography>
                    <Typography variant="body2">
                      Crédito antes: R${" "}
                      {formatarValor(
                        selectedFornecedorForSale.creditoLoja ??
                          selectedFornecedorForSale.valorCredito ??
                          0
                      )}
                    </Typography>
                    <Typography variant="body2">
                      Crédito após venda: R${" "}
                      {formatarValor(calcularCreditoFinal())}
                    </Typography>
                    {/* If there's a deficit, present payment options */}
                    {calcularDeficit() > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "#b8e4f4ff",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#00509E" }}
                        >
                          Crédito insuficiente — completar com pagamento
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#00509E" }}>
                          Déficit: R$ {formatarValor(calcularDeficit())}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            label="Dinheiro"
                            type="number"
                            value={paymentDinheiro}
                            onChange={(e) => setPaymentDinheiro(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  R$
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            label="Cartão"
                            type="number"
                            value={paymentCartao}
                            onChange={(e) => setPaymentCartao(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  R$
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            label="Pix"
                            type="number"
                            value={paymentPix}
                            onChange={(e) => setPaymentPix(e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  R$
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#023e58" }}>
                            Total pagamento:
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#023e58" }}>
                            R$ {formatarValor(pagamentoTotal())}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                          {pagamentoTotal() < calcularDeficit() ? (
                            <Typography color="error">
                              A soma dos pagamentos é menor que o déficit.
                              Complete os valores.
                            </Typography>
                          ) : (
                            <Typography sx={{ color: "#0b6b9a" }}>
                              Pagamento suficiente para cobrir o déficit.
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Confirme os dados antes de finalizar a compra.
              </Typography>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confirmedReview}
                      onChange={(e) => setConfirmedReview(e.target.checked)}
                    />
                  }
                  label="Li e conferi os itens, valores e fornecedor selecionado"
                />
              </Box>
            </Box>
          )}

          {/* Tab 1: Fornecedor */}
          {tabValue === 1 && selectedFornecedorForSale && (
            <Box sx={{ mb: 3, p: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: "#2e7d32" }}
              >
                Fornecedor Selecionado
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Nome:</strong> {selectedFornecedorForSale.nome}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Contato:</strong>{" "}
                {selectedFornecedorForSale.contato || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Crédito disponível:</strong> R${" "}
                {formatarValor(
                  selectedFornecedorForSale.creditoLoja ??
                    selectedFornecedorForSale.valorCredito ??
                    0
                )}
              </Typography>
              <Typography variant="body1">
                <strong>Chave Pix:</strong>{" "}
                {selectedFornecedorForSale.chavePix || "N/A"}
              </Typography>
            </Box>
          )}
        </DialogContent>

        {/* Ações */}
        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}>
          <Button
            onClick={handleCloseFinalizarModal}
            sx={{
              backgroundColor: "#FADADD",
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "140px",
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
            Cancelar
          </Button>
          <Button
            onClick={() => {
              // build a printable receipt with a table
              const rowsHtml = carrinhoItems
                .map((it) => {
                  const q = Number(it.quantidade) || 1;
                  const pu = Number(it.preco) || 0;
                  return `<tr><td style="padding:6px;border:1px solid #ddd">${
                    it.descricao
                  }</td><td style="padding:6px;border:1px solid #ddd;text-align:center">${q}</td><td style="padding:6px;border:1px solid #ddd;text-align:right">R$ ${formatarValor(
                    pu
                  )}</td><td style="padding:6px;border:1px solid #ddd;text-align:right">R$ ${formatarValor(
                    q * pu
                  )}</td></tr>`;
                })
                .join("");

              const receiptHtml = `
                <html>
                  <head>
                    <title>Recibo ${orderRef || ""}</title>
                    <meta charset="utf-8" />
                  </head>
                  <body style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;">
                    <h2>Recibo - ${orderRef || ""}</h2>
                    <p>Data: ${new Date().toLocaleString()}</p>
                    <table style="border-collapse:collapse;width:100%;margin-top:12px">
                      <thead>
                        <tr>
                          <th style="padding:8px;border:1px solid #ddd;text-align:left">Descrição</th>
                          <th style="padding:8px;border:1px solid #ddd;text-align:center">Qtde</th>
                          <th style="padding:8px;border:1px solid #ddd;text-align:right">Valor unit.</th>
                          <th style="padding:8px;border:1px solid #ddd;text-align:right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${rowsHtml}
                      </tbody>
                    </table>
                    <div style="margin-top:12px;text-align:right">
                      <div style="font-weight:bold">Total: R$ ${formatarValor(
                        totalVenda
                      )}</div>
                    </div>
                    <div style="margin-top:12px">
                      <div><strong>Fornecedor:</strong> ${
                        selectedFornecedorForSale?.nome || "-"
                      }</div>
                      <div>Crédito antes: R$ ${formatarValor(
                        selectedFornecedorForSale?.creditoLoja ??
                          selectedFornecedorForSale?.valorCredito ??
                          0
                      )}</div>
                      <div>Crédito após venda: R$ ${formatarValor(
                        calcularCreditoFinal()
                      )}</div>
                    </div>
                  </body>
                </html>
              `;

              const w = window.open("", "_blank");
              if (!w)
                return alert("Não foi possível abrir janela de impressão.");
              w.document.open();
              w.document.write(receiptHtml);
              w.document.close();
              w.focus();
              setTimeout(() => w.print(), 300);
            }}
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "14px",
              borderRadius: "25px",
              padding: "10px 20px",
              minWidth: "120px",
              textTransform: "none",
            }}
          >
            Imprimir Recibo
          </Button>

          <Button
            onClick={handleConfirmarCompra}
            disabled={!confirmedReview || isLoading}
            sx={{
              backgroundColor:
                !confirmedReview || isLoading ? "#9e9e9e" : "#4caf50",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "140px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.4)",
              "&:hover": {
                backgroundColor:
                  !confirmedReview || isLoading ? "#9e9e9e" : "#45a049",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(76, 175, 80, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Confirmar Compra"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSuccessMessage}
        autoHideDuration={2000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="success"
          sx={{
            width: "100%",
            bgcolor: "#4caf50",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
            fontSize: "1rem",
            alignItems: "center",
          }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          Venda realizada ao fornecedor com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}
