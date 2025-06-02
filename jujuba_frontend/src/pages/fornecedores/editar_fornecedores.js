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
  InputAdornment,
} from "@mui/material"
import { ArrowBack, Home } from "@mui/icons-material"
import Sidebar from "../../../../components/sidebar"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

// Função para editar fornecedora
const editarFornecedora = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Erro ao editar fornecedora")
  }
}

export default function FornecedoresEdicao() {
  const theme = useTheme()
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Alterar a estrutura do estado fornecedora para corresponder ao backend
  const [fornecedora, setFornecedora] = useState({
    nome: "",
    dataNascimento: "", // Alterado de dataDeNascimento para dataNascimento para corresponder ao backend
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
    creditoLoja: "", // Adicionado campo que existe no backend
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
    if (id && typeof id === "string") {
      fetchFornecedora(id)
    }
  }, [id])

  // Modificar a função fetchFornecedora para formatar a data corretamente
  const fetchFornecedora = async (fornecedoraId) => {
    try {
      setFetchLoading(true)
      console.log("Buscando fornecedor com ID:", fornecedoraId)

      const response = await axios.get(`${BASE_URL}/${fornecedoraId}`)
      console.log("Resposta da API:", response.data)

      const data = response.data

      // Formatação da data para o formato esperado pelo input type="date"
      let dataFormatada = data.dataNascimento || ""
      if (dataFormatada && dataFormatada.includes("/")) {
        const partes = dataFormatada.split("/")
        if (partes.length === 3) {
          // Converter de dd/MM/yyyy para yyyy-MM-dd
          dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`
        }
      }

      setFornecedora({
        nome: data.nome || "",
        dataNascimento: dataFormatada, // Usando o nome correto do campo
        contato: data.contato || "",
        endereco: data.endereco || "",
        chavePix: data.chavePix || "",
        contratoUrl: data.contratoUrl || "",
        creditoLoja: data.creditoLoja || "",
      })

      if (data.contratoUrl) {
        setContratoAtual(data.contratoUrl)
      }

      setSnackbar({
        open: true,
        message: "Dados carregados com sucesso!",
        severity: "success",
      })
    } catch (error) {
      console.error("Erro ao buscar dados do fornecedor:", error)
      setSnackbar({
        open: true,
        message: `Erro ao carregar dados do fornecedor: ${error.response?.data?.message || error.message}`,
        severity: "error",
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    console.log(`Campo ${name} alterado para:`, value)
    setFornecedora((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log("Arquivo selecionado:", file.name)
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

  // Modificar a função handleSubmit para formatar a data corretamente antes de enviar
  const handleSubmit = async (event) => {
    event.preventDefault()

    console.log("Dados do formulário antes da validação:", fornecedora)

    if (!fornecedora.nome.trim() || !fornecedora.contato.trim() || !fornecedora.endereco.trim()) {
      setSnackbar({
        open: true,
        message: "Por favor, preencha todos os campos obrigatórios (Nome, Contato e Endereço).",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()

      formData.append("nome", fornecedora.nome)

      // Converter a data de yyyy-MM-dd para dd/MM/yyyy antes de enviar
      if (fornecedora.dataNascimento) {
        const [ano, mes, dia] = fornecedora.dataNascimento.split("-")
        const dataFormatada = `${dia}/${mes}/${ano}`
        formData.append("dataNascimento", dataFormatada)
      }

      formData.append("contato", fornecedora.contato)
      formData.append("endereco", fornecedora.endereco)
      formData.append("chavePix", fornecedora.chavePix)
      if (fornecedora.creditoLoja) {
        formData.append("creditoLoja", fornecedora.creditoLoja)
      }

      if (selectedFile) {
        formData.append("contratoFile", selectedFile)
      }

      console.log("Dados enviados para API (FormData):", formData)

      const data = await editarFornecedora(id, formData)
      console.log("Fornecedor atualizado com sucesso:", data)

      setSnackbar({
        open: true,
        message: "Fornecedor atualizado com sucesso!",
        severity: "success",
      })

      setTimeout(() => {
        router.push("/fornecedores")
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
        <Box sx={{ mb: 1, textAlign: "center", mt: { xs: 4, md: 8 } }}></Box>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <Card
            sx={{
              borderRadius: 10,
              backgroundColor: "#FADADD",
              p: 3,
              maxWidth: "60%",
              mx: "auto",
              mt: { xs: 4, md: 8 },
              height: "auto",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container direction="column" alignItems="center" spacing={1}>
                    <Grid item xs={12} width="100%">
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <ArrowBack
                          sx={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color: "black",
                          }}
                          onClick={() => router.back()}
                        />
                        <Home
                          sx={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color: "black",
                          }}
                          onClick={() => router.push("/")}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 1,
                          fontSize: { xs: "35px", md: "45px" },
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Edição de Fornecedor
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          color: "gray",
                          textAlign: "center",
                          mb: 1,
                        }}
                      >
                        Campos com <span style={{ color: "red" }}>*</span> são obrigatórios
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

                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Nome <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="nome"
                        onChange={handleChange}
                        required
                        value={fornecedora.nome}
                        variant="outlined"
                        label=""
                        placeholder=""
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

                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Data de Nascimento <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="dataNascimento"
                        onChange={handleChange}
                        required
                        value={fornecedora.dataNascimento}
                        variant="outlined"
                        label=""
                        placeholder=""
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
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

                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Contato <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="contato"
                        onChange={handleChange}
                        required
                        value={fornecedora.contato}
                        variant="outlined"
                        label=""
                        placeholder=""
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

                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Endereço <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="endereco"
                        onChange={handleChange}
                        required
                        value={fornecedora.endereco}
                        variant="outlined"
                        label=""
                        placeholder=""
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

                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Chave Pix
                      </Typography>
                      <TextField
                        fullWidth
                        name="chavePix"
                        onChange={handleChange}
                        value={fornecedora.chavePix}
                        variant="outlined"
                        label=""
                        placeholder=""
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

                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Crédito na Loja
                      </Typography>
                      <TextField
                        fullWidth
                        name="creditoLoja"
                        onChange={handleChange}
                        value={fornecedora.creditoLoja}
                        variant="outlined"
                        label=""
                        placeholder=""
                        type="number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
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

                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "normal",
                          fontSize: "16px",
                          marginBottom: "8px",
                          color: "gray",
                          textAlign: "center",
                        }}
                      >
                        {contratoAtual && !selectedFile ? (
                          <>
                            Contrato atual: <span style={{ fontWeight: "bold" }}>{contratoAtual}</span>
                          </>
                        ) : selectedFile ? (
                          <>
                            Novo contrato selecionado: <span style={{ fontWeight: "bold" }}>{selectedFile.name}</span>
                          </>
                        ) : (
                          <>Nenhum contrato carregado.</>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{
                    mt: 2,
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
                      width: { xs: "100%", sm: "200px" },
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" },
                      borderRadius: "50px",
                      padding: "8px 16px",
                      height: "48px",
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
                      <CircularProgress size={20} sx={{ color: "#FFFFFF", marginRight: 1 }} />
                    ) : selectedFile ? (
                      "Contrato Selecionado"
                    ) : contratoAtual ? (
                      "Trocar Contrato"
                    ) : (
                      "Upload de Contrato"
                    )}
                    <input type="file" name="contratoFile" hidden onChange={handleFileChange} />
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    sx={{
                      color: "Black",
                      backgroundColor: "#50abe4",
                      textTransform: "none",
                      width: { xs: "100%", sm: "200px" },
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" },
                      borderRadius: "50px",
                      padding: "8px 16px",
                      height: "48px",
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
                      <CircularProgress size={20} sx={{ color: "#FFFFFF", marginRight: 1 }} />
                    ) : (
                      "Atualizar Fornecedor"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>

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
    </Box>
  )
}
