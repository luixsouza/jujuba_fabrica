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
  Avatar,
  Slide,
} from "@mui/material"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import CloseIcon from "@mui/icons-material/Close"
import Sidebar from "../../components/sidebar"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import { useRouter } from "next/navigation"
import { getAllLotes, deletarLote, testConnection } from "../api/lotes"

// Transição personalizada para o modal
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const EstoquePage = () => {
  const [lotes, setLotes] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [loteToDelete, setLoteToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const router = useRouter()

  useEffect(() => {
    // Verificar conexão primeiro
    const checkConnection = async () => {
      try {
        const connectionTest = await testConnection()
        if (!connectionTest.sucesso) {
          setSnackbar({
            open: true,
            message: "⚠️ Problema de conexão com o servidor. Verifique se o backend está rodando na porta 8080.",
            severity: "warning",
          })
        }
      } catch (error) {
        console.log("Teste de conexão falhou:", error)
      }
    }

    checkConnection()
    fetchLotes()
  }, [])

  const fetchLotes = async () => {
    setLoading(true)
    try {
      const lotesData = await getAllLotes()
      const lotesFormatados = lotesData.map((lote) => ({
        id: lote.id,
        numero: `L${lote.id}`,
        data: new Date().toISOString(),
        fornecedora: lote.fornecedora?.nome || "Fornecedora não especificada",
        fornecedoraId: lote.fornecedora?.id,
        totalProdutos: lote.produtos?.length || 0,
        produtos: lote.produtos || [],
      }))

      setLotes(lotesFormatados)
      setSnackbar({
        open: true,
        message: `${lotesFormatados.length} lotes carregados com sucesso`,
        severity: "success",
      })
    } catch (error) {
      console.error("Erro ao buscar lotes:", error)
      setSnackbar({
        open: true,
        message: "Erro ao carregar lotes",
        severity: "error",
      })
      setLotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setLoteToDelete(id)
    setOpenDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!loteToDelete) return

    try {
      setLoading(true)

      console.log("Iniciando exclusão do lote:", loteToDelete)

      const response = await deletarLote(loteToDelete)
      console.log("Resposta da exclusão:", response)

      if (response && response.sucesso) {
        setLotes((prev) => prev.filter((lote) => lote.id !== loteToDelete))
        setSnackbar({
          open: true,
          message: response.mensagem || "Lote excluído com sucesso",
          severity: "success",
        })
      } else {
        setSnackbar({
          open: true,
          message: response?.mensagem || "Erro desconhecido ao excluir lote",
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Erro crítico ao excluir lote:", error)
      setSnackbar({
        open: true,
        message: `Erro crítico: ${error.message}. Verifique o console para mais detalhes.`,
        severity: "error",
      })
    } finally {
      setLoading(false)
      setOpenDialog(false)
      setLoteToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setOpenDialog(false)
    setLoteToDelete(null)
  }

  const handleNavigateToRegister = () => router.push("./cadastrar_lote")
  const handleNavigateToView = (lote) => router.push(`./visualizar_produto?id=${lote.id}`)
  const handleNavigateToEdit = (id) => router.push(`./editar_produto?id=${id}`)

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false })

  const lotesFiltrados = useMemo(
    () =>
      lotes.filter(
        (lote) =>
          lote.numero.toLowerCase().includes(search.toLowerCase()) ||
          lote.fornecedora.toLowerCase().includes(search.toLowerCase()),
      ),
    [lotes, search],
  )

  const searchOptions = useMemo(() => [...new Set(lotes.map((lote) => lote.numero.toString()))], [lotes])

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar lotes={lotes} />
      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, sm: "290px" },
          paddingTop: "3rem",
          paddingX: { xs: "1rem", sm: "2rem" },
          backgroundColor: "#9AE4FF",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "80px" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "50px", color: "#000000" }}>
            Estoque
          </Typography>
        </Box>

        <SearchField search={search} setSearch={setSearch} options={searchOptions} />

        <LotesTable
          lotesFiltrados={lotesFiltrados}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleDeleteClick={handleDeleteClick}
          handleNavigateToView={handleNavigateToView}
          handleNavigateToEdit={handleNavigateToEdit}
          loading={loading}
        />

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <Button
            sx={{
              backgroundColor: "#FADADD",
              color: "black",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              border: "2px solid #FADADD",
              fontWeight: "bold",
              fontSize: "20px",
              borderRadius: "60px",
              padding: "10px 0",
              width: "300px",
              height: "50px",
              textTransform: "none",
            }}
            onClick={handleNavigateToRegister}
            variant="contained"
          >
            Cadastrar Lote
          </Button>
        </Box>

        {/* Modal de Confirmação de Exclusão */}
        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCancelDelete}
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
              onClick={handleCancelDelete}
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
                  <Typography sx={{ fontWeight: "bold", color: "#333" }}>L</Typography>
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
                    Lote L{loteToDelete}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    ID: {loteToDelete}
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
                Tem certeza que deseja excluir este lote?
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
              onClick={handleCancelDelete}
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

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}

const SearchField = ({ search, setSearch, options }) => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" }}>
    <Autocomplete
      freeSolo
      options={options}
      value={search}
      onChange={(e, newValue) => setSearch(newValue || "")}
      onInputChange={(e, newValue) => setSearch(newValue || "")}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Pesquisar lote"
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
              "& fieldset": { borderColor: "#CCCCCC" },
              "&:hover fieldset": { borderColor: "#00509E" },
              "&.Mui-focused fieldset": { borderColor: "#00509E" },
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
            },
            "& .MuiInputBase-input": {
              padding: "14px 20px",
              fontSize: "18px",
            },
          }}
        />
      )}
      sx={{ width: "100%", maxWidth: "1800px" }}
    />
  </Box>
)

const LotesTable = ({
  lotesFiltrados,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteClick,
  handleNavigateToView,
  handleNavigateToEdit,
  loading,
}) => (
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
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {["Lotes", "Fornecedora", "Total de Produtos", "Ação"].map((header) => (
              <TableCell
                key={header}
                sx={{
                  fontSize: "18px",
                  fontWeight: "normal",
                  backgroundColor: "#FADADD",
                  borderRight: "2px solid #F5F5F5",
                  textAlign: "center",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={40} sx={{ color: "#FADADD" }} />
                </Box>
              </TableCell>
            </TableRow>
          ) : lotesFiltrados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Nenhum lote encontrado
              </TableCell>
            </TableRow>
          ) : (
            lotesFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lote) => (
              <TableRow key={lote.id} hover>
                <TableCell align="center">{lote.numero}</TableCell>
                <TableCell align="center">{lote.fornecedora}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#00509E" }}>
                      {lote.totalProdutos}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {lote.totalProdutos === 1 ? "produto" : "produtos"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleNavigateToView(lote)} sx={{ marginRight: 1, color: "#00509E" }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleNavigateToEdit(lote.id)} sx={{ marginRight: 1, color: "#00509E" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(lote.id)} sx={{ color: "#d32f2f" }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      component="div"
      count={lotesFiltrados.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
    />
  </Card>
)

export default EstoquePage
