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
  useMediaQuery,
  useTheme,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material"
import { ArrowBack, Home, Upload } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

const formFields = [
  { label: "Nome", name: "nome" },
  { label: "Contato", name: "contato" },
  { label: "Endereço", name: "endereco" },
  { label: "Chave Pix", name: "chavePix" },
  { label: "Data de nascimento", name: "dataDeNascimento" },
]

export default function FornecedoresCadastro() {
  const theme = useTheme()
  const router = useRouter()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [newValues, setNewValues] = useState({
    nome: "",
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
    dataDeNascimento: "",
  })

  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setNewValues((prev) => ({
        ...prev,
        contratoUrl: file.name,
      }))
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const createFornecedora = async (values) => {
    try {
      const formData = new FormData()

      // cria objeto fornecedora sem o arquivo
      const fornecedoraData = {
        nome: values.nome || "N/A",
        contato: values.contato || "N/A",
        endereco: values.endereco || "N/A",
        chavePix: values.chavePix || "N/A",
        dataDeNascimento: values.dataDeNascimento || "N/A",
      }

      // adiciona objeto JSON ao FormData
      formData.append("fornecedora", JSON.stringify(fornecedoraData))

      // adicionar arquivo se existir
      if (selectedFile) {
        formData.append("contratoUrl", selectedFile)
      } else {
        throw new Error("O arquivo do contrato é obrigatório!")
      }

      const response = await axios.post(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error)
      throw error
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // valida
    if (!newValues.nome || !newValues.contato || !newValues.endereco || !newValues.dataDeNascimento) {
      setSnackbar({
        open: true,
        message: "Por favor, preencha todos os campos obrigatórios.",
        severity: "error",
      })
      return
    }

    if (!selectedFile) {
      setSnackbar({
        open: true,
        message: "O arquivo do contrato é obrigatório!",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      const data = await createFornecedora(newValues)
      console.log("Fornecedor criado com sucesso:", data)

      setSnackbar({
        open: true,
        message: "Fornecedor cadastrado com sucesso!",
        severity: "success",
      })

      // limpa formulário
      setNewValues({
        nome: "",
        contato: "",
        endereco: "",
        chavePix: "",
        contratoUrl: "",
        dataDeNascimento: "",
      })
      setSelectedFile(null)

      // redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/fornecedores/fornecedores_tabela")
      }, 2000)
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error)
      setSnackbar({
        open: true,
        message: error.message || "Erro ao cadastrar fornecedor. Tente novamente.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const buttonStyle = {
    color: "Black",
    backgroundColor: "#50abe4",
    textTransform: "none",
    width: "200px",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "50px",
    padding: "10px 20px",
    height: "56px",
    "&:hover": {
      backgroundColor: "#003B6F",
    },
    "&:disabled": {
      backgroundColor: "#cccccc",
      color: "#666666",
    },
  }

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#FFFFFF",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      borderRadius: "20px",
    },
    "& .MuiOutlinedInput-root.Mui-focused": {
      backgroundColor: "#FFFFFF",
    },
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: "#9AE4FF",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : "250px",
          position: isMobile ? "static" : "sticky",
          top: 0,
          height: isMobile ? "auto" : "100vh",
        }}
      >
        <Sidebar />
      </Box>

      <Box
        sx={{
          flex: 1,
          p: isMobile ? 2 : 3,
          width: "100%",
        }}
      >
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Card
            sx={{
              borderRadius: 10,
              backgroundColor: "#FADADD",
              p: { xs: 2, sm: 3, md: 4 },
              width: "100%",
              maxWidth: "800px",
              mx: "auto",
              mt: { xs: 2, sm: 4, md: 8 },
              height: "auto",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <IconButton onClick={() => router.back()}>
                      <ArrowBack
                        sx={{
                          fontSize: "30px",
                          cursor: "pointer",
                          color: "black",
                        }}
                      />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => router.push("/")}>
                      <Home
                        sx={{
                          fontSize: "30px",
                          cursor: "pointer",
                          color: "black",
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 4,
                      fontSize: isMobile ? "28px" : isTablet ? "35px" : "45px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Cadastro de Fornecedor
                  </Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid container direction="column" spacing={2}>
                    {formFields.map((field) => (
                      <Grid item key={field.name}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                        >
                          {field.label}
                        </Typography>
                        <TextField
                          fullWidth
                          name={field.name}
                          onChange={handleChange}
                          required={field.name !== "chavePix"}
                          value={newValues[field.name] || ""}
                          variant="outlined"
                          placeholder={field.label}
                          sx={textFieldStyle}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Grid container direction="column" spacing={2} alignItems="flex-end">
                    <Grid item>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={loading}
                        startIcon={<Upload />}
                        sx={{
                          ...buttonStyle,
                          backgroundColor: selectedFile ? "#4CAF50" : "#50abe4",
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={30} sx={{ color: "#FFFFFF" }} />
                        ) : selectedFile ? (
                          "Contrato Selecionado"
                        ) : (
                          "Upload de Contrato"
                        )}
                        <input
                          type="file"
                          name="contrato"
                          hidden
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                      </Button>
                      {selectedFile && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 1,
                            color: "text.secondary",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {selectedFile.name}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" disabled={loading} sx={buttonStyle}>
                        {loading ? <CircularProgress size={30} sx={{ color: "#FFFFFF" }} /> : "Cadastrar Fornecedor"}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        disabled={loading}
                        onClick={() => router.push("/lotes/lotes_cadastro")}
                        sx={buttonStyle}
                      >
                        {loading ? <CircularProgress size={30} sx={{ color: "#FFFFFF" }} /> : "Cadastrar Lote"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>

 
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

