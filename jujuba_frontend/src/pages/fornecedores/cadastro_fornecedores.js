"use client"

import { useState } from "react"
import { Box, Button, Card, CardContent, TextField, Typography, Grid, CircularProgress } from "@mui/material"
import Sidebar from "../../components/sidebar"
import axios from "axios"
const BASE_URL = "http://localhost:8080/api/fornecedoras"
import { ArrowBack, Home } from "@mui/icons-material"
import { useRouter } from "next/router"
export default function FornecedoresCadastro() {
  const [fornecedora, setFornecedora] = useState({
    nome: "",
    dataNascimento: "",
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
  })
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
 
  const handleChange = (event) => {
    const { name, value } = event.target
    setFornecedora((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFornecedora((prev) => ({
      ...prev,
      contratoUrl: file || "",
    }))
  }

 // Função para formatar a data no padrão "dd/MM/yyyy"
function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return "N/A";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const createFornecedora = async (values) => {
  try {
    const formData = new FormData();

    const dataNascimentoFormatted = formatDateToDDMMYYYY(values.dataNascimento);

    const fornecedoraObj = {
      nome: values.nome || "N/A",
      dataNascimento: dataNascimentoFormatted,
      contato: values.contato || "N/A",
      endereco: values.endereco || "N/A",
      chavePix: values.chavePix || "N/A",
    };

    formData.append("fornecedora", JSON.stringify(fornecedoraObj));

    // Aqui deve ser só o arquivo do input, sem usar 'contratoUrl' de values
    const contrato = document.querySelector('input[name="contrato"]')?.files[0];

    if (contrato) {
      // O nome do campo DEVE ser "contrato" para o backend reconhecer
      formData.append("contrato", contrato);
    } else {
      throw new Error("O arquivo do contrato é obrigatório!");
    }

    const response = await axios.post(BASE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar fornecedora:", error);
    throw error;
  }
};


  // envia os dados para a API
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const data = await createFornecedora(fornecedora) // cria o fornecedor na API
      console.log("Fornecedor criado com sucesso:", data)
      alert("Fornecedor criado com sucesso!")
      setFornecedora({
        nome: "",
        dataNascimento: "",
        contato: "",
        endereco: "",
        chavePix: "",
        contratoUrl: "",
      })
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error)
      alert("Erro ao criar fornecedor.")
    } finally {
      setLoading(false)
    }
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
              maxWidth: "60%", // Mantido em 60%
              mx: "auto", // Centraliza o card
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
                    {/* Ícones de navegação */}
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
                          mb: 1, // Mantido em 1
                          fontSize: { xs: "35px", md: "45px" },
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Cadastro de Fornecedor
                      </Typography>
                      
                      {/* Mensagem informativa sobre campos obrigatórios */}
                      <Typography
                        variant="body2"
                        sx={{ 
                          fontSize: "14px",
                          color: "gray",
                          textAlign: "center",
                          mb: 3 // Mantido em 3
                        }}
                      >
                        Campos com <span style={{ color: 'red' }}>*</span> são obrigatórios
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* Container para os campos do formulário em formato vertical */}
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    {/* Campo Nome - ocupando toda a largura */}
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Nome <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="nome"
                        onChange={handleChange}
                        required
                        value={fornecedora.nome}
                        variant="outlined"
                        label="" // Mantido vazio
                        placeholder="" // Mantido vazio
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
                    
                    {/* NOVO Campo Data de Nascimento - ocupando toda a largura */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Data de Nascimento <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="dataNascimento"
                        onChange={handleChange}
                        required
                        value={fornecedora.dataNascimento}
                        variant="outlined"
                        label="" // Vazio
                        placeholder="" // Vazio
                        type="date" // Definido como campo de data
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
                    
                    {/* Campo Contato - ocupando toda a largura */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Contato <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="contato"
                        onChange={handleChange}
                        required
                        value={fornecedora.contato}
                        variant="outlined"
                        label="" // Mantido vazio
                        placeholder="" // Mantido vazio
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
                    
                    {/* Campo Endereço - ocupando toda a largura */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Endereço <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="endereco"
                        onChange={handleChange}
                        required
                        value={fornecedora.endereco}
                        variant="outlined"
                        label="" // Mantido vazio
                        placeholder="" // Mantido vazio
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
                    
                    {/* Campo Chave Pix - ocupando toda a largura */}
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
                        label="" // Mantido vazio
                        placeholder="" // Mantido vazio
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
                    
                    {/* Mensagem sobre obrigatoriedade do upload de contrato */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          fontWeight: "normal", 
                          fontSize: "14px", 
                          marginBottom: "8px", 
                          color: "gray",
                          textAlign: "center"
                        }}
                      >
                        O upload do contrato é <span style={{ color: 'red', fontWeight: 'bold' }}>obrigatório</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Botões alinhados horizontalmente no final da página */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    mt: 2, // Reduzido de 4 para 2 por causa da mensagem acima
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
                      width: { xs: "100%", sm: "200px" }, // Mantido em 200px
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" }, // Mantido
                      borderRadius: "50px",
                      padding: "8px 16px", // Mantido
                      height: "48px", // Mantido
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
                        size={20} // Mantido
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
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
                      width: { xs: "100%", sm: "200px" }, // Mantido em 200px
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" }, // Mantido
                      borderRadius: "50px",
                      padding: "8px 16px", // Mantido
                      height: "48px", // Mantido
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
                        size={20} // Mantido
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
                    ) : (
                      "Cadastrar fornecedor"
                    )}
                  </Button>

                  <Button
                    type="button"
                    disabled={loading}
                    sx={{
                      color: "Black",
                      backgroundColor: "#50abe4",
                      textTransform: "none",
                      width: { xs: "100%", sm: "200px" }, // Mantido em 200px
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" }, // Mantido
                      borderRadius: "50px",
                      padding: "8px 16px", // Mantido
                      height: "48px", // Mantido
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
                        size={20} // Mantido
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
                    ) : (
                      "Cadastrar Lote"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Box>
  )
}
