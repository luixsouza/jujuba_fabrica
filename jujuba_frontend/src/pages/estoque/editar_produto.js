"use client"

import { useState, useEffect } from "react"
import { Box, Button, Card, CardContent, TextField, Typography, Grid, IconButton } from "@mui/material"
import Sidebar from "../../components/sidebar"
import axios from "axios"
import { ArrowBack, Home, ArrowForward, AddPhotoAlternate } from "@mui/icons-material"
import { useRouter } from "next/router"

const BASE_URL = "http://localhost:8080/api/produtos"

export default function ProdutosEdit({ produtoId }) {
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
  const [images, setImages] = useState([null, null, null])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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
   
        if (response.data.imagens && response.data.imagens.length > 0) {
          setImages(response.data.imagens.concat(Array(3 - response.data.imagens.length).fill(null)))
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setProduto((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (event, index) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImages = [...images]
        newImages[index] = reader.result
        setImages(newImages)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
   
    formData.append("descricao", produto.descricao)
    formData.append("codigo", produto.codigo)
    formData.append("lote", produto.lote)
    formData.append("estado", produto.estado)
    formData.append("fornecedora", produto.fornecedora)
    
    formData.append("valor", produto.valor)
    formData.append("status", produto.status)
   
    images.forEach((image, index) => {
      if (image && image.startsWith("data:")) {
        const blob = dataURItoBlob(image)
        formData.append(`imagens[${index}]`, blob, `imagem${index + 1}.jpg`) 
      } else if (image) {
        formData.append(`imagens[${index}]`, image) 
      }
    })

    try {
      const response = await axios.put(`${BASE_URL}/${produtoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("Produto atualizado com sucesso:", response.data)
      alert("Produto atualizado com sucesso!")
      router.push("/produtos")
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      setError("Erro ao atualizar produto. Verifique os dados e tente novamente.")
      alert("Erro ao atualizar produto.")
    } finally {
      setLoading(false)
    }
  }

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1])
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
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
                    Editar Produto
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
                    <IconButton onClick={handlePrevImage} sx={{ color: "gray", "&:hover": { color: "black" } }}>
                      <ArrowBack fontSize="large" />
                    </IconButton>
                    <Box
                      sx={{
                        width: "300px",
                        height: "300px",
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "10px",
                      }}
                    >
                      {images[currentImageIndex] ? (
                        <img
                          src={images[currentImageIndex] || "/placeholder.svg"}
                          alt={`Produto ${currentImageIndex + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Typography variant="body2" color="gray">
                          Imagem {currentImageIndex + 1}
                        </Typography>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, currentImageIndex)}
                        style={{ display: "none" }}
                        id={`image-upload-${currentImageIndex}`}
                      />
                      <label htmlFor={`image-upload-${currentImageIndex}`}>
                        <IconButton
                          component="span"
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
                          }}
                        >
                          <AddPhotoAlternate />
                        </IconButton>
                      </label>
                    </Box>
                    <IconButton onClick={handleNextImage} sx={{ color: "gray", "&:hover": { color: "black" } }}>
                      <ArrowForward fontSize="large" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    {images.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: index === currentImageIndex ? "#00509E" : "#CCCCCC",
                          mx: 0.5,
                        }}
                      />
                    ))}
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
                    <Button
                      type="submit"
                      disabled={loading}
                      sx={{
                        backgroundColor: "#FADADD",
                        color: "black",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                        border: "2px solid #FADADD",
                        fontWeight: "bold",
                        fontSize: "17px",
                        borderRadius: "60px",
                        padding: "10px 0",
                        width: { xs: "100%", sm: "300px" },
                        height: "50px",
                        textTransform: "none",
                      }}
                    >
                      {loading ? "Salvando..." : "Salvar Edição"}
                    </Button>
                  </Box>
                  {error && (
                    <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Box>
  )
}