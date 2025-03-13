"use client"

import { useState, useEffect } from "react"
import { Box, Button, Paper, TextField, Typography, Grid, IconButton, CircularProgress, MenuItem } from "@mui/material"
import { ArrowBack, Home, Save } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import { ProdutoService } from "../services/produto-service"

export default function ProdutoEditar() {
  const [produto, setProduto] = useState({
    descricao: "",
    descricaoDetalhada: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "",
    genero: "",
    preco: "",
    fornecedora: "",
    forma_pagamento: "",
    lote_id: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [fornecedoras, setFornecedoras] = useState([])
  const [formasPagamento, setFormasPagamento] = useState([])
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        setLoading(true)

       
        const [produtoData, fornecedorasData, formasPagamentoData] = await Promise.all([
          ProdutoService.getProdutoById(id),
          ProdutoService.getFornecedoras(),
          ProdutoService.getFormasPagamento(),
        ])

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

      
        setProduto({
          descricao: produtoData.descricao || "",
          descricaoDetalhada: produtoData.descricaoDetalhada || "",
          marca: produtoData.marca || "",
          tamanho: produtoData.tamanho || "",
          estadoConservacao: produtoData.estadoConservacao || "",
          genero: produtoData.genero || "",
          preco: produtoData.preco || "",
          fornecedora: produtoData.fornecedora || "",
          forma_pagamento: produtoData.forma_pagamento || "",
          lote_id: produtoData.lote_id || "",
        })

        setFornecedoras(fornecedorasData)
        setFormasPagamento(formasPagamentoData)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError("Erro ao carregar os dados. Por favor, tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProduto((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
    
      const produtoFormatado = {
        ...produto,
        preco: Number.parseFloat(produto.preco) || 0,
      }


      const produtoAtualizado = await ProdutoService.updateProduto(id, produtoFormatado)

      if (produtoAtualizado) {
        alert("Produto atualizado com sucesso!")
        router.push(`/produtos/visualizar/${id}`)
      } else {
        setError("Não foi possível atualizar o produto. Tente novamente.")
      }
    } catch (err) {
      console.error("Erro ao atualizar produto:", err)
      setError("Erro ao atualizar produto. Por favor, tente novamente.")
    } finally {
      setSaving(false)
    }
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

  if (error && !produto.id) {
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
            {error}
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
            EDITAR PRODUTO
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

        {error && (
          <Typography
            color="error"
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "rgba(255, 0, 0, 0.1)",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "800px",
              textAlign: "center",
            }}
          >
            {error}
          </Typography>
        )}

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
              placeholder="Descrição"
              name="descricao"
              value={produto.descricao || ""}
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
              Descrição detalhada:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="descricaoDetalhada"
              value={produto.descricaoDetalhada || ""}
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
                  value={produto.marca || ""}
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
                  value={produto.tamanho || ""}
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
                  value={produto.estadoConservacao || ""}
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
                  value={produto.genero || ""}
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
                  label="Preço"
                  name="preco"
                  type="number"
                  value={produto.preco || ""}
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
                  select
                  fullWidth
                  label="Fornecedora"
                  name="fornecedora"
                  value={produto.fornecedora || ""}
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
                >
                  <MenuItem value="" disabled>
                    Selecione uma fornecedora
                  </MenuItem>
                  {fornecedoras.map((fornecedora) => (
                    <MenuItem key={fornecedora.id} value={fornecedora.id}>
                      {fornecedora.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Forma de Pagamento"
                  name="forma_pagamento"
                  value={produto.forma_pagamento || ""}
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
                >
                  <MenuItem value="" disabled>
                    Selecione uma forma de pagamento
                  </MenuItem>
                  {formasPagamento.map((formaPagamento) => (
                    <MenuItem key={formaPagamento.id} value={formaPagamento.id}>
                      {formaPagamento.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID do Lote"
                  name="lote_id"
                  value={produto.lote_id || ""}
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
                disabled={saving}
                startIcon={<Save />}
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
                {saving ? <CircularProgress size={24} sx={{ color: "black" }} /> : "Salvar Alterações"}
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
    </Box>
  )
}

