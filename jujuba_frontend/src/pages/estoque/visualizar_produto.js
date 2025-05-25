"use client"

import { useState, useEffect } from "react"
import { Box, Button, Paper, Typography, Grid, IconButton, CircularProgress } from "@mui/material"
import { ArrowBack, Home, Edit } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter, useSearchParams } from "next/navigation"
import { buscarProdutoPorId } from "../api/produtos"

export default function ProdutoVisualizacao() {
  const [produto, setProduto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchProduto = async () => {
      if (!id) {
        setError("ID do produto não fornecido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await buscarProdutoPorId(id)

        if (response.sucesso) {
          setProduto(response.produto)
        } else {
          setError(response.mensagem || "Erro ao carregar produto")
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err)
        setError("Erro ao carregar os dados do produto. Por favor, tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduto()
  }, [id])

  const handleEditClick = () => {
    router.push(`./editar_produto?id=${id}`)
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("../../fornecedores/fornecedores_tabela")
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#9AE4FF",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error || !produto) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#9AE4FF",
        }}
      >
        <Paper sx={{ p: 4, maxWidth: "500px", textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {error || "Produto não encontrado"}
          </Typography>
          <Button
            onClick={() => router.push("../../estoque/estoque_tabela")}
            sx={{ mt: 2, bgcolor: "#f8c8cc", color: "black", "&:hover": { bgcolor: "#f8c8cc" } }}
          >
            Voltar para Estoque
          </Button>
        </Paper>
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
          marginLeft: "244px",
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
            onClick={handleGoBack}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            VISUALIZAR PRODUTO
          </Typography>
          <IconButton
            onClick={handleGoHome}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <Home />
          </IconButton>
        </Box>

        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "800px",
            borderRadius: "20px",
            backgroundColor: "#9AE4FF",
            p: 3,
            mb: 3,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              ID do Produto:
            </Typography>
            <Paper
              sx={{
                p: 2,
                borderRadius: "30px",
                backgroundColor: "#f8f9fa",
                fontSize: "18px",
              }}
            >
              <Typography>{produto.id || "N/A"}</Typography>
            </Paper>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Descrição:
            </Typography>
            <Paper
              sx={{
                p: 2,
                borderRadius: "30px",
                backgroundColor: "#f8f9fa",
                fontSize: "18px",
              }}
            >
              <Typography>{produto.descricao || "N/A"}</Typography>
            </Paper>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Marca:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{produto.marca || "N/A"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Tamanho:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{produto.tamanho || "N/A"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Estado de Conservação:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{produto.estadoConservacao || "N/A"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Preço:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>R$ {produto.preco?.toFixed(2).replace(".", ",") || "0,00"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                ID da Fornecedora:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{produto.fornecedoraId || "N/A"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Imagem URL:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    wordBreak: "break-all",
                    fontSize: "0.9rem",
                  }}
                >
                  {produto.imagemUrl || "N/A"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Display product image if available */}
          {produto.imagemUrl && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Imagem do Produto:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={produto.imagemUrl || "/placeholder.svg"}
                  alt={produto.descricao || "Produto"}
                  style={{
                    maxWidth: "300px",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none"
                  }}
                />
              </Paper>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Button
              onClick={handleEditClick}
              startIcon={<Edit />}
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
              Editar Produto
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
