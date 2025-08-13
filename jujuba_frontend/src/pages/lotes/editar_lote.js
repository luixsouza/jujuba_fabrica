"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Material-UI imports
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputAdornment from "@mui/material/InputAdornment"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import DialogContentText from "@mui/material/DialogContentText"
import Grid from "@mui/material/Grid"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"

// Material-UI icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import HomeIcon from "@mui/icons-material/Home"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

// Import API functions
import { getLoteById, editLote, getAllLotes, getFornecedoras, ESTADOS_CONSERVACAO, GENEROS } from "../api/lotes"

// Import Sidebar component
import Sidebar from "../../components/sidebar"

export default function EditarLotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loteId = searchParams.get("id") || ""

  // State management
  const [editingItemId, setEditingItemId] = useState(null)
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false)
  const [openFinishDialog, setOpenFinishDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [hasChanges, setHasChanges] = useState(false)
  const [originalItems, setOriginalItems] = useState([])
  const [items, setItems] = useState([])
  const [lotesSidebar, setLotesSidebar] = useState([])
  const [fornecedoras, setFornecedoras] = useState([])
  const [selectedFornecedora, setSelectedFornecedora] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for edited item
  const [editedItem, setEditedItem] = useState({
    descricao: "",
    estadoConservacao: "BOM",
    preco: 0,
    quantidade: 1,
    marca: "",
    tamanho: "",
    genero: "UNISSEX",
  })

  // State for new item
  const [newItem, setNewItem] = useState({
    descricao: "",
    estadoConservacao: "BOM",
    preco: "",
    quantidade: 1,
    marca: "",
    tamanho: "",
    genero: "UNISSEX",
  })

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!loteId) {
        setError("ID do lote não fornecido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Fetch lote data, fornecedoras, and sidebar lotes in parallel
        const [loteData, fornecedorasData, lotesData] = await Promise.all([
          getLoteById(loteId),
          getFornecedoras(),
          getAllLotes(),
        ])

        // Set lote data
        if (loteData) {
          setSelectedFornecedora(loteData.fornecedora?.id?.toString() || "")

          if (loteData.produtos && Array.isArray(loteData.produtos)) {
            const formattedItems = loteData.produtos.map((produto) => ({
              id: produto.id,
              descricao: produto.descricao || produto.nome || "",
              preco: Number(produto.preco) || 0,
              quantidade: Number(produto.quantidade) || 1,
              marca: produto.marca || "",
              tamanho: produto.tamanho || "",
              estadoConservacao: produto.estadoConservacao || "BOM",
              genero: produto.genero || "UNISSEX",
            }))

            setItems(formattedItems)
            setOriginalItems(JSON.parse(JSON.stringify(formattedItems)))
          }
        }

        // Set fornecedoras
        setFornecedoras(Array.isArray(fornecedorasData) ? fornecedorasData : [])

        // Set sidebar lotes
        const formattedLotes = Array.isArray(lotesData)
          ? lotesData
              .map((lote) => ({
                id: lote.id,
                codigo: `L${lote.id}`,
                data: lote.dataCriacao ? new Date(lote.dataCriacao).toLocaleDateString("pt-BR") : "Data não disponível",
              }))
              .slice(0, 5)
          : []

        setLotesSidebar(formattedLotes)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setError(`Erro ao carregar dados: ${error.message}`)
        showSnackbar("Erro ao carregar dados do lote", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [loteId])

  // Check for changes
  useEffect(() => {
    if (originalItems.length > 0) {
      const itemsChanged = JSON.stringify(items) !== JSON.stringify(originalItems)
      setHasChanges(itemsChanged)
    }
  }, [items, originalItems])

  // Navigation handlers
  const handleGoBack = () => {
    if (hasChanges) {
      if (confirm("Você tem alterações não salvas. Deseja realmente sair?")) {
        router.back()
      }
    } else {
      router.back()
    }
  }

  const handleGoHome = () => {
    if (hasChanges) {
      if (confirm("Você tem alterações não salvas. Deseja realmente sair?")) {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }

  // Item handlers
  const handleViewItem = (itemId) => {
    router.push(`/estoque/visualizar_produto?id=${itemId}`)
  }

  const handleEditItem = (item) => {
    setEditingItemId(item.id)
    setEditedItem({
      descricao: item.descricao,
      estadoConservacao: item.estadoConservacao,
      preco: item.preco,
      quantidade: item.quantidade,
      marca: item.marca,
      tamanho: item.tamanho,
      genero: item.genero,
    })
  }

  const handleCancelEdit = () => {
    setEditingItemId(null)
    setEditedItem({
      descricao: "",
      estadoConservacao: "BOM",
      preco: 0,
      quantidade: 1,
      marca: "",
      tamanho: "",
      genero: "UNISSEX",
    })
  }

  const handleSaveEdit = () => {
    // Validate required fields
    if (!editedItem.descricao?.trim()) {
      showSnackbar("Descrição é obrigatória", "error")
      return
    }

    if (!editedItem.preco || editedItem.preco <= 0) {
      showSnackbar("Preço deve ser maior que zero", "error")
      return
    }

    if (!editedItem.quantidade || editedItem.quantidade <= 0) {
      showSnackbar("Quantidade deve ser maior que zero", "error")
      return
    }

    // Update item in the list
    setItems(
      items.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              ...editedItem,
              preco: Number(editedItem.preco),
              quantidade: Number(editedItem.quantidade),
            }
          : item,
      ),
    )

    setEditingItemId(null)
    showSnackbar("Item atualizado com sucesso", "success")
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditedItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDeleteItem = (item) => {
    setItemToDelete(item)
    setOpenDeleteDialog(true)
  }

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setItems(items.filter((item) => item.id !== itemToDelete.id))
      setOpenDeleteDialog(false)
      setItemToDelete(null)
      showSnackbar("Item removido com sucesso", "success")
    }
  }

  // New item handlers
  const handleNewItemChange = (e) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOpenNewItemDialog = () => {
    setNewItem({
      descricao: "",
      estadoConservacao: "BOM",
      preco: "",
      quantidade: 1,
      marca: "",
      tamanho: "",
      genero: "UNISSEX",
    })
    setOpenNewItemDialog(true)
  }

  const handleCloseNewItemDialog = () => {
    setOpenNewItemDialog(false)
  }

  const handleAddNewItem = () => {
    // Validate required fields
    if (!newItem.descricao?.trim()) {
      showSnackbar("Descrição é obrigatória", "error")
      return
    }

    if (!newItem.preco || Number(newItem.preco) <= 0) {
      showSnackbar("Preço deve ser maior que zero", "error")
      return
    }

    if (!newItem.quantidade || Number(newItem.quantidade) <= 0) {
      showSnackbar("Quantidade deve ser maior que zero", "error")
      return
    }

    // Generate temporary ID for new item
    const tempId = `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newItemWithId = {
      id: tempId,
      descricao: newItem.descricao.trim(),
      preco: Number(newItem.preco),
      quantidade: Number(newItem.quantidade),
      marca: newItem.marca?.trim() || "",
      tamanho: newItem.tamanho?.trim() || "",
      estadoConservacao: newItem.estadoConservacao,
      genero: newItem.genero,
    }

    setItems([...items, newItemWithId])
    setOpenNewItemDialog(false)
    showSnackbar("Novo item adicionado com sucesso", "success")
  }

  // Finish editing handlers
  const handleOpenFinishDialog = () => {
    if (!hasChanges) {
      showSnackbar("Nenhuma alteração foi feita no lote", "info")
      return
    }

    if (!selectedFornecedora) {
      showSnackbar("Selecione uma fornecedora antes de finalizar", "error")
      return
    }

    if (items.length === 0) {
      showSnackbar("Adicione pelo menos um produto ao lote", "error")
      return
    }

    setOpenFinishDialog(true)
  }

  const handleCloseFinishDialog = () => {
    setOpenFinishDialog(false)
  }

  const handleFinishLote = async () => {
    try {
      setLoading(true)

      // Prepare data according to API format
      const loteData = {
        fornecedora: {
          id: Number(selectedFornecedora),
        },
        produtos: items.map((item) => ({
          id: item.id.toString().startsWith("TEMP_") ? undefined : item.id,
          descricao: item.descricao,
          preco: Number(item.preco),
          quantidade: Number(item.quantidade),
          marca: item.marca || "",
          tamanho: item.tamanho || "",
          estadoConservacao: item.estadoConservacao,
          genero: item.genero,
        })),
      }

      console.log("Enviando dados para API:", loteData)

      // Call API to update lote
      const result = await editLote(loteId, loteData)

      console.log("Resposta da API:", result)

      setOpenFinishDialog(false)
      showSnackbar("Lote atualizado com sucesso!", "success")

      // Update original items to reflect saved state
      setOriginalItems(JSON.parse(JSON.stringify(items)))
      setHasChanges(false)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/lotes/lotes_geral")
      }, 1500)
    } catch (error) {
      console.error("Erro ao atualizar lote:", error)
      showSnackbar(`Erro ao atualizar lote: ${error.message}`, "error")
      setLoading(false)
    }
  }

  // Utility functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const getEstadoConservacaoLabel = (value) => {
    const entry = Object.entries(ESTADOS_CONSERVACAO).find(([key, val]) => val === value)
    return entry ? entry[0] : value
  }

  const getGeneroLabel = (value) => {
    const entry = Object.entries(GENEROS).find(([key, val]) => val === value)
    return entry ? entry[0] : value
  }

  // Loading state
  if (loading && !items.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#a3e0f5",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar lotes={lotesSidebar} />

      {/* Main Content */}
      <Box
        sx={{
          ml: "244px",
          flex: 1,
          bgcolor: "#a3e0f5",
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 244px)",
          px: 4,
        }}
      >
        {/* Header */}
        <Box
  sx={{
    p: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#9AE4FF",
    marginTop: "50px",
  }}
>
  <IconButton sx={{ color: "black" }} onClick={handleGoBack}>
    <ArrowBackIcon fontSize="medium" />
  </IconButton>

  <Box sx={{ flex: 1, textAlign: "center" }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        fontSize: "50px",
        color: "#000000",
      }}
    >
      Editando Lote
    </Typography>

    <Box
  sx={{
    bgcolor: "white",
    borderRadius: 1,
    px: 2,
    py: 0.8,
    display: "inline-block",
    mt: 1,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // sombra
  }}
>
  <Typography
    sx={{
      fontWeight: "bold",
      fontSize: "1.4rem",
      color: "#2B2B2B", // cor escura para o texto
    }}
  >
    Lote: {loteId}
  </Typography>
</Box>

  </Box>

  <IconButton sx={{ color: "black" }} onClick={handleGoHome}>
    <HomeIcon fontSize="medium" />
  </IconButton>
</Box>

        {/* Error Alert */}
        {error && (
          <Box sx={{ mx: "auto", mt: 2, width: "95%", maxWidth: "1200px" }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Box>
        )}


        <Box sx={{ mx: "auto", mt: 2, width: "100%", maxWidth: "1200px" }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={selectedFornecedora}
            onChange={(e) => setSelectedFornecedora(e.target.value)}
            sx={{
              bgcolor: "white",
              border: "1px solid #ccc", // borda padrão
              "&:hover": {
                border: "1px solid black" // borda preta ao passar mouse
              }
            }}
          >
            {fornecedoras.map((fornecedora) => (
              <MenuItem key={fornecedora.id} value={fornecedora.id.toString()}>
                {fornecedora.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>


        {/* Products Table */}
        <TableContainer
          component={Paper}
          sx={{
            padding: "20px",
            bgcolor: "white",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "25px",
            backgroundColor: "#F5F5F5",
            width: "100%",
            margin: "0 auto",
            border: "2px solid #F5F5F5",
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
                  Preço
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
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <TextField
                          fullWidth
                          multiline
                          name="descricao"
                          value={editedItem.descricao}
                          onChange={handleEditChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        item.descricao
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            name="estadoConservacao"
                            value={editedItem.estadoConservacao}
                            onChange={handleEditChange}
                          >
                            {Object.entries(ESTADOS_CONSERVACAO).map(([label, value]) => (
                              <MenuItem key={value} value={value}>
                                {label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        getEstadoConservacaoLabel(item.estadoConservacao)
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <TextField
                          fullWidth
                          name="preco"
                          type="number"
                          value={editedItem.preco}
                          onChange={handleEditChange}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                          }}
                        />
                      ) : (
                        `R$ ${Number(item.preco).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <TextField
                          fullWidth
                          name="quantidade"
                          type="number"
                          value={editedItem.quantidade}
                          onChange={handleEditChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        item.quantidade
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <TextField
                          fullWidth
                          name="marca"
                          value={editedItem.marca}
                          onChange={handleEditChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        item.marca || "-"
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <TextField
                          fullWidth
                          name="tamanho"
                          value={editedItem.tamanho}
                          onChange={handleEditChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        item.tamanho || "-"
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <FormControl fullWidth size="small">
                          <Select name="genero" value={editedItem.genero} onChange={handleEditChange}>
                            {Object.entries(GENEROS).map(([label, value]) => (
                              <MenuItem key={value} value={value}>
                                {label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        getGeneroLabel(item.genero)
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        {editingItemId === item.id ? (
                          <>
                            <IconButton size="small" onClick={handleSaveEdit} sx={{ color: "green" }}>
                              <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleCancelEdit} sx={{ color: "red" }}>
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton size="small" onClick={() => handleViewItem(item.id)} sx={{ color: "#00509E" }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleEditItem(item)} sx={{ color: "#00509E" }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteItem(item)} sx={{ color: "#d32f2f" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="textSecondary">
                      Nenhum produto encontrado neste lote
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewItemDialog}
            sx={{
              bgcolor: "#FADADD",
              color: "black",
              fontWeight: "bold",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: "#FADADD",
              },
            }}
          >
            Adicionar Produto
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenFinishDialog}
            disabled={!hasChanges || loading}
            sx={{
              bgcolor: hasChanges && !loading ? "#4caf50" : "#cccccc",
              color: "white",
              fontWeight: "bold",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: hasChanges && !loading ? "#45a049" : "#cccccc",
              },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Salvar Alterações"}
          </Button>
        </Box>
      </Box>

      {/* New Item Dialog */}
      <Dialog open={openNewItemDialog} onClose={handleCloseNewItemDialog} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar Novo Produto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição *"
                name="descricao"
                value={newItem.descricao}
                onChange={handleNewItemChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Preço *"
                name="preco"
                type="number"
                value={newItem.preco}
                onChange={handleNewItemChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantidade *"
                name="quantidade"
                type="number"
                value={newItem.quantidade}
                onChange={handleNewItemChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Estado de Conservação</InputLabel>
                <Select
                  name="estadoConservacao"
                  value={newItem.estadoConservacao}
                  onChange={handleNewItemChange}
                  label="Estado de Conservação"
                >
                  {Object.entries(ESTADOS_CONSERVACAO).map(([label, value]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Gênero</InputLabel>
                <Select name="genero" value={newItem.genero} onChange={handleNewItemChange} label="Gênero">
                  {Object.entries(GENEROS).map(([label, value]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Marca"
                name="marca"
                value={newItem.marca}
                onChange={handleNewItemChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Tamanho"
                name="tamanho"
                value={newItem.tamanho}
                onChange={handleNewItemChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewItemDialog}>Cancelar</Button>
          <Button onClick={handleAddNewItem} variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover o produto "{itemToDelete?.descricao}" do lote?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDeleteItem} variant="contained" color="error">
            Remover
          </Button>
        </DialogActions>
      </Dialog>

      {/* Finish Dialog */}
      <Dialog open={openFinishDialog} onClose={handleCloseFinishDialog}>
        <DialogTitle>Salvar Alterações do Lote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja salvar todas as alterações feitas no lote? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFinishDialog}>Cancelar</Button>
          <Button onClick={handleFinishLote} variant="contained" color="primary">
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}