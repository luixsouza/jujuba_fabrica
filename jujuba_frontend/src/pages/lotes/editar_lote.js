"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Tooltip from "@mui/material/Tooltip"
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
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import AddIcon from "@mui/icons-material/Add"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"

// Import Lucide icons
import { Users, ShoppingBag, ShoppingCart, ListIcon } from "lucide-react"

// Import API functions
import { buscarLotePorId, atualizarLote, listarLotes } from "../api/lotes"

export default function EditandoLotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loteId = searchParams.get("id") || ""

  const [activeItem, setActiveItem] = useState("lotes")
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
        const response = await buscarLotePorId(loteId)

        if (response.data) {
          const loteData = response.data
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
      const response = await listarLotes()
      if (response.data) {
        // Format lotes for sidebar display
        const formattedLotes = response.data
          .map((lote) => ({
            id: lote.id,
            codigo: `L${lote.id}`,
            data: new Date(lote.dataCriacao).toLocaleDateString("pt-BR"),
          }))
          .slice(0, 5) // Limit to 5 lotes for sidebar

        setLotesSidebar(formattedLotes)
      }
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

  const handleNavigation = (path, menuItem) => {
    setActiveItem(menuItem)
    router.push(path)
  }

  const getMenuItemStyle = (itemName) => ({
    borderRadius: "8px",
    mb: 1,
    backgroundColor: activeItem === itemName ? "rgba(255, 255, 255, 0.3)" : "transparent",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
  })

  const iconStyle = {
    size: 20,
    strokeWidth: 2,
  }

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

      // Call API to update lote
      await atualizarLote(loteId, fornecedoraId, items)

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
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "276px",
          bgcolor: "#f8c0e0",
          display: "flex",
          flexDirection: "column",
          p: 2.5,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", my: 2.5 }}>
          <Box
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              src="/jujba2.png"
              alt="Jujuba Logo"
              width={140}
              height={140}
              priority
              style={{ borderRadius: "50%" }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 3,
            p: 1.5,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            mb: 3,
          }}
        >
          <List sx={{ width: "100%", padding: "0 8px" }}>
            <Tooltip title="Gerenciar Fornecedores" placement="right" arrow>
              <ListItem
                button
                sx={getMenuItemStyle("fornecedores")}
                onClick={() => handleNavigation("/fornecedores/fornecedores_tabela", "fornecedores")}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <Users {...iconStyle} color="black" />
                </ListItemIcon>
                <ListItemText
                  primary="Fornecedores"
                  sx={{
                    color: "black",
                    "& .MuiListItemText-primary": {
                      fontWeight: activeItem === "fornecedores" ? 600 : 400,
                      fontSize: "1rem",
                    },
                  }}
                />
                {activeItem === "fornecedores" && <ChevronRightIcon size={16} color="black" />}
              </ListItem>
            </Tooltip>

            <Tooltip title="Gerenciar Estoque" placement="right" arrow>
              <ListItem
                button
                sx={getMenuItemStyle("estoque")}
                onClick={() => handleNavigation("/estoque/estoque_tabela", "estoque")}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <ShoppingBag {...iconStyle} color="black" />
                </ListItemIcon>
                <ListItemText
                  primary="Estoque"
                  sx={{
                    color: "black",
                    "& .MuiListItemText-primary": {
                      fontWeight: activeItem === "estoque" ? 600 : 400,
                      fontSize: "1rem",
                    },
                  }}
                />
                {activeItem === "estoque" && <ChevronRightIcon size={16} color="black" />}
              </ListItem>
            </Tooltip>

            <Tooltip title="Gerenciar Vendas" placement="right" arrow>
              <ListItem button sx={getMenuItemStyle("vendas")} onClick={() => handleNavigation("/Caixa", "vendas")}>
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <ShoppingCart {...iconStyle} color="black" />
                </ListItemIcon>
                <ListItemText
                  primary="Vendas"
                  sx={{
                    color: "black",
                    "& .MuiListItemText-primary": {
                      fontWeight: activeItem === "vendas" ? 600 : 400,
                      fontSize: "1rem",
                    },
                  }}
                />
                {activeItem === "vendas" && <ChevronRightIcon size={16} color="black" />}
              </ListItem>
            </Tooltip>

            <Tooltip title="Gerenciar Lotes" placement="right" arrow>
              <ListItem
                button
                sx={getMenuItemStyle("lotes")}
                onClick={() => handleNavigation("/lotes/lotes_geral", "lotes")}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <ListIcon {...iconStyle} color="black" />
                </ListItemIcon>
                <ListItemText
                  primary="Lotes"
                  sx={{
                    color: "black",
                    "& .MuiListItemText-primary": {
                      fontWeight: activeItem === "lotes" ? 600 : 400,
                      fontSize: "1rem",
                    },
                  }}
                />
                {activeItem === "lotes" && <ChevronRightIcon size={16} color="black" />}
              </ListItem>
            </Tooltip>
          </List>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography sx={{ color: "text.secondary", mb: 1.5, fontWeight: "bold", fontSize: "1rem" }}>
            Lista de Lotes
          </Typography>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: 3,
              p: 1.5,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            {lotesSidebar.length > 0 ? (
              lotesSidebar.map((lote) => (
                <Box
                  key={lote.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    bgcolor: "#ffd0e8",
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    "&:hover": {
                      transform: "scale(1.02)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleNavigation(`/lotes/visualizar_lote?id=${lote.id}`, "lotes")}
                >
                  <Typography sx={{ fontSize: "0.95rem" }}>{lote.codigo}</Typography>
                  <Typography sx={{ fontSize: "0.95rem" }}>{lote.data}</Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ textAlign: "center", p: 1, color: "text.secondary" }}>
                Nenhum lote encontrado
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          ml: "276px",
          flex: 1,
          bgcolor: "#a3e0f5",
          display: "flex",
          flexDirection: "column",
          maxWidth: "calc(100% - 276px)",
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
                        `R$ ${item.preco.toFixed(2).replace(".", ",")}`
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
                          disabled
                        />
                      ) : (
                        item.id
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {editingItemId === item.id ? (
                        <FormControl fullWidth size="small">
                          <Select name="genero" value={editedItem.genero} onChange={handleEditChange}>
                            <MenuItem value="Masc">Masc</MenuItem>
                            <MenuItem value="Fem">Fem</MenuItem>
                            <MenuItem value="Unisex">Unisex</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        item.genero
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", fontSize: "0.95rem" }}>
                      {item.fornecedorPercentage}%
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        {editingItemId === item.id ? (
                          <>
                            <IconButton size="small" color="primary" onClick={handleSaveEdit}>
                              <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={handleCancelEdit}>
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              sx={{ color: "text.secondary" }}
                              onClick={() => handleViewItem(item.id)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: "text.secondary" }}
                              onClick={() => handleEditItem(item)}
                            >
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
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 3 }}>
                    {loading ? "Carregando itens..." : "Nenhum item encontrado neste lote"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Fornecedor Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleOpenFornecedorDialog}
            sx={{
              bgcolor: "white",
              color: "black",
              px: 3,
              py: 1,
              borderRadius: 1,
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: 1,
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            % FORNECEDOR
          </Button>
        </Box>

        {/* Bottom Buttons */}
        <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between", p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewItemDialog}
            disabled={loading}
            sx={{
              bgcolor: "#ffd0e8",
              color: "black",
              px: 3,
              py: 1.5,
              borderRadius: 28,
              fontWeight: "bold",
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "#ffb0d8",
              },
              "&.Mui-disabled": {
                bgcolor: "#f5f5f5",
                color: "#999",
              },
            }}
          >
            Novo Item
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenFinishDialog}
            disabled={loading || !hasChanges}
            sx={{
              bgcolor: "#ffd0e8",
              color: "black",
              px: 3,
              py: 1.5,
              borderRadius: 28,
              fontWeight: "bold",
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "#ffb0d8",
              },
              "&.Mui-disabled": {
                bgcolor: "#f5f5f5",
                color: "#999",
              },
            }}
          >
            Finalizar Edição
          </Button>
        </Box>
      </Box>

      {/* Fornecedor Percentage Dialog */}
      <Dialog open={openFornecedorDialog} onClose={handleCloseFornecedorDialog}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Porcentagem do Fornecedor</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Porcentagem"
              type="number"
              value={fornecedorPercentage}
              onChange={(e) => setFornecedorPercentage(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
              Esta porcentagem será aplicada a todos os itens do lote.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFornecedorDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSaveFornecedorPercentage} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Item Dialog */}
      <Dialog open={openNewItemDialog} onClose={handleCloseNewItemDialog} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.4rem",
            bgcolor: "#ffd0e8",
            color: "black",
            py: 2,
          }}
        >
          Adicionar Novo Item
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 200,
                  border: "1px dashed #ccc",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 40, color: "#999", mb: 1 }} />
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Clique para adicionar uma imagem
                </Typography>
                <Typography variant="caption" sx={{ color: "#999" }}>
                  ou arraste e solte aqui
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Código do Produto"
                name="id"
                value={newItem.id}
                onChange={handleNewItemChange}
                variant="outlined"
                margin="normal"
                disabled
              />

              <FormControl fullWidth margin="normal">
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

              <FormControl fullWidth margin="normal">
                <InputLabel>Gênero</InputLabel>
                <Select name="genero" value={newItem.genero} onChange={handleNewItemChange} label="Gênero">
                  <MenuItem value="Masc">Masculino</MenuItem>
                  <MenuItem value="Fem">Feminino</MenuItem>
                  <MenuItem value="Unisex">Unisex</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descrição do Item"
                name="descricao"
                value={newItem.descricao}
                onChange={handleNewItemChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                required
                error={!newItem.descricao && newItem.descricao !== undefined}
                helperText={!newItem.descricao && newItem.descricao !== undefined ? "Descrição é obrigatória" : ""}
              />

              <TextField
                fullWidth
                label="Valor (R$)"
                name="preco"
                type="number"
                value={newItem.preco}
                onChange={handleNewItemChange}
                variant="outlined"
                margin="normal"
                required
                error={!newItem.preco && newItem.preco !== undefined}
                helperText={!newItem.preco && newItem.preco !== undefined ? "Valor é obrigatório" : ""}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />

              <TextField
                fullWidth
                label="Quantidade"
                name="quantidade"
                type="number"
                value={newItem.quantidade}
                onChange={handleNewItemChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />

              <TextField
                fullWidth
                label="Marca"
                name="marca"
                value={newItem.marca}
                onChange={handleNewItemChange}
                variant="outlined"
                margin="normal"
              />

              <TextField
                fullWidth
                label="Tamanho"
                name="tamanho"
                value={newItem.tamanho}
                onChange={handleNewItemChange}
                variant="outlined"
                margin="normal"
              />

              <TextField
                fullWidth
                label="Porcentagem do Fornecedor"
                name="fornecedorPercentage"
                type="number"
                value={newItem.fornecedorPercentage}
                onChange={handleNewItemChange}
                variant="outlined"
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseNewItemDialog} color="inherit" variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={handleAddNewItem}
            color="primary"
            variant="contained"
            sx={{
              bgcolor: "#ffd0e8",
              color: "black",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#ffb0d8",
              },
            }}
          >
            Adicionar Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Finish Editing Dialog */}
      <Dialog open={openFinishDialog} onClose={handleCloseFinishDialog}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>Finalizar Edição do Lote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você realizou alterações neste lote. Deseja finalizar a edição e salvar as alterações?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFinishDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleFinishLote} color="primary" variant="contained" disabled={loading}>
            {loading ? "Processando..." : "Finalizar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
