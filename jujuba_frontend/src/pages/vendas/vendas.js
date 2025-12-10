"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  TablePagination,
  InputAdornment,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Slide,
  Snackbar,
  Alert,
  Chip,
  Tabs,
  Tab,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../../components/sidebar";
import { forwardRef } from "react";
import Head from "next/head";

// Transição personalizada para o modal
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VendasPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendas, setVendas] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    venda: null,
  });
  const [tabValue, setTabValue] = useState(0);
  const [pageTabValue, setPageTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();

  // Função para ordenar vendas por data (mais recente primeiro)
  const ordenarVendasPorData = (vendas) => {
    return vendas.sort((a, b) => {
      const dataA = new Date(a.dataVenda);
      const dataB = new Date(b.dataVenda);
      return dataB - dataA; // Ordem decrescente (mais recente primeiro)
    });
  };

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const response = await api.get("/vendas");
        const vendasOrdenadas = ordenarVendasPorData(response.data);
        setVendas(vendasOrdenadas);
      } catch (error) {
        console.error("Erro ao buscar vendas:", error.message);
        setSnackbar({
          open: true,
          message: "Erro ao carregar vendas",
          severity: "error",
        });
      }
    };
    fetchVendas();
  }, []);

  // Função para formatar data
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Função para formatar valor monetário
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  // Função para determinar se uma venda é recente (últimas 3)
  const isVendaRecente = (index) => {
    return index < 3;
  };

  const handleDetailsClick = (venda) => {
    setDetailsModal({
      open: true,
      venda: venda,
    });
  };

  const handleCloseDetailsModal = () => {
    setDetailsModal({
      open: false,
      venda: null,
    });
    setTabValue(0); // Reset tab
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageTabChange = (event, newValue) => {
    setPageTabValue(newValue);
  };

  // Função para obter todos os fornecedores únicos dos produtos vendidos
  const getFornecedoresDosItens = (itens) => {
    const fornecedoresMap = new Map();

    itens.forEach((item) => {
      if (item.produto && item.produto.lote && item.produto.lote.fornecedora) {
        const fornecedora = item.produto.lote.fornecedora;
        if (!fornecedoresMap.has(fornecedora.id)) {
          fornecedoresMap.set(fornecedora.id, {
            ...fornecedora,
            produtos: [],
          });
        }
        fornecedoresMap.get(fornecedora.id).produtos.push({
          produto: item.produto,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        });
      }
    });

    return Array.from(fornecedoresMap.values());
  };

  const filteredVendas = useMemo(() => {
    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.trim() === ""
    ) {
      return vendas;
    }
    const searchLower = searchTerm.toLowerCase();

    // Tenta extrair o ID se o formato for "#123 - ..." vindo do Autocomplete
    const idMatch = searchLower.match(/^#(\d+)/);
    const searchId = idMatch ? idMatch[1] : searchLower;

    return vendas.filter((venda) => {
      const idString = venda.id.toString();
      const tipoString = venda.tipoVenda ? venda.tipoVenda.toLowerCase() : "";
      const fornecedoraNome = venda.fornecedora ? venda.fornecedora.nome.toLowerCase() : "";

      // Se for uma busca por ID (formato #123 ou apenas números)
      if (idMatch || (!isNaN(searchId) && searchId.trim() !== "")) {
         if (idString.includes(searchId)) return true;
      }

      return (
        idString.includes(searchLower) ||
        tipoString.includes(searchLower) ||
        fornecedoraNome.includes(searchLower) ||
        getFornecedoresDosItens(venda.itens || []).some(f => 
          f.nome.toLowerCase().includes(searchLower)
        ) ||
        (venda.itens || []).some((item) =>
          item.produto?.descricao?.toLowerCase().includes(searchLower)
        )
      );
    });
  }, [vendas, searchTerm]);

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
    >
      <Head>
        <title>Jujuba - Vendas</title>
      </Head>
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
            marginBottom: "20px",
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
            Histórico de Vendas
          </Typography>
        </Box>

        {/* Abas */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={pageTabValue}
            onChange={handlePageTabChange}
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: "18px",
                color: "#333",
                minWidth: 200,
                backgroundColor: "white",
                margin: "0 5px",
                borderRadius: "10px 10px 0 0",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#00509E",
                backgroundColor: "#F5F5F5",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#00509E",
                height: 3,
              },
            }}
          >
            <Tab label="Vendas" />
            <Tab label="Relatório Fornecedores" />
          </Tabs>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <TextField
            value={search}
            onChange={(event) => {
              const newValue = event.target.value;
              setSearch(newValue);
              setSearchTerm(newValue);
            }}
            placeholder="Pesquisar vendas por ID, tipo, fornecedora ou produto"
            variant="outlined"
            size="medium"
            InputProps={{
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
        </Box>



        {/* Conteúdo das Abas */}
        {pageTabValue === 0 && (
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
                      fontWeight: "bold",
                    }}
                  >
                    Itens
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: "bold",
                    }}
                  >
                    Data/Hora ↓
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: "bold",
                    }}
                  >
                    Tipo
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      fontWeight: "bold",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVendas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((venda, index) => (
                    <TableRow
                      key={venda.id}
                      sx={{
                        backgroundColor: isVendaRecente(
                          page * rowsPerPage + index
                        )
                          ? "#E3F2FD"
                          : "inherit",
                        "&:hover": {
                          backgroundColor: isVendaRecente(
                            page * rowsPerPage + index
                          )
                            ? "#BBDEFB"
                            : "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                          fontWeight: isVendaRecente(page * rowsPerPage + index)
                            ? "bold"
                            : "normal",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          {venda.itens?.slice(0, 2).map((item, idx) => (
                            <Typography key={idx} variant="body2" sx={{ fontSize: "12px" }}>
                              {item.produto?.descricao || "Produto"}
                            </Typography>
                          ))}
                          {venda.itens?.length > 2 && (
                            <Typography variant="body2" sx={{ fontSize: "10px", color: "#666" }}>
                              +{venda.itens.length - 2} mais
                            </Typography>
                          )}
                          {isVendaRecente(page * rowsPerPage + index) && (
                            <Chip
                              label="Nova"
                              size="small"
                              sx={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                fontSize: "10px",
                                height: "20px",
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                          fontWeight: isVendaRecente(page * rowsPerPage + index)
                            ? "bold"
                            : "normal",
                        }}
                      >
                        {formatarData(venda.dataVenda)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        <Chip
                          label={
                            venda.tipoVenda === "VENDA_SIMPLES"
                              ? "Venda Simples"
                              : "Venda Fornecedor"
                          }
                          color={
                            venda.tipoVenda === "VENDA_SIMPLES"
                              ? "primary"
                              : "secondary"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#4CAF50",
                        }}
                      >
                        {formatarValor(venda.total)}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          padding: "8px",
                          minWidth: "100px",
                        }}
                      >
                        <IconButton
                          onClick={() => handleDetailsClick(venda)}
                          sx={{ color: "#00509E" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
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
              `${from}-${to} de ${count}`
            }
          />
        </Card>
        )}

        {/* Segunda Aba - Tabela de Fornecedores */}
        {pageTabValue === 1 && (
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
                      fontWeight: "bold",
                    }}
                  >
                    Fornecedor
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: "bold",
                    }}
                  >
                    Valor Fornecedor
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: "bold",
                    }}
                  >
                    Valor Brechó
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      fontWeight: "bold",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  // Lista cada venda com fornecedor separadamente
                  const vendasComFornecedor = [];
                  
                  vendas.forEach(venda => {
                    // Verifica se há fornecedora diretamente na venda
                    if (venda.fornecedora) {
                      vendasComFornecedor.push({
                        fornecedor: venda.fornecedora.nome,
                        valorFornecedor: venda.valorFornecedora || 0,
                        valorBrecho: venda.valorBrecho || 0,
                        total: venda.total || 0,
                        venda: venda
                      });
                    }
                    
                    // Também verifica fornecedores dos produtos
                    const fornecedores = getFornecedoresDosItens(venda.itens || []);
                    fornecedores.forEach(fornecedora => {
                      const valorProdutos = fornecedora.produtos.reduce((sum, p) => sum + (p.subtotal || 0), 0);
                      vendasComFornecedor.push({
                        fornecedor: fornecedora.nome,
                        valorFornecedor: valorProdutos * 0.7,
                        valorBrecho: valorProdutos * 0.3,
                        total: valorProdutos,
                        venda: venda
                      });
                    });
                  });
                  
                  if (vendasComFornecedor.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" sx={{ color: '#666' }}>
                            Nenhuma venda com fornecedor encontrada
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  
                  return vendasComFornecedor.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {item.fornecedor}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#2196F3",
                        }}
                      >
                        {formatarValor(item.valorFornecedor)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {formatarValor(item.valorBrecho)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#4CAF50",
                        }}
                      >
                        {formatarValor(item.total)}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          padding: "8px",
                          minWidth: "100px",
                        }}
                      >
                        <IconButton
                          onClick={() => handleDetailsClick(item.venda)}
                          sx={{ color: "#00509E" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
        )}
      </Box>

      {/* Modal de Detalhes da Venda */}
      <Dialog
        open={detailsModal.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDetailsModal}
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
            onClick={handleCloseDetailsModal}
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
              <ReceiptIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              Detalhes da Venda #{detailsModal.venda?.id}
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
            <Tab label="Informações Gerais" />
            <Tab label="Itens Vendidos" />
            <Tab label="Fornecedores dos Produtos" />
          </Tabs>

          {/* Tab 0: Informações Gerais */}
          {tabValue === 0 && detailsModal.venda && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                    >
                      Dados da Venda
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>ID:</strong> #{detailsModal.venda.id}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Data/Hora:</strong>{" "}
                      {formatarData(detailsModal.venda.dataVenda)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Tipo:</strong>{" "}
                      <Chip
                        label={
                          detailsModal.venda.tipoVenda === "VENDA_SIMPLES"
                            ? "Venda Simples"
                            : "Venda Fornecedor"
                        }
                        color={
                          detailsModal.venda.tipoVenda === "VENDA_SIMPLES"
                            ? "primary"
                            : "secondary"
                        }
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
                      Valores
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
                      <strong>Total:</strong>{" "}
                      {formatarValor(detailsModal.venda.total)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Valor Brechó:</strong>{" "}
                      {formatarValor(detailsModal.venda.valorBrecho)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Valor Fornecedora:</strong>{" "}
                      {formatarValor(detailsModal.venda.valorFornecedora)}
                    </Typography>
                  </Paper>
                </Grid>

                {detailsModal.venda.fornecedora && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                      >
                        Fornecedora Principal
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Nome:</strong>{" "}
                        {detailsModal.venda.fornecedora.nome}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Contato:</strong>{" "}
                        {detailsModal.venda.fornecedora.contato}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Chave Pix:</strong>{" "}
                        {detailsModal.venda.fornecedora.chavePix}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Tab 1: Itens Vendidos */}
          {tabValue === 1 && detailsModal.venda && (
            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
              >
                Produtos Vendidos ({detailsModal.venda.itens?.length || 0}{" "}
                itens)
              </Typography>
              {detailsModal.venda.itens?.map((item, index) => (
                <Paper
                  key={index}
                  sx={{ p: 2, mb: 2, backgroundColor: "#FADADD" }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {item.produto?.descricao || "Produto sem descrição"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                        <strong>Marca:</strong> {item.produto?.marca || "N/A"} |
                        <strong> Tamanho:</strong>{" "}
                        {item.produto?.tamanho || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        <strong>Estado:</strong>{" "}
                        {item.produto?.estadoConservacao || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body1">
                        <strong>Quantidade:</strong> {item.quantidade}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Preço Unit.:</strong>{" "}
                        {formatarValor(item.precoUnitario)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "#4CAF50",
                          textAlign: "right",
                        }}
                      >
                        {formatarValor(item.subtotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}

          {/* Tab 2: Fornecedores dos Produtos */}
          {tabValue === 2 && detailsModal.venda && (
            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
              >
                Fornecedores dos Produtos (Donos)
              </Typography>
              {(() => {
                const fornecedores = getFornecedoresDosItens(
                  detailsModal.venda.itens || []
                );

                if (fornecedores.length === 0) {
                  return (
                    <Paper
                      sx={{
                        p: 3,
                        backgroundColor: "#FADADD",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "#666" }}>
                        Nenhum produto possui fornecedor associado nesta venda.
                      </Typography>
                    </Paper>
                  );
                }

                return fornecedores.map((fornecedora, index) => (
                  <Paper
                    key={fornecedora.id}
                    sx={{ p: 3, mb: 2, backgroundColor: "#FADADD" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ backgroundColor: "#00509E", mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#333" }}
                        >
                          {fornecedora.nome}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Contato: {fornecedora.contato} | Pix:{" "}
                          {fornecedora.chavePix}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Produtos desta fornecedora:
                    </Typography>

                    {fornecedora.produtos.map((produtoInfo, prodIndex) => (
                      <Box
                        key={prodIndex}
                        sx={{
                          ml: 2,
                          mb: 1,
                          p: 1,
                          backgroundColor: "#FADADD",
                          borderRadius: 1,
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={6}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {produtoInfo.produto.descricao}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#666" }}
                            >
                              {produtoInfo.produto.marca} -{" "}
                              {produtoInfo.produto.tamanho}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2">
                              Qtd: {produtoInfo.quantidade}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "#4CAF50" }}
                            >
                              {formatarValor(produtoInfo.subtotal)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}

                    <Box
                      sx={{
                        mt: 2,
                        p: 1,
                        backgroundColor: "#FADADD",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", textAlign: "right" }}
                      >
                        Total desta fornecedora:{" "}
                        {formatarValor(
                          fornecedora.produtos.reduce(
                            (sum, p) => sum + (p.subtotal || 0),
                            0
                          )
                        )}
                      </Typography>
                    </Box>
                  </Paper>
                ));
              })()}
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
            onClick={handleCloseDetailsModal}
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
                backgroundColor: "#FADADD",
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
  );
};

export default VendasPage;
