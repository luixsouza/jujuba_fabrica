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

  // função para criar um fornecedor na API
  const createFornecedora = async (values) => {
    try {
      const formData = new FormData()

      // serializa o objeto fornecedora como JSON
      formData.append(
        "fornecedora",
        JSON.stringify({
          nome: values.nome || "N/A",
          contato: values.contato || "N/A",
          endereco: values.endereco || "N/A",
          chavePix: values.chavePix || "N/A",
        }),
      )

      // adiciona o contrato ao FormData
      const contrato = document.querySelector('input[name="contrato"]')?.files[0]
      if (contrato) {
        formData.append("contratoUrl", contrato)
      } else {
        throw new Error("O arquivo do contrato é obrigatório!")
      }


      const response = await axios.post(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error)
      throw error
    }
  }

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
                        Cadastro de Fornecedor
                      </Typography>
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

                {/* Botões alinhados horizontalmente no final da página */}
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

