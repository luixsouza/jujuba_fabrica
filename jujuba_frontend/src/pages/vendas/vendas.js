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
  Receipt as ReceiptIcon, // Ícone para vendas
  CalendarToday as CalendarTodayIcon, // Ícone para data
  People as PeopleIcon, // Ícone para fornecedora
} from "@mui/icons-material"
import { listarVendasRealizadas, buscarVendaPorId } from "../api/vendas"
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openSaleDetailsModal, setOpenSaleDetailsModal] = useState(false);
  const [saleSelected, setSaleSelected] = useState(null);

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
                    ID Produto
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
                        R$ {venda.preco ? venda.preco.toFixed(2).replace(".", ",") : "0,00"}
                      </TableCell>
                      {/* CÉLULA ÚNICA PARA AMBOS OS BOTÕES DE AÇÃO */}
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          aria-label="visualizar item"
                          onClick={() => handleOpenProductModal(venda)}
                          sx={{ color: "#00509E" }} // Cor do olho
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          aria-label="visualizar venda completa"
                          onClick={() => handleOpenSaleDetailsModal(venda.vendaId)}
                          sx={{ color: "#00509E", ml: 1 }} // Mesma cor do olho, com margem
                        >
                          <ReceiptIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}> {/* Colspan ajustado para 9 */}
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

      {/* Modal de Visualização do Produto (Design Padronizado) */}
      <Dialog
        open={openProductModal}
        onClose={handleCloseProductModal}
        maxWidth="sm" // Mantido 'sm' para um tamanho compacto e focado no produto
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.25)", // Sombra mais pronunciada (igual ao de venda)
            overflow: 'hidden', // Garante que o borderRadius seja aplicado corretamente
            backgroundColor: '#FFFFFF', // Fundo branco padrão (igual ao de venda)
          },
        }}
      >
        {produtoSelecionado && (
          <>
            {/* Título do Modal (igual ao de venda) */}
            <DialogTitle
              sx={{
                bgcolor: "#FADADD", // Cor de fundo rosa claro (igual ao de venda)
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2.5, // Padding um pouco maior (igual ao de venda)
                borderBottom: '1px solid #e0e0e0', // Linha sutil para separar o título (igual ao de venda)
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                Detalhes do Produto
              </Typography>
              <IconButton onClick={handleCloseProductModal} size="large" sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            {/* Conteúdo Principal do Modal */}
            <DialogContent sx={{ p: 4, pb: 2 }}> {/* Padding ajustado (igual ao de venda) */}
              <Grid container spacing={3}>
                {/* Descrição e Preço - Seção de Destaque */}
                <Grid item xs={12}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#212121" }}> {/* Fonte maior e mais escura */}
                    {produtoSelecionado.descricao}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: "#00509E", mr: 1.5, fontSize: '2.2rem' }} /> {/* Ícone maior */}
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#00509E" }}> {/* Fonte maior e mais escura */}
                      R$ {produtoSelecionado.preco ? produtoSelecionado.preco.toFixed(2).replace(".", ",") : "0,00"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Chip de Estado de Conservação */}
                <Grid item xs={12}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={produtoSelecionado.estadoConservacao}
                    color="success"
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem", // Tamanho da fonte um pouco maior
                      py: 1.5, // Padding vertical para um chip mais "cheio"
                      px: 2, // Padding horizontal
                      height: 'auto',
                      borderRadius: '20px', // Borda mais arredondada
                    }}
                  />
                </Grid>

                {/* Separador e Título para Detalhes (igual ao de venda) */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 3, borderColor: '#e0e0e0' }} /> {/* Separador mais visível (igual ao de venda) */}
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#424242" }}> {/* Cor mais suave (igual ao de venda) */}
                    Informações Detalhadas
                  </Typography>
                </Grid>

                {/* Detalhes do Produto em duas colunas com ícones e espaçamento (igual ao de venda) */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}> {/* Espaçamento maior entre itens */}
                    <QrCodeIcon sx={{ color: "#757575", mr: 1.5 }} /> {/* Cor de ícone mais suave */}
                    <Typography variant="body1" color="text.secondary">
                      <strong>ID:</strong> {produtoSelecionado.id}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CategoryIcon sx={{ color: "#757575", mr: 1.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong>Marca:</strong> {produtoSelecionado.marca || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InventoryIcon sx={{ color: "#757575", mr: 1.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong>Quantidade:</strong> {produtoSelecionado.quantidade || 1}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InventoryIcon sx={{ color: "#757575", mr: 1.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong>Tamanho:</strong> {produtoSelecionado.tamanho || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CategoryIcon sx={{ color: "#757575", mr: 1.5 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong>Gênero:</strong> {produtoSelecionado.genero || "-"}
                    </Typography>
                  </Box>

                  {/* Fornecedora (condicionalmente) */}
                  {produtoSelecionado.tipoVenda === 'VENDA_FORNECEDOR' && produtoSelecionado.fornecedoraNome && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PeopleIcon sx={{ color: "#757575", mr: 1.5 }} />
                      <Typography variant="body1" color="text.secondary">
                        <strong>Fornecedora:</strong> {produtoSelecionado.fornecedoraNome}
                      </Typography>
                    </Box>
                  )}

                  {/* Lote */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CategoryIcon sx={{ color: "#757575", mr: 1.5 }} /> {/* Usando CategoryIcon para Lote */}
                    <Typography variant="body1" color="text.secondary">
                      <strong>Lote:</strong> {produtoSelecionado.lote || "-"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            {/* Ações do Modal (igual ao de venda) */}
            <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa", borderTop: '1px solid #e0e0e0' }}>
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

      {/* NOVO MODAL DE VISUALIZAÇÃO DA VENDA COMPLETA */}
      <Dialog
        open={openSaleDetailsModal}
        onClose={handleCloseSaleDetailsModal}
        maxWidth="lg" // Maior para exibir mais detalhes
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {saleSelected && (
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
                Detalhes da Venda #{saleSelected.id}
              </Typography>
              <IconButton onClick={handleCloseSaleDetailsModal} size="large" sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Informações Gerais da Venda */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#00509E" }}>
                    Informações da Venda
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>ID da Venda:</strong> {saleSelected.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CalendarTodayIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Data da Venda:</strong> {new Date(saleSelected.dataVenda).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CategoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Tipo de Venda:</strong> {saleSelected.tipoVenda.replace('_', ' ')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <AttachMoneyIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Total da Venda:</strong> R$ {saleSelected.total.toFixed(2).replace('.', ',')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <AttachMoneyIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Valor Brechó:</strong> R$ {saleSelected.valorBrecho.toFixed(2).replace('.', ',')}
                        </Typography>
                      </Box>
                    </Grid>
                    {saleSelected.tipoVenda === 'VENDA_FORNECEDOR' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <AttachMoneyIcon sx={{ color: "#666", mr: 1 }} />
                            <Typography variant="body1">
                              <strong>Valor Fornecedora:</strong> R$ {saleSelected.valorFornecedora.toFixed(2).replace('.', ',')}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <PeopleIcon sx={{ color: "#666", mr: 1 }} />
                            <Typography variant="body1">
                              <strong>Fornecedora:</strong> {saleSelected.fornecedora?.nome || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                            <Typography variant="body1">
                              <strong>CNPJ Fornecedora:</strong> {saleSelected.fornecedora?.cnpj || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#00509E" }}>
                    Itens da Venda
                  </Typography>
                  <TableContainer component={Card} sx={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: "#FADADD" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>ID Produto</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Preço Unitário</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {saleSelected.itens && saleSelected.itens.length > 0 ? (
                          saleSelected.itens.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              <TableCell>{item.produto.id}</TableCell>
                              <TableCell>{item.produto.descricao}</TableCell>
                              <TableCell align="right">R$ {item.precoUnitario.toFixed(2).replace('.', ',')}</TableCell>
                              <TableCell align="right">{item.quantidade}</TableCell>
                              <TableCell align="right">R$ {item.subtotal.toFixed(2).replace('.', ',')}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} align="center">Nenhum item encontrado para esta venda.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Button
                variant="outlined"
                onClick={handleCloseSaleDetailsModal}
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