"use client"

import { useState, useEffect, useMemo } from "react"
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
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material"
import Sidebar from "../../components/sidebar"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import { useRouter } from "next/router"

// Dados mockados para lotes
const mockLotes = [
  {
    id: 1,
    numero: "L001",
    data: "2023-03-15",
    fornecedora: "Fornecedora ABC Ltda",
  },
  {
    id: 2,
    numero: "L002",
    data: "2023-04-20",
    fornecedora: "Distribuidora XYZ S.A.",
  },
  {
    id: 3,
    numero: "L003",
    data: "2023-05-10",
    fornecedora: "Indústria Têxtil Nacional",
  },
  {
    id: 4,
    numero: "L004",
    data: "2023-06-05",
    fornecedora: "Confecções Moda Brasil",
  },
  {
    id: 5,
    numero: "L005",
    data: "2023-07-12",
    fornecedora: "Tecidos & Cia",
  },
  {
    id: 6,
    numero: "L006",
    data: "2023-08-18",
    fornecedora: "Fornecedora ABC Ltda",
  },
  {
    id: 7,
    numero: "L007",
    data: "2023-09-22",
    fornecedora: "Distribuidora XYZ S.A.",
  },
  {
    id: 8,
    numero: "L008",
    data: "2023-10-30",
    fornecedora: "Indústria Têxtil Nacional",
  },
]

// Serviço mockado para lotes
const LoteService = {
  getLotes: () => Promise.resolve(mockLotes),
  deleteLote: (id) => {
    return Promise.resolve(true)
  },
}

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

  // Initialize useRouter outside of conditional block
  const router = useRouter()

  useEffect(() => {
    fetchLotes()
  }, [])

  const fetchLotes = async () => {
    setLoading(true)
    try {
      // Usando o serviço mockado
      const lotesData = await LoteService.getLotes()
      setLotes(lotesData)
    } catch (error) {
      console.error("Erro ao buscar lotes:", error)
      setSnackbar({
        open: true,
        message: "Erro ao carregar lotes",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setLoteToDelete(id)
    setOpenDialog(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await LoteService.deleteLote(loteToDelete)
      setLotes((prev) => prev.filter((lote) => lote.id !== loteToDelete))
      setSnackbar({
        open: true,
        message: "Lote excluído com sucesso",
        severity: "success",
      })
    } catch (error) {
      console.error("Erro ao excluir lote:", error)
      setSnackbar({
        open: true,
        message: "Falha ao excluir lote",
        severity: "error",
      })
    } finally {
      setOpenDialog(false)
      setLoteToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setOpenDialog(false)
    setLoteToDelete(null)
  }

  const handleNavigateToRegister = () => {
    try {
      router.push("./cadastrar_lote")
    } catch (error) {
      console.error("Erro ao navegar:", error)
      // Fallback navigation
      window.location.href = "./cadastrar_lote"
    }
  }

  const handleNavigateToView = (lote) => {
    try {
L
      router.push(
        `./visualizar_lote?id=${lote.numero}&data=${lote.data}&fornecedora=${encodeURIComponent(lote.fornecedora)}`,
      )
    } catch (error) {
      console.error("Erro ao navegar:", error)

      window.location.href = `./visualizar_lote?id=${lote.numero}&data=${lote.data}&fornecedora=${encodeURIComponent(lote.fornecedora)}`
    }
  }

  const handleNavigateToEdit = (id) => {
    try {
      router.push(`./editar_lote?id=${id}`)
    } catch (error) {
      console.error("Erro ao navegar:", error)
      // Fallback navigation
      window.location.href = `./editar_lote?id=${id}`
    }
  }

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const lotesFiltrados = useMemo(() => {
    return lotes.filter(
      (lote) =>
        lote.numero.toString().toLowerCase().includes(search.toLowerCase()) ||
        lote.fornecedora.toLowerCase().includes(search.toLowerCase()),
    )
  }, [lotes, search])

  const searchOptions = useMemo(() => {
    return [...new Set(lotes.map((lote) => lote.numero.toString()))]
  }, [lotes])

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: "250px",
          padding: "20px",
          height: "150vh",
          overflow: "hidden",
          marginTop: "50px",
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
            marginBottom: "50px",
          }}
        >
          Controle de Estoque
        </Typography>

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

        {/* Diálogo de confirmação para exclusão */}
        <Dialog
          open={openDialog}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirmar exclusão"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para feedback */}
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
      options={options}
      value={search}
      onChange={(event, newValue) => {
        setSearch(newValue || "")
      }}
      onInputChange={(event, newValue) => {
        setSearch(newValue || "")
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Pesquisar lote"
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
            maxWidth: "1800px",
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
        maxWidth: "1800px",
      }}
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
      marginTop: "20px",
      backgroundColor: "#F5F5F5",
      borderRadius: "20px",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        textAlign: "LEFT",
        marginBottom: "40px",
        fontSize: "35px",
        color: "#333",
        marginTop: "20px",
      }}
    >
      Lotes em Estoque
    </Typography>

    <TableContainer sx={{ maxHeight: "600px", borderRadius: "10px", overflow: "hidden" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {["Lotes", "Data", "Fornecedoras", "Ação"].map((header) => (
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
                Carregando lotes...
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
                <TableCell align="center">{new Date(lote.data).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell align="center">{lote.fornecedora}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleNavigateToView(lote)} sx={{ marginRight: 1, color: "#00509E" }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleNavigateToEdit(lote.id)} sx={{ marginRight: 1, color: "#00509E" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(lote.id)} sx={{ color: "#00509E" }}>
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
      labelRowsPerPage="Itens por página"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      sx={{
        marginTop: "10px",
        bgcolor: "#F5F5F5",
        borderRadius: "10px",
      }}
    />
  </Card>
)
export default EstoquePage

