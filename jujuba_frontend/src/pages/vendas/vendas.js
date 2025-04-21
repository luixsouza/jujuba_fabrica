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
  Container,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Chip,
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  QrCode as QrCodeIcon,
  Category as CategoryIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material"
import Sidebar from "../../components/sidebar"

export default function VendasPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("ALC352333")
  const [search, setSearch] = useState("ALC352333")
  const [searchTerm, setSearchTerm] = useState("ALC352333")
  const [openProductModal, setOpenProductModal] = useState(false)

  // Opções de pesquisa (simuladas)
  const searchOptions = ["ALC352333", "ALC123456", "ALC789012", "ALC456789"]

  // Dados do produto
  const product = {
    descricao: "Crocs Minnie Tamanho 19/20",
    estado: "Ótimo",
    valor: 47.5,
    codigo: "ALC352333",
    lote: "B321",
    categoria: "Calçados Infantis",
    marca: "Crocs",
    cor: "Rosa",
    dataEntrada: "15/04/2023",
    fornecedor: "Bazar Infantil",
    observacoes: "Produto em excelente estado, sem marcas de uso. Acompanha todos os adesivos originais.",
  }

  const handleOpenProductModal = () => {
    setOpenProductModal(true)
  }

  const handleCloseProductModal = () => {
    setOpenProductModal(false)
  }

  const handleGoToCart = () => {
    router.push("/vendas/carrinho")
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#a8e1ff" }}>
      {/* Importando o componente Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ ml: "244px", flex: 1, p: 2, pt: 4 }}>
        {/* Header - Moved down */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            px: 1,
            mt: 2,
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

        {/* Container to center and reduce width */}
        <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Search Bar - New Implementation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "30px",
              width: "125%",
            }}
          >
            <Autocomplete
              freeSolo
              options={searchOptions}
              value={search}
              onChange={(event, newValue) => {
                setSearch(newValue || "")
                setSearchTerm(newValue || "")
                setSearchQuery(newValue || "")
              }}
              onInputChange={(event, newValue) => {
                setSearch(newValue || "")
                setSearchTerm(newValue || "")
                setSearchQuery(newValue || "")
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pesquisar código"
                  variant="outlined"
                  color="primary"
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

          {/* Products Section - Reduced width */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              bgcolor: "#f8f9fa",
              overflow: "hidden",
              p: 0,
              width: "125%",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Table */}
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#ffccd5",
                      height: "70px",
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        p: 1,
                        pl: 2,
                        borderBottom: "none",
                        verticalAlign: "middle",
                      }}
                    >
                      Imagem
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        p: 1,
                        borderBottom: "none",
                        verticalAlign: "middle",
                      }}
                    >
                      Descrição
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        p: 1,
                        borderBottom: "none",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Estado de conservação
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        p: 1,
                        borderBottom: "none",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Valor
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        p: 1,
                        borderBottom: "none",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Código do Produto
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        p: 1,
                        borderBottom: "none",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Lote
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        p: 1,
                        borderBottom: "none",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ bgcolor: "white" }}>
                    <TableCell
                      sx={{
                        p: 1,
                        pl: 2,
                        borderBottom: "none",
                      }}
                    >
                      {/* Placeholder for image */}
                      <Box sx={{ width: 40, height: 40, bgcolor: "#f5f5f5", borderRadius: 1 }}></Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.85rem",
                        color: "#555",
                        p: 1,
                        borderBottom: "none",
                      }}
                    >
                      {product.descricao}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.85rem",
                        color: "#555",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {product.estado}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.85rem",
                        color: "#555",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      R$ {product.valor.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.85rem",
                        color: "#555",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {product.codigo}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.85rem",
                        color: "#555",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {product.lote}
                    </TableCell>
                    <TableCell
                      sx={{
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton size="small" sx={{ p: 0.5 }} onClick={handleOpenProductModal}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0.5 }} onClick={handleGoToCart}>
                          <ShoppingCartIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Modal de Visualização do Produto */}
      <Dialog
        open={openProductModal}
        onClose={handleCloseProductModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
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
          <IconButton onClick={handleCloseProductModal} size="large" sx={{ color: "#333" }}>
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
                  label={product.estado}
                  color="success"
                  sx={{ fontWeight: 600, fontSize: "1rem", py: 2.5, px: 1 }}
                />
              </Box>
            </Grid>

            {/* Informações do Produto */}
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#333" }}>
                {product.descricao}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AttachMoneyIcon sx={{ color: "#00509E", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#00509E" }}>
                  R$ {product.valor.toFixed(2).replace(".", ",")}
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Código:</strong> {product.codigo}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Lote:</strong> {product.lote}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CategoryIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Categoria:</strong> {product.categoria}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarMonthIcon sx={{ color: "#666", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Data de Entrada:</strong> {product.dataEntrada}
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
                    <strong>Marca:</strong> {product.marca}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Cor:</strong> {product.cor}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Fornecedor:</strong> {product.fornecedor}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, bgcolor: "#f5f5f5", p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Observações
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.observacoes}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa" }}>
          <Button
            variant="outlined"
            onClick={handleCloseProductModal}
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
            startIcon={<ShoppingCartIcon />}
            onClick={handleGoToCart}
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
            Adicionar ao Carrinho
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
