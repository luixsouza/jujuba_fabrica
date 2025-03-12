"use client"

import { useState } from "react"
import { Box, Button, Paper, TextField, Typography, Grid, IconButton, CircularProgress } from "@mui/material"
import { ArrowBack, Home } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/produtos"

export default function ProdutoCadastro() {
  const [produto, setProduto] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "",
    genero: "",
    preco: "",
    codigo: "",
    lote: "",
    fornecedor: "",
    status: "",
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (event) => {
    const { name, value } = event.target
    setProduto((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(BASE_URL, produto)
      console.log("Produto cadastrado com sucesso:", response.data)
      alert("Produto cadastrado com sucesso!")
      router.push("/produtos")
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error)
      alert("Erro ao cadastrar produto. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: "280px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <IconButton
            onClick={() => router.back()}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            CADASTRAR PRODUTO
          </Typography>
          <IconButton
            onClick={() => router.push("/")}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <Home />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              borderRadius: "20px",
              backgroundColor: " #9AE4FF",
              p: 3,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="Nome do produto"
              name="descricao"
              value={produto.descricao}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  backgroundColor: "#f8f9fa",
                  fontSize: "18px",
                },
              }}
            />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Descrição:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="descricao"
              value={produto.descricao}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  name="marca"
                  value={produto.marca}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tamanho"
                  name="tamanho"
                  value={produto.tamanho}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estado de Conservação"
                  name="estadoConservacao"
                  value={produto.estadoConservacao}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gênero"
                  name="genero"
                  value={produto.genero}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Código"
                  name="codigo"
                  value={produto.codigo}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lote"
                  name="lote"
                  value={produto.lote}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="preco"
                  type="number"
                  value={produto.preco}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: "R$ ",
                  }}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fornecedor"
                  name="fornecedor"
                  value={produto.fornecedor}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Button
                type="submit"
                disabled={loading}
                sx={{
                  bgcolor: "#f8c8cc",
                  color: "black",
                  borderRadius: "30px",
                  px: 6,
                  py: 1.5,
                  fontSize: "18px",
                  fontWeight: "bold",
                  minWidth: "200px",
                  "&:hover": {
                    bgcolor: "#f8c8cc",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "black" }} /> : "Cadastrar"}
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
    </Box>
  )
}

