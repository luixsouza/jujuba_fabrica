"use client"

import { useState, useEffect } from "react"
import { Box, Card, CardContent, Typography, Grid, IconButton } from "@mui/material"
import Sidebar from "../../components/sidebar"
import axios from "axios"
import { ArrowBack, Home } from "@mui/icons-material"
import { useRouter } from "next/router"

const BASE_URL = "http://localhost:8080/api/produtos" 

export default function ProdutosView({ produtoId }) {
  const [produto, setProduto] = useState({
    descricao: "",
    codigo: "",
    lote: "",
    estado: "",
    fornecedora: "",
    valor: "",
    status: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imagemPreview, setImagemPreview] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BASE_URL}/${produtoId}`)
        
        setProduto({
          descricao: response.data.descricao || "",
          codigo: response.data.codigo || "",
          lote: response.data.lote || "",
          estado: response.data.estado || "",
          fornecedora: response.data.fornecedora || "",
          valor: response.data.valor || "",
          status: response.data.status || "",
        })
        // Define a imagem principal (se houver)
        if (response.data.imagem) {
          setImagemPreview(response.data.imagem)
        }
      } catch (error) {
        setError("Erro ao carregar produto")
        console.error("Erro ao carregar produto:", error)
      } finally {
        setLoading(false)
      }
    }

    if (produtoId) {
      fetchProduto()
    }
  }, [produtoId])

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Box sx={{ width: { xs: "100%", md: "250px" } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 3, width: "100%" }}>
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
                  Visualizar Produto
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
                    {imagemPreview ? (
                      <img
                        src={imagemPreview || "/placeholder.svg"}
                        alt="Produto"
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    ) : (
                      <Typography variant="body2" color="gray">
                        Imagem
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>

              {["Descrição", "Código", "Lote", "Estado", "Fornecedora", "Valor", "Status"].map((label) => {
                if (label === "Descrição") {
                  return (
                    <Grid item xs={12} key={label}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                        {label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          backgroundColor: "#F5F5F5",
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                          borderRadius: "20px",
                          p: 2,
                          minHeight: "80px", // Altura mínima para consistência com o TextField
                        }}
                      >
                        {produto[label.toLowerCase()] || "N/A"}
                      </Typography>
                    </Grid>
                  )
                } else {
                  return (
                    <Grid item xs={12} sm={6} md={4} key={label}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                        {label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          backgroundColor: "#F5F5F5",
                          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                          borderRadius: "20px",
                          p: 2,
                        }}
                      >
                        {produto[label.toLowerCase()] || "N/A"}
                      </Typography>
                    </Grid>
                  )
                }
              })}

              {error && (
                <Grid item xs={12}>
                  <Typography color="error" sx={{ textAlign: "center", mt: 3 }}>
                    {error}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}