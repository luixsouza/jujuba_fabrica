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

// Importar Autocomplete do MUI
//import Autocomplete from "@mui/material/Autocomplete"

export default function CadastroLotePage() {
  const router = useRouter()
  const [loteId, setLoteId] = useState("")
  const [fornecedoraId, setFornecedoraId] = useState("")
  const [fornecedoraSelecionada, setFornecedoraSelecionada] = useState(null) // Para controlar o objeto selecionado
  const [items, setItems] = useState([])
  const [lotesSidebar, setLotesSidebar] = useState([])
  const [fornecedoras, setFornecedoras] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [debugDialog, setDebugDialog] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

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

  const handleFinalizarLote = async () => {
    if (items.length === 0) {
      setError("Adicione pelo menos um item ao lote antes de finalizar.")
      return
    }

    if (!fornecedoraId) {
      setError("Selecione uma fornecedora para o lote.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const result = await createLote(fornecedoraId, items)

      if (result.success) {
        setSuccess(`Lote finalizado com sucesso! ${items.length} itens cadastrados.`)

        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          router.push("./lotes_geral")
        }, 2000)
      }
    } catch (error) {
      console.error("Erro ao finalizar lote:", error)
      setError(error.message || "Não foi possível finalizar o lote. Tente novamente.")
    } finally {
      setLoading(false)
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

        {/* Formulário */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
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
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Gênero</InputLabel>
                <Select name="genero" value={novoItem.genero} onChange={handleInputChange} label="Gênero">
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Unisex">Unisex</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* ALTERAÇÃO AQUI: Autocomplete para Fornecedora */}
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
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Fornecedora" variant="outlined" />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                noOptionsText="Nenhuma fornecedora encontrada"
                clearOnEscape
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              disabled={loading}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#FADADD",
                },
                px: 4,
                py: 1.5,
                borderRadius: 25,
              }}
            >
              Adicionar Item
            </Button>
          </Box>
        </Paper>

        <Card
          sx={{
            padding: "20px",
            bgcolor: "white",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "25px",
            backgroundColor: "#F5F5F5",
            width: "100%",
            margin: "0 auto",
            border: "2px solid #B0B0B0",
          }}
        >
          {/*titulo novo*/}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#333",
              fontSize: "2rem", // Ajuste o tamanho da fonte conforme desejar
              textAlign: "left", // Alinhe à esquerda ou ao centro
              pl: 1, // Adicione um pouco de padding à esquerda se necessário
            }}
          >
            Itens do Lote
          </Typography>

          <TableContainer
            sx={{
              maxHeight: "600px",
              borderRadius: "10px",
              overflow: "auto",
              backgroundColor: "#F5F5F5",
              width: "100%",
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
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Nenhum item adicionado ao lote
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.estadoConservacao}</TableCell>
                      <TableCell>R$ {item.preco.toFixed(2).replace(".", ",")}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>{item.marca || "-"}</TableCell>
                      <TableCell>{item.tamanho || "-"}</TableCell>
                      <TableCell>{item.genero}</TableCell>
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
                  <TableRow>
                    <TableCell colSpan={2} align="right" sx={{ fontWeight: "bold" }}>
                      Total:
                    </TableCell>
                    <TableCell colSpan={6} sx={{ fontWeight: "bold" }}>
                      R$ {calcularValorTotal().toFixed(2).replace(".", ",")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Botão Finalizar */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={handleFinalizarLote}
            disabled={loading || items.length === 0 || !fornecedoraId}
            sx={{
              backgroundColor: "#ffd0e8",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#ffb0d8",
              },
              px: 6,
              py: 2,
              borderRadius: 25,
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processando...
              </>
            ) : (
              "Finalizar Lote"
            )}
          </Button>
        </Box>

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
