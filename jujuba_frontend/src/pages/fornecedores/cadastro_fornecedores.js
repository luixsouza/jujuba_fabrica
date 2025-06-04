"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Slide,
} from "@mui/material"
import Sidebar from "../../components/sidebar"
import axios from "axios"
const BASE_URL = "http://localhost:8080/api/fornecedoras"
import { ArrowBack, Home, AttachFile, CheckCircle, CheckCircleOutline, PersonAdd, Close } from "@mui/icons-material"
import { useRouter } from "next/router"
import { forwardRef } from "react"

// Transição personalizada para o modal
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function FornecedoresCadastro() {
  const [fornecedora, setFornecedora] = useState({
    nome: "",
    dataNascimento: "",
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
  })
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [successModal, setSuccessModal] = useState({
    open: false,
    fornecedorData: null,
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFornecedora((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFornecedora((prev) => ({
        ...prev,
        contratoUrl: file || "",
      }))
    }
  }

  // Função para formatar a data no padrão "dd/MM/yyyy"
  function formatDateToDDMMYYYY(dateString) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    if (isNaN(date)) return "N/A"

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const createFornecedora = async (values) => {
    try {
      const formData = new FormData()

      const dataNascimentoFormatted = formatDateToDDMMYYYY(values.dataNascimento)

      const fornecedoraObj = {
        nome: values.nome || "N/A",
        dataNascimento: dataNascimentoFormatted,
        contato: values.contato || "N/A",
        endereco: values.endereco || "N/A",
        chavePix: values.chavePix || "N/A",
      }

      formData.append("fornecedora", JSON.stringify(fornecedoraObj))

      const contrato = document.querySelector('input[name="contrato"]')?.files[0]

      if (contrato) {
        formData.append("contrato", contrato)
      } else {
        throw new Error("O arquivo do contrato é obrigatório!")
      }

      const response = await axios.post(BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      return response.data
    } catch (error) {
      console.error("Erro ao criar fornecedora:", error)
      throw error
    }
  }

  const handleCloseSuccessModal = () => {
    setSuccessModal({
      open: false,
      fornecedorData: null,
    })
  }

  const handleCreateAnother = () => {
    handleCloseSuccessModal()
    // O formulário já foi resetado, então não precisa fazer nada mais
  }

  // envia os dados para a API
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const data = await createFornecedora(fornecedora)
      console.log("Fornecedor criado com sucesso:", data)

      // Mostrar modal de sucesso em vez de alert
      setSuccessModal({
        open: true,
        fornecedorData: {
          ...fornecedora,
          id: data.id || "N/A",
        },
      })

      // Resetar formulário
      setFornecedora({
        nome: "",
        dataNascimento: "",
        contato: "",
        endereco: "",
        chavePix: "",
        contratoUrl: "",
      })
      setSelectedFile(null)
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error)
      alert("Erro ao criar fornecedor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#9AE4FF",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "250px" } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>
        <Box sx={{ mb: 1, textAlign: "center", mt: { xs: 4, md: 8 } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", marginBottom: "20px", fontSize: { xs: "30px", md: "40px" } }}
          ></Typography>
        </Box>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <Card
            sx={{
              borderRadius: 10,
              backgroundColor: "#FADADD",
              p: 3,
              maxWidth: "60%",
              mx: "auto",
              mt: { xs: 4, md: 8 },
              height: "auto",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}></Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container direction="column" alignItems="center" spacing={1}>
                    {/* Ícones de navegação */}
                    <Grid item xs={12} width="100%">
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <ArrowBack
                          sx={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color: "black",
                          }}
                          onClick={() => router.back()}
                        />
                        <Home
                          sx={{
                            fontSize: "30px",
                            cursor: "pointer",
                            color: "black",
                          }}
                          onClick={() => router.push("/")}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 1,
                          fontSize: { xs: "35px", md: "45px" },
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Cadastro de Fornecedor
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "14px",
                          color: "gray",
                          textAlign: "center",
                          mb: 3,
                        }}
                      >
                        Campos com <span style={{ color: "red" }}>*</span> são obrigatórios
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Container para os campos do formulário */}
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    {/* Campo Nome */}
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Nome <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="nome"
                        onChange={handleChange}
                        required
                        value={fornecedora.nome}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            backgroundColor: "#FFFFFF",
                          },
                        }}
                      />
                    </Grid>

                    {/* Campo Data de Nascimento */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Data de Nascimento <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="dataNascimento"
                        onChange={handleChange}
                        required
                        value={fornecedora.dataNascimento}
                        variant="outlined"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            backgroundColor: "#FFFFFF",
                          },
                        }}
                      />
                    </Grid>

                    {/* Campo Contato */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Contato <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="contato"
                        onChange={handleChange}
                        required
                        value={fornecedora.contato}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            backgroundColor: "#FFFFFF",
                          },
                        }}
                      />
                    </Grid>

                    {/* Campo Endereço */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Endereço <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        name="endereco"
                        onChange={handleChange}
                        required
                        value={fornecedora.endereco}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            backgroundColor: "#FFFFFF",
                          },
                        }}
                      />
                    </Grid>

                    {/* Campo Chave Pix */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Chave Pix
                      </Typography>
                      <TextField
                        fullWidth
                        name="chavePix"
                        onChange={handleChange}
                        value={fornecedora.chavePix}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                          },
                          "& .MuiOutlinedInput-root.Mui-focused": {
                            backgroundColor: "#FFFFFF",
                          },
                        }}
                      />
                    </Grid>

                    {/* Mensagem sobre upload de contrato */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "normal",
                          fontSize: "16px",
                          marginBottom: "8px",
                          color: "gray",
                          textAlign: "center",
                        }}
                      >
                        {selectedFile ? (
                          <>
                            Arquivo selecionado:{" "}
                            <span style={{ color: "green", fontWeight: "bold" }}>{selectedFile.name}</span>
                          </>
                        ) : (
                          <>
                            O upload do contrato é <span style={{ color: "red", fontWeight: "bold" }}>obrigatório</span>
                          </>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Botões */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "center",
                    gap: { xs: 2, sm: 3 },
                  }}
                >
                  {/* Botão de Upload LINDO com ícone mais vibrante */}
                  <Button
                    component="label"
                    disabled={loading}
                    sx={{
                      color: selectedFile ? "#FFFFFF" : "Black",
                      backgroundColor: selectedFile ? "#4caf50" : "#FF6B9D",
                      textTransform: "none",
                      width: { xs: "100%", sm: "200px" },
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" },
                      borderRadius: "50px",
                      padding: "8px 16px",
                      height: "48px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      position: "relative",
                      transition: "all 0.3s ease",
                      boxShadow: selectedFile
                        ? "0px 4px 12px rgba(76, 175, 80, 0.4)"
                        : "0px 4px 12px rgba(255, 107, 157, 0.4)",
                      "&:hover": {
                        backgroundColor: selectedFile ? "#45a049" : "#FF4081",
                        transform: "translateY(-2px) scale(1.02)",
                        boxShadow: selectedFile
                          ? "0px 6px 16px rgba(76, 175, 80, 0.6)"
                          : "0px 6px 16px rgba(255, 107, 157, 0.6)",
                      },
                      "&:disabled": {
                        backgroundColor: "#cccccc",
                        color: "#666666",
                        transform: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {selectedFile ? (
                          <>
                            <CheckCircle
                              sx={{
                                fontSize: 20,
                                animation: "pulse 2s infinite",
                                "@keyframes pulse": {
                                  "0%": { transform: "scale(1)" },
                                  "50%": { transform: "scale(1.1)" },
                                  "100%": { transform: "scale(1)" },
                                },
                              }}
                            />
                            <span>Arquivo OK!</span>
                          </>
                        ) : (
                          <>
                            <AttachFile
                              sx={{
                                fontSize: 20,
                                animation: "bounce 2s infinite",
                                "@keyframes bounce": {
                                  "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
                                  "40%": { transform: "translateY(-5px)" },
                                  "60%": { transform: "translateY(-3px)" },
                                },
                              }}
                            />
                            <span>Anexar Contrato</span>
                          </>
                        )}
                      </Box>
                    )}
                    <input
                      type="file"
                      name="contrato"
                      hidden
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    sx={{
                      color: "Black",
                      backgroundColor: "#50abe4",
                      textTransform: "none",
                      width: { xs: "100%", sm: "200px" },
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" },
                      borderRadius: "50px",
                      padding: "8px 16px",
                      height: "48px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "&:hover": {
                        backgroundColor: "#003B6F",
                      },
                      "&:disabled": {
                        backgroundColor: "#cccccc",
                        color: "#666666",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
                    ) : (
                      "Cadastrar fornecedor"
                    )}
                  </Button>

                  <Button
                    type="button"
                    disabled={loading}
                    sx={{
                      color: "Black",
                      backgroundColor: "#50abe4",
                      textTransform: "none",
                      width: { xs: "100%", sm: "200px" },
                      fontWeight: "bold",
                      fontSize: { xs: "14px", md: "16px" },
                      borderRadius: "50px",
                      padding: "8px 16px",
                      height: "48px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "&:hover": {
                        backgroundColor: "#003B6F",
                      },
                      "&:disabled": {
                        backgroundColor: "#cccccc",
                        color: "#666666",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "#FFFFFF",
                          marginRight: 1,
                        }}
                      />
                    ) : (
                      "Cadastrar Lote"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>

      {/* Modal de Sucesso AZUL */}
      <Dialog
        open={successModal.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseSuccessModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "25px",
            background: "linear-gradient(135deg, #2196f3 0%, #64b5f6 50%, #90caf9 100%)",
            boxShadow: "0px 25px 50px rgba(33, 150, 243, 0.3)",
            overflow: "visible",
            position: "relative",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pb: 2,
            pt: 4,
            position: "relative",
          }}
        >
          <Button
            onClick={handleCloseSuccessModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              minWidth: "auto",
              width: 40,
              height: 40,
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Close />
          </Button>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
                animation: "celebration 2s ease-in-out infinite",
                "@keyframes celebration": {
                  "0%, 100%": { transform: "scale(1) rotate(0deg)" },
                  "25%": { transform: "scale(1.1) rotate(-5deg)" },
                  "75%": { transform: "scale(1.1) rotate(5deg)" },
                },
              }}
            >
              <CheckCircleOutline sx={{ fontSize: 50, color: "#2196f3" }} />
            </Avatar>

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              🎉 Sucesso! 🎉
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              Fornecedor cadastrado com sucesso!
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "20px 30px",
                borderRadius: "20px",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                border: "3px solid rgba(255, 255, 255, 0.5)",
                minWidth: "300px",
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: "#2196f3",
                  width: 60,
                  height: 60,
                }}
              >
                <PersonAdd sx={{ color: "white", fontSize: 30 }} />
              </Avatar>
              <Box sx={{ textAlign: "left", flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    mb: 0.5,
                  }}
                >
                  {successModal.fornecedorData?.nome}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  ID: {successModal.fornecedorData?.id}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Contato: {successModal.fornecedorData?.contato}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "16px",
                lineHeight: 1.6,
                maxWidth: "400px",
                textShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              O fornecedor foi adicionado ao sistema com sucesso!
              <br />
              Você pode cadastrar outro fornecedor ou fechar esta janela.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            px: 4,
            pb: 4,
          }}
        >
          <Button
            onClick={handleCreateAnother}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#2196f3",
              fontWeight: "bold",
              fontSize: "18px",
              borderRadius: "25px",
              padding: "15px 40px",
              minWidth: "200px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.3)",
              "&:hover": {
                backgroundColor: "white",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(255, 255, 255, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Cadastrar Outro Fornecedor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
