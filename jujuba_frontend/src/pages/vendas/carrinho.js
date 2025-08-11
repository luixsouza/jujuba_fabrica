"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid,
  Divider,
  Chip,
  DialogContentText,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarMonthIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import Sidebar from "../../components/sidebar"
import {
  removerDoCarrinho,
  listarCarrinho,
} from "../api/carrinho";
import { finalizarVendaSimples } from "../api/vendas"

// Função de formatação segura
const formatarPreco = (valor) => {
  const numero = Number(valor);
  if (isNaN(numero)) {
    return "0,00";
  }
  return numero.toFixed(2).replace(".", ",");
};

export default function CarrinhoPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [totalValue, setTotalValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchOptions, setSearchOptions] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true)
        setError(null);
        const response = await listarCarrinho()
        if (response.sucesso && response.carrinho) {
          setCartItems(response.carrinho.itens || []);
          setTotalValue(Number(response.carrinho.valorTotal) || 0);

          // CORREÇÃO: Acessar a descrição diretamente do item
          const options = (response.carrinho.itens || []).map((item) => item.descricao);
          setSearchOptions([...new Set(options)]);

        } else {
          console.error("Erro ao carregar itens do carrinho:", response.mensagem)
          setError("Não foi possível carregar os itens do carrinho: " + response.mensagem)
          setCartItems([]);
          setTotalValue(0);
        }
      } catch (error) {
        console.error("Erro ao carregar itens do carrinho:", error)
        setError("Não foi possível carregar os itens do carrinho. Verifique a conexão com o servidor.")
        setCartItems([]);
        setTotalValue(0);
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const handleOpenSellModal = () => setOpenSellModal(true);
  const handleCloseSellModal = () => setOpenSellModal(false);
  const handleVenderParaFornecedor = () => router.push("/vendas/vender_fornecedor");

  const handleConfirmDeleteItem = (id) => {
    // CORREÇÃO: Acessar o ID diretamente do item
    const item = cartItems.find((item) => item.id === id);
    setItemToDelete(item);
    setOpenDeleteConfirmation(true);
  }

  const handleDeleteItem = async () => {
    if (itemToDelete) {
      try {
        setLoading(true);
        setError(null);
        // CORREÇÃO: Enviar o ID diretamente do item a ser deletado
        const result = await removerDoCarrinho(itemToDelete.id);

        if (result.sucesso && result.carrinho) {
          setCartItems(result.carrinho.itens || []);
          setTotalValue(Number(result.carrinho.valorTotal) || 0);
          setSnackbar({
            open: true,
            message: `"${itemToDelete.descricao}" removido do carrinho!`,
            severity: "success",
          });
        } else {
          console.error("Erro ao remover item do carrinho:", result.mensagem);
          setSnackbar({ open: true, message: `Erro ao remover item: ${result.mensagem}`, severity: "error" });
        }

        if (selectedItem && selectedItem.id === itemToDelete.id) {
          setOpenViewModal(false);
        }
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        setSnackbar({ open: true, message: "Erro ao remover item. Verifique a conexão.", severity: "error" });
      } finally {
        setLoading(false);
      }
    }
    setOpenDeleteConfirmation(false);
    setItemToDelete(null);
  }

  const handleCancelDelete = () => {
    setOpenDeleteConfirmation(false);
    setItemToDelete(null);
  }

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
  }

  const handleCloseViewModal = () => setOpenViewModal(false);

  const handleFinalizarVenda = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await finalizarVendaSimples();
      if (result.sucesso) {
        setCartItems([]);
        setTotalValue(0);
        setOpenSellModal(false);
        setSnackbar({ open: true, message: "Venda finalizada com sucesso!", severity: "success" });
        router.push("/vendas/vendas");
      } else {
        console.error("Erro ao finalizar venda:", result.mensagem);
        setSnackbar({ open: true, message: `Erro ao finalizar venda: ${result.mensagem}`, severity: "error" });
      }
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      setSnackbar({ open: true, message: "Erro ao finalizar venda. Verifique a conexão.", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (event, newValue) => setSearch(newValue || "");
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // CORREÇÃO: Filtrar usando item.descricao diretamente
  const filteredCartItems = (cartItems || []).filter(item =>
    item?.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, marginLeft: { xs: 0, sm: "290px" }, maxHeight: "1000px", overflow: "auto", backgroundColor: "#9AE4FF", paddingTop: "3rem", paddingX: { xs: "1rem", sm: "2rem" } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "80px" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: "50px", color: "#000000" }}>Carrinho</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px", width: "100%" }}>
          <Autocomplete
            freeSolo
            options={searchOptions}
            value={search}
            onChange={handleSearch}
            onInputChange={(event, newValue) => setSearch(newValue || "")}
            renderInput={(params) => (
              <TextField {...params} placeholder="Pesquisar produto no carrinho" variant="outlined" size="medium"
                InputProps={{ ...params.InputProps, startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#000000" }} /></InputAdornment>), sx: { height: "60px" } }}
                sx={{ width: "100%", maxWidth: "1800px", backgroundColor: "#F5F5F5", my: "50px", borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            )}
            sx={{ width: "100%", maxWidth: "1800px" }}
          />
        </Box>
        <Card sx={{ padding: "20px", boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", borderRadius: "25px", backgroundColor: "#F5F5F5", border: "2px solid #B0B0B0" }}>
          <CardContent sx={{ p: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#333", fontSize: "2rem" }}>Itens no carrinho</Typography>
            {loading && <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}><CircularProgress sx={{ color: "#ffccd5" }} /></Box>}
            {error && <Box sx={{ bgcolor: "#ffebee", p: 2, borderRadius: 2, mb: 3 }}><Typography color="error">{error}</Typography></Box>}
            {!loading && !error && (
              <Table sx={{ mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontSize: "18px", backgroundColor: "#FADADD", borderRight: "2px solid #F5F5F5" }}>Descrição</TableCell>
                    <TableCell align="center" sx={{ fontSize: "18px", backgroundColor: "#FADADD", borderRight: "2px solid #F5F5F5" }}>Estado de conservação</TableCell>
                    <TableCell align="center" sx={{ fontSize: "18px", backgroundColor: "#FADADD", borderRight: "2px solid #F5F5F5" }}>Valor</TableCell>
                    <TableCell align="center" sx={{ fontSize: "18px", backgroundColor: "#FADADD", borderRight: "2px solid #F5F5F5" }}>Lote</TableCell>
                    <TableCell align="center" sx={{ fontSize: "18px", backgroundColor: "#FADADD" }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCartItems.length > 0 ? (
                    filteredCartItems.map((item) => (
                      // CORREÇÃO: Usar item.id e acessar propriedades diretamente
                      <TableRow key={item.id}>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell align="center">{item.estadoConservacao}</TableCell>
                        <TableCell align="center">R$ {formatarPreco(item.preco)}</TableCell>
                        <TableCell align="center">{item.lote || "-"}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleViewItem(item)}><VisibilityIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleConfirmDeleteItem(item.id)}><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>Nenhum item no carrinho</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            {!loading && !error && (
              <Box sx={{ display: "inline-block", bgcolor: "#b3e5fc", px: 2, py: 0.5, borderRadius: 1, mb: 3 }}>
                <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#333" }}>Valor Total: R$ {formatarPreco(totalValue)}</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button variant="contained" onClick={handleVenderParaFornecedor} sx={{ bgcolor: "#ffc1cc", color: "black", "&:hover": { bgcolor: "#ffb6c1" }, borderRadius: 10, px: 4, py: 1.5, fontSize: "1rem" }}>Vender para fornecedor</Button>
              <Button variant="contained" onClick={handleOpenSellModal} disabled={cartItems.length === 0 || loading} sx={{ bgcolor: "#ffc1cc", color: "black", "&:hover": { bgcolor: "#ffb6c1" }, borderRadius: 10, px: 5, py: 1.5, fontSize: "1rem", "&.Mui-disabled": { bgcolor: "#f5f5f5", color: "#999" } }}>Vender</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Modals (com as mesmas correções) */}
      <Dialog open={openSellModal} onClose={handleCloseSellModal} PaperProps={{ sx: { borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", bgcolor: "white", maxWidth: "350px", width: "100%", m: 0, p: 0 } }}>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton edge="start" color="inherit" onClick={handleCloseSellModal} aria-label="close" sx={{ p: 0.5, mr: 1 }}><ArrowBackIcon /></IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.2rem", color: "#333", flex: 1, textAlign: "center", mr: 4 }}>Vender</Typography>
          </Box>
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: "#ffc1cc", color: "#333", fontWeight: 500, fontSize: "0.9rem", p: 1.5, textAlign: "center", border: "1px solid #e0e0e0" }}>Forma de pagamento</TableCell>
                <TableCell sx={{ bgcolor: "#ffc1cc", color: "#333", fontWeight: 500, fontSize: "0.9rem", p: 1.5, textAlign: "center", border: "1px solid #e0e0e0" }}>Total da compra</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ bgcolor: "#f5f5f5", color: "#333", fontSize: "0.9rem", p: 1.5, textAlign: "center", border: "1px solid #e0e0e0" }}>Pix</TableCell>
                <TableCell sx={{ bgcolor: "#f5f5f5", color: "#333", fontSize: "0.9rem", p: 1.5, textAlign: "center", border: "1px solid #e0e0e0" }}>R$ {formatarPreco(totalValue)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="contained" onClick={handleFinalizarVenda} sx={{ bgcolor: "#ffc1cc", color: "black", "&:hover": { bgcolor: "#ffb6c1" }, borderRadius: 10, px: 4, py: 1, textTransform: "none", fontWeight: 600, boxShadow: "none", fontSize: "1rem", width: "45%" }}>Sim</Button>
            <Button variant="contained" onClick={handleCloseSellModal} sx={{ bgcolor: "#ffc1cc", color: "black", "&:hover": { bgcolor: "#ffb6c1" }, borderRadius: 10, px: 4, py: 1, textTransform: "none", fontWeight: 600, boxShadow: "none", fontSize: "1rem", width: "45%" }}>Não</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openViewModal} onClose={handleCloseViewModal} maxWidth="md" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle sx={{ bgcolor: "#ffccd5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Detalhes do Produto</Typography>
              <IconButton onClick={handleCloseViewModal}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4 }}>
              {/* CORREÇÃO: Acessar propriedades diretamente de selectedItem */}
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ width: "100%", height: 250, bgcolor: "#f5f5f5", borderRadius: 2, display: "flex", justifyContent: "center", alignItems: "center" }}><Typography>Imagem</Typography></Box>
                  <Chip icon={<CheckCircleIcon />} label={selectedItem.estadoConservacao} color="success" sx={{ mt: 3 }} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedItem.descricao}</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>R$ {formatarPreco(selectedItem.preco)}</Typography>
                  <Grid container spacing={2} sx={{ my: 2 }}>
                    <Grid item xs={6}><Typography><strong>Código:</strong> {selectedItem.id}</Typography></Grid>
                    <Grid item xs={6}><Typography><strong>Lote:</strong> {selectedItem.lote || "-"}</Typography></Grid>
                    <Grid item xs={6}><Typography><strong>Categoria:</strong> {selectedItem.categoria || "-"}</Typography></Grid>
                    <Grid item xs={6}><Typography><strong>Marca:</strong> {selectedItem.marca}</Typography></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseViewModal}>Fechar</Button>
              <Button variant="contained" color="error" onClick={() => { handleConfirmDeleteItem(selectedItem.id); handleCloseViewModal(); }}>Remover do Carrinho</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={openDeleteConfirmation} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar Remoção</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* CORREÇÃO: Acessar a descrição diretamente */}
            Tem certeza que deseja remover <strong>{itemToDelete?.descricao}</strong> do carrinho?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleDeleteItem} color="error">Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled" elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}