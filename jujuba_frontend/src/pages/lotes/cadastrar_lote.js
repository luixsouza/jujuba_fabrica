"use client"

import { Autocomplete } from "@mui/material"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
} from "@mui/material"
import { ArrowBack, Home, Delete, Visibility, Add, BugReport } from "@mui/icons-material"
import { createLote, getAllLotes, getFornecedoras, testApiConnection } from "../api/lotes"
import Sidebar from "../../components/sidebar"

export default function CadastroLotePage() {
  const router = useRouter()
  const [loteId, setLoteId] = useState("")
  const [fornecedoraId, setFornecedoraId] = useState("")
  const [fornecedoraSelecionada, setFornecedoraSelecionada] = useState(null)
  const [items, setItems] = useState([])
  const [lotesSidebar, setLotesSidebar] = useState([])
  const [fornecedoras, setFornecedoras] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [debugDialog, setDebugDialog] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  const [creditModal, setCreditModal] = useState(false)
  const [currentCredit, setCurrentCredit] = useState(0)
  const [newCredit, setNewCredit] = useState("")
  const [creditLoading, setCreditLoading] = useState(false)

  const [novoItem, setNovoItem] = useState({
    descricao: "",
    marca: "",
    tamanho: "",
    estadoConservacao: "Ótimo",
    preco: "",
    genero: "Unisex",
    quantidade: 1,
  })

  useEffect(() => {
    // Gerar ID do lote
    setLoteId(`L${String(Math.floor(Math.random() * 900) + 100)}`)

    // Carregar dados iniciais
    fetchLotes()
    fetchFornecedoras()
  }, [])

  const fetchLotes = async () => {
    try {
      const response = await getAllLotes()
      if (response.data) {
        const lotesFormatados = response.data
          .map((lote) => ({
            id: lote.id,
            codigo: `L${lote.id}`,
            data: new Date(lote.dataCriacao).toLocaleDateString("pt-BR"),
          }))
          .slice(0, 5)

        setLotesSidebar(lotesFormatados)
      }
    } catch (error) {
      console.error("Erro ao buscar lotes:", error)
      setError("Não foi possível carregar os lotes.")
    }
  }

  const fetchFornecedoras = async () => {
    try {
      const data = await getFornecedoras()
      setFornecedoras(data)
    } catch (error) {
      console.error("Erro ao buscar fornecedoras:", error)
      setError("Não foi possível carregar as fornecedoras.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNovoItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddItem = () => {
    // Validação
    if (!novoItem.descricao || !novoItem.preco) {
      setError("Por favor, preencha pelo menos a descrição e o valor")
      return
    }

    if (Number.parseFloat(novoItem.preco) <= 0) {
      setError("O valor deve ser maior que zero")
      return
    }

    if (Number.parseInt(novoItem.quantidade) <= 0) {
      setError("A quantidade deve ser maior que zero")
      return
    }

    const newItem = {
      id: Date.now(),
      descricao: novoItem.descricao.trim(),
      marca: novoItem.marca.trim(),
      tamanho: novoItem.tamanho.trim(),
      estadoConservacao: novoItem.estadoConservacao,
      preco: Number.parseFloat(novoItem.preco),
      genero: novoItem.genero || "Unisex",
      quantidade: Number.parseInt(novoItem.quantidade) || 1,
    }

    setItems((prev) => [...prev, newItem])
    setError(null)
    setSuccess("Item adicionado com sucesso!")

    // Limpar formulário
    setNovoItem({
      descricao: "",
      marca: "",
      tamanho: "",
      estadoConservacao: "Ótimo",
      preco: "",
      genero: "Unisex",
      quantidade: 1,
    })

    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSuccess("Item removido com sucesso!")
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleViewItem = (id) => {
    const item = items.find((item) => item.id === id)
    if (item) {
      alert(
        `Detalhes do item:\n` +
          `Descrição: ${item.descricao}\n` +
          `Valor: R$ ${item.preco.toFixed(2)}\n` +
          `Marca: ${item.marca || "Não informado"}\n` +
          `Tamanho: ${item.tamanho || "Não informado"}\n` +
          `Gênero: ${item.genero}\n` +
          `Quantidade: ${item.quantidade}`,
      )
    }
  }

  const handleTestApi = async () => {
    try {
      setLoading(true)
      const result = await testApiConnection()
      setDebugInfo(JSON.stringify(result, null, 2))
      setDebugDialog(true)
    } catch (error) {
      setDebugInfo(`Erro ao testar API: ${error.message}`)
      setDebugDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const getFornecedoraCredit = async (fornecedoraId) => {
    try {
      const response = await fetch(`/api/fornecedores`)
      const data = await response.json()
      const fornecedora = data.find((f) => f.id === fornecedoraId)
      return fornecedora ? fornecedora.creditoLoja || 0 : 0
    } catch (error) {
      console.error("Erro ao buscar crédito da fornecedora:", error)
      return 0
    }
  }

  const updateFornecedoraCredit = async (fornecedoraId, newCreditValue) => {
    try {
      console.log("[v0] === INICIANDO EDIÇÃO DE CRÉDITO ===")
      console.log("[v0] ID:", fornecedoraId)
      console.log("[v0] Novo valor de crédito:", newCreditValue)

      const getFornecedoraResponse = await fetch(`http://localhost:8080/api/fornecedoras/${fornecedoraId}`)

      if (!getFornecedoraResponse.ok) {
        throw new Error(`Erro ao buscar fornecedora: ${getFornecedoraResponse.status}`)
      }

      const fornecedoraData = await getFornecedoraResponse.json()
      console.log("[v0] Dados atuais da fornecedora:", fornecedoraData)

      const updatedFornecedora = {
        ...fornecedoraData,
        creditoLoja: newCreditValue,
      }

      const formData = new FormData()
      formData.append("fornecedora", JSON.stringify(updatedFornecedora))

      const updateResponse = await fetch(`http://localhost:8080/api/fornecedoras/${fornecedoraId}`, {
        method: "PUT",
        body: formData,
      })

      console.log("[v0] === RESPOSTA DA API ===")
      console.log("[v0] Status:", updateResponse.status)

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        console.error("[v0] Erro na resposta:", errorText)
        throw new Error(`HTTP ${updateResponse.status}: ${errorText}`)
      }

      const result = await updateResponse.json()
      console.log("[v0] Data:", result)

      return result
    } catch (error) {
      console.error("[v0] === ERRO COMPLETO NA EDIÇÃO DE CRÉDITO ===", error)
      throw error
    }
  }

  const handleFinalizarLote = async () => {
    if (items.length === 0) {
      setError("Adicione pelo menos um item ao lote antes de finalizar.")
      return
    }

    if (!fornecedoraId) {
      setError("Selecione uma fornecedora para o lote.")
      return
    }

    // Get current credit and open modal
    try {
      setCreditLoading(true)
      const credit = await getFornecedoraCredit(fornecedoraId)
      setCurrentCredit(credit)
      setCreditModal(true)
    } catch (error) {
      setError("Erro ao buscar crédito da fornecedora")
    } finally {
      setCreditLoading(false)
    }
  }

  const handleCreditConfirm = async () => {
    try {
      setCreditLoading(true)
      setError(null)

      console.log("[v0] Starting credit confirmation process")
      console.log("[v0] Current credit:", currentCredit)
      console.log("[v0] New credit to add:", newCredit)
      console.log("[v0] Fornecedora ID:", fornecedoraId)

      // Update credit if new value is provided
      if (newCredit && Number.parseFloat(newCredit) > 0) {
        const updatedCredit = currentCredit + Number.parseFloat(newCredit)
        console.log("[v0] Calculated updated credit:", updatedCredit)
        await updateFornecedoraCredit(fornecedoraId, updatedCredit)
        console.log("[v0] Credit updated successfully")
      }

      // Create the batch
      console.log("[v0] Creating lote with items:", items.length)
      const result = await createLote(fornecedoraId, items)
      console.log("[v0] Lote creation result:", result)

      if (result.success) {
        setSuccess(`Lote finalizado com sucesso! ${items.length} itens cadastrados.`)
        setCreditModal(false)
        setNewCredit("")

        // Redirect after success
        setTimeout(() => {
          router.push("./lotes_geral")
        }, 2000)
      }
    } catch (error) {
      console.error("[v0] Erro ao finalizar lote:", error)
      setError(error.message || "Não foi possível finalizar o lote. Tente novamente.")
    } finally {
      setCreditLoading(false)
    }
  }

  const calcularValorTotal = () => {
    return items.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  // Últimas 10 fornecedoras (supondo que fornecedoras já estejam ordenadas pela data desc)
  const ultimasFornecedoras = fornecedoras.slice(0, 10)

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar lotes={lotesSidebar} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "244px",
          backgroundColor: "#a3e0f5",
          minHeight: "100vh",
          p: 4,
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            mb: 4,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <IconButton onClick={() => router.push("./lotes_geral")} sx={{ color: "#333" }}>
              <ArrowBack />
            </IconButton>

            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#333",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                CADASTRAR LOTE
              </Typography>
              <Typography variant="h6" sx={{ color: "#666" }}>
                Lote: {loteId}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton onClick={handleTestApi} sx={{ color: "#333" }} title="Testar API">
                <BugReport />
              </IconButton>
              <IconButton onClick={() => router.push("../fornecedores/fornecedores_tabela")} sx={{ color: "#333" }}>
                <Home />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Alertas */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Paper
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 3,
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
            border: "2px solid #e0e0e0",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#333",
              textAlign: "center",
              pb: 2,
              borderBottom: "2px solid #FADADD",
            }}
          >
            Adicionar Novo Item
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Descrição do item"
                name="descricao"
                value={novoItem.descricao}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Marca"
                name="marca"
                value={novoItem.marca}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tamanho"
                name="tamanho"
                value={novoItem.tamanho}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado de Conservação</InputLabel>
                <Select
                  name="estadoConservacao"
                  value={novoItem.estadoConservacao}
                  onChange={handleInputChange}
                  label="Estado de Conservação"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="Ótimo">Ótimo</MenuItem>
                  <MenuItem value="Excelente">Excelente</MenuItem>
                  <MenuItem value="Bom">Bom</MenuItem>
                  <MenuItem value="Ruim">Ruim</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Valor (R$)"
                name="preco"
                type="number"
                value={novoItem.preco}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ step: 0.01, min: 0.01 }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quantidade"
                name="quantidade"
                type="number"
                value={novoItem.quantidade}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ min: 1 }}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover fieldset": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gênero</InputLabel>
                <Select
                  name="genero"
                  value={novoItem.genero}
                  onChange={handleInputChange}
                  label="Gênero"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#d0d0d0",
                      borderWidth: 2,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FADADD",
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Unisex">Unisex</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={fornecedoras
                  .slice()
                  .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
                  .slice(0, 10)}
                getOptionLabel={(option) => option.nome}
                value={fornecedoras.find((f) => f.id === fornecedoraId) || null}
                onChange={(event, newValue) => {
                  setFornecedoraId(newValue ? newValue.id : "")
                  setFornecedoraSelecionada(newValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fornecedora"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#fafafa",
                        "& fieldset": {
                          borderColor: "#d0d0d0",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "#FADADD",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#FADADD",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText="Nenhuma fornecedora encontrada"
                clearOnEscape
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              disabled={loading}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#f8a8c8",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 20px rgba(250, 218, 221, 0.4)",
                },
                px: 6,
                py: 2,
                borderRadius: 25,
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow: "0px 4px 15px rgba(250, 218, 221, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Adicionar Item
            </Button>
          </Box>
        </Paper>

        <Card
          sx={{
            padding: "25px",
            bgcolor: "white",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            width: "100%",
            margin: "0 auto",
            border: "3px solid #e0e0e0",
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#333",
              textAlign: "center",
              pb: 2,
              borderBottom: "3px solid #FADADD",
            }}
          >
            Itens do Lote
          </Typography>

          <TableContainer
            sx={{
              maxHeight: "600px",
              borderRadius: "15px",
              overflow: "auto",
              backgroundColor: "#ffffff",
              width: "100%",
              border: "2px solid #f0f0f0",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Descrição
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Valor
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Quantidade
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Marca
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Tamanho
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Gênero
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                      borderRight: "2px solid #F5F5F5",
                      fontWeight: 600,
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, fontSize: "1.1rem", color: "#666" }}>
                      Nenhum item adicionado ao lote
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} hover sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}>
                      <TableCell sx={{ fontSize: "16px" }}>{item.descricao}</TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>{item.estadoConservacao}</TableCell>
                      <TableCell sx={{ fontSize: "16px", fontWeight: 600 }}>
                        R$ {item.preco.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>{item.quantidade}</TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>{item.marca || "-"}</TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>{item.tamanho || "-"}</TableCell>
                      <TableCell sx={{ fontSize: "16px" }}>{item.genero}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleViewItem(item.id)} color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteItem(item.id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {items.length > 0 && (
                  <TableRow sx={{ backgroundColor: "#f0f8ff" }}>
                    <TableCell colSpan={2} align="right" sx={{ fontWeight: "bold", fontSize: "18px" }}>
                      Total:
                    </TableCell>
                    <TableCell colSpan={6} sx={{ fontWeight: "bold", fontSize: "18px", color: "#2e7d32" }}>
                      R$ {calcularValorTotal().toFixed(2).replace(".", ",")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleFinalizarLote}
            disabled={loading || items.length === 0 || !fornecedoraId}
            sx={{
              backgroundColor: "#ffd0e8",
              color: "#333",
              "&:hover": {
                backgroundColor: "#ffb0d8",
                transform: "translateY(-3px)",
                boxShadow: "0px 8px 25px rgba(255, 208, 232, 0.4)",
              },
              "&:disabled": {
                backgroundColor: "#e0e0e0",
                color: "#999",
              },
              px: 8,
              py: 2.5,
              borderRadius: 30,
              fontSize: "1.2rem",
              fontWeight: 700,
              boxShadow: "0px 6px 20px rgba(255, 208, 232, 0.3)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 2, color: "#333" }} />
                Processando...
              </>
            ) : (
              "Finalizar Lote"
            )}
          </Button>
        </Box>

        <Dialog
          open={creditModal}
          onClose={() => !creditLoading && setCreditModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#333",
              borderBottom: "2px solid #FADADD",
              pb: 2,
            }}
          >
            Gerenciar Crédito do Fornecedor
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
                Fornecedor: {fornecedoraSelecionada?.nome}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
                Crédito atual: <strong>R$ {currentCredit.toFixed(2).replace(".", ",")}</strong>
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Novo crédito a receber (R$)"
              type="number"
              value={newCredit}
              onChange={(e) => setNewCredit(e.target.value)}
              inputProps={{ step: 0.01, min: 0 }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#d0d0d0",
                    borderWidth: 2,
                  },
                  "&:hover fieldset": {
                    borderColor: "#FADADD",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FADADD",
                    borderWidth: 2,
                  },
                },
              }}
              helperText="Deixe em branco se não houver crédito adicional"
            />

            {newCredit && Number.parseFloat(newCredit) > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Novo total será: R$ {(currentCredit + Number.parseFloat(newCredit)).toFixed(2).replace(".", ",")}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setCreditModal(false)}
              disabled={creditLoading}
              sx={{
                color: "#666",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreditConfirm}
              variant="contained"
              disabled={creditLoading}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#f8a8c8",
                },
                px: 4,
                borderRadius: 2,
              }}
            >
              {creditLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "#333" }} />
                  Processando...
                </>
              ) : (
                "Confirmar e Finalizar"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={debugDialog} onClose={() => setDebugDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Informações de Debug da API</DialogTitle>
          <DialogContent>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>{debugInfo}</pre>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDebugDialog(false)}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}
