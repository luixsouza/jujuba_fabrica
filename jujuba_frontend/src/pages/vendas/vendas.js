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
  Snackbar, // Adicionado para feedback
  Alert,    // Adicionado para feedback
  CircularProgress
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
} from "@mui/icons-material"
import { listarVendasRealizadas } from "../api/vendas" // Importa a função real
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
  const [loading, setLoading] = useState(true); // Novo estado de loading
  const [snackbar, setSnackbar] = useState({ // Novo estado para snackbar
    open: false,
    message: "",
    severity: "success",
  });

  // Efeito para buscar o histórico de vendas na montagem do componente
  useEffect(() => {
    const fetchVendasHistorico = async () => {
      setLoading(true);
      try {
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
      } catch (error) {
        console.error("Erro ao carregar histórico de vendas:", error);
        setSnackbar({
          open: true,
          message: "Erro ao carregar histórico de vendas. Verifique a conexão com o servidor.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendasHistorico();
  }, []);

  const handleOpenProductModal = (produto) => {
    setProdutoSelecionado(produto)
    setOpenProductModal(true)
  }

  const handleCloseProductModal = () => {
    setOpenProductModal(false)
  }

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
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}> {/* Cor de fundo */}
      <Sidebar />

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
        {/* Header - Padrão de Fornecedores */}
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
             Vendas
          </Typography>
        </Box>

        {/* Search Bar - Padrão de Fornecedores */}
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

        {/* Tabela de Histórico de Vendas - Padrão de Fornecedores */}
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
                      backgroundColor: "#FADADD", // Cor de fundo rosa
                      borderRight: "2px solid #F5F5F5", // Linha branca entre colunas
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
                    }}
                  >
                    Valor
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
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
                        R$ {venda.preco ? venda.preco.toFixed(2).replace(".", ",") : "0,00"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                      Nenhum item vendido encontrado
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
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      </Box>

      {/* Modal de Visualização do Produto (mantido, mas sem botão de carrinho) */}
      <Dialog
        open={openProductModal}
        onClose={handleCloseProductModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {produtoSelecionado && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#FADADD",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                Detalhes do Produto Vendido
              </Typography>
              <IconButton onClick={handleCloseProductModal} size="large" sx={{ color: "#333" }}>
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
                      label={produtoSelecionado.estadoConservacao}
                      color="success"
                      sx={{ fontWeight: 600, fontSize: "1rem", py: 2.5, px: 1 }}
                    />
                  </Box>
                </Grid>

                {/* Informações do Produto */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#333" }}>
                    {produtoSelecionado.descricao}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: "#00509E", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00509E" }}>
                      R$ {produtoSelecionado.preco ? produtoSelecionado.preco.toFixed(2).replace(".", ",") : "0,00"}
                    </Typography>
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>ID:</strong> {produtoSelecionado.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Tamanho:</strong> {produtoSelecionado.tamanho || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CategoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Gênero:</strong> {produtoSelecionado.genero || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Quantidade:</strong> {produtoSelecionado.quantidade || 1}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Detalhes Adicionais
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Marca:</strong> {produtoSelecionado.marca || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Estado:</strong> {produtoSelecionado.estadoConservacao}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Button
                variant="outlined"
                onClick={handleCloseProductModal}
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
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}