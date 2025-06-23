"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  TextField,
  Card,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Chip,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
  CircularProgress,
  Badge, // Importar Badge para a contagem do carrinho
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Category as CategoryIcon,
  Receipt as ReceiptIcon, // Ícone para vendas
  CalendarToday as CalendarTodayIcon, // Ícone para data
  People as PeopleIcon, // Ícone para fornecedora
  ShoppingCart as ShoppingCartIcon, // Importar ícone do carrinho
} from "@mui/icons-material"
import { listarVendasRealizadas, buscarVendaPorId } from "../api/vendas"
// Importações de API para carrinho
import { adicionarAoCarrinho, listarCarrinho } from "../api/carrinho"
import Sidebar from "../../components/sidebar"

export default function VendasPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [openProductModal, setOpenProductModal] = useState(false)
  const [vendasRealizadas, setVendasRealizadas] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [searchOptions, setSearchOptions] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0) // Contagem de itens no carrinho
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openSaleDetailsModal, setOpenSaleDetailsModal] = useState(false);
  const [saleSelected, setSaleSelected] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Buscar histórico de vendas
        const response = await listarVendasRealizadas();
        if (response.sucesso && response.vendas) {
          setVendasRealizadas(response.vendas);
          const options = response.vendas.flatMap(p => [
            p.id?.toString(), p.descricao, p.marca, p.genero
          ]).filter(Boolean);
          setSearchOptions([...new Set(options)]);
        } else {
          console.error("Erro ao buscar histórico de vendas:", response.mensagem);
          setSnackbar({
            open: true,
            message: `Erro ao carregar histórico: ${response.mensagem}`,
            severity: "error",
          });
        }

        // Buscar a contagem inicial do carrinho
        const cartResponse = await listarCarrinho()
        if (cartResponse.sucesso && cartResponse.carrinho) {
          setCartItemCount(cartResponse.carrinho.totalItens)
        } else {
          console.error("Erro ao buscar contagem do carrinho:", cartResponse.mensagem)
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setSnackbar({
          open: true,
          message: "Erro ao carregar dados. Verifique a conexão com o servidor.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleOpenProductModal = (produto) => {
    setProdutoSelecionado(produto)
    setOpenProductModal(true)
  }

  const handleCloseProductModal = () => {
    setOpenProductModal(false)
  }

  // Função para adicionar ao carrinho (adaptada para vendas) - MANTIDA CASO SEJA USADA EM OUTRO LUGAR, MAS NÃO SERÁ CHAMADA PELA TABELA
  const handleAddToCart = async (venda) => {
    try {
      // Converter objeto de venda para formato de produto para o carrinho
      const produtoParaCarrinho = {
        id: venda.id,
        descricao: venda.descricao,
        marca: venda.marca,
        tamanho: venda.tamanho,
        genero: venda.genero,
        estadoConservacao: venda.estadoConservacao,
        preco: venda.preco,
        lote: venda.lote
      };

      const result = await adicionarAoCarrinho(produtoParaCarrinho, 1)
      if (result.sucesso) {
        console.log("Produto adicionado ao carrinho com sucesso!", result.carrinho)
        setCartItemCount(result.carrinho.totalItens) // Atualiza a contagem
        setSnackbar({
          open: true,
          message: `"${venda.descricao}" adicionado ao carrinho!`,
          severity: "success",
        })
        setOpenProductModal(false); // Fecha o modal após adicionar
      } else {
        console.error("Erro ao adicionar produto ao carrinho:", result.mensagem)
        setSnackbar({
          open: true,
          message: `Erro ao adicionar produto ao carrinho: ${result.mensagem}`,
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Erro inesperado ao adicionar produto ao carrinho:", error)
      setSnackbar({
        open: true,
        message: "Ocorreu um erro inesperado ao adicionar o produto ao carrinho.",
        severity: "error",
      })
    }
  }

  // Função para navegar diretamente para a página do carrinho
  const handleNavigateToCart = () => {
    router.push("/vendas/carrinho") // Assumindo que a página do carrinho está em /vendas/carrinho
  }

  const handleOpenSaleDetailsModal = async (saleId) => {
    setLoading(true);
    try {
      const response = await buscarVendaPorId(saleId);
      if (response.sucesso && response.venda) {
        setSaleSelected(response.venda);
        setOpenSaleDetailsModal(true);
      } else {
        console.error("Erro ao buscar detalhes da venda:", response.mensagem);
        setSnackbar({
          open: true,
          message: `Erro ao carregar detalhes da venda: ${response.mensagem}`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da venda:", error);
      setSnackbar({
        open: true,
        message: "Erro ao carregar detalhes da venda. Verifique a conexão com o servidor.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSaleDetailsModal = () => {
    setOpenSaleDetailsModal(false);
    setSaleSelected(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredVendas = vendasRealizadas.filter((venda) => {
    const query = searchQuery.toLowerCase();
    return (
      venda.id?.toString().toLowerCase().includes(query) ||
      venda.descricao?.toLowerCase().includes(query) ||
      venda.marca?.toLowerCase().includes(query) ||
      venda.genero?.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />

      {/* Botão do Carrinho no canto superior direito */}
      <Box
        sx={{
          position: 'fixed',
          top: 72, // Ajustado para mover mais para baixo
          right: 140, // Ajustado para mover mais para a esquerda
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={handleNavigateToCart}
          sx={{
            bgcolor: '#FADADD', // Cor rosa padrão
            color: '#333', // Cor do ícone
            '&:hover': {
              bgcolor: '#ffb6c1', // Cor rosa mais clara ao passar o mouse
            },
            borderRadius: '50%', // Botão redondo
            width: 56, // Largura fixa
            height: 56, // Altura fixa
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra para destaque
          }}
        >
          <Badge badgeContent={cartItemCount} color="error"> {/* Badge para a contagem */}
            <ShoppingCartIcon sx={{ fontSize: 30 }} />
          </Badge>
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, sm: "290px" },
          maxHeight: "1000px",
          overflow: "auto",
          backgroundColor: "#9AE4FF",
          paddingTop: "3rem",
          paddingX: { xs: "1rem", sm: "2rem" },
          transition: "margin-left 0.3s ease",
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
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "50px",
              color: "#000000",
            }}
          >
             Vendas
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
            value={searchQuery}
            onChange={(event, newValue) => {
              setSearchQuery(newValue || "")
            }}
            onInputChange={(event, newValue) => {
              setSearchQuery(newValue || "")
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pesquisar vendas por ID, descrição, marca ou gênero"
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

        <Card
          sx={{
            padding: "20px",
            bgcolor: "white",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "25px",
            backgroundColor: "#F5F5F5",
            width: "100%",
            margin: "0 auto",
            border: "2px solid #B0B0B0",
          }}
        >
          {/* Novo título para a tabela */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#333",
              fontSize: "2rem", // Ajuste o tamanho da fonte conforme desejar
              textAlign: "left", // Alinhe à esquerda ou ao centro
              pl: 1, // Adicione um pouco de padding à esquerda se necessário
            }}
          >
            Últimas vendas
          </Typography>

          <TableContainer
            sx={{
              maxHeight: "600px",
              borderRadius: "10px",
              overflow: "auto",
              backgroundColor: "#F5F5F5",
              width: "100%",
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
                    }}
                  >
                    ID 
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
                    Marca
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
                    Tamanho
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
                    Gênero
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
                    Estado
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
                    Quantidade
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
                  {/* COLUNA ÚNICA PARA AÇÕES */}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center"> {/* Colspan ajustado para 9 */}
                      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                        <CircularProgress size={40} sx={{ color: "#FADADD" }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : filteredVendas.length > 0 ? (
                  filteredVendas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((venda, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.descricao}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.marca || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.tamanho || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.genero || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.estadoConservacao}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.quantidade || 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        R$ {venda.preco?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          {/* Botão de Visualizar */}
                          <IconButton
                            onClick={() => handleOpenProductModal(venda)}
                            sx={{
                              color: "#00509E",
                              "&:hover": { backgroundColor: "#E3F2FD" },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          
                          {/* REMOVIDO: Botão de Adicionar ao Carrinho */}
                          {/*
                          <IconButton
                            onClick={() => handleAddToCart(venda)}
                            sx={{
                              color: "#FADADD",
                              "&:hover": { backgroundColor: "#FCE4EC" },
                            }}
                          >
                            <ShoppingCartIcon />
                          </IconButton>
                          */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body1" color="textSecondary">
                        Nenhuma venda encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredVendas.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
            sx={{
              "& .MuiTablePagination-toolbar": {
                backgroundColor: "#F5F5F5",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: "16px",
                color: "#333",
              },
            }}
          />
        </Card>

        {/* Modal de Visualização de Produto */}
        <Dialog
          open={openProductModal}
          onClose={handleCloseProductModal}
          maxWidth="md"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "15px",
              backgroundColor: "#F5F5F5",
            },
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#FADADD",
              color: "#333",
              fontWeight: "bold",
              fontSize: "24px",
              textAlign: "center",
              position: "relative",
            }}
          >
            Detalhes da Venda
            <IconButton
              onClick={handleCloseProductModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "#333",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: "30px", backgroundColor: "#F5F5F5" }}>
            {produtoSelecionado && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <QrCodeIcon sx={{ mr: 1, color: "#00509E" }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      ID: {produtoSelecionado.id}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: "#4CAF50" }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Valor: R$ {produtoSelecionado.preco?.toFixed(2) || "0.00"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InventoryIcon sx={{ mr: 1, color: "#FF9800" }} />
                    <Typography variant="body1">
                      <strong>Descrição:</strong> {produtoSelecionado.descricao}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CategoryIcon sx={{ mr: 1, color: "#9C27B0" }} />
                    <Typography variant="body1">
                      <strong>Marca:</strong> {produtoSelecionado.marca || "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Tamanho:</strong> {produtoSelecionado.tamanho || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Gênero:</strong> {produtoSelecionado.genero || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 1, color: "#4CAF50" }} />
                    <Chip
                      label={produtoSelecionado.estadoConservacao}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Quantidade:</strong> {produtoSelecionado.quantidade || 1}
                  </Typography>
                </Grid>
                {produtoSelecionado.lote && (
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <strong>Lote:</strong> {produtoSelecionado.lote}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#F5F5F5", padding: "20px" }}>
            <Button
              onClick={handleCloseProductModal}
              sx={{
                backgroundColor: "#CCCCCC",
                color: "#333",
                "&:hover": { backgroundColor: "#BBBBBB" },
                borderRadius: "10px",
                padding: "10px 20px",
              }}
            >
              Fechar
            </Button>
            {/* REMOVIDO: Botão de Adicionar ao Carrinho no Modal */}
            {/*
            <Button
              onClick={() => handleAddToCart(produtoSelecionado)}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                "&:hover": { backgroundColor: "#ffb6c1" },
                borderRadius: "10px",
                padding: "10px 20px",
              }}
              startIcon={<ShoppingCartIcon />}
            >
              Adicionar ao Carrinho
            </Button>
            */}
          </DialogActions>
        </Dialog>

        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
