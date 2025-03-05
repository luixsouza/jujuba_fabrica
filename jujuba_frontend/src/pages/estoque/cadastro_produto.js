"use client"

import { useState } from "react"
import { Box, Button, Card, CardContent, TextField, Typography, Grid, IconButton } from "@mui/material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import { ArrowBack, Home, ArrowForward, AddPhotoAlternate } from "@mui/icons-material"

const BASE_URL = "http://localhost:8080/api/produtos" // URL base da API do backend 

export default function ProdutoCadastro() {
  const [newValues, setNewValues] = useState({
    descricao: "",
    codigo: "",
    lote: "",
    estado: "",
    fornecedora: "",
    valor: "",
    status: "",
  })
  const [images, setImages] = useState([null, null, null])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImages = [...images]
        newImages[index] = e.target.result
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

  const createProduto = async (values) => {
    // aqui será chamada a api de criação 
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const data = await createProduto({ ...newValues, images })
      console.log("Produto criado com sucesso:", data)
      alert("Produto criado com sucesso!")
     
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      alert("Erro ao criar produto.")
    } finally {
      setLoading(false)
    }
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
                        onChange={(e) => handleImageUpload(e, currentImageIndex)}
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
                    value={newValues?.status || ""}
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

