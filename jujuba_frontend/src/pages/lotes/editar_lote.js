"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Correct MUI imports
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

// Correct MUI icons imports
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import HomeIcon from "@mui/icons-material/Home"
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import AddIcon from "@mui/icons-material/Add"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"

// Import API functions - CORRIGIDO para usar as funções corretas do lotes.js
import { getLoteById, editLote, getAllLotes } from "../api/lotes"

// Import Sidebar component
import Sidebar from "../../components/sidebar"

export default function EditandoLotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loteId = searchParams.get("id") || ""

  const [editingItemId, setEditingItemId] = useState(null)
  const [fornecedorPercentage, setFornecedorPercentage] = useState("30")
  const [openFornecedorDialog, setOpenFornecedorDialog] = useState(false)
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false)
  const [openFinishDialog, setOpenFinishDialog] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [hasChanges, setHasChanges] = useState(false)
  const [originalItems, setOriginalItems] = useState([])
  const [items, setItems] = useState([])
  const [lotesSidebar, setLotesSidebar] = useState([])
  const [fornecedoraId, setFornecedoraId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for edited item
  const [editedItem, setEditedItem] = useState({
    descricao: "",
    estadoConservacao: "",
    preco: 0,
    id: "",
    genero: "",
    fornecedorPercentage: "",
  })

  // State for new item
  const [newItem, setNewItem] = useState({
    descricao: "",
    estadoConservacao: "Ótimo",
    preco: "",
    id: "",
    genero: "Unisex",
    fornecedorPercentage: fornecedorPercentage,
    quantidade: 1,
    marca: "",
    tamanho: "",
  })

  // Fetch lote data when component mounts
  useEffect(() => {
    const fetchLoteData = async () => {
      if (!loteId) return

      try {
        setLoading(true)
        // CORRIGIDO: getLoteById retorna diretamente o objeto do lote
        const loteData = await getLoteById(loteId)

        if (loteData) {
          setFornecedoraId(loteData.fornecedora?.id || "")

          // Set fornecedor percentage if available
          if (loteData.fornecedora?.percentual) {
            setFornecedorPercentage(loteData.fornecedora.percentual.toString())
          }

          // Format items data
          if (loteData.produtos && Array.isArray(loteData.produtos)) {
            const formattedItems = loteData.produtos.map((produto) => ({
              ...produto,
              fornecedorPercentage: loteData.fornecedora?.percentual?.toString() || fornecedorPercentage,
            }))

            setItems(formattedItems)
            // Store original items to track changes
            setOriginalItems(JSON.parse(JSON.stringify(formattedItems)))
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do lote:", error)
        setError("Não foi possível carregar os dados do lote.")
        showSnackbar("Erro ao carregar dados do lote", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchLoteData()
    fetchLotesSidebar()
  }, [loteId])

  // Fetch lotes for sidebar
  const fetchLotesSidebar = async () => {
    try {
      // CORRIGIDO: getAllLotes retorna diretamente o array
      const lotes = await getAllLotes()
      
      // Format lotes for sidebar display
      const formattedLotes = lotes
        .map((lote) => ({
          id: lote.id,
          codigo: `L${lote.id}`,
          data: new Date(lote.dataCriacao).toLocaleDateString("pt-BR"),
        }))
        .slice(0, 5) // Limit to 5 lotes for sidebar

      setLotesSidebar(formattedLotes)
    } catch (error) {
      console.error("Erro ao buscar lotes para barra lateral:", error)
    }
  }

  // Check for changes
  useEffect(() => {
    if (originalItems.length > 0) {
      const itemsChanged = JSON.stringify(items) !== JSON.stringify(originalItems)
      setHasChanges(itemsChanged)
    }
  }, [items, originalItems])

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const handleViewItem = (itemId) => {
    router.push(`/estoque/visualizar_produto?id=${itemId}`)
  }

  const handleEditItem = (item) => {
    setEditingItemId(item.id)
    setEditedItem({
      descricao: item.descricao,
      estadoConservacao: item.estadoConservacao,
      preco: item.preco,
      id: item.id,
      genero: item.genero,
      fornecedorPercentage: item.fornecedorPercentage || fornecedorPercentage,
      marca: item.marca || "",
      tamanho: item.tamanho || "",
      quantidade: item.quantidade || 1,
    })
  }

  const handleCancelEdit = () => {
    setEditingItemId(null)
  }

  const handleSaveEdit = () => {
    // Validate required fields
    if (!editedItem.descricao || !editedItem.preco) {
      showSnackbar("Descrição e valor são campos obrigatórios", "error")
      return
    }

    setItems(items.map((item) => (item.id === editingItemId ? { ...item, ...editedItem } : item)))
    setEditingItemId(null)
    showSnackbar("Item atualizado com sucesso", "success")
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditedItem((prev) => ({
      ...prev,
      [name]: name === "preco" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleNewItemChange = (e) => {
    const { name, value } = e.target
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "preco" ? value : value,
    }))
  }

  const handleOpenFornecedorDialog = () => {
    setOpenFornecedorDialog(true)
  }

  const handleCloseFornecedorDialog = () => {
    setOpenFornecedorDialog(false)
  }

  const handleSaveFornecedorPercentage = () => {
    // Update all items with the new percentage
    setItems(
      items.map((item) => ({
        ...item,
        fornecedorPercentage,
      })),
    )
    setOpenFornecedorDialog(false)
    showSnackbar("Porcentagem do fornecedor atualizada para todos os itens", "success")
  }

  const handleOpenNewItemDialog = () => {
    // Generate a random code for the new item
    const randomId = `PROD${Math.floor(Math.random() * 900000) + 100000}`
    setNewItem({
      ...newItem,
      id: randomId,
      fornecedorPercentage: fornecedorPercentage,
    })
    setOpenNewItemDialog(true)
  }

  const handleCloseNewItemDialog = () => {
    setOpenNewItemDialog(false)
  }

  const handleAddNewItem = () => {
    // Validate required fields
    if (!newItem.descricao || !newItem.preco) {
      showSnackbar("Descrição e valor são campos obrigatórios", "error")
      return
    }

    const newItemWithId = {
      ...newItem,
      preco: Number.parseFloat(newItem.preco) || 0,
    }

    setItems([...items, newItemWithId])
    setOpenNewItemDialog(false)

    // Reset new item form
    setNewItem({
      descricao: "",
      estadoConservacao: "Ótimo",
      preco: "",
      id: "",
      genero: "Unisex",
      fornecedorPercentage: fornecedorPercentage,
      quantidade: 1,
      marca: "",
      tamanho: "",
    })

    showSnackbar("Novo item adicionado com sucesso", "success")
  }

  const handleOpenFinishDialog = () => {
    if (hasChanges) {
      setOpenFinishDialog(true)
    } else {
      showSnackbar("Nenhuma alteração foi feita no lote", "info")
    }
  }

  const handleCloseFinishDialog = () => {
    setOpenFinishDialog(false)
  }

  const handleFinishLote = async () => {
    try {
      setLoading(true)

      // CORRIGIDO: Preparar dados no formato esperado pela função editLote
      const loteData = {
        fornecedora: {
          id: fornecedoraId,
        },
        produtos: items.map((item) => ({
          id: item.id,
          descricao: item.descricao,
          preco: Number.parseFloat(item.preco),
          quantidade: Number.parseInt(item.quantidade) || 1,
          marca: item.marca || "",
          tamanho: item.tamanho || "",
          estadoConservacao: item.estadoConservacao || "BOM",
          genero: item.genero || "UNISSEX",
        })),
      }

      // Call API to update lote
      await editLote(loteId, loteData)

      setOpenFinishDialog(false)
      showSnackbar("Lote atualizado com sucesso!", "success")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/lotes/lotes_geral")
      }, 1500)
    } catch (error) {
      console.error("Erro ao atualizar lote:", error)
      showSnackbar("Erro ao atualizar lote. Por favor, tente novamente.", "error")
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  if (loading && !items.length) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#a3e0f5" }}
      >
        <CircularProgress />
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
          px: 4, // Add horizontal padding
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <IconButton sx={{ color: "black" }} onClick={handleGoBack}>
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "2rem" }}>
              Editando
            </Typography>
            <Box sx={{ bgcolor: "white", borderRadius: 1, px: 2, py: 0.8, display: "inline-block" }}>
              <Typography sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>Lote: {loteId}</Typography>
            </Box>
          </Box>
          <IconButton sx={{ color: "black" }} onClick={handleGoHome}>
            <HomeIcon fontSize="medium" />
          </IconButton>
        </Box>

        {error && (
          <Box sx={{ mx: "auto", mt: 2, width: "95%", maxWidth: "1200px" }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            mx: "auto",
            mt: 2,
            borderRadius: 3,
            overflow: "hidden",
            width: "95%", // Reduce width to 95% of the container
            maxWidth: "1200px", // Add a max-width
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  Imagem
                </TableCell>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  Descrição
                </TableCell>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  Estado de conservação
                </TableCell>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  Valor
                </TableCell>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  Código do Produto
                </TableCell>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  Gênero
                </TableCell>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  % Fornecedor
                </TableCell>
                <TableCell sx={{ bgcolor: "#ffd0e8", textAlign: "center", fontSize: "1rem", fontWeight: "bold" }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                  <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Box sx={{ width: "40px", height: "40px", bgcolor: "grey.200", borderRadius: 1 }}></Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.95rem", whiteSpace: "pre-line" }}>
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
                            <MenuItem value="Ótimo">Ótimo</MenuItem>
                            <MenuItem value="Bom">Bom</MenuItem>
                            <MenuItem value="Regular">Regular</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        item.estadoConservacao
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
                        `R$ ${item.preco?.toFixed(2) || "0,00"}`
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <TextField
                          fullWidth
                          name="id"
                          value={editedItem.id}
                          onChange={handleEditChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        item.id
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <FormControl fullWidth size="small">
                          <Select name="genero" value={editedItem.genero} onChange={handleEditChange}>
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Feminino">Feminino</MenuItem>
                            <MenuItem value="Unisex">Unisex</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        item.genero
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {item.fornecedorPercentage || fornecedorPercentage}%
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
                            <IconButton size="small" onClick={() => handleViewItem(item.id)} sx={{ color: "blue" }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleEditItem(item)} sx={{ color: "orange" }}>
                              <EditIcon fontSize="small" />
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
              bgcolor: "#ffd0e8",
              color: "black",
              fontWeight: "bold",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: "#ffb3d9",
              },
            }}
          >
            Adicionar Item
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenFornecedorDialog}
            sx={{
              bgcolor: "#ffd0e8",
              color: "black",
              fontWeight: "bold",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: "#ffb3d9",
              },
            }}
          >
            Editar % Fornecedor
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenFinishDialog}
            disabled={!hasChanges}
            sx={{
              bgcolor: hasChanges ? "#4caf50" : "#cccccc",
              color: "white",
              fontWeight: "bold",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: hasChanges ? "#45a049" : "#cccccc",
              },
            }}
          >
            Finalizar Edição
          </Button>
        </Box>
      </Box>

      {/* Dialogs */}
      {/* Fornecedor Percentage Dialog */}
      <Dialog open={openFornecedorDialog} onClose={handleCloseFornecedorDialog}>
        <DialogTitle>Editar Porcentagem do Fornecedor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Defina a porcentagem que será aplicada a todos os itens do lote para o fornecedor.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Porcentagem (%)"
            type="number"
            fullWidth
            variant="outlined"
            value={fornecedorPercentage}
            onChange={(e) => setFornecedorPercentage(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFornecedorDialog}>Cancelar</Button>
          <Button onClick={handleSaveFornecedorPercentage} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Item Dialog */}
      <Dialog open={openNewItemDialog} onClose={handleCloseNewItemDialog} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar Novo Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
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
                label="Preço"
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
                label="Código do Produto"
                name="id"
                value={newItem.id}
                onChange={handleNewItemChange}
                variant="outlined"
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
                  <MenuItem value="Ótimo">Ótimo</MenuItem>
                  <MenuItem value="Bom">Bom</MenuItem>
                  <MenuItem value="Regular">Regular</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Gênero</InputLabel>
                <Select name="genero" value={newItem.genero} onChange={handleNewItemChange} label="Gênero">
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Unisex">Unisex</MenuItem>
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Quantidade"
                name="quantidade"
                type="number"
                value={newItem.quantidade}
                onChange={handleNewItemChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="% Fornecedor"
                value={newItem.fornecedorPercentage}
                variant="outlined"
                disabled
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
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

      {/* Finish Dialog */}
      <Dialog open={openFinishDialog} onClose={handleCloseFinishDialog}>
        <DialogTitle>Finalizar Edição do Lote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja finalizar a edição do lote? Todas as alterações serão salvas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFinishDialog}>Cancelar</Button>
          <Button onClick={handleFinishLote} variant="contained" color="primary">
            Finalizar
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