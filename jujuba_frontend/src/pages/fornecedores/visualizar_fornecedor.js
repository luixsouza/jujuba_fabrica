"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
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
  Snackbar,
  Alert,
  Chip,
  TextField,
  Paper,
  Divider,
} from "@mui/material";
import { ArrowBack, Home, Download, BugReport } from "@mui/icons-material";
import Sidebar from "../../components/sidebar";
import { useRouter } from "next/router";
import axios from "axios";

const BACKEND_BASE_URL = "http://localhost:8080";
const BASE_URL = "http://localhost:8080/api/fornecedoras";

export default function FornecedoresVisualizar() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [fornecedora, setFornecedora] = useState({
    nome: "",
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
    dataNascimento: "",
    creditoLoja: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchFornecedora(id);
    }
  }, [id]);

  const fetchFornecedora = async (fornecedoraId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${fornecedoraId}`);
      const data = response.data;

      setFornecedora({
        nome: data.nome || "",
        contato: data.contato || "",
        endereco: data.endereco || "",
        chavePix: data.chavePix || "",
        dataNascimento: data.dataNascimento || "",
        contratoUrl: data.contratoUrl || "",
        creditoLoja: data.creditoLoja || 0,
      });
    } catch (error) {
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      };
      setErrorDetails(errorDetails);
      setSnackbar({
        open: true,
        message: `Erro ao carregar dados: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDownloadContrato = () => {
    if (fornecedora.contratoUrl) {
      const url = fornecedora.contratoUrl.startsWith("http")
        ? fornecedora.contratoUrl
        : `${BACKEND_BASE_URL}/${fornecedora.contratoUrl.replace(/^\/+/, "")}`;
      window.open(url, "_blank");
    } else {
      setSnackbar({
        open: true,
        message: "Contrato não disponível para download",
        severity: "warning",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#9AE4FF",
          minHeight: "100vh",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Head>
          <title>Jujuba - Visualizar Fornecedora</title>
        </Head>
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
    );
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
      <Head>
        <title>Jujuba - Visualizar Fornecedora</title>
      </Head>
      <Box sx={{ width: { xs: "100%", md: "250px" } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>
        {errorDetails && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#ffebee",
              border: "2px solid #f44336",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#d32f2f",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <BugReport sx={{ mr: 1 }} />
              DETALHES DO ERRO
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography
              variant="body2"
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                fontSize: "12px",
                backgroundColor: "#fff",
                p: 2,
                borderRadius: 1,
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              {JSON.stringify(errorDetails, null, 2)}
            </Typography>
          </Paper>
        )}

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
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item xs={12} width="100%">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width="100%"
                    >
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
                      Visualizar Fornecedor
                    </Typography>

                    <Box
                      sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                    >
                      <Chip
                        label={`ID: ${id || "Carregando..."}`}
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
                      sx={{
                        fontWeight: "normal",
                        fontSize: "18px",
                        marginBottom: "4px",
                        color: "gray",
                      }}
                    >
                      Nome
                    </Typography>
                    <TextField
                      fullWidth
                      name="nome"
                      value={fornecedora.nome}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "normal",
                        fontSize: "18px",
                        marginBottom: "4px",
                        color: "gray",
                      }}
                    >
                      Data de Nascimento
                    </Typography>
                    <TextField
                      fullWidth
                      name="dataNascimento"
                      value={fornecedora.dataNascimento}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "normal",
                        fontSize: "18px",
                        marginBottom: "4px",
                        color: "gray",
                      }}
                    >
                      Contato
                    </Typography>
                    <TextField
                      fullWidth
                      name="contato"
                      value={fornecedora.contato}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "normal",
                        fontSize: "18px",
                        marginBottom: "4px",
                        color: "gray",
                      }}
                    >
                      Endereço
                    </Typography>
                    <TextField
                      fullWidth
                      name="endereco"
                      value={fornecedora.endereco}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "normal",
                        fontSize: "18px",
                        marginBottom: "4px",
                        color: "gray",
                      }}
                    >
                      Chave Pix
                    </Typography>
                    <TextField
                      fullWidth
                      name="chavePix"
                      value={fornecedora.chavePix}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "normal",
                        fontSize: "18px",
                        marginBottom: "4px",
                        color: "gray",
                      }}
                    >
                      Crédito na Loja
                    </Typography>
                    <TextField
                      fullWidth
                      name="creditoLoja"
                      value={
                        fornecedora.creditoLoja
                          ? `R$ ${parseFloat(fornecedora.creditoLoja)
                              .toFixed(2)
                              .replace(".", ",")}`
                          : "R$ 0,00"
                      }
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} md={8} sx={{ mt: 4 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "normal",
                        fontSize: "18px",
                        marginBottom: "4px",
                        color: "gray",
                      }}
                    >
                      Contrato
                    </Typography>
                    {fornecedora.contratoUrl ? (
                      <Button
                        component="label"
                        onClick={handleDownloadContrato}
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
                        }}
                        startIcon={<Download />}
                      >
                        Visualizar Contrato
                      </Button>
                    ) : (
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        Contrato não disponível
                      </Typography>
                    )}
                  </Grid>
                </Grid>
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
