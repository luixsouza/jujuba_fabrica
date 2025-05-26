"use client"

import { useState, useEffect } from "react"
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
  Snackbar,
  Alert,
  Chip,
} from "@mui/material"
import { ArrowBack, Home } from "@mui/icons-material"
import Sidebar from "../../../components/sidebar" // Usando o caminho da 'main'
import { useRouter } from "next/router"
import { editarFornecedora } from "../api/fornecedores" // Usando a função importada da 'main'
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/fornecedoras"

export default function FornecedoresEdicao() {
  const theme = useTheme()
  const router = useRouter()
  const { id } = router.query
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Estado combinando campos de ambas as versões, padronizado para dataDeNascimento
  const [fornecedora, setFornecedora] = useState({
    nome: "",
    dataDeNascimento: "", // Padronizado
    contato: "",
    endereco: "",
    chavePix: "",
    contratoUrl: "",
  })

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [contratoAtual, setContratoAtual] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchFornecedora(id)
    }
  }, [id])

  // Lógica de busca da 'main', com formatação de data e erro detalhado
  const fetchFornecedora = async (fornecedoraId) => {
    try {
      setFetchLoading(true)
      console.log("Buscando fornecedor com ID:", fornecedoraId)

      const response = await axios.get(`${BASE_URL}/${fornecedoraId}`)
      console.log("Resposta da API:", response.data)

      const data = response.data

      // Formatando a data se necessário (lógica da 'main')
      let dataFormatada = data.dataDeNascimento || ""
      if (dataFormatada && !dataFormatada.includes("-")) {
        const partes = dataFormatada.split("/")
        if (partes.length === 3) {
          dataFormatada = `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`
        }
      }

      // Atualizando estado com dados da API e data formatada
      setFornecedora({
        nome: data.nome || "",
        dataDeNascimento: dataFormatada, // Usando o campo padronizado e formatado
        contato: data.contato || "",
        endereco: data.endereco || "",
        chavePix: data.chavePix || "",
        contratoUrl: data.contratoUrl || "",
      })

      if (data.contratoUrl) {
        setContratoAtual(data.contratoUrl)
      }

      setSnackbar({
        open: true,
        message: "Dados carregados com sucesso!",
        severity: "success",
      })
    } catch (error) {
      console.error("Erro ao buscar dados do fornecedor:", error)
      // Mensagem de erro detalhada da 'main'
      setSnackbar({
        open: true,
        message: `Erro ao carregar dados do fornecedor: ${error.response?.data?.message || error.message}`,
        severity: "error",
      })
    } finally {
      setFetchLoading(false)
    }
  }

  // Handlers da 'main' (incluindo console.log)
  const handleChange = (event) => {
    const { name, value } = event.target
    console.log(`Campo ${name} alterado para:`, value)
    setFornecedora((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log("Arquivo selecionado:", file.name)
      setSelectedFile(file)
      // Atualiza o nome no estado apenas para exibição, o arquivo real será enviado
      setFornecedora((prev) => ({
        ...prev,
        contratoUrl: file.name, 
      }))
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Lógica de submit da 'main', mas adaptada para usar FormData (necessário para arquivo)
  const handleSubmit = async (event) => {
    event.preventDefault()

    console.log("Dados do formulário antes da validação:", fornecedora)

    // Validação da 'main' (Nome, Contato, Endereço)
    if (!fornecedora.nome.trim() || !fornecedora.contato.trim() || !fornecedora.endereco.trim()) {
      setSnackbar({
        open: true,
        message: "Por favor, preencha todos os campos obrigatórios (Nome, Contato e Endereço).",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      // Usar FormData para enviar dados e arquivo (influência da Corrigir_telas)
      const formData = new FormData()
      
      // Anexar dados do formulário ao FormData
      // É crucial que a API (e a função editarFornecedora) espere receber os dados dessa forma
      // Se editarFornecedora espera um objeto JSON, esta parte precisa ser ajustada
      // Assumindo que editarFornecedora pode lidar com FormData ou que será ajustada:
      formData.append("nome", fornecedora.nome)
      formData.append("dataDeNascimento", fornecedora.dataDeNascimento)
      formData.append("contato", fornecedora.contato)
      formData.append("endereco", fornecedora.endereco)
      formData.append("chavePix", fornecedora.chavePix)
      // Não enviar contratoUrl como string, enviar o arquivo ou nada

      if (selectedFile) {
        formData.append("contratoFile", selectedFile) // Nome do campo para o arquivo (verificar API)
      } else {
        // Se não há arquivo novo, talvez a API precise saber o contrato atual?
        // Ou talvez não precise enviar nada se não mudou. Verifique a API.
        // formData.append("contratoUrl", contratoAtual); // Exemplo, se necessário
      }

      console.log("Dados enviados para API (FormData):", formData) // FormData não é diretamente logável assim

      // Chamar a função importada da 'main', passando FormData
      const data = await editarFornecedora(id, formData) 
      console.log("Fornecedor atualizado com sucesso:", data)

      setSnackbar({
        open: true,
        message: "Fornecedor atualizado com sucesso!",
        severity: "success",
      })

      setTimeout(() => {
        router.push("/fornecedores/fornecedores_tabela")
      }, 2000)
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error)
      setSnackbar({
        open: true,
        message: error.message || "Erro ao atualizar fornecedor. Tente novamente.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // JSX de carregamento (padrão)
  if (fetchLoading) {
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
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#FADADD" }} />
          <Typography variant="h6" sx={{ ml: 2, color: "#333" }}>
            Carregando dados do fornecedor...
          </Typography>
        </Box>
      </Box>
    )
  }

  // JSX principal com layout da 'Corrigir_telas'
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#9AE4FF", // Cor de fundo geral
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "250px" } }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, p: 3 }}>
        {/* Título da página removido ou vazio na versão Corrigir_telas */}
        <Box sx={{ mb: 1, textAlign: "center", mt: { xs: 4, md: 8 } }}>
          {/* <Typography variant="h4" sx={{...}}></Typography> */}
        </Box>

        <form autoComplete="off" onSubmit={handleSubmit}>
          {/* Estilo do Card da 'Corrigir_telas' */}
          <Card
            sx={{
              borderRadius: 10,
              backgroundColor: "#FADADD", // Cor do card
              p: 3,
              maxWidth: "60%", // Largura do card da 'Corrigir_telas'
              mx: "auto",
              mt: { xs: 4, md: 8 },
              height: "auto",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <CardContent>
              {/* Título interno do Card removido ou vazio */}
              {/* <Typography variant="h6" gutterBottom sx={{...}}></Typography> */}
              
              <Grid container spacing={3}>
                {/* Layout dos Ícones, Título, Mensagem e Chip da 'Corrigir_telas' */}
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

                    {/* Título Principal */}
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
                        Edição de Fornecedor
                      </Typography>
                      
                      {/* Mensagem informativa sobre campos obrigatórios */}
                      <Typography
                        variant="body2"
                        sx={{ 
                          fontSize: "14px",
                          color: "gray",
                          textAlign: "center",
                          mb: 1
                        }}
                      >
                        Campos com <span style={{ color: 'red' }}>*</span> são obrigatórios
                      </Typography>
                      
                      {/* Chip com ID */}
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Chip
                          label={`ID: ${id}`}
                          color="primary"
                          sx={{
                            backgroundColor: "rgba(154, 228, 255, 0.8)",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* Layout vertical dos campos da 'Corrigir_telas' */}
                <Grid item xs={12}>
                  <Grid container justifyContent="center">
                    {/* Campo Nome */}
                    <Grid item xs={12} sm={10} md={8}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "normal", fontSize: "18px", marginBottom: "4px", color: "gray" }}
                      >
                        Nome <span style={{ color: 'red' }}>*</span> {/* Obrigatório pela lógica 'main' */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="nome"
                        onChange={handleChange}
                        required // Lógica 'main'
                        value={fornecedora.nome}
                        variant="outlined"
                        label="" // Layout 'Corrigir_telas'
                        placeholder="" // Layout 'Corrigir_telas'
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
                        Data de Nascimento {/* Não obrigatório pela lógica 'main' */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="dataDeNascimento"
                        onChange={handleChange}
                        // required // Não era required na validação da 'main'
                        value={fornecedora.dataDeNascimento}
                        variant="outlined"
                        label="" // Layout 'Corrigir_telas'
                        placeholder="" // Layout 'Corrigir_telas'
                        type="date" // Layout 'Corrigir_telas'
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
                        Contato <span style={{ color: 'red' }}>*</span> {/* Obrigatório pela lógica 'main' */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="contato"
                        onChange={handleChange}
                        required // Lógica 'main'
                        value={fornecedora.contato}
                        variant="outlined"
                        label="" // Layout 'Corrigir_telas'
                        placeholder="" // Layout 'Corrigir_telas'
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
                        Endereço <span style={{ color: 'red' }}>*</span> {/* Obrigatório pela lógica 'main' */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="endereco"
                        onChange={handleChange}
                        required // Lógica 'main'
                        value={fornecedora.endereco}
                        variant="outlined"
                        label="" // Layout 'Corrigir_telas'
                        placeholder="" // Layout 'Corrigir_telas'
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
                        Chave Pix {/* Não obrigatório pela lógica 'main' */}
                      </Typography>
                      <TextField
                        fullWidth
                        name="chavePix"
                        onChange={handleChange}
                        value={fornecedora.chavePix}
                        variant="outlined"
                        label="" // Layout 'Corrigir_telas'
                        placeholder="" // Layout 'Corrigir_telas'
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
                    
                    {/* Mensagem sobre contrato da 'Corrigir_telas' */}
                    <Grid item xs={12} sm={10} md={8} sx={{ mt: 4 }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          fontWeight: "normal", 
                          fontSize: "16px", 
                          marginBottom: "8px", 
                          color: "gray",
                          textAlign: "center"
                        }}
                      >
                        {contratoAtual && !selectedFile ? (
                          <>Contrato atual: <span style={{ fontWeight: 'bold' }}>{contratoAtual}</span></>
                        ) : selectedFile ? (
                          <>Novo contrato selecionado: <span style={{ fontWeight: 'bold' }}>{selectedFile.name}</span></>
                        ) : (
                          <>Nenhum contrato carregado.</> // Ajuste a mensagem se necessário
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Botões com layout da 'Corrigir_telas' */}
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
                  {/* Botão Upload/Trocar Contrato */}
                  <Button
                    component="label"
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
                      <CircularProgress size={20} sx={{ color: "#FFFFFF", marginRight: 1 }} />
                    ) : selectedFile ? (
                      "Contrato Selecionado"
                    ) : contratoAtual ? (
                      "Trocar Contrato"
                    ) : (
                      "Upload de Contrato"
                    )}
                    <input type="file" name="contratoFile" hidden onChange={handleFileChange} />
                  </Button>

                  {/* Botão Atualizar Fornecedor */}
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
                      <CircularProgress size={20} sx={{ color: "#FFFFFF", marginRight: 1 }} />
                    ) : (
                      "Atualizar Fornecedor"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>

        {/* Snackbar (padrão) */}
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
    </Box>
  )
}

