"use client"

import { useState, useEffect, useMemo, forwardRef } from "react"
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
  TablePagination,
  TextField,
  Button,
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  Chip,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Sidebar from "../../components/sidebar"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import SearchIcon from "@mui/icons-material/Search"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import InventoryIcon from "@mui/icons-material/Inventory"
import QrCodeIcon from "@mui/icons-material/QrCode"
import CategoryIcon from "@mui/icons-material/Category"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useRouter } from "next/navigation"
// Importação de API apenas para produtos
import { listarProdutos } from "../api/produtos"

const Transition = forwardRef(function Transition(props, ref) {
  return <div ref={ref} {...props} />
})

export default function EstoquePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [produtos, setProdutos] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [searchOptions, setSearchOptions] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [openProductModal, setOpenProductModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [openEditModal, setOpenEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editFormData, setEditFormData] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    genero: "",
    estadoConservacao: "",
    quantidade: 0,
    preco: 0,
  })

  // Estados de Snackbar para feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Efeito para buscar produtos
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        // Buscar todos os produtos disponíveis
        const productsResponse = await listarProdutos()
        if (productsResponse.sucesso && productsResponse.produtos) {
          setProdutos(productsResponse.produtos)
          const options = productsResponse.produtos
            .flatMap((p) => [p.id?.toString(), p.descricao, p.marca, p.genero])
            .filter(Boolean)
          setSearchOptions([...new Set(options)])
        } else {
          console.error("Erro ao buscar produtos:", productsResponse.mensagem)
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

  const handleOpenProductModal = (produto) => {
    setProdutoSelecionado(produto)
    setOpenProductModal(true)
  }

  const handleCloseProductModal = () => {
    setOpenProductModal(false)
  }

  // Função para editar produto
  const handleEditProduct = (produto) => {
    setEditingProduct(produto)
    setEditFormData({
      descricao: produto.descricao || "",
      marca: produto.marca || "",
      tamanho: produto.tamanho || "",
      genero: produto.genero || "",
      estadoConservacao: produto.estadoConservacao || "",
      quantidade: produto.quantidade || 0,
      preco: produto.preco || 0,
    })
    setOpenEditModal(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setEditingProduct(null)
  }

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveEdit = async () => {
    try {
      // Aqui você implementaria a chamada da API para salvar as alterações
      console.log("Salvando alterações:", editFormData)

      // Atualizar o produto na lista local
      setProdutos((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...editFormData } : p)))

      setSnackbar({
        open: true,
        message: `Produto "${editFormData.descricao}" atualizado com sucesso!`,
        severity: "success",
      })

      handleCloseEditModal()
    } catch (error) {
      console.error("Erro ao salvar alterações:", error)
      setSnackbar({
        open: true,
        message: "Erro ao salvar alterações do produto.",
        severity: "error",
      })
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false })

  const filteredProdutos = useMemo(() => {
    return produtos.filter((produto) => {
      const query = searchQuery.toLowerCase()
      return (
        produto.id?.toString().toLowerCase().includes(query) ||
        produto.descricao?.toLowerCase().includes(query) ||
        produto.marca?.toLowerCase().includes(query) ||
        produto.genero?.toLowerCase().includes(query)
      )
    })
  }, [produtos, searchQuery])

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
        {/* Header */}
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
            Estoque
          </Typography>
        </Box>

        {/* Search Bar */}
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
                placeholder="Pesquisar produtos por ID, descrição, marca ou gênero"
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

        {/* Tabela de Produtos em Estoque */}
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
            Produtos disponíveis
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
                    <TableCell colSpan={9} align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                        <CircularProgress size={40} sx={{ color: "#FADADD" }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : filteredProdutos.length > 0 ? (
                  filteredProdutos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produto, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.descricao}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.marca || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.tamanho || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.genero || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.estadoConservacao}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.quantidade || 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        R$ {produto.preco ? produto.preco.toFixed(2).replace(".", ",") : "0,00"}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          padding: "8px",
                          minWidth: "150px",
                        }}
                      >
                        <IconButton onClick={() => handleOpenProductModal(produto)} sx={{ color: "#00509E" }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditProduct(produto)} sx={{ color: "#00509E" }}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                      Nenhum produto encontrado no estoque
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredProdutos.length}
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
                Detalhes do Produto
              </Typography>
              <IconButton onClick={handleCloseProductModal} size="large" sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Informações do Produto - agora ocupa toda a largura */}
                <Grid item xs={12}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#333" }}>
                    {produtoSelecionado.descricao}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: "#00509E", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00509E" }}>
                      R$ {produtoSelecionado.preco ? produtoSelecionado.preco.toFixed(2).replace(".", ",") : "0,00"}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={produtoSelecionado.estadoConservacao}
                      color="success"
                      sx={{ fontWeight: 600, fontSize: "1rem", py: 2.5, px: 1 }}
                    />
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
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => handleEditProduct(produtoSelecionado)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: "#FADADD",
                  color: "#333",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#ffb6c1",
                  },
                }}
              >
                Editar Produto
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Modal de Edição */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {editingProduct && (
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
                Editar Produto - ID: {editingProduct.id}
              </Typography>
              <IconButton onClick={handleCloseEditModal} size="large" sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={editFormData.descricao}
                    onChange={(e) => handleEditFormChange("descricao", e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Marca"
                    value={editFormData.marca}
                    onChange={(e) => handleEditFormChange("marca", e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tamanho"
                    value={editFormData.tamanho}
                    onChange={(e) => handleEditFormChange("tamanho", e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Gênero"
                    value={editFormData.genero}
                    onChange={(e) => handleEditFormChange("genero", e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estado de Conservação"
                    value={editFormData.estadoConservacao}
                    onChange={(e) => handleEditFormChange("estadoConservacao", e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantidade"
                    type="number"
                    value={editFormData.quantidade}
                    onChange={(e) => handleEditFormChange("quantidade", Number.parseInt(e.target.value) || 0)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Preço (R$)"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={editFormData.preco}
                    onChange={(e) => handleEditFormChange("preco", Number.parseFloat(e.target.value) || 0)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Button
                variant="outlined"
                onClick={handleCloseEditModal}
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
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: "#FADADD",
                  color: "#333",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#ffb6c1",
                  },
                }}
              >
                Salvar Alterações
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
