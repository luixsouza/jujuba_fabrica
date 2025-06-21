"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarMonthIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import {
  adicionarAoCarrinho,
  removerDoCarrinho,
  listarCarrinho,
  limparCarrinho
} from "../../api/carrinho";
import { finalizarVendaSimples } from "../../api/vendas"

export default function CarrinhoPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchOptions, setSearchOptions] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Carregar itens do carrinho ao iniciar
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true)
        setError(null); // Limpa erros anteriores
        const response = await listarCarrinho() // Usando listarCarrinho
        if (response.sucesso && response.carrinho) {
          setCartItems(response.carrinho.itens)
          setTotalValue(response.carrinho.valorTotal) // Usando valorTotal retornado pela API

          // Extrair opções de pesquisa dos itens do carrinho
          const options = response.carrinho.itens.map((item) => item.produto.descricao) // Acessando a descrição do produto dentro do item
          setSearchOptions([...new Set(options)])
        } else {
          console.error("Erro ao carregar itens do carrinho:", response.mensagem)
          setError("Não foi possível carregar os itens do carrinho: " + response.mensagem)
          setCartItems([]); // Garante que a lista esteja vazia em caso de erro
          setTotalValue(0);
        }
      } catch (error) {
        console.error("Erro ao carregar itens do carrinho:", error)
        setError("Não foi possível carregar os itens do carrinho. Verifique a conexão com o servidor.")
        setCartItems([]);
        setTotalValue(0);
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const handleOpenSellModal = () => {
    setOpenSellModal(true)
  }

  const handleCloseSellModal = () => {
    setOpenSellModal(false)
  }

  const handleVenderParaFornecedor = () => {
    router.push("/vendas/vender_fornecedor") // Redireciona para a página de venda para fornecedor
  }

  const handleConfirmDeleteItem = (id) => {
    // Encontrar o item a ser removido para mostrar no diálogo de confirmação
    const item = cartItems.find((item) => item.produto.id === id) // Acessando o ID do produto dentro do item
    setItemToDelete(item)
    setOpenDeleteConfirmation(true)
  }

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        setLoading(true)
        setError(null); // Limpa erros anteriores
        const result = await removerDoCarrinho(itemToDelete.produto.id) // Usando removerDoCarrinho e ID do produto

        if (result.sucesso && result.carrinho) {
          setCartItems(result.carrinho.itens)
          setTotalValue(result.carrinho.valorTotal)
          setSnackbar({
            open: true,
            message: `"${itemToDelete.produto.descricao}" removido do carrinho!`,
            severity: "success",
          });
        } else {
          console.error("Erro ao remover item do carrinho:", result.mensagem)
          setError("Não foi possível remover o item do carrinho: " + result.mensagem)
          setSnackbar({
            open: true,
            message: `Erro ao remover item: ${result.mensagem}`,
            severity: "error",
          });
        }

        // Se o item sendo removido também é o item selecionado na modal de visualização, fechar a modal
        if (selectedItem && selectedItem.produto.id === itemToDelete.produto.id) { // Acessando ID do produto
          setOpenViewModal(false)
        }
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error)
        setError("Não foi possível remover o item do carrinho. Verifique a conexão com o servidor.")
        setSnackbar({
          open: true,
          message: "Erro ao remover item. Verifique a conexão com o servidor.",
          severity: "error",
        });
      } finally {
        setLoading(false)
      }
    }
    setOpenDeleteConfirmation(false)
    setItemToDelete(null)
  }

  const handleCancelDelete = () => {
    setOpenDeleteConfirmation(false)
    setItemToDelete(null)
  }

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setOpenViewModal(true)
  }

  const handleCloseViewModal = () => {
    setOpenViewModal(false)
  }

  const handleFinalizarVenda = async () => {
    try {
      setLoading(true)
      setError(null); // Limpa erros anteriores

      // Chama a função do backend para finalizar a venda simples
      const result = await finalizarVendaSimples();

      if (result.sucesso) {
        // Limpar o carrinho no frontend após a venda bem-sucedida
        setCartItems([])
        setTotalValue(0)

        // Fechar o modal de venda
        setOpenSellModal(false)

        setSnackbar({
          open: true,
          message: "Venda finalizada com sucesso!",
          severity: "success",
        });

        // Redirecionar para uma página de confirmação ou para o histórico de vendas
        router.push("/vendas"); // Redireciona para a página de histórico de vendas
      } else {
        console.error("Erro ao finalizar venda:", result.mensagem)
        setError("Não foi possível finalizar a venda: " + result.mensagem)
        setSnackbar({
          open: true,
          message: `Erro ao finalizar venda: ${result.mensagem}`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao finalizar venda:", error)
      setError("Não foi possível finalizar a venda. Verifique a conexão com o servidor.")
      setSnackbar({
        open: true,
        message: "Erro ao finalizar venda. Verifique a conexão com o servidor.",
        severity: "error",
      });
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event, newValue) => {
    setSearch(newValue || "")
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtra os itens do carrinho para exibição na tabela
  const filteredCartItems = cartItems.filter(item =>
    item.produto.descricao.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}> {/* Cor de fundo */}
      {/* Importando o componente Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, sm: "290px" }, // Ajuste para a sidebar
          maxHeight: "1000px",
          overflow: "auto",
          backgroundColor: "#9AE4FF", // Cor de fundo
          paddingTop: "3rem",
          paddingX: { xs: "1rem", sm: "2rem" },
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header - Ajustado para o padrão de Fornecedores */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "80px", // Espaçamento abaixo do título
          }}
        >
          <Typography
            variant="h4" // Tamanho do título
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontWeight: "bold", // Negrito
              fontSize: "50px", // Tamanho da fonte
              color: "#000000", // Cor do texto
            }}
          >
            Carrinho
          </Typography>
        </Box>

        {/* Search Bar - Estilo da VendasPage/FornecedoresPage */}
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
            onInputChange={(event, newValue) => {
              setSearch(newValue || "")
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pesquisar produto no carrinho" // Placeholder mais específico
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
                    alignItems: "center",
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
                    padding: "14px 20px",
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

        {/* Cart Section - Ajustado para o padrão de Fornecedores */}
        <Card
          sx={{
            padding: "20px",
            bgcolor: "white",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "25px",
            backgroundColor: "#F5F5F5",
            width: "100%",
            margin: "0 auto", // Centraliza o card
            border: "2px solid #B0B0B0", // Borda do card
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#333",
                fontSize: "2rem",
              }}
            >
              Itens no carrinho
            </Typography>

            {/* Loading indicator */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress sx={{ color: "#ffccd5" }} />
              </Box>
            )}

            {/* Error message */}
            {error && (
              <Box sx={{ bgcolor: "#ffebee", p: 2, borderRadius: 2, mb: 3 }}>
                <Typography color="error">{error}</Typography>
              </Box>
            )}

            {/* Cart Items Table */}
            {!loading && !error && (
              <Table sx={{ mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "18px",
                        textAlign: "center",
                        backgroundColor: "#FADADD", // Cor de fundo rosa
                        borderRight: "2px solid #F5F5F5", // Linha branca entre colunas
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
                      }}
                    >
                      Estado de conservação
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "18px",
                        textAlign: "center",
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
                        textAlign: "center",
                        backgroundColor: "#FADADD",
                        borderRight: "2px solid #F5F5F5",
                      }}
                    >
                      Lote
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "18px",
                        textAlign: "center",
                        backgroundColor: "#FADADD",
                      }}
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCartItems.length > 0 ? (
                    filteredCartItems.map((item, index) => (
                      <TableRow
                        key={item.produto.id} // Usando item.produto.id como chave
                        sx={{
                          bgcolor: "#f9f9f9",
                          borderBottom: index < filteredCartItems.length - 1 ? "1px solid #e0e0e0" : "none",
                        }}
                      >
                        <TableCell
                          sx={{
                            fontSize: "0.9rem",
                            color: "#333",
                            p: 1,
                            borderBottom: "none",
                          }}
                        >
                          {item.produto.descricao}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "0.9rem",
                            color: "#333",
                            p: 1,
                            textAlign: "center",
                            borderBottom: "none",
                          }}
                        >
                          {item.produto.estadoConservacao}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "0.9rem",
                            color: "#333",
                            p: 1,
                            textAlign: "center",
                            borderBottom: "none",
                          }}
                        >
                          R$ {item.produto.preco.toFixed(2).replace(".", ",")}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "0.9rem",
                            color: "#333",
                            p: 1,
                            textAlign: "center",
                            borderBottom: "none",
                          }}
                        >
                          {item.produto.lote || "-"}
                        </TableCell>
                        <TableCell
                          sx={{
                            p: 1,
                            textAlign: "center",
                            borderBottom: "none",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <IconButton size="small" sx={{ p: 0.5 }} onClick={() => handleViewItem(item)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ p: 0.5 }} onClick={() => handleConfirmDeleteItem(item.produto.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                        Nenhum item no carrinho
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            {/* Total Value */}
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
                <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#333" }}>
                  Valor Total: R$ {totalValue.toFixed(2).replace(".", ",")}
                </Typography>
              </Box>
            )}

            {/* Action Buttons - Aumentados */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  fontSize: "1rem",
                  minWidth: "180px",
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
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  fontSize: "1rem",
                  minWidth: "140px",
                  "&.Mui-disabled": {
                    bgcolor: "#f5f5f5",
                    color: "#999",
                  },
                }}
              >
                Vender
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Modal de Venda */}
      <Dialog
        open={openSellModal}
        onClose={handleCloseSellModal}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            bgcolor: "white", // Alterado para branco
            maxWidth: "350px",
            width: "100%",
            m: 0,
            p: 0,
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseSellModal}
              aria-label="close"
              sx={{ p: 0.5, mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.2rem",
                color: "#333",
                flex: 1,
                textAlign: "center",
                mr: 4,
              }}
            >
              Vender
            </Typography>
          </Box>

          {/* Tabela de Pagamento */}
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#ffc1cc",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Forma de pagamento
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#ffc1cc",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Total da compra
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Pix
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  R$ {totalValue.toFixed(2).replace(".", ",")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Botões de Confirmação */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleFinalizarVenda}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 10,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                fontSize: "1rem",
                width: "45%",
              }}
            >
              Sim
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseSellModal}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 10,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                fontSize: "1rem",
                width: "45%",
              }}
            >
              Não
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização do Produto */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#ffccd5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                Detalhes do Produto
              </Typography>
              <IconButton onClick={handleCloseViewModal} size="large" sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Imagem do Produto */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 250,
                      bgcolor: "#f5f5f5",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Imagem do Produto
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={selectedItem.produto.estadoConservacao} // Acessando estadoConservacao do produto
                      color="success"
                      sx={{ fontWeight: 600, fontSize: "1rem", py: 2.5, px: 1 }}
                    />
                  </Box>
                </Grid>

                {/* Informações do Produto */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#333" }}>
                    {selectedItem.produto.descricao}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: "#00509E", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00509E" }}>
                      R$ {selectedItem.produto.preco.toFixed(2).replace(".", ",")}
                    </Typography>
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Código:</strong> {selectedItem.produto.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Lote:</strong> {selectedItem.produto.lote || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CategoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Categoria:</strong> {selectedItem.produto.categoria || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    {selectedItem.produto.dataEntrada && (
                      <Grid item xs={6}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <CalendarMonthIcon sx={{ color: "#666", mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Data de Entrada:</strong> {selectedItem.produto.dataEntrada}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Detalhes Adicionais
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Marca:</strong> {selectedItem.produto.marca}
                      </Typography>
                    </Grid>
                    {selectedItem.produto.cor && (
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Cor:</strong> {selectedItem.produto.cor}
                        </Typography>
                      </Grid>
                    )}
                    {selectedItem.produto.fornecedor && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Fornecedor:</strong> {selectedItem.produto.fornecedor}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {selectedItem.produto.observacoes && (
                    <Box sx={{ mt: 3, bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Observações
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedItem.produto.observacoes}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Button
                variant="outlined"
                onClick={handleCloseViewModal}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  borderColor: "#ccc",
                  color: "#666",
                  "&:hover": {
                    borderColor: "#999",
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                Fechar
              </Button>
              <Button
                variant="contained"
                onClick={() => handleConfirmDeleteItem(selectedItem.produto.id)} // Acessando ID do produto
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: "#ffccd5",
                  color: "#333",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#ffb6c1",
                  },
                }}
              >
                Remover do Carrinho
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Confirmation Dialog for Deleting Items */}
      <Dialog
        open={openDeleteConfirmation}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#ffccd5",
            display: "flex",
            alignItems: "center",
            p: 2,
          }}
        >
          <WarningIcon sx={{ mr: 1, color: "#d32f2f" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            Confirmar Remoção
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <DialogContentText>
            {itemToDelete ? (
              <>
                Tem certeza que deseja remover <strong>{itemToDelete.produto.descricao}</strong> do carrinho?
              </>
            ) : (
              "Tem certeza que deseja remover este item do carrinho?"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "#f8f9fa" }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              color: "#666",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteItem}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              bgcolor: "#ffccd5",
              color: "#333",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#ffb6c1",
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
