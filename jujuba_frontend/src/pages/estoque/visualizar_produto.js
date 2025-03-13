"use client"

import { useState, useEffect } from "react"
import { Box, Button, Paper, Typography, Grid, IconButton, CircularProgress } from "@mui/material"
import { ArrowBack, Home, Edit } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import { ProdutoService } from "../services/produto-service"

export default function ProdutoVisualizacao() {
  const [produto, setProduto] = useState(null)
  const [fornecedora, setFornecedora] = useState(null)
  const [formaPagamento, setFormaPagamento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchProduto = async () => {
      if (!id) return

      try {
        setLoading(true)
        const produtoData = await ProdutoService.getProdutoById(id)

        if (!produtoData) {
          setError("Produto não encontrado")
          return
        }

       
        if (!produtoData.descricaoDetalhada) {
          console.warn(`Produto ${id} não tem descrição detalhada. Gerando uma descrição mockada.`)
          produtoData.descricaoDetalhada = `Descrição detalhada mockada para o produto ${produtoData.descricao || "desconhecido"}. 
Este produto apresenta excelente qualidade e acabamento. Fabricado com materiais de primeira linha, 
oferece durabilidade e conforto. Ideal para uso diário e ocasiões especiais.`
        }

        setProduto(produtoData)

       
        if (produtoData.fornecedora) {
          const fornecedoraData = await ProdutoService.getFornecedoraById(produtoData.fornecedora)
          setFornecedora(fornecedoraData)
        }

        if (produtoData.forma_pagamento) {
          const formaPagamentoData = await ProdutoService.getFormaPagamentoById(produtoData.forma_pagamento)
          setFormaPagamento(formaPagamentoData)
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
    router.push(`./editar_produto/${id}`)
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
            onClick={() => router.push("/produtos")}
            sx={{ mt: 2, bgcolor: "#f8c8cc", color: "black", "&:hover": { bgcolor: "#f8c8cc" } }}
          >
            Voltar para Lista de Produtos
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
            VISUALIZAR PRODUTO
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

        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "800px",
            borderRadius: "20px",
            backgroundColor: " #9AE4FF",
            p: 3,
            mb: 3,
          }}
        >
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

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Descrição detalhada:
            </Typography>
            <Paper
              sx={{
                p: 2,
                borderRadius: "15px",
                backgroundColor: "#f8f9fa",
                minHeight: "100px",
              }}
            >
              <Typography>{produto.descricaoDetalhada || "N/A"}</Typography>
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
                Gênero:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{produto.genero || "N/A"}</Typography>
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
                <Typography>R$ {produto.preco?.toFixed(2) || "0.00"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Fornecedora:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{fornecedora?.nome || "N/A"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                Forma de Pagamento:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{formaPagamento?.nome || "N/A"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                ID do Lote:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "15px",
                  backgroundColor: "#f8f9fa",
                  mb: 2,
                }}
              >
                <Typography>{produto.lote_id || "N/A"}</Typography>
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

