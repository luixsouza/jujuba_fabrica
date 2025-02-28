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
} from "@mui/material"
import { ArrowBack, Home, Upload } from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import { useRouter } from "next/router"
import axios from "axios"
const BASE_URL = "http://localhost:8080/api/fornecedoras"

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setNewValues((prev) => ({
      ...prev,
      contratoUrl: file || "",
    }))
  }

  const createFornecedora = async (values) => {
    try {
      const formData = new FormData()

      formData.append(
        "fornecedora",
        JSON.stringify({
          nome: values.nome || "N/A",
          contato: values.contato || "N/A",
          endereco: values.endereco || "N/A",
          chavePix: values.chavePix || "N/A",
          contratoUrl: values.contratoUrl || null,
          dataDeNascimento: values.dataDeNascimento || "N/A",
        }),
      )

      const contrato = document.querySelector('input[name="contrato"]')?.files[0]
      if (contrato) {
        formData.append("contratoUrl", contrato)
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
    setLoading(true)
    try {
      const data = await createFornecedora(newValues)
      console.log("Fornecedor criado com sucesso:", data)
      alert("Fornecedor criado com sucesso!")
      setNewValues({
        nome: "",
        contato: "",
        endereco: "",
        chavePix: "",
        contratoUrl: "",
        dataDeNascimento: "",
      })
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
                     Visualizar Fornecedor
                  </Typography>
                </Grid>

                <Grid item xs={12} md={8}>
                  {/* Form Fields */}
                  <Grid container direction="column" spacing={2}>
                    {[
                      { label: "Nome", name: "nome" },
                      { label: "Contato", name: "contato" },
                      { label: "Endereço", name: "endereco" },
                      { label: "Chave Pix", name: "chavePix" },
                      { label: "Data de nascimento", name: "dataDeNascimento" },
                    ].map((field) => (
                      <Grid item key={field.name}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                        >
                          {field.label}
                        </Typography>
                        <TextField
                          fullWidth
                          label={field.label}
                          name={field.name}
                          onChange={handleChange}
                          required={field.name !== "chavePix"}
                          value={newValues[field.name] || ""}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "#FFFFFF",
                              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                              borderRadius: "20px",
                            },
                            "& .MuiOutlinedInput-root.Mui-focused": {
                              backgroundColor: "#FFFFFF",
                            },
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
               
                  <Grid container direction="column" spacing={2} alignItems="flex-end">
                   
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </Box>
    </Box>
  )
}

