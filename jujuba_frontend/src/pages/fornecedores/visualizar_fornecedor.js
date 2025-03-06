"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
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
} from "@mui/material"
import {
  ArrowBack,
  Home,
  Edit,
  Download,
  Person,
  Phone,
  LocationOn,
  Payments,
  CalendarMonth,
  Description,
} from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

export default function FornecedoresVisualizar() {
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

  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // busca dados da fornecedora quando o componente carregar
  useEffect(() => {
    if (id) {
      fetchFornecedora(id)
    }
  }, [id])

  const fetchFornecedora = async (fornecedoraId) => {
    try {
      setLoading(true)
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
    } catch (error) {
      console.error("Erro ao buscar dados do fornecedor:", error)
      setSnackbar({
        open: true,
        message: "Erro ao carregar dados do fornecedor",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleEditClick = () => {
    router.push(`/fornecedores/fornecedores_edicao?id=${id}`)
  }

  const handleDownloadContrato = () => {
    if (fornecedora.contratoUrl) {
      window.open(fornecedora.contratoUrl, "_blank")
    } else {
      setSnackbar({
        open: true,
        message: "Contrato não disponível para download",
        severity: "warning",
      })
    }
  }

  if (loading) {
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
        <Card
          sx={{
            borderRadius: 10,
            backgroundColor: "#FADADD",
            p: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            maxWidth: "800px",
            mx: "auto",
            mt: { xs: 2, sm: 4, md: 8 },
            height: "auto",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <IconButton onClick={() => router.back()}>
                    <ArrowBack
                      sx={{
                        fontSize: "30px",
                        cursor: "pointer",
                        color: "black",
                      }}
                    />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => router.push("/")}>
                    <Home
                      sx={{
                        fontSize: "30px",
                        cursor: "pointer",
                        color: "black",
                      }}
                    />
                  </IconButton>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 2,
                    fontSize: isMobile ? "28px" : isTablet ? "35px" : "45px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Visualizar Fornecedor
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

              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "16px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Person sx={{ color: "#50abe4", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                          Nome
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4, mb: 3 }}>
                        {fornecedora.nome || "Não informado"}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Phone sx={{ color: "#50abe4", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                          Contato
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4, mb: 3 }}>
                        {fornecedora.contato || "Não informado"}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <LocationOn sx={{ color: "#50abe4", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                          Endereço
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4, mb: 3 }}>
                        {fornecedora.endereco || "Não informado"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Payments sx={{ color: "#50abe4", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                          Chave Pix
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4, mb: 3 }}>
                        {fornecedora.chavePix || "Não informado"}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CalendarMonth sx={{ color: "#50abe4", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                          Data de Nascimento
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ ml: 4, mb: 3 }}>
                        {fornecedora.dataDeNascimento || "Não informado"}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Description sx={{ color: "#50abe4", mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#333" }}>
                          Contrato
                        </Typography>
                      </Box>
                      {fornecedora.contratoUrl ? (
                        <Box sx={{ ml: 4 }}>
                          <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={handleDownloadContrato}
                            sx={{
                              borderColor: "#50abe4",
                              color: "#333",
                              "&:hover": {
                                borderColor: "#003B6F",
                                backgroundColor: "rgba(80, 171, 228, 0.1)",
                              },
                            }}
                          >
                            Visualizar Contrato
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ ml: 4 }}>
                          Contrato não disponível
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEditClick}
                  sx={{
                    color: "Black",
                    backgroundColor: "#50abe4",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    borderRadius: "50px",
                    padding: "10px 20px",
                    height: "56px",
                    width: { xs: "100%", sm: "250px" },
                    "&:hover": {
                      backgroundColor: "#003B6F",
                    },
                  }}
                >
                  Editar Fornecedor
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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

