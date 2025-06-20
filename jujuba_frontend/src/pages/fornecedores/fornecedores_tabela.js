"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import PersonIcon from "@mui/icons-material/Person"
import CloseIcon from "@mui/icons-material/Close"
import axios from "axios"
import { useRouter } from "next/navigation"
import SearchIcon from "@mui/icons-material/Search"
import Sidebar from "../../components/sidebar"
import { forwardRef } from "react"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

// Transição personalizada para o modal
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const FornecedoresPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [fornecedores, setFornecedores] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState("")
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    fornecedor: null,
  })
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const router = useRouter()

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await axios.get(BASE_URL)
        setFornecedores(response.data)
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error.message)
        setSnackbar({
          open: true,
          message: "Erro ao carregar fornecedores",
          severity: "error",
        })
      }
    }
    fetchFornecedores()
  }, [])

  const deleteFornecedora = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`)
      console.log("Fornecedor deletado com sucesso:", response.data)
      setFornecedores((prev) => prev.filter((fornecedora) => fornecedora.id !== id))

      setSnackbar({
        open: true,
        message: "Fornecedor deletado com sucesso!",
        severity: "success",
      })
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error)
      setSnackbar({
        open: true,
        message: "Erro ao deletar fornecedor. Tente novamente.",
        severity: "error",
      })
    }
  }, [])

  const handleNavigateToRegister = () => {
    router.push("/fornecedores/cadastro_fornecedores")
  }

  const handleEditNavigation = (id) => {
    console.log("Navegando para edição com ID:", id)
    router.push(`/fornecedores/editar_fornecedores?id=${id}`)
  }

  const handleNavigation = (id) => {
    console.log("Navegando para visualização com ID:", id)
    router.push(`/fornecedores/visualizar_fornecedor?id=${id}`)
  }

  // Função para abrir o modal de confirmação
  const handleDeleteClick = (fornecedor) => {
    setDeleteModal({
      open: true,
      fornecedor: fornecedor,
    })
  }

  // Função para fechar o modal
  const handleCloseDeleteModal = () => {
    setDeleteModal({
      open: false,
      fornecedor: null,
    })
  }

  // Função para confirmar a exclusão
  const handleConfirmDelete = async () => {
    if (deleteModal.fornecedor) {
      await deleteFornecedora(deleteModal.fornecedor.id)
      handleCloseDeleteModal()
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const filteredFornecedores = useMemo(
    () => fornecedores.filter((fornecedora) => fornecedora.nome.toLowerCase().includes(searchTerm.toLowerCase())),
    [fornecedores, searchTerm],
  )

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
            Fornecedores
          </Typography>
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
            options={fornecedores.map((option) => option.nome)}
            value={search}
            onChange={(event, newValue) => {
              setSearch(newValue || "")
              setSearchTerm(newValue || "")
            }}
            onInputChange={(event, newValue) => {
              setSearch(newValue || "")
              setSearchTerm(newValue || "")
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

        <Card
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
                    borderRight: "2px solid #F5F5F5", // LINHA BRANCA ENTRE COLUNAS
                  }}
                >
                  Nome
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
                  Contato
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
                  Endereço
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
                  Chave Pix
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
                {filteredFornecedores
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((fornecedora) => (
                    <TableRow key={fornecedora.id}>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {fornecedora.nome}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {fornecedora.contato}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {fornecedora.endereco}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {fornecedora.chavePix}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          padding: "8px",
                          minWidth: "150px", // ajuste se quiser
                        }}
                      >
                        <IconButton onClick={() => handleNavigation(fornecedora.id)} sx={{ color: "#00509E" }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditNavigation(fornecedora.id)} sx={{ color: "#00509E" }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(fornecedora)} sx={{ color: "#d32f2f" }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredFornecedores.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <Button
            sx={{
              backgroundColor: "#FADADD",
              color: "black",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              border: "2px solid #FADADD",
              fontWeight: "bold",
              fontSize: "17px",
              borderRadius: "60px",
              padding: "10px 0",
              width: "300px",
              height: "50px",
              textTransform: "none",
            }}
            onClick={handleNavigateToRegister}
          >
            Cadastrar fornecedor
          </Button>
        </Box>
      </Box>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={deleteModal.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
            overflow: "visible",
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
            onClick={handleCloseDeleteModal}
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
                backgroundColor: "#ff5722",
                boxShadow: "0px 8px 20px rgba(255, 87, 34, 0.3)",
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              Confirmar Exclusão
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: "16px 24px",
                borderRadius: "15px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                border: "2px solid rgba(154, 228, 255, 0.5)",
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: "#9AE4FF",
                  width: 50,
                  height: 50,
                }}
              >
                <PersonIcon sx={{ color: "#333" }} />
              </Avatar>
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    mb: 0.5,
                  }}
                >
                  {deleteModal.fornecedor?.nome}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  ID: {deleteModal.fornecedor?.id}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: "#555",
                fontSize: "18px",
                lineHeight: 1.6,
                maxWidth: "400px",
              }}
            >
              Tem certeza que deseja excluir este fornecedor?
              <br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </Typography>
          </Box>
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
            onClick={handleCloseDeleteModal}
            sx={{
              backgroundColor: "#9AE4FF",
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
              "&:hover": {
                backgroundColor: "#7DD3FC",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: "#ff5722",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(255, 87, 34, 0.4)",
              "&:hover": {
                backgroundColor: "#e64a19",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(255, 87, 34, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Excluir
          </Button>
        </DialogActions>
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

export default FornecedoresPage
