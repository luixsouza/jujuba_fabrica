"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slide } from "@mui/material";

// Material-UI imports
import Box from "@mui/material/Box";
import Head from "next/head";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";

// Material-UI icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";

// Import API functions
import {
  getLoteById,
  editLote,
  getAllLotes,
  getFornecedoras,
  ESTADOS_CONSERVACAO,
  GENEROS,
} from "../api/lotes";

// Import Sidebar component
import Sidebar from "../../components/sidebar";

export default function EditarLotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loteId = searchParams.get("id") || "";
  // State management
  const [editingItemId, setEditingItemId] = useState(null);
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [openFinishDialog, setOpenFinishDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [hasChanges, setHasChanges] = useState(false);
  const [originalItems, setOriginalItems] = useState([]);
  const [items, setItems] = useState([]);
  const [lotesSidebar, setLotesSidebar] = useState([]);
  const [fornecedoras, setFornecedoras] = useState([]);
  const [selectedFornecedora, setSelectedFornecedora] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);

  const handleCloseViewItem = () => setViewingItem(null);
  // State for edited item
  const [editedItem, setEditedItem] = useState({
    descricao: "",
    estadoConservacao: "BOM",
    preco: 0,
    quantidade: 1,
    marca: "",
    tamanho: "",
    genero: "UNISSEX",
  });

  // State for new item
  const [newItem, setNewItem] = useState({
    descricao: "",
    estadoConservacao: "BOM",
    preco: "",
    quantidade: 1,
    marca: "",
    tamanho: "",
    genero: "UNISSEX",
  });
  // Estado do modal de visualização
  const [openProductModal, setOpenProductModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Funções para abrir e fechar modal
  const handleOpenProductModal = (item) => {
    setProdutoSelecionado(item);
    setOpenProductModal(true);
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setProdutoSelecionado(null);
    setTabValue(0);
  };

  // Função para mudar abas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Função auxiliar para formatar preço
  const formatarPreco = (preco) => Number(preco).toFixed(2);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!loteId) {
        setError("ID do lote não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch lote data, fornecedoras, and sidebar lotes in parallel
        const [loteData, fornecedorasData, lotesData] = await Promise.all([
          getLoteById(loteId),
          getFornecedoras(),
          getAllLotes(),
        ]);

        // Set lote data
        if (loteData) {
          setSelectedFornecedora(loteData.fornecedora?.id?.toString() || "");

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
            }));

            setItems(formattedItems);
            setOriginalItems(JSON.parse(JSON.stringify(formattedItems)));
          }
        }

        // Set fornecedoras
        setFornecedoras(
          Array.isArray(fornecedorasData) ? fornecedorasData : []
        );

        // Set sidebar lotes
        const formattedLotes = Array.isArray(lotesData)
          ? lotesData
              .map((lote) => ({
                id: lote.id,
                codigo: `L${lote.id}`,
                data: lote.dataCriacao
                  ? new Date(lote.dataCriacao).toLocaleDateString("pt-BR")
                  : "Data não disponível",
              }))
              .slice(0, 5)
          : [];

        setLotesSidebar(formattedLotes);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(`Erro ao carregar dados: ${error.message}`);
        showSnackbar("Erro ao carregar dados do lote", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [loteId]);

  // Check for changes
  useEffect(() => {
    if (originalItems.length > 0) {
      const itemsChanged =
        JSON.stringify(items) !== JSON.stringify(originalItems);
      setHasChanges(itemsChanged);
    }
  }, [items, originalItems]);

  // Navigation handlers
  const handleGoBack = () => {
    if (hasChanges) {
      if (confirm("Você tem alterações não salvas. Deseja realmente sair?")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const handleGoHome = () => {
    if (hasChanges) {
      if (confirm("Você tem alterações não salvas. Deseja realmente sair?")) {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  // Item handlers
  const handleViewItem = (item) => {
    setViewingItem(item);
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setEditedItem({
      descricao: item.descricao,
      estadoConservacao: item.estadoConservacao,
      preco: item.preco,
      quantidade: item.quantidade,
      marca: item.marca,
      tamanho: item.tamanho,
      genero: item.genero,
    });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditedItem({
      descricao: "",
      estadoConservacao: "BOM",
      preco: 0,
      quantidade: 1,
      marca: "",
      tamanho: "",
      genero: "UNISSEX",
    });
  };

  const handleSaveEdit = () => {
    // Validate required fields
    if (!editedItem.descricao?.trim()) {
      showSnackbar("Descrição é obrigatória", "error");
      return;
    }

    if (!editedItem.preco || editedItem.preco <= 0) {
      showSnackbar("Preço deve ser maior que zero", "error");
      return;
    }

    if (!editedItem.quantidade || editedItem.quantidade <= 0) {
      showSnackbar("Quantidade deve ser maior que zero", "error");
      return;
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
          : item
      )
    );

    setEditingItemId(null);
    showSnackbar("Item atualizado com sucesso", "success");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setItems(items.filter((item) => item.id !== itemToDelete.id));
      setOpenDeleteDialog(false);
      setItemToDelete(null);
      showSnackbar("Item removido com sucesso", "success");
    }
  };

  // New item handlers
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenNewItemDialog = () => {
    setNewItem({
      descricao: "",
      estadoConservacao: "BOM",
      preco: "",
      quantidade: 1,
      marca: "",
      tamanho: "",
      genero: "UNISSEX",
    });
    setOpenNewItemDialog(true);
  };

  const handleCloseNewItemDialog = () => {
    setOpenNewItemDialog(false);
  };

  const handleAddNewItem = () => {
    // Validate required fields
    if (!newItem.descricao?.trim()) {
      showSnackbar("Descrição é obrigatória", "error");
      return;
    }

    if (!newItem.preco || Number(newItem.preco) <= 0) {
      showSnackbar("Preço deve ser maior que zero", "error");
      return;
    }

    if (!newItem.quantidade || Number(newItem.quantidade) <= 0) {
      showSnackbar("Quantidade deve ser maior que zero", "error");
      return;
    }

    // Generate temporary ID for new item
    const tempId = `TEMP_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newItemWithId = {
      id: tempId,
      descricao: newItem.descricao.trim(),
      preco: Number(newItem.preco),
      quantidade: Number(newItem.quantidade),
      marca: newItem.marca?.trim() || "",
      tamanho: newItem.tamanho?.trim() || "",
      estadoConservacao: newItem.estadoConservacao,
      genero: newItem.genero,
    };

    setItems([...items, newItemWithId]);
    setOpenNewItemDialog(false);
    showSnackbar("Novo item adicionado com sucesso", "success");
  };

  // Finish editing handlers
  const handleOpenFinishDialog = () => {
    if (!hasChanges) {
      showSnackbar("Nenhuma alteração foi feita no lote", "info");
      return;
    }

    if (!selectedFornecedora) {
      showSnackbar("Selecione uma fornecedora antes de finalizar", "error");
      return;
    }

    if (items.length === 0) {
      showSnackbar("Adicione pelo menos um produto ao lote", "error");
      return;
    }

    setOpenFinishDialog(true);
  };

  const handleCloseFinishDialog = () => {
    setOpenFinishDialog(false);
  };

  const handleFinishLote = async () => {
    try {
      setLoading(true);

      // Prepare data according to API format
      // Filtrar apenas produtos com estoque (quantidade > 0) e novos produtos para enviar
      const produtosParaEnviar = items.filter(item => {
        // Enviar apenas:
        // 1. Produtos novos (ID temporário)
        // 2. Produtos existentes com quantidade > 0 (com estoque)
        return item.id.toString().startsWith("TEMP_") || item.quantidade > 0;
      });

      const loteData = {
        fornecedora: {
          id: Number(selectedFornecedora),
        },
        produtos: produtosParaEnviar.map((item) => ({
          id: item.id.toString().startsWith("TEMP_") ? undefined : item.id,
          descricao: item.descricao,
          preco: Number(item.preco),
          quantidade: Number(item.quantidade),
          marca: item.marca || "",
          tamanho: item.tamanho || "",
          estadoConservacao: item.estadoConservacao,
          genero: item.genero,
        })),
      };

      console.log("Enviando dados para API:", loteData);

      // Call API to update lote
      const result = await editLote(loteId, loteData);

      console.log("Resposta da API:", result);

      setOpenFinishDialog(false);
      showSnackbar("Lote atualizado com sucesso!", "success");

      // Update original items to reflect saved state
      setOriginalItems(JSON.parse(JSON.stringify(items)));
      setHasChanges(false);

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/lotes/lotes_geral");
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar lote:", error);
      showSnackbar(`Erro ao atualizar lote: ${error.message}`, "error");
      setLoading(false);
    }
  };

  // Utility functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getEstadoConservacaoLabel = (value) => {
    const entry = Object.entries(ESTADOS_CONSERVACAO).find(
      ([key, val]) => val === value
    );
    return entry ? entry[0] : value;
  };

  const getGeneroLabel = (value) => {
    const entry = Object.entries(GENEROS).find(([key, val]) => val === value);
    return entry ? entry[0] : value;
  };

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
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Head>
        <title>Jujuba - Editar Lote</title>
      </Head>
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
            backgroundColor: "transparent",
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
          <Box
            sx={{
              bgcolor: "white",
              border: "2px solid #9AE4FF",
              borderRadius: "12px",
              padding: "16px 20px",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                color: "#666",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Fornecedor:
            </Typography>
            <Typography
              sx={{
                color: "#333",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {fornecedoras.find((f) => f.id.toString() === selectedFornecedora)?.nome || "Carregando..."}
            </Typography>
          </Box>
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
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ 
                      fontSize: "0.95rem",
                      maxWidth: "200px",
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      overflow: "hidden",
                    }}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {item.descricao}
                          {item.quantidade === 0 && (
                            <Chip 
                              label="VENDIDO" 
                              size="small" 
                              sx={{ 
                                bgcolor: '#ff5722', 
                                color: 'white', 
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }} 
                            />
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "0.95rem" }}
                    >
                      {editingItemId === item.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            name="estadoConservacao"
                            value={editedItem.estadoConservacao}
                            onChange={handleEditChange}
                          >
                            {Object.entries(ESTADOS_CONSERVACAO).map(
                              ([label, value]) => (
                                <MenuItem key={value} value={value}>
                                  {label}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        getEstadoConservacaoLabel(item.estadoConservacao)
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "0.95rem" }}
                    >
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
                            startAdornment: (
                              <InputAdornment position="start">
                                R$
                              </InputAdornment>
                            ),
                          }}
                        />
                      ) : (
                        `R$ ${Number(item.preco).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "0.95rem" }}
                    >
                      {editingItemId === item.id ? (
                        <TextField
                          fullWidth
                          name="quantidade"
                          type="number"
                          value={editedItem.quantidade}
                          onChange={handleEditChange}
                          variant="outlined"
                          size="small"
                          disabled={item.quantidade === 0}
                        />
                      ) : (
                        <Box sx={{ 
                          color: item.quantidade === 0 ? '#ff5722' : 'inherit',
                          fontWeight: item.quantidade === 0 ? 'bold' : 'normal',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          {item.quantidade}
                          {item.quantidade === 0 && (
                            <Chip 
                              label="VENDIDO" 
                              size="small" 
                              sx={{ 
                                bgcolor: '#ff5722', 
                                color: 'white', 
                                fontWeight: 'bold',
                                fontSize: '0.6rem'
                              }} 
                            />
                          )}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "0.95rem" }}
                    >
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
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "0.95rem" }}
                    >
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
                    <TableCell
                      sx={{ textAlign: "center", fontSize: "0.95rem" }}
                    >
                      {editingItemId === item.id ? (
                        <FormControl fullWidth size="small">
                          <Select
                            name="genero"
                            value={editedItem.genero}
                            onChange={handleEditChange}
                          >
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
                    <TableCell sx={{ 
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {editingItemId === item.id ? (
                          <>
                            <IconButton
                              size="small"
                              onClick={handleSaveEdit}
                              sx={{ color: "green" }}
                            >
                              <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleCancelEdit}
                              sx={{ color: "red" }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenProductModal(item)}
                              sx={{ color: "#00509E" }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEditItem(item)}
                              sx={{ color: "#00509E" }}
                              disabled={item.quantidade === 0}
                              title={item.quantidade === 0 ? "Produto vendido - não pode ser editado" : "Editar produto"}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteItem(item)}
                              sx={{ color: "#d32f2f" }}
                              disabled={item.quantidade === 0}
                              title={item.quantidade === 0 ? "Produto vendido - não pode ser removido" : "Remover produto"}
                            >
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 3,
            mb: 3,
          }}
        >
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
              bgcolor: hasChanges && !loading ? "#FADADD" : "#cccccc",
              color: "black",
              fontWeight: "bold",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: hasChanges && !loading ? "#FADADD" : "#cccccc",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </Box>
      </Box>
      <Dialog
        open={openProductModal}
        onClose={handleCloseProductModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "#F5F5F5",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
            overflow: "visible",
            maxHeight: "90vh",
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
          <IconButton
            onClick={handleCloseProductModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#666",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>

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
                width: 80,
                height: 80,
                backgroundColor: "#9AE4FF",
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <InventoryIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
            >
              {produtoSelecionado?.descricao || "Produto"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 4, pb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: "16px",
                color: "#333",
              },
              "& .MuiTab-root.Mui-selected": { color: "#9AE4FF" },
              "& .MuiTabs-indicator": { backgroundColor: "#9AE4FF" },
            }}
          >
            <Tab label="Informações Básicas" />
            <Tab label="Detalhes Adicionais" />
          </Tabs>

          {tabValue === 0 && produtoSelecionado && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                    >
                      Dados do Produto
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>ID:</strong> #{produtoSelecionado.id || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Descrição:</strong> {produtoSelecionado.descricao}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Estado:</strong>{" "}
                      <Chip
                        label={produtoSelecionado.estadoConservacao}
                        color="success"
                        size="small"
                      />
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                    >
                      Preço e Estoque
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 1,
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#4CAF50",
                      }}
                    >
                      <strong>Preço:</strong> R${" "}
                      {formatarPreco(produtoSelecionado.preco)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Quantidade:</strong>{" "}
                      {produtoSelecionado.quantidade} unidades
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Tamanho:</strong> {produtoSelecionado.tamanho}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 1 && produtoSelecionado && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, backgroundColor: "#FADADD" }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                    >
                      Características
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Marca:</strong> {produtoSelecionado.marca}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Gênero:</strong> {produtoSelecionado.genero}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, backgroundColor: "#FADADD" }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
                    >
                      Controle
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Data de Adição:</strong>{" "}
                      {produtoSelecionado.dataAdicao
                        ? new Date(
                            produtoSelecionado.dataAdicao
                          ).toLocaleDateString("pt-BR")
                        : "Não informada"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Status:</strong>{" "}
                      <Chip
                        label={produtoSelecionado.ativo ? "Ativo" : "Inativo"}
                        color={produtoSelecionado.ativo ? "success" : "error"}
                        size="small"
                      />
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}>
          <Button
            onClick={handleCloseProductModal}
            sx={{
              backgroundColor: "#FADADD",
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
              "&:hover": {
                backgroundColor: "#FFB6C1",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
              },
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Item Dialog - Padronizado Visualmente (Mantendo Campos Originais) */}
      <Dialog
        open={openNewItemDialog}
        onClose={handleCloseNewItemDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
            border: "2px solid #e0e0e0",
            overflow: "visible",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pb: 2,
            pt: 4,
            position: "relative",
            borderBottom: "2px solid #FADADD",
          }}
        >
          <IconButton
            onClick={handleCloseNewItemDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#666",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>

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
                width: 80,
                height: 80,
                backgroundColor: "#FADADD",
                boxShadow: "0px 8px 20px rgba(250, 218, 221, 0.3)",
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: "#333" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#333", textAlign: "center" }}
            >
              Adicionar Novo Produto
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 4, pb: 2 }}>
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
            <Grid container spacing={3}>
              {/* Descrição - Mantido como xs={12} */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição do item"
                  name="descricao"
                  value={newItem.descricao}
                  onChange={handleNewItemChange}
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

              {/* Preço - Mantido como xs={6} com InputAdornment */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valor (R$)"
                  name="preco"
                  type="number"
                  value={newItem.preco}
                  onChange={handleNewItemChange}
                  variant="outlined"
                  inputProps={{ step: 0.01, min: 0.01 }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
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

              {/* Quantidade - Mantido como xs={6} */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantidade"
                  name="quantidade"
                  type="number"
                  value={newItem.quantidade}
                  onChange={handleNewItemChange}
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

              {/* Estado de Conservação - Mantido como xs={6} */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado de Conservação</InputLabel>
                  <Select
                    name="estadoConservacao"
                    value={newItem.estadoConservacao}
                    onChange={handleNewItemChange}
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
                    {Object.entries(ESTADOS_CONSERVACAO).map(
                      ([label, value]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Gênero - Mantido como xs={6} */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Gênero</InputLabel>
                  <Select
                    name="genero"
                    value={newItem.genero}
                    onChange={handleNewItemChange}
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
                    {Object.entries(GENEROS).map(([label, value]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Marca - Mantido como xs={6} */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Marca"
                  name="marca"
                  value={newItem.marca}
                  onChange={handleNewItemChange}
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

              {/* Tamanho - Mantido como xs={6} */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tamanho"
                  name="tamanho"
                  value={newItem.tamanho}
                  onChange={handleNewItemChange}
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
            </Grid>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}>
          <Button
            onClick={handleCloseNewItemDialog}
            sx={{
              backgroundColor: "#FADADD",
              color: "#333",
              fontWeight: 600,
              fontSize: "1.1rem",
              borderRadius: 25,
              px: 6,
              py: 2,
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 15px rgba(250, 218, 221, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f8a8c8",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 20px rgba(250, 218, 221, 0.4)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleAddNewItem}
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
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Exclusão de Produto */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
            overflow: "visible",
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
          <IconButton
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#666",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

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
                width: 80,
                height: 80,
                backgroundColor: "#ff5722",
                boxShadow: "0px 8px 20px rgba(255, 87, 34, 0.3)",
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
            >
              Confirmar Exclusão
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            Tem certeza que deseja remover o produto "
            <strong>{itemToDelete?.descricao}</strong>" do lote?
            <br />
            <strong>Esta ação não pode ser desfeita.</strong>
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 4,
            pb: 4,
          }}
        >
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              backgroundColor: "#9AE4FF",
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
              "&:hover": {
                backgroundColor: "#7DD3FC",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={confirmDeleteItem}
            sx={{
              backgroundColor: "#ff5722",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(255, 87, 34, 0.4)",
              "&:hover": {
                backgroundColor: "#e64a19",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(255, 87, 34, 0.6)",
              },
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Finish Dialog */}
      <Dialog
        open={openFinishDialog}
        onClose={handleCloseFinishDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.3)",
            overflow: "visible",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            pb: 2,
            pt: 4,
            position: "relative",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Salvar Alterações do Lote
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
          <DialogContentText
            sx={{
              color: "#555",
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "400px",
              mx: "auto",
            }}
          >
            Você tem certeza que deseja salvar as alterações feitas no lote?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 4,
            pb: 4,
          }}
        >
          <Button
            onClick={handleCloseFinishDialog}
            sx={{
              backgroundColor: "#9AE4FF",
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
              "&:hover": {
                backgroundColor: "#7DD3FC",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleFinishLote}
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "120px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.4)",
              "&:hover": {
                backgroundColor: "#388E3C",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(76, 175, 80, 0.6)",
              },
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
