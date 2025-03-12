"use client"

import { useState, useEffect } from "react"
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
  Button,
  Autocomplete,
  TextField,
} from "@mui/material"
import Sidebar from "../../components/sidebar"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useRouter } from "next/navigation"
import axios from "axios"

const LotesPage = () => {
  const [lotes, setLotes] = useState([])
  const [loteCodes, setLoteCodes] = useState([])

  // URL da API de lotes
  const BASE_URL = "http://127.0.0.1:8000/lotes/"

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState("")
  const router = useRouter()

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get(BASE_URL)
        // Ajuste os dados da API para incluir 'dataCriacao' se necessário
        const lotesData = response.data.map((lote) => ({
          ...lote,
          dataCriacao: lote.dataCriacao || "2023-01-01", // Valor padrão se a API não fornecer 'dataCriacao'
        }))
        setLotes(lotesData)

        // Extract unique lot IDs for autocomplete
        const codes = lotesData.map((lote) => lote.id.toString())
        setLoteCodes([...new Set(codes)])
      } catch (error) {
        console.error("Erro ao buscar lotes:", error.message)
        setLotes([]) // Define como array vazio em caso de erro
        setLoteCodes([])
      }
    }
    fetchLotes()
  }, [])

  // Função para excluir um lote
  const handleDeleteLote = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este lote?")) {
      try {
        await axios.delete(`${BASE_URL}${id}/`)
        setLotes((prev) => prev.filter((lote) => lote.id !== id))
        alert("Lote excluído com sucesso!")
      } catch (error) {
        console.error("Erro ao excluir lote:", error.message)
        alert("Erro ao excluir lote. Tente novamente.")
      }
    }
  }

  const handleNavigateToRegister = () => {
    router.push("./cadastrar_lote")
  }

  const handleViewLote = (id) => {
    router.push(`./visualizar_lote?id=${id}`)
  }

  const handleEditLote = (id) => {
    router.push(`./editar_lote?id=${id}`)
  }

  // Formatar data para exibição
  const formatarData = (dataString) => {
    if (!dataString) return "N/A"
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  // Filtra os lotes pelo campo de pesquisa
  const lotesFiltrados = lotes.filter((lote) => search === "" || lote.id.toString().includes(search))

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: "250px",
          padding: "20px",
          height: "100vh",
          overflow: "hidden",
          marginTop: "50px",
        }}
      >
        <Box sx={{ marginBottom: "50px" }}>
          <Typography
            variant="h4"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "50px",
            }}
          >
            Gerenciamento de Lotes
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
            options={loteCodes}
            value={search}
            onChange={(event, newValue) => {
              setSearch(newValue || "")
            }}
            onInputChange={(event, newInputValue) => {
              setSearch(newInputValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pesquisar por ID do lote"
                variant="outlined"
                size="medium"
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
            Lotes
          </Typography>

          <TableContainer sx={{ maxHeight: "600px", borderRadius: "10px", overflow: "hidden" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: "18px",
                      fontWeight: "normal",
                      backgroundColor: "#f8c0e0",
                      borderRight: "2px solid #F5F5F5",
                      textAlign: "center",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "18px",
                      backgroundColor: "#f8c0e0",
                      fontWeight: "normal",
                      borderRight: "2px solid #F5F5F5",
                      textAlign: "center",
                    }}
                  >
                    Data
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: "18px",
                      fontWeight: "lighter",
                      backgroundColor: "#f8c0e0",
                      borderRight: "2px solid #F5F5F5",
                      textAlign: "center",
                    }}
                  >
                    Fornecedora
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "normal",
                      backgroundColor: "#f8c0e0",
                      borderRight: "2px solid #F5F5F5",
                      textAlign: "center",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lotesFiltrados.length > 0 ? (
                  lotesFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lote) => (
                    <TableRow key={lote.id} hover>
                      <TableCell align="center">{lote.id}</TableCell>
                      <TableCell align="center">{formatarData(lote.dataCriacao)}</TableCell>
                      <TableCell align="center">{lote.fornecedora || "N/A"}</TableCell>
                      <TableCell align="center">
                        <IconButton sx={{ marginRight: 1, color: "#00509E" }} onClick={() => handleViewLote(lote.id)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton sx={{ marginRight: 1, color: "#00509E" }} onClick={() => handleEditLote(lote.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteLote(lote.id)} sx={{ color: "#00509E" }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum lote encontrado
                    </TableCell>
                  </TableRow>
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
            sx={{
              marginTop: "10px",
              bgcolor: "#F5F5F5",
              borderRadius: "10px",
            }}
            labelRowsPerPage="Itens por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <Button
            sx={{
              backgroundColor: "#f8c0e0",
              color: "black",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              border: "2px solid #f8c0e0",
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
            Cadastrar lote
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default LotesPage

