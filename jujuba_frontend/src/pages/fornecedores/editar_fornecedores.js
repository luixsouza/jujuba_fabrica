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
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Paper,
  Avatar,
  Divider,
} from "@mui/material"
import {
  ArrowBack,
  Home,
  Upload,
  CheckCircle,
  Business,
  Phone,
  LocationOn,
  AccountBalance,
  CalendarToday,
} from "@mui/icons-material"
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

  // Fetch supplier data when component loads
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

      // Create supplier object without the file
      const fornecedoraData = {
        id: id,
        nome: values.nome || "N/A",
        contato: values.contato || "N/A",
        endereco: values.endereco || "N/A",
        chavePix: values.chavePix || "N/A",
        dataDeNascimento: values.dataDeNascimento || "N/A",
        contratoUrl: selectedFile ? null : contratoAtual,
      }

      // Add JSON object to FormData
      formData.append("fornecedora", JSON.stringify(fornecedoraData))

      // Add file if a new one exists
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
          flexDirection: isMobile ? "column" : "row",
          backgroundColor: "#9AE4FF",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "250px",
            position: isMobile ? "static" : "sticky",
            top: 0,
            height: isMobile ? "auto" : "100vh",
          }}
        >
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
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: "#9AE4FF",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : "250px",
          position: isMobile ? "static" : "sticky",
          top: 0,
          height: isMobile ? "auto" : "100vh",
        }}
      >
        <Sidebar />
      </Box>

      <Box
        sx={{
          flex: 1,
          p: isMobile ? 2 : 3,
          width: "100%",
        }}
      >
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Card
            sx={{
              borderRadius: 4,
              backgroundColor: "#F5F5F5",
              p: { xs: 2, sm: 3, md: 4 },
              width: "100%",
              maxWidth: "900px",
              mx: "auto",
              mt: { xs: 2, sm: 4, md: 5 },
              height: "auto",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
              overflow: "visible",
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <IconButton
                      onClick={() => router.back()}
                      sx={{
                        backgroundColor: "rgba(80, 171, 228, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(80, 171, 228, 0.2)",
                        },
                      }}
                    >
                      <ArrowBack
                        sx={{
                          fontSize: "26px",
                          color: "#50abe4",
                        }}
                      />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Chip
                      label={`ID: ${id}`}
                      color="primary"
                      sx={{
                        backgroundColor: "#50abe4",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                        height: "32px",
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => router.push("/")}
                      sx={{
                        backgroundColor: "rgba(80, 171, 228, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(80, 171, 228, 0.2)",
                        },
                      }}
                    >
                      <Home
                        sx={{
                          fontSize: "26px",
                          color: "#50abe4",
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: "#FADADD",
                        margin: "0 auto",
                        mb: 2,
                      }}
                    >
                      <Business sx={{ fontSize: 40, color: "#333" }} />
                    </Avatar>
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: isMobile ? "28px" : isTablet ? "32px" : "36px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Editar Fornecedor
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        mt: 1,
                      }}
                    >
                      Atualize as informações do fornecedor conforme necessário
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 4, borderColor: "rgba(0,0,0,0.1)" }} />
                </Grid>

                <Grid item xs={12} md={7}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: "600",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Business sx={{ mr: 1, color: "#50abe4" }} />
                      Informações do Fornecedor
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: "500", mb: 1, color: "#555" }}>
                          Nome do Fornecedor*
                        </Typography>
                        <TextField
                          fullWidth
                          name="nome"
                          onChange={handleChange}
                          required
                          value={fornecedora.nome}
                          variant="outlined"
                          placeholder="Nome completo do fornecedor"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#F9F9F9",
                              "&:hover fieldset": {
                                borderColor: "#50abe4",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#50abe4",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ fontWeight: "500", mb: 1, color: "#555" }}>
                          <Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom", color: "#50abe4" }} />
                          Contato*
                        </Typography>
                        <TextField
                          fullWidth
                          name="contato"
                          onChange={handleChange}
                          required
                          value={fornecedora.contato}
                          variant="outlined"
                          placeholder="Telefone ou email"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#F9F9F9",
                              "&:hover fieldset": {
                                borderColor: "#50abe4",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#50abe4",
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: "500", mb: 1, color: "#555" }}>
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom", color: "#50abe4" }} />
                          Endereço*
                        </Typography>
                        <TextField
                          fullWidth
                          name="endereco"
                          onChange={handleChange}
                          required
                          value={fornecedora.endereco}
                          variant="outlined"
                          placeholder="Endereço completo"
                          multiline
                          rows={2}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#F9F9F9",
                              "&:hover fieldset": {
                                borderColor: "#50abe4",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#50abe4",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: "500", mb: 1, color: "#555" }}>
                          <AccountBalance
                            sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom", color: "#50abe4" }}
                          />
                          Chave Pix
                        </Typography>
                        <TextField
                          fullWidth
                          name="chavePix"
                          onChange={handleChange}
                          value={fornecedora.chavePix}
                          variant="outlined"
                          placeholder="Chave Pix para pagamentos"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              backgroundColor: "#F9F9F9",
                              "&:hover fieldset": {
                                borderColor: "#50abe4",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#50abe4",
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: "600",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Upload sx={{ mr: 1, color: "#50abe4" }} />
                      Contrato
                    </Typography>

                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Box sx={{ mb: 4, textAlign: "center" }}>
                        {contratoAtual && !selectedFile ? (
                          <Box
                            sx={{
                              p: 2,
                              border: "1px dashed #50abe4",
                              borderRadius: 2,
                              backgroundColor: "rgba(80, 171, 228, 0.05)",
                              mb: 3,
                            }}
                          >
                            <CheckCircle sx={{ color: "#4CAF50", fontSize: 40, mb: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "500", color: "#333" }}>
                              Contrato Atual
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                mt: 1,
                                wordBreak: "break-word",
                              }}
                            >
                              {contratoAtual.split("/").pop()}
                            </Typography>
                          </Box>
                        ) : selectedFile ? (
                          <Box
                            sx={{
                              p: 2,
                              border: "1px dashed #4CAF50",
                              borderRadius: 2,
                              backgroundColor: "rgba(76, 175, 80, 0.05)",
                              mb: 3,
                            }}
                          >
                            <CheckCircle sx={{ color: "#4CAF50", fontSize: 40, mb: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: "500", color: "#333" }}>
                              Novo Contrato Selecionado
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                mt: 1,
                                wordBreak: "break-word",
                              }}
                            >
                              {selectedFile.name}
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              p: 2,
                              border: "1px dashed #ccc",
                              borderRadius: 2,
                              backgroundColor: "#f9f9f9",
                              mb: 3,
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: "500", color: "#666" }}>
                              Nenhum contrato selecionado
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                mt: 1,
                              }}
                            >
                              Selecione um arquivo para upload
                            </Typography>
                          </Box>
                        )}

                        <Button
                          variant="outlined"
                          component="label"
                          disabled={loading}
                          startIcon={<Upload />}
                          sx={{
                            borderRadius: "12px",
                            borderColor: "#50abe4",
                            color: "#50abe4",
                            textTransform: "none",
                            padding: "10px 20px",
                            "&:hover": {
                              borderColor: "#003B6F",
                              backgroundColor: "rgba(80, 171, 228, 0.05)",
                            },
                          }}
                        >
                          {selectedFile ? "Trocar arquivo" : "Selecionar contrato"}
                          <input
                            type="file"
                            name="contrato"
                            hidden
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                          />
                        </Button>
                      </Box>

                      <Box sx={{ mt: "auto" }}>
                        <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.1)" }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={loading}
                              fullWidth
                              sx={{
                                backgroundColor: "#FADADD",
                                color: "#333",
                                textTransform: "none",
                                fontWeight: "bold",
                                fontSize: "16px",
                                borderRadius: "12px",
                                padding: "12px 0",
                                boxShadow: "0 4px 12px rgba(250, 218, 221, 0.5)",
                                "&:hover": {
                                  backgroundColor: "#f8c8cc",
                                },
                              }}
                            >
                              {loading ? <CircularProgress size={24} sx={{ color: "#333" }} /> : "Salvar Edições"}
                            </Button>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="outlined"
                              disabled={loading}
                              onClick={() => router.push("/fornecedores/fornecedores_tabela")}
                              fullWidth
                              sx={{
                                borderColor: "#50abe4",
                                color: "#50abe4",
                                textTransform: "none",
                                fontWeight: "bold",
                                fontSize: "16px",
                                borderRadius: "12px",
                                padding: "12px 0",
                                "&:hover": {
                                  borderColor: "#003B6F",
                                  backgroundColor: "rgba(80, 171, 228, 0.05)",
                                },
                              }}
                            >
                              Cancelar
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Paper>
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "12px",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

