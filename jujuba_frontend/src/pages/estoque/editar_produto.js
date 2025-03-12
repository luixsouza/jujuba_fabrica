"use client"

import { useState, useEffect } from "react"
import { Box, Button, Paper, TextField, Typography, Grid, IconButton, CircularProgress } from "@mui/material"
import { ArrowBack, Home } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/produtos"

export default function ProdutosEdit() {
  const router = useRouter()
  const { id } = router.query

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
      })
    } catch (error) {
      console.error("Erro ao buscar dados do produto:", error)
      setError("Erro ao carregar dados do produto")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setProduto((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.put(`${BASE_URL}/${id}`, produto)
      console.log("Produto atualizado com sucesso:", response.data)
      alert("Produto atualizado com sucesso!")
      router.push("/produtos")
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      setError("Erro ao atualizar produto. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
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

        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "800px" }}>
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

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Observações:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="observacoes"
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
                  <TextField
                    fullWidth
                    name="codigo"
                    value={produto.codigo}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="ALC222333"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                      },
                    }}
                  />
                </Paper>
              </Grid>
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
                  <TextField
                    fullWidth
                    name="lote"
                    value={produto.lote}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="A321"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                      },
                    }}
                  />
                </Paper>
              </Grid>
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
                  <TextField
                    fullWidth
                    name="estadoConservacao"
                    value={produto.estadoConservacao}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="Ótimo"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                      },
                    }}
                  />
                </Paper>
              </Grid>
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
                  <TextField
                    fullWidth
                    name="fornecedor"
                    value={produto.fornecedor}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="Ana Lúcia Cardoso"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                      },
                    }}
                  />
                </Paper>
              </Grid>
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
                  <TextField
                    fullWidth
                    name="preco"
                    value={produto.preco}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="R$ 89,90"
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: produto.preco ? "R$ " : "",
                    }}
                    sx={{
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                      },
                    }}
                  />
                </Paper>
              </Grid>
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
                  <TextField
                    fullWidth
                    name="status"
                    value={produto.status}
                    onChange={handleChange}
                    variant="standard"
                    placeholder="Disponível"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      textAlign: "center",
                      "& input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                      },
                    }}
                  />
                </Paper>
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
                  bgcolor: "#FADADD",
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
                {loading ? <CircularProgress size={24} sx={{ color: "black" }} /> : "Salvar Alterações"}
              </Button>
            </Box>

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
          </Paper>
        </form>
      </Box>
    </Box>
  )
}

