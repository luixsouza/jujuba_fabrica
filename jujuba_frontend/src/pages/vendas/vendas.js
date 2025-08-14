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
  Badge,
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarTodayIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
} from "@mui/icons-material"
import { listarVendasRealizadas, buscarVendaPorId } from "../api/vendas"
import { listarCarrinho } from "../api/carrinho"
import Sidebar from "../../components/sidebar"

export default function VendasPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [openSaleModal, setOpenSaleModal] = useState(false)
  const [vendasRealizadas, setVendasRealizadas] = useState([])
  const [vendaSelecionada, setVendaSelecionada] = useState(null)
  const [searchOptions, setSearchOptions] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [loading, setLoading] = useState(true)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        // Buscar histórico de vendas
        const response = await listarVendasRealizadas()
        if (response.sucesso && response.vendas) {
          setVendasRealizadas(response.vendas)
          // Criar opções de busca baseadas nos dados de vendas
          const options = response.vendas
            .flatMap((venda) => [venda.id?.toString(), venda.tipoVenda, venda.fornecedora?.nome])
            .filter(Boolean)
          setSearchOptions([...new Set(options)])
        } else {
          console.error("Erro ao buscar histórico de vendas:", response.mensagem)
          setSnackbar({
            open: true,
            message: `Erro ao carregar histórico: ${response.mensagem}`,
            severity: "error",
          })
        }

        // Buscar a contagem inicial do carrinho
        const cartResponse = await listarCarrinho()
        if (cartResponse.sucesso && cartResponse.carrinho) {
          setCartItemCount(cartResponse.carrinho.totalItens)
        } else {
          console.error("Erro ao buscar contagem do carrinho:", cartResponse.mensagem)
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error)
        setSnackbar({
          open: true,
          message: "Erro ao carregar dados. Verifique a conexão com o servidor.",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const handleOpenSaleModal = async (vendaId) => {
    setLoading(true)
    try {
      const response = await buscarVendaPorId(vendaId)
      if (response.sucesso && response.venda) {
        setVendaSelecionada(response.venda)
        setOpenSaleModal(true)
      } else {
        console.error("Erro ao buscar detalhes da venda:", response.mensagem)
        setSnackbar({
          open: true,
          message: `Erro ao carregar detalhes da venda: ${response.mensagem}`,
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes da venda:", error)
      setSnackbar({
        open: true,
        message: "Erro ao carregar detalhes da venda. Verifique a conexão com o servidor.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSaleModal = () => {
    setOpenSaleModal(false)
    setVendaSelecionada(null)
  }

  const handleNavigateToCart = () => {
    router.push("/vendas/carrinho")
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const formatarData = (dataString) => {
    if (!dataString) return "N/A"
    try {
      const data = new Date(dataString)
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  const formatarValor = (valor) => {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return "0,00"
    }
    return Number(valor).toFixed(2).replace(".", ",")
  }

  const getTipoVendaLabel = (tipo) => {
    switch (tipo) {
      case "VENDA_SIMPLES":
        return "Venda Simples"
      case "VENDA_FORNECEDOR":
        return "Venda Fornecedor"
      default:
        return tipo || "N/A"
    }
  }

  const getTipoVendaColor = (tipo) => {
    switch (tipo) {
      case "VENDA_SIMPLES":
        return "primary"
      case "VENDA_FORNECEDOR":
        return "secondary"
      default:
        return "default"
    }
  }

  const filteredVendas = vendasRealizadas.filter((venda) => {
    const query = searchQuery.toLowerCase()
    return (
      venda.id?.toString().toLowerCase().includes(query) ||
      venda.tipoVenda?.toLowerCase().includes(query) ||
      venda.fornecedora?.nome?.toLowerCase().includes(query)
    )
  })

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />

      {/* Botão do Carrinho no canto superior direito */}
      <Box
        sx={{
          position: "fixed",
          top: 72,
          right: 140,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={handleNavigateToCart}
          sx={{
            bgcolor: "#FADADD",
            color: "#333",
            "&:hover": {
              bgcolor: "#ffb6c1",
            },
            borderRadius: "50%",
            width: 56,
            height: 56,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Badge badgeContent={cartItemCount} color="error">
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
            Histórico de Vendas
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
                placeholder="Pesquisar vendas por ID, tipo ou fornecedora"
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
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#333",
              fontSize: "2rem",
              textAlign: "left",
              pl: 1,
            }}
          >
            Vendas Realizadas
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
                    Data/Hora
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
                    Tipo
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
                    Fornecedora
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
                    Total
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
                    Valor Brechó
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
                    Valor Fornecedora
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
                          label={getTipoVendaLabel(venda.tipoVenda)}
                          color={getTipoVendaColor(venda.tipoVenda)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {venda.fornecedora?.nome || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        R$ {formatarValor(venda.total)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        R$ {formatarValor(venda.valorBrecho)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        R$ {formatarValor(venda.valorFornecedora)}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          onClick={() => handleOpenSaleModal(venda.id)}
                          sx={{
                            color: "#00509E",
                            "&:hover": { backgroundColor: "#E3F2FD" },
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
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
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
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

        {/* Modal de Detalhes da Venda */}
        <Dialog
          open={openSaleModal}
          onClose={handleCloseSaleModal}
          maxWidth="lg"
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
              onClick={handleCloseSaleModal}
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
            {vendaSelecionada && (
              <Grid container spacing={3}>
                {/* Informações Gerais da Venda */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
                    Informações Gerais
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <ReceiptIcon sx={{ mr: 1, color: "#00509E" }} />
                    <Typography variant="body1">
                      <strong>ID:</strong> {vendaSelecionada.id}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: "#FF9800" }} />
                    <Typography variant="body1">
                      <strong>Data:</strong> {formatarData(vendaSelecionada.dataVenda)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <StoreIcon sx={{ mr: 1, color: "#9C27B0" }} />
                    <Chip
                      label={getTipoVendaLabel(vendaSelecionada.tipoVenda)}
                      color={getTipoVendaColor(vendaSelecionada.tipoVenda)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: "#4CAF50" }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                      Total: R$ {formatarValor(vendaSelecionada.total)}
                    </Typography>
                  </Box>
                </Grid>

                {/* Informações Financeiras */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
                    Divisão Financeira
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Valor Brechó:</strong> R$ {formatarValor(vendaSelecionada.valorBrecho)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Valor Fornecedora:</strong> R$ {formatarValor(vendaSelecionada.valorFornecedora)}
                  </Typography>
                </Grid>

                {/* Informações da Fornecedora */}
                {vendaSelecionada.fornecedora && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
                        Fornecedora
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <PeopleIcon sx={{ mr: 1, color: "#2196F3" }} />
                        <Typography variant="body1">
                          <strong>Nome:</strong> {vendaSelecionada.fornecedora.nome}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <strong>Contato:</strong> {vendaSelecionada.fornecedora.contato || "N/A"}
                      </Typography>
                    </Grid>
                  </>
                )}

                {/* Itens da Venda */}
                {vendaSelecionada.itens && vendaSelecionada.itens.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#333" }}>
                        Itens da Venda ({vendaSelecionada.itens.length})
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TableContainer sx={{ maxHeight: 300, border: "1px solid #ddd", borderRadius: 1 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                              <TableCell>
                                <strong>Produto</strong>
                              </TableCell>
                              <TableCell>
                                <strong>Marca</strong>
                              </TableCell>
                              <TableCell align="center">
                                <strong>Quantidade</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>Preço Unit.</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>Subtotal</strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {vendaSelecionada.itens.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.produto?.descricao || "N/A"}</TableCell>
                                <TableCell>{item.produto?.marca || "N/A"}</TableCell>
                                <TableCell align="center">{item.quantidade}</TableCell>
                                <TableCell align="right">R$ {formatarValor(item.precoUnitario)}</TableCell>
                                <TableCell align="right">R$ {formatarValor(item.subtotal)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#F5F5F5", padding: "20px" }}>
            <Button
              onClick={handleCloseSaleModal}
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
          </DialogActions>
        </Dialog>

        {/* Snackbar para feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
