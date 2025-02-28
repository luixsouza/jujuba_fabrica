"use client"

import { useState } from "react"
import { Box, Button, Card, CardContent, TextField, Typography, Grid, IconButton } from "@mui/material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import { ArrowBack, Home, ArrowForward } from "@mui/icons-material"

const BASE_URL = "http://localhost:8080/api/fornecedoras" // URL base da API

export default function FornecedoresCadastro() {
  const [newValues, setNewValues] = useState({
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
    setNewValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setNewValues((prev) => ({
      ...prev,
      contratoUrl: file || "",
    }))
  }

  const createFornecedora = async (values) => {
    // ... (keep the existing createFornecedora function)
  }

  const handleSubmit = async (event) => {
    // ... (keep the existing handleSubmit function)
  }

  const handleEditClick = () => {
    router.push("./editar_produto")
  }

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Box sx={{ width: { xs: "100%", md: "250px" } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 3, width: "100%" }}>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Card
            sx={{
              backgroundColor: "#9AE4FF",
              p: 3,
              maxWidth: "100%",
              mx: "auto",
              mt: 4,
              height: "auto",
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <IconButton onClick={() => router.back()}>
                      <ArrowBack />
                    </IconButton>
                    <IconButton onClick={() => router.push("/")}>
                      <Home />
                    </IconButton>
                  </Box>
                  <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}>
                    Cadastrar Produto
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <IconButton sx={{ color: "gray", "&:hover": { color: "black" } }}>
                      <ArrowBack fontSize="large" />
                    </IconButton>
                    <Box
                      sx={{
                        width: "20%",
                        height: "150px",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2" color="gray">
                        Imagem
                      </Typography>
                    </Box>
                    <IconButton sx={{ color: "gray", "&:hover": { color: "black" } }}>
                      <ArrowForward fontSize="large" />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    name="descricao"
                    onChange={handleChange}
                    required
                    value={newValues?.descricao || ""}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F5F5F5",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Código"
                    name="codigo"
                    onChange={handleChange}
                    required
                    value={newValues?.codigo || ""}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F5F5F5",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Lote"
                    name="lote"
                    onChange={handleChange}
                    value={newValues?.lote || ""}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F5F5F5",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Estado"
                    name="estado"
                    onChange={handleChange}
                    value={newValues?.estado || ""}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F5F5F5",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Fornecedora"
                    name="fornecedora"
                    onChange={handleChange}
                    required
                    value={newValues?.fornecedora || ""}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F5F5F5",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Valor"
                    name="valor"
                    onChange={handleChange}
                    required
                    value={newValues?.valor || ""}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F5F5F5",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    onChange={handleChange}
                    required
                    value={newValues?.Status || ""}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F5F5F5",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        borderRadius: "20px",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      gap: "20px",
                      mt: 3,
                    }}
                  >
                    {["Excluir", "Adicionar ao carrinho", "Editar"].map((text, index) => (
                      <Button
                        key={text}
                        onClick={index === 2 ? handleEditClick : undefined}
                        sx={{
                          backgroundColor: "#FADADD",
                          color: "black",
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                          border: "2px solid #FADADD",
                          fontWeight: "bold",
                          fontSize: "17px",
                          borderRadius: "60px",
                          padding: "10px 0",
                          width: { xs: "100%", sm: "200px" },
                          height: "50px",
                          textTransform: "none",
                        }}
                      >
                        {text}
                      </Button>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Box>
  )
}

