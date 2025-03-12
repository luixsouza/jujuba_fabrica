"use client"

import { useState, useEffect } from "react"
import { Box, Paper, Typography, Grid, IconButton, CircularProgress } from "@mui/material"
import { ArrowBack, Home } from "@mui/icons-material"
import Sidebar from "../../../components/sidebar"
import { useRouter } from "next/navigation"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/produtos"

export default function ProdutosView({ params }) {
  const router = useRouter()
  const { id } = params

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
    observacoes: "",
  })

  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchProduto(id)
    }
  }, [id])

  const fetchProduto = async (produtoId) => {
    try {
      setFetchLoading(true)
      const response = await axios.get(`${BASE_URL}/${produtoId}`)
      const data = response.data

      setProduto({
        descricao: data.descricao || "",
        marca: data.marca || "",
        tamanho: data.tamanho || "",
        estadoConservacao: data.estadoConservacao || "",
        genero: data.genero || "",
        preco: data.preco || "",
        codigo: data.codigo || "",
        lote: data.lote || "",
        fornecedor: data.fornecedor || "",
        status: data.status || "Disponível",
        observacoes: data.observacoes || "",
      })
    } catch (error) {
      console.error("Erro ao buscar dados do produto:", error)
      setError("Erro ao carregar dados do produto")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        setFetchLoading(true)
        await axios.delete(`${BASE_URL}/${id}`)
        alert("Produto excluído com sucesso!")
        router.push("/produtos")
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
        setError("Erro ao excluir produto")
        setFetchLoading(false)
      }
    }
  }

  // Loading state
  if (fetchLoading) {
    return (
      <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            marginLeft: "280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#FADADD" }} />
          <Typography variant="h6" sx={{ ml: 2, color: "#333" }}>
            Carregando dados do produto...
          </Typography>
        </Box>
      </Box>
    )
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
            VISUALIZAR ITEM
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

        <Box style={{ width: "100%", maxWidth: "800px" }}>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              borderRadius: "20px",
              backgroundColor: "#9AE4FF",
              p: 3,
              mb: 3,
            }}
          >
            {/* Product Name */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: "30px",
                backgroundColor: "#f8f9fa",
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {produto.descricao}
            </Box>

            {/* Description */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Descrição:
            </Typography>
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: "15px",
                backgroundColor: "#f8f9fa",
                minHeight: "80px",
              }}
            >
              {produto.descricao}
            </Box>

            {/* Observations */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Observações:
            </Typography>
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: "15px",
                backgroundColor: "#f8f9fa",
                minHeight: "60px",
              }}
            >
              {produto.observacoes || "Sem observações"}
            </Box>

            <Grid container spacing={2}>
              {/* Code */}
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: "30px",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                    CÓDIGO
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>{produto.codigo || "N/A"}</Typography>
                </Paper>
              </Grid>

              {/* Lot */}
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: "30px",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                    LOTE
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>{produto.lote || "N/A"}</Typography>
                </Paper>
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: "30px",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                    ESTADO
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                    {produto.estadoConservacao || "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              {/* Supplier */}
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: "30px",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                    FORNECEDOR
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>{produto.fornecedor || "N/A"}</Typography>
                </Paper>
              </Grid>

              {/* Price */}
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: "30px",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                    VALOR
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
                    {produto.preco ? `R$ ${produto.preco}` : "N/A"}
                  </Typography>
                </Paper>
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: "30px",
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                    STATUS
                  </Typography>
                  <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>{produto.status || "N/A"}</Typography>
                </Paper>
              </Grid>
            </Grid>

            {error && (
              <Typography
                color="error"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  fontWeight: "medium",
                }}
              >
                {error}
              </Typography>
            )}

            {/* Add Edit and Delete buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 4,
              }}
            >
              <IconButton
                onClick={() => router.push(`/produtos/${id}/editar_produto`)}
                sx={{
                  bgcolor: "#FADADD",
                  color: "black",
                  borderRadius: "30px",
                  px: 4,
                  py: 1,
                  fontSize: "16px",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#f8c8cc",
                  },
                }}
              >
                <Typography sx={{ mx: 1 }}>Editar</Typography>
              </IconButton>

              <IconButton
                onClick={handleDelete}
                sx={{
                  bgcolor: "#ff6b6b",
                  color: "white",
                  borderRadius: "30px",
                  px: 4,
                  py: 1,
                  fontSize: "16px",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#ff5252",
                  },
                }}
              >
                <Typography sx={{ mx: 1 }}>Excluir</Typography>
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

