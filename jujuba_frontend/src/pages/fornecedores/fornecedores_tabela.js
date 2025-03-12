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
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import axios from "axios"
import { useRouter } from "next/router"
import SearchIcon from "@mui/icons-material/Search"
import { Suspense, lazy } from "react"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

const FornecedoresPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [fornecedores, setFornecedores] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState("")
  const router = useRouter()
  const Sidebar = lazy(() => import("../../components/sidebar"))
  const [values, setValues] = useState({
    nome: "",
    contato: "",
    endereco: "",
    chavePix: "",
  })

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await axios.get(BASE_URL)
        setFornecedores(response.data)
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error.message)
      }
    }
    fetchFornecedores()
  }, [])

  const deleteFornecedora = useCallback(
    async (id) => {
      try {
        const formData = new FormData()
        formData.append(
          "fornecedora",
          JSON.stringify({
            id,
            nome: values.nome,
            contato: values.contato,
            endereco: values.endereco,
            chavePix: values.chavePix,
          }),
        )
        const response = await axios.post(`${BASE_URL}/delete`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        console.log("Fornecedor deletado com sucesso:", response.data)
        setFornecedores((prev) => prev.filter((fornecedora) => fornecedora.id !== id))
        alert("Fornecedor deletado com sucesso!")
      } catch (error) {
        console.error("Erro ao deletar fornecedor:", error)
        alert("Erro ao deletar fornecedor.")
      }
    },
    [values],
  )

  const handleNavigateToRegister = () => {
    if (router) {
      router.push("./cadastro_fornecedores")
    }
  }

  const handleEditNavigation = (id) => {
    router.push(`./editar_fornecedores?id=${id}`)
  }

  const handleNavigation = () => {
    router.push("./visualizar_fornecedor")
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
    <Box sx={{ display: "flex", backgroundColor: "#50abe4", minHeight: "100vh", backgroundColor: "#9AE4FF" }}>
      <Suspense fallback={<div>Carregando...</div>}>
        <Sidebar />
      </Suspense>
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
                label="Pesquisar fornecedora"
                variant="outlined"
                color="blue"
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
                    }}
                  >
                    Nome
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Contato
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Endereço
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Chave Pix
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFornecedores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fornecedora) => (
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
                    <TableCell>
                      <IconButton onClick={handleNavigation} sx={{ marginRight: 1, color: "#00509E" }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleEditNavigation(fornecedora.id)}
                        sx={{ marginRight: 1, color: "#00509E" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteFornecedora(fornecedora.id)} sx={{ color: "#00509E" }}>
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
    </Box>
  )
}

export default FornecedoresPage

