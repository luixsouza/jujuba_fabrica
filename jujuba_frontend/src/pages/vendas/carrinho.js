"use client"

import { useState } from "react"
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
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
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

export default function CarrinhoPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [openSellModal, setOpenSellModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      descricao: "Crocs Minnie Tamanho 19/20",
      estado: "Ótimo",
      valor: 47.5,
      lote: "B321",
      codigo: "ALC352333",
      categoria: "Calçados Infantis",
      marca: "Crocs",
      cor: "Rosa",
      dataEntrada: "15/04/2023",
      fornecedor: "Bazar Infantil",
      observacoes: "Produto em excelente estado, sem marcas de uso. Acompanha todos os adesivos originais.",
    },
    {
      id: 2,
      descricao: "Camiseta Lacoste 8 anos",
      estado: "Ótimo",
      valor: 68.9,
      lote: "B321",
      codigo: "ALC123456",
      categoria: "Roupas Infantis",
      marca: "Lacoste",
      cor: "Verde",
      dataEntrada: "10/04/2023",
      fornecedor: "Bazar Infantil",
      observacoes: "Produto original em ótimo estado de conservação.",
    },
  ])

  // Opções de pesquisa (simuladas)
  const options = ["Crocs Minnie", "Camiseta Lacoste", "Tênis Nike", "Vestido Lilica"]

  const totalValue = cartItems.reduce((total, item) => total + item.valor, 0)

  const handleOpenSellModal = () => {
    setOpenSellModal(true)
  }

  const handleCloseSellModal = () => {
    setOpenSellModal(false)
  }

  const handleVenderParaFornecedor = () => {
    router.push("/vendas/vender_fornecedor")
  }

  const handleConfirmDeleteItem = (id) => {
    // Find the item to delete for showing in the confirmation dialog
    const item = cartItems.find((item) => item.id === id)
    setItemToDelete(item)
    setOpenDeleteConfirmation(true)
  }

  const handleDeleteItem = () => {
    if (itemToDelete) {
      setCartItems(cartItems.filter((item) => item.id !== itemToDelete.id))

      // If the item being deleted is also the selected item in the view modal, close the modal
      if (selectedItem && selectedItem.id === itemToDelete.id) {
        setOpenViewModal(false)
      }
    }
    setOpenDeleteConfirmation(false)
    setItemToDelete(null)
  }

  const handleCancelDelete = () => {
    setOpenDeleteConfirmation(false)
    setItemToDelete(null)
  }

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setOpenViewModal(true)
  }

  const handleCloseViewModal = () => {
    setOpenViewModal(false)
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#a8e1ff" }}>
      {/* Importando o componente Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ ml: "244px", flex: 1, p: 2, pt: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 1,
            mt: 2, // Reduzido para mover os ícones para cima
          }}
        >
          <IconButton onClick={() => router.back()} sx={{ color: "#333", p: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              color: "#333",
              fontWeight: 700,
              position: "absolute",
              left: "55%",
              transform: "translateX(-50%)",
              fontSize: "3rem",
            }}
          >
            Vendas
          </Typography>
          <IconButton sx={{ color: "#333", p: 1 }}>
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Search Bar - Novo estilo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Autocomplete
            freeSolo
            options={options}
            value={search}
            onChange={(event, newValue) => {
              setSearch(newValue || "")
            }}
            onInputChange={(event, newValue) => {
              setSearch(newValue || "")
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pesquisar produto"
                variant="outlined"
                size="medium"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  maxWidth: "1800px",
                  backgroundColor: "#F5F5F5",
                  marginBottom: "50px",
                  marginTop: "50px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    height: "80px",
                    "& fieldset": {
                      borderColor: "#CCCCCC",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00509E",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00509E",
                    },
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiInputBase-input": {
                    color: "#000000",
                    padding: "0 20px",
                    fontSize: "18px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "20px",
                    color: "#000000",
                    transform: "translate(20px, 28px)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00509E",
                  },
                  "& .MuiInputLabel-shrink": {
                    transform: "translate(20px, -6px) scale(0.75)",
                  },
                }}
              />
            )}
            sx={{
              width: "100%",
              maxWidth: "1800px",
            }}
          />
        </Box>

        {/* Cart Section */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            bgcolor: "#fff5f7",
            overflow: "visible",
            p: 2,
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#333",
                fontSize: "2rem",
              }}
            >
              Itens no carrinho
            </Typography>

            {/* Cart Items Table */}
            <Table sx={{ mb: 3 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "25%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                    }}
                  >
                    Descrição
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "25%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Estado de conservação
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Valor
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Lote
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      bgcolor: "#f9f9f9",
                      borderBottom: index < cartItems.length - 1 ? "1px solid #e0e0e0" : "none",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        borderBottom: "none",
                      }}
                    >
                      {item.descricao}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {item.estado}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      R$ {item.valor.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {item.lote}
                    </TableCell>
                    <TableCell
                      sx={{
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton size="small" sx={{ p: 0.5 }} onClick={() => handleViewItem(item)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0.5 }} onClick={() => handleConfirmDeleteItem(item.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {cartItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                      Nenhum item no carrinho
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Total Value */}
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "#b3e5fc",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#333" }}>
                Valor Total: R$ {totalValue.toFixed(2).replace(".", ",")}
              </Typography>
            </Box>

            {/* Action Buttons - Aumentados */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleVenderParaFornecedor}
                sx={{
                  bgcolor: "#ffc1cc",
                  color: "black",
                  "&:hover": { bgcolor: "#ffb6c1" },
                  borderRadius: 10,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  fontSize: "1rem",
                  minWidth: "180px",
                }}
              >
                Vender para fornecedor
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenSellModal}
                disabled={cartItems.length === 0}
                sx={{
                  bgcolor: "#ffc1cc",
                  color: "black",
                  "&:hover": { bgcolor: "#ffb6c1" },
                  borderRadius: 10,
                  px: 5,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  fontSize: "1rem",
                  minWidth: "140px",
                  "&.Mui-disabled": {
                    bgcolor: "#f5f5f5",
                    color: "#999",
                  },
                }}
              >
                Vender
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Modal de Venda */}
      <Dialog
        open={openSellModal}
        onClose={handleCloseSellModal}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            bgcolor: "white", // Alterado para branco
            maxWidth: "350px",
            width: "100%",
            m: 0,
            p: 0,
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseSellModal}
              aria-label="close"
              sx={{ p: 0.5, mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.2rem",
                color: "#333",
                flex: 1,
                textAlign: "center",
                mr: 4,
              }}
            >
              Vender
            </Typography>
          </Box>

          {/* Tabela de Pagamento */}
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#ffc1cc",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Forma de pagamento
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#ffc1cc",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Total da compra
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Pix
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  R$ {totalValue.toFixed(2).replace(".", ",")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Botões de Confirmação */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleCloseSellModal}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 10,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                fontSize: "1rem",
                width: "45%",
              }}
            >
              Sim
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseSellModal}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 10,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                fontSize: "1rem",
                width: "45%",
              }}
            >
              Não
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização do Produto */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#ffccd5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                Detalhes do Produto
              </Typography>
              <IconButton onClick={handleCloseViewModal} size="large" sx={{ color: "#333" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Imagem do Produto */}
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 250,
                      bgcolor: "#f5f5f5",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Imagem do Produto
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={selectedItem.estado}
                      color="success"
                      sx={{ fontWeight: 600, fontSize: "1rem", py: 2.5, px: 1 }}
                    />
                  </Box>
                </Grid>

                {/* Informações do Produto */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#333" }}>
                    {selectedItem.descricao}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: "#00509E", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00509E" }}>
                      R$ {selectedItem.valor.toFixed(2).replace(".", ",")}
                    </Typography>
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Código:</strong> {selectedItem.codigo}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Lote:</strong> {selectedItem.lote}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CategoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Categoria:</strong> {selectedItem.categoria}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CalendarMonthIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Data de Entrada:</strong> {selectedItem.dataEntrada}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Detalhes Adicionais
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Marca:</strong> {selectedItem.marca}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Cor:</strong> {selectedItem.cor}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Fornecedor:</strong> {selectedItem.fornecedor}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Observações
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedItem.observacoes}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa" }}>
              <Button
                variant="outlined"
                onClick={handleCloseViewModal}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  borderColor: "#ccc",
                  color: "#666",
                  "&:hover": {
                    borderColor: "#999",
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                Fechar
              </Button>
              <Button
                variant="contained"
                onClick={() => handleConfirmDeleteItem(selectedItem.id)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: "#ffccd5",
                  color: "#333",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#ffb6c1",
                  },
                }}
              >
                Remover do Carrinho
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Confirmation Dialog for Deleting Items */}
      <Dialog
        open={openDeleteConfirmation}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#ffccd5",
            display: "flex",
            alignItems: "center",
            p: 2,
          }}
        >
          <WarningIcon sx={{ mr: 1, color: "#d32f2f" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            Confirmar Remoção
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <DialogContentText>
            {itemToDelete ? (
              <>
                Tem certeza que deseja remover <strong>{itemToDelete.descricao}</strong> do carrinho?
              </>
            ) : (
              "Tem certeza que deseja remover este item do carrinho?"
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "#f8f9fa" }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              color: "#666",
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteItem}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              bgcolor: "#ffccd5",
              color: "#333",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#ffb6c1",
              },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
