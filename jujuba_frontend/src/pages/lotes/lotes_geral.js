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
  CircularProgress,
} from "@mui/material"
import Sidebar from "../../components/sidebar"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import { useRouter } from "next/navigation"

// Importando as funções da API
import { getAllLotes, deletarLote } from "../api/lotes"

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
    fetchLotes()
  }, [])

  const fetchLotes = async () => {
    setLoading(true)
    try {
      const response = await getAllLotes()
      if (response && Array.isArray(response)) {
        const lotesFormatados = response.map((lote) => ({
          id: lote.id,
          numero: `L${lote.id}`,
          data: lote.dataCriacao || new Date().toISOString(),
          fornecedora: lote.fornecedora?.nome || "Fornecedora não especificada",
        }))
        setLotes(lotesFormatados)
      } else {
        setLotes([])
      }
    } catch (error) {
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
      setLoading(true)
      await deletarLote(loteToDelete)
      setLotes((prev) => prev.filter((lote) => lote.id !== loteToDelete))
      setSnackbar({
        open: true,
        message: "Lote excluído com sucesso",
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Falha ao excluir lote",
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

  const handleNavigateToRegister = () => {
    router.push("./cadastrar_lote")
  }

  const handleNavigateToView = (lote) => {
    router.push(`./visualizar_lote?id=${lote.id}`)
  }

  const handleNavigateToEdit = (id) => {
    router.push(`./editar_lote?id=${id}`)
  }

  const handleChangePage = (event, newPage) => setPage(newPage)

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const lotesFiltrados = useMemo(() => {
    return lotes.filter(
      (lote) =>
        lote.numero.toLowerCase().includes(search.toLowerCase()) ||
        lote.fornecedora.toLowerCase().includes(search.toLowerCase()),
    )
  }, [lotes, search])

  const searchOptions = useMemo(() => {
    return [...new Set(lotes.map((lote) => lote.numero))]
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
              color: "#000000",
            }}
        >
          Lotes
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
}) => {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        padding: "20px",
        maxWidth: "100%",
        overflowX: "auto",
      }}
    >
      <TableContainer>
        <Table stickyHeader aria-label="lotes table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "normal", fontSize: "20px" }}>
                Número do Lote
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "normal", fontSize: "20px" }}>
                Data de Criação
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "normal", fontSize: "20px" }}>
                Fornecedora
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "normal", fontSize: "20px" }}>
                Ações
              </TableCell>
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
                  Nenhum lote encontrado.
                </TableCell>
              </TableRow>
            ) : (
              lotesFiltrados
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lote) => (
                  <TableRow key={lote.id}>
                    <TableCell align="center" sx={{ fontWeight: "normal", fontSize: "20px" }}>
                      {lote.numero}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", fontSize: "20px" }}>
                      {new Date(lote.data).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "normal", fontSize: "20px" }}>
                      {lote.fornecedora}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="visualizar"
                        onClick={() => handleNavigateToView(lote)}
                        size="large"
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="editar"
                        onClick={() => handleNavigateToEdit(lote.id)}
                        size="large"
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="excluir"
                        onClick={() => handleDeleteClick(lote.id)}
                        size="large"
                        color="error"
                      >
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={lotesFiltrados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  )
}

export default EstoquePage