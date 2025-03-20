"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material"
import { ArrowBack, Home } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

export default function FornecedoresEdicao() {
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [fornecedora, setFornecedora] = useState({
    nome: "",
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
    dataDeNascimento: "",
  })

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [contratoAtual, setContratoAtual] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })


  useEffect(() => {
    if (id) {
      fetchFornecedora(id)
    }
  }, [id])

  const fetchFornecedora = async (fornecedoraId) => {
    try {
      setFetchLoading(true)
      const response = await axios.get(`${BASE_URL}/${fornecedoraId}`)
      const data = response.data

      setFornecedora({
        nome: data.nome || "",
        contato: data.contato || "",
        endereco: data.endereco || "",
        chavePix: data.chavePix || "",
        dataDeNascimento: data.dataDeNascimento || "",
        contratoUrl: data.contratoUrl || "",
      })

      if (data.contratoUrl) {
        setContratoAtual(data.contratoUrl)
      }
    } catch (error) {
      console.error("Erro ao buscar dados do fornecedor:", error)
      setSnackbar({
        open: true,
        message: "Erro ao carregar dados do fornecedor",
        severity: "error",
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFornecedora((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFornecedora((prev) => ({
        ...prev,
        contratoUrl: file.name,
      }))
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const updateFornecedora = async (values) => {
    if (!id) {
      throw new Error("ID do fornecedor não encontrado")
    }

    try {
      const formData = new FormData()


      const fornecedoraData = {
        id: id,
        nome: values.nome || "N/A",
        contato: values.contato || "N/A",
        endereco: values.endereco || "N/A",
        chavePix: values.chavePix || "N/A",
        dataDeNascimento: values.dataDeNascimento || "N/A",
        contratoUrl: selectedFile ? null : contratoAtual,
      }


      formData.append("fornecedora", JSON.stringify(fornecedoraData))


      if (selectedFile) {
        formData.append("contratoUrl", selectedFile)
      }

      const response = await axios.put(`${BASE_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error)
      throw error
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!fornecedora.nome || !fornecedora.contato || !fornecedora.endereco) {
      setSnackbar({
        open: true,
        message: "Por favor, preencha todos os campos obrigatórios.",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      const data = await updateFornecedora(fornecedora)
      console.log("Fornecedor atualizado com sucesso:", data)

      setSnackbar({
        open: true,
        message: "Fornecedor atualizado com sucesso!",
        severity: "success",
      })

      setTimeout(() => {
        router.push("/fornecedores/fornecedores_tabela")
      }, 2000)
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error)
      setSnackbar({
        open: true,
        message: error.message || "Erro ao atualizar fornecedor. Tente novamente.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#9AE4FF",
          minHeight: "100vh",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "250px" } }}>
          <Sidebar />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#FADADD" }} />
          <Typography variant="h6" sx={{ ml: 2, color: "#333" }}>
            Carregando dados do fornecedor...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#9AE4FF",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "250px" } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ mb: 1, textAlign: "center", mt: { xs: 4, md: 8 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", marginBottom: "20px", fontSize: { xs: "30px", md: "40px" } }}
          ></Typography>
        </Box>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <Card
            sx={{
              borderRadius: 10,
              backgroundColor: "#FADADD",
              p: 3,
              maxWidth: "150%",
              mx: "auto",
              mt: { xs: 4, md: 8 },
              height: "auto",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}></Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container direction="column" alignItems="center" spacing={1}>
                    <Grid item xs={12} display="flex" justifyContent="flex-start" width="100%" alignItems="center">
                      <ArrowBack
                        sx={{
                          fontSize: "30px",
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => router.back()}
                      />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="flex-end" width="100%" alignItems="center">
                      <Home
                        sx={{
                          fontSize: "30px",
                          cursor: "pointer",
                          color: "black",
                          marginTop: "-40px",
                        }}
                        onClick={() => router.push("/")}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 4,
                          fontSize: { xs: "35px", md: "45px" },
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Edição de Fornecedor
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Chip
                          label={`ID: ${id}`}
                          color="primary"
                          sx={{
                            backgroundColor: "rgba(154, 228, 255, 0.8)",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={8} md={7}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                  >
                    Nome
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nome do Fornecedor"
                    name="nome"
                    onChange={handleChange}
                    required
                    value={fornecedora.nome}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={8} md={7}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                  >
                    Contato
                  </Typography>
                  <TextField
                    fullWidth
                    label="Contato"
                    name="contato"
                    onChange={handleChange}
                    required
                    value={fornecedora.contato}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={8} md={7}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                  >
                    Endereço
                  </Typography>
                  <TextField
                    fullWidth
                    label="Endereço"
                    name="endereco"
                    onChange={handleChange}
                    required
                    value={fornecedora.endereco}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={8} md={7}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                  >
                    Chave Pix
                  </Typography>
                  <TextField
                    fullWidth
                    label="Chave Pix"
                    name="chavePix"
                    onChange={handleChange}
                    value={fornecedora.chavePix}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={8} md={7}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                  >
                    Data de Nascimento
                  </Typography>
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    name="dataDeNascimento"
                    onChange={handleChange}
                    value={fornecedora.dataDeNascimento}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "center",
                    gap: { xs: 2, sm: 3 },
                  }}
                >
                  <Button
                    component="label"
                    disabled={loading}
                    sx={{
                      color: "Black",
                      backgroundColor: "#50abe4",
                      textTransform: "none",
                      width: { xs: "100%", sm: "250px" },
                      fontWeight: "bold",
                      fontSize: { xs: "16px", md: "18px" },
                      borderRadius: "50px",
                      padding: "10px 20px",
                      height: "56px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "&:hover": {
                        backgroundColor: "#003B6F",
                      },
                      "&:disabled": {
                        backgroundColor: "#cccccc",
                        color: "#666666",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
                    ) : selectedFile ? (
                      "Contrato Selecionado"
                    ) : contratoAtual ? (
                      "Trocar Contrato"
                    ) : (
                      "Upload de Contrato"
                    )}
                    <input type="file" name="contrato" hidden onChange={handleFileChange} />
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    sx={{
                      color: "Black",
                      backgroundColor: "#50abe4",
                      textTransform: "none",
                      width: { xs: "100%", sm: "250px" },
                      fontWeight: "bold",
                      fontSize: { xs: "16px", md: "18px" },
                      borderRadius: "50px",
                      padding: "10px 20px",
                      height: "56px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "&:hover": {
                        backgroundColor: "#003B6F",
                      },
                      "&:disabled": {
                        backgroundColor: "#cccccc",
                        color: "#666666",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

