"use client"

import { useState, useEffect } from "react"
import { Box, Button, Card, CardContent, TextField, Typography, Grid, IconButton } from "@mui/material"
import Sidebar from "../../components/sidebar"
import axios from "axios"
import { ArrowBack, Home, ArrowForward } from "@mui/icons-material"
import { useRouter } from "next/router"

//const BASE_URL = "http://localhost:8080/api/produtos" // URL da API

export default function ProdutosEdit({ produtoId }) {
  const [produto, setProduto] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imagemPreview, setImagemPreview] = useState(null)
  const [imagem, setImagem] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${BASE_URL}/${produtoId}`)
        setProduto(response.data)
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setProduto((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (event) => {
    setImagem(event.target.files[0])
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagemPreview(reader.result)
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData()
    for (const key in produto) {
      formData.append(key, produto[key])
    }
    if (imagem) {
      formData.append("imagem", imagem)
    }

    try {
      const response = await axios.put(`${BASE_URL}/${produtoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("Produto atualizado com sucesso:", response.data)
      alert("Produto atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      setError("Erro ao atualizar produto")
      alert("Erro ao atualizar produto.")
    }
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
                    Visualizar  Produto
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
                      {imagemPreview ? (
                        <img
                          src={imagemPreview || "/placeholder.svg"}
                          alt="Preview"
                          style={{ maxHeight: "100%", maxWidth: "100%" }}
                        />
                      ) : (
                        <Typography variant="body2" color="gray">
                          Imagem
                        </Typography>
                      )}
                    </Box>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="imagemInput"
                    />
                    <label htmlFor="imagemInput">
                      <IconButton sx={{ color: "gray", "&:hover": { color: "black" } }}>
                        <ArrowForward fontSize="large" />
                      </IconButton>
                    </label>
                  </Box>
                </Grid>

                {["Descrição", "Código", "Lote", "Estado", "Fornecedora", "Valor", "Status"].map((label) => {
                  if (label === "Descrição") {
                    return (
                      <Grid item xs={12} key={label}>
                        <TextField
                          fullWidth
                          label={label}
                          name={label.toLowerCase()}
                          onChange={handleChange}
                          value={produto[label.toLowerCase()] || ""}
                          variant="outlined"
                          multiline
                          rows={2}
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
                    )
                  } else {
                    return (
                      <Grid item xs={12} sm={6} md={4} key={label}>
                        <TextField
                          fullWidth
                          label={label}
                          name={label.toLowerCase()}
                          onChange={handleChange}
                          value={produto[label.toLowerCase()] || ""}
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
                    )
                  }
                })}

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                   
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

