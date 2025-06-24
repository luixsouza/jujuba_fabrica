"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  CircularProgress,
} from "@mui/material"
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
} from "@mui/icons-material"
import Sidebar from "../../components/sidebar"

export default function FornecedoresPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [search, setSearch] = useState("")
  const [fornecedores, setFornecedores] = useState([])
  const [openFinalizarModal, setOpenFinalizarModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [selectedFornecedor, setSelectedFornecedor] = useState(null)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
  const [fornecedorToDelete, setFornecedorToDelete] = useState(null)
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [carrinhoItems, setCarrinhoItems] = useState([])
  const [totalVenda, setTotalVenda] = useState(0)

  // Função para formatar valor monetário
  const formatarValor = (valor) => {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return "0,00"
    }
    return Number(valor).toFixed(2).replace(".", ",")
  }

  // Função para obter valor seguro
  const obterValorSeguro = (valor) => {
    return valor !== null && valor !== undefined && !isNaN(valor) ? Number(valor) : 0
  }

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8080/api/fornecedoras")
        if (!response.ok) {
          throw new Error("Falha ao buscar fornecedores")
        }
        const data = await response.json()
        setFornecedores(data)
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFornecedores()
  }, [])

  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho")
    if (carrinhoSalvo) {
      const items = JSON.parse(carrinhoSalvo)
      setCarrinhoItems(items)
      const total = items.reduce((sum, item) => {
        const preco = obterValorSeguro(item.preco)
        const quantidade = obterValorSeguro(item.quantidade)
        return sum + preco * quantidade
      }, 0)
      setTotalVenda(total)
    }
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const handleSearch = async (event, newValue) => {
    setSearch(newValue || "")
    setSearchTerm(newValue || "")

    try {
      setLoading(true)
      let url = "http://localhost:8080/api/fornecedoras"
      if (newValue) {
        url += `?nome=${encodeURIComponent(newValue)}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Falha ao buscar fornecedores")
      }

      const data = await response.json()
      setFornecedores(data)
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewFornecedor = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/fornecedoras/${id}`)
      if (!response.ok) {
        throw new Error("Falha ao buscar detalhes do fornecedor")
      }

      const fornecedor = await response.json()
      setSelectedFornecedor(fornecedor)
      setOpenViewModal(true)
    } catch (error) {
      console.error("Erro ao buscar detalhes do fornecedor:", error)
      setError(error.message)
    }
  }

  const handleCloseViewModal = () => {
    setOpenViewModal(false)
  }

  const handleDeleteFornecedor = (id) => {
    const fornecedor = fornecedores.find((f) => f.id === id)
    setFornecedorToDelete(fornecedor)
    setOpenDeleteConfirmation(true)
  }

  const handleConfirmDelete = async () => {
    if (fornecedorToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/fornecedoras/${fornecedorToDelete.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Falha ao excluir fornecedor")
        }

        setFornecedores(fornecedores.filter((f) => f.id !== fornecedorToDelete.id))
        setOpenDeleteConfirmation(false)
        setFornecedorToDelete(null)
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error)
        setError(error.message)
      }
    }
  }

  const handleCancelDelete = () => {
    setOpenDeleteConfirmation(false)
    setFornecedorToDelete(null)
  }

  const handleFinalizarCompra = () => {
    if (!selectedFornecedor) {
      setSelectedFornecedor(fornecedores[0])
    }
    setOpenFinalizarModal(true)
  }

  const handleCloseFinalizarModal = () => {
    setOpenFinalizarModal(false)
  }

  const handleConfirmFinalizarCompra = async () => {
    if (!selectedFornecedor || carrinhoItems.length === 0) return

    try {
      // Simular finalização da venda
      localStorage.removeItem("carrinho")
      setCarrinhoItems([])

      setOpenFinalizarModal(false)
      setOpenSuccessMessage(true)
      setTimeout(() => {
        router.push("/vendas")
      }, 2000)
    } catch (error) {
      console.error("Erro ao finalizar venda:", error)
      setError("Falha ao finalizar a venda. Por favor, tente novamente.")
    }
  }

  const handleCloseSuccessMessage = () => {
    setOpenSuccessMessage(false)
  }

  const calcularCreditoFinal = () => {
    if (!selectedFornecedor) return 0
    const credito = obterValorSeguro(selectedFornecedor.valorCredito)
    return credito - totalVenda
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#a8e1ff" }}>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <Box sx={{ ml: "244px", flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton onClick={handleGoBack} sx={{ color: "black", mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", flex: 1, color: "#333" }}>
            FORNECEDORES
          </Typography>
          <Box sx={{ width: 48 }} />
        </Box>

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
            options={fornecedores.map((f) => f.nome || "")}
            value={search}
            onChange={handleSearch}
            onInputChange={(event, newValue) => {
              setSearch(newValue || "")
              setSearchTerm(newValue || "")
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pesquisar fornecedor"
                variant="outlined"
                size="medium"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  maxWidth: "1200px",
                  backgroundColor: "#F5F5F5",
                  marginBottom: "50px",
                  marginTop: "50px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    height: "80px",
                    "& fieldset": {
                      borderColor: "#CCCCCC",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00509E",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00509E",
                    },
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiInputBase-input": {
                    color: "#000000",
                    padding: "0 20px",
                    fontSize: "18px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "20px",
                    color: "#000000",
                    transform: "translate(20px, 28px)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00509E",
                  },
                  "& .MuiInputLabel-shrink": {
                    transform: "translate(20px, -6px) scale(0.75)",
                  },
                }}
              />
            )}
            sx={{
              width: "100%",
              maxWidth: "1200px",
            }}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            mx: "auto",
            width: "100%",
            maxWidth: 1200,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            mb: 4,
            flex: 1,
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300, color: "error.main" }}
            >
              <Typography>{error}</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#ffccd5", height: "70px" }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#666" }}>Fornecedores</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", color: "#666" }}>Contato</TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", textAlign: "center", color: "#666" }}>
                    Valor de Crédito da loja
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", textAlign: "center", color: "#666" }}>
                    Chave Pix
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.1rem", textAlign: "center", color: "#666" }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fornecedores.length > 0 ? (
                  fornecedores.map((fornecedor) => (
                    <TableRow key={fornecedor.id} sx={{ bgcolor: "white" }}>
                      <TableCell sx={{ fontSize: "0.95rem", color: "#555" }}>{fornecedor.nome || "N/A"}</TableCell>
                      <TableCell sx={{ fontSize: "0.95rem", color: "#555" }}>{fornecedor.contato || "N/A"}</TableCell>
                      <TableCell sx={{ fontSize: "0.95rem", textAlign: "center", color: "#555" }}>
                        R$ {formatarValor(fornecedor.valorCredito)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.95rem", textAlign: "center", color: "#555" }}>
                        {fornecedor.chavePix || "N/A"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewFornecedor(fornecedor.id)}
                            sx={{ color: "text.secondary" }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteFornecedor(fornecedor.id)}
                            sx={{ color: "text.secondary" }}
                          >
                            <DeleteIcon fontSize="small" />
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

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            variant="contained"
            onClick={handleFinalizarCompra}
            disabled={carrinhoItems.length === 0 || fornecedores.length === 0}
            sx={{
              bgcolor: "#ffccd5",
              color: "black",
              px: 6,
              py: 1.5,
              borderRadius: 28,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#ffb6c1",
              },
              "&.Mui-disabled": {
                bgcolor: "#f5f5f5",
                color: "#aaa",
              },
              width: "300px",
            }}
          >
            Finalizar compra
          </Button>
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
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {selectedFornecedor && (
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
                Detalhes do Fornecedor
              </Typography>
              <IconButton onClick={handleCloseViewModal} size="large" sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#333" }}>
                    {selectedFornecedor.nome || "Nome não informado"}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CreditCardIcon sx={{ color: "#00509E", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00509E" }}>
                      Crédito: R$ {formatarValor(selectedFornecedor.valorCredito)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Informações de Contato
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PersonIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Nome:</strong> {selectedFornecedor.nome || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhoneIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Contato:</strong> {selectedFornecedor.contato || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <KeyIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Chave Pix:</strong> {selectedFornecedor.chavePix || "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Endereço
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Endereço:</strong> {selectedFornecedor.endereco || "N/A"}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Cidade:</strong> {selectedFornecedor.cidade || "N/A"}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Estado:</strong> {selectedFornecedor.estado || "N/A"}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>CEP:</strong> {selectedFornecedor.cep || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mt: 2, bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Observações
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFornecedor.observacoes || "Nenhuma observação"}
                    </Typography>
                  </Box>
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
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Modal de Finalizar Compra */}
      <Dialog
        open={openFinalizarModal}
        onClose={handleCloseFinalizarModal}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            bgcolor: "white",
            maxWidth: "500px",
            width: "100%",
            m: 0,
            p: 0,
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#ffccd5",
            p: 2,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          Finalizar compra
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          {selectedFornecedor && (
            <Table sx={{ mb: 3, mt: 2 }}>
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
                    Nome Fornecedora
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
                    Crédito disponível
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
                    Total da venda
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
                    Crédito final
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
                    {selectedFornecedor.nome || "N/A"}
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
                    R$ {formatarValor(selectedFornecedor.valorCredito)}
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
                    R$ {formatarValor(totalVenda)}
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#f5f5f5",
                      color: calcularCreditoFinal() >= 0 ? "#008000" : "#d32f2f",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      p: 1.5,
                      textAlign: "center",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    R$ {formatarValor(calcularCreditoFinal())}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleConfirmFinalizarCompra}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 28,
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
              onClick={handleCloseFinalizarModal}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 28,
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

      {/* Modal de Confirmação de Exclusão */}
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
            Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <DialogContentText>
            {fornecedorToDelete ? (
              <>
                Tem certeza que deseja excluir o fornecedor <strong>{fornecedorToDelete.nome}</strong>?
              </>
            ) : (
              "Tem certeza que deseja excluir este fornecedor?"
            )}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: "#d32f2f" }}>Esta ação não pode ser desfeita.</DialogContentText>
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
            onClick={handleConfirmDelete}
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
  )
}
