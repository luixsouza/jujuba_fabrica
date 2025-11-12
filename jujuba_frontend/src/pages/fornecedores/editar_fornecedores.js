"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
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
  Paper,
  Divider,
} from "@mui/material";
import { ArrowBack, Home, BugReport } from "@mui/icons-material";
import Sidebar from "../../components/sidebar";
import { useRouter } from "next/router";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/fornecedoras";

const editarFornecedora = async (id, fornecedoraData, selectedFile) => {
  const formData = new FormData();
  formData.append("fornecedora", JSON.stringify(fornecedoraData));

  if (selectedFile) {
    formData.append("contrato", selectedFile);
  }

  const response = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default function FornecedoresEdicao() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [fornecedora, setFornecedora] = useState({
    nome: "",
    dataNascimento: "",
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
    creditoLoja: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contratoAtual, setContratoAtual] = useState("");

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
      setFetchLoading(true);
      const response = await axios.get(`${BASE_URL}/${fornecedoraId}`);
      const data = response.data;

      setFornecedora({
        nome: data.nome || "",
        dataNascimento: data.dataNascimento || data.dataDeNascimento || "",
        contato: data.contato || "",
        endereco: data.endereco || "",
        chavePix: data.chavePix || "",
        contratoUrl: data.contratoUrl || "",
        creditoLoja: data.creditoLoja || "",
      });

      if (data.contratoUrl) {
        setContratoAtual(data.contratoUrl);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Erro ao carregar dados do fornecedor: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFornecedora((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFornecedora((prev) => ({
        ...prev,
        contratoUrl: file.name,
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !fornecedora.nome.trim() ||
      !fornecedora.contato.trim() ||
      !fornecedora.endereco.trim() ||
      !fornecedora.chavePix?.trim()
    ) {
      setSnackbar({
        open: true,
        message: "Por favor, preencha todos os campos obrigatórios.",
        severity: "error",
      });
      return;
    }



    if (!id) {
      setSnackbar({
        open: true,
        message: "ID do fornecedor não encontrado. Tente recarregar a página.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const fornecedoraData = {
        nome: fornecedora.nome.trim(),
        contato: fornecedora.contato.trim(),
        endereco: fornecedora.endereco.trim(),
        chavePix: fornecedora.chavePix.trim(),
        dataNascimento: fornecedora.dataNascimento || "01/01/2000",
        creditoLoja: fornecedora.creditoLoja,
      };

      const responseData = await editarFornecedora(
        id,
        fornecedoraData,
        selectedFile
      );

      setSnackbar({
        open: true,
        message: "Fornecedor atualizado com sucesso!",
        severity: "success",
      });

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Erro ao atualizar fornecedor: ${error.response?.data?.message || error.message}`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Head>
          <title>Jujuba - Editar Fornecedora</title>
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
        <title>Jujuba - Editar Fornecedora</title>
      </Head>
      <Box sx={{ width: { xs: "100%", md: "250px" } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>


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
                        Campos com <span style={{ color: "red" }}>*</span> são
                        obrigatórios
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 3,
                        }}
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
                        Nome <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
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
                        Data de Nascimento{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="dataNascimento"
                        onChange={handleChange}
                        value={fornecedora.dataNascimento}
                        variant="outlined"
                        placeholder="dd/MM/yyyy"
                        helperText="Formato: dd/MM/yyyy (ex: 01/01/2000)"
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
                        sx={{
                          fontWeight: "normal",
                          fontSize: "18px",
                          marginBottom: "4px",
                          color: "gray",
                        }}
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
                        sx={{
                          fontWeight: "normal",
                          fontSize: "18px",
                          marginBottom: "4px",
                          color: "gray",
                        }}
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
                        sx={{
                          fontWeight: "normal",
                          fontSize: "18px",
                          marginBottom: "4px",
                          color: "gray",
                        }}
                      >
                        Chave Pix <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
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
                        Crédito Loja
                      </Typography>
                      <TextField
                        fullWidth
                        name="creditoLoja"
                        onChange={handleChange}
                        value={fornecedora.creditoLoja}
                        variant="outlined"
                        type="number"
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
                        Contrato<br/>
                        {contratoAtual && !selectedFile ? (
                          <>
                            Contrato atual:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {contratoAtual}
                            </span>
                          </>
                        ) : selectedFile ? (
                          <>
                            Novo contrato selecionado:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {selectedFile.name}
                            </span>
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
                      <CircularProgress
                        size={20}
                        sx={{ color: "#FFFFFF", marginRight: 1 }}
                      />
                    ) : selectedFile ? (
                      "Contrato Selecionado"
                    ) : contratoAtual ? (
                      "Trocar Contrato"
                    ) : (
                      "Upload de Contrato"
                    )}
                    <input
                      type="file"
                      name="contratoFile"
                      hidden
                      onChange={handleFileChange}
                    />
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
                      <CircularProgress
                        size={20}
                        sx={{ color: "#FFFFFF", marginRight: 1 }}
                      />
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
          autoHideDuration={10000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%", maxWidth: "800px" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

////
