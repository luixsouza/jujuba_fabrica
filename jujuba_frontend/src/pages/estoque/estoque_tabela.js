"use client"

import { useState, useEffect, useMemo, forwardRef } from "react"
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  TextField,
  Button,
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  Badge, // Importar Badge para a contagem do carrinho
  Grid,
  Divider,
  Chip,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Sidebar from "../../components/sidebar"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart" // Importar ícone do carrinho
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import InventoryIcon from "@mui/icons-material/Inventory"
import QrCodeIcon from "@mui/icons-material/QrCode"
import CategoryIcon from "@mui/icons-material/Category"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useRouter } from "next/navigation"
// Importações de API para produtos e carrinho
import { listarProdutos } from "../api/produtos"
import { adicionarAoCarrinho, listarCarrinho } from "../api/carrinho"

// Transição personalizada para o modal (mantida para outros modais, se houver)
// Note: Slide component is not imported, so this Transition might cause an error if used.
// For this change, it's not directly relevant to the task.
const Transition = forwardRef(function Transition(props, ref) {
  // Assuming Slide is imported or not used for this specific modal
  // If you intend to use Slide, ensure it's imported from @mui/material
  return <div ref={ref} {...props} />; // Placeholder if Slide is not available
});

export default function EstoquePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("") // Usado para a barra de pesquisa
  const [produtos, setProdutos] = useState([]) // Produtos em estoque
  const [produtoSelecionado, setProdutoSelecionado] = useState(null) // Para o modal de visualização
  const [searchOptions, setSearchOptions] = useState([])
  const [cartItemCount, setCartItemCount] = useState(0) // Contagem de itens no carrinho
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [openProductModal, setOpenProductModal] = useState(false) // Para o modal de visualização de produto
  const [loading, setLoading] = useState(true) // Estado de carregamento

  // Estados de Snackbar para feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Efeito para buscar produtos e a contagem inicial do carrinho
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Buscar todos os produtos disponíveis
        const productsResponse = await listarProdutos()
        if (productsResponse.sucesso && productsResponse.produtos) {
          setProdutos(productsResponse.produtos)
          const options = productsResponse.produtos.flatMap(p => [
            p.id?.toString(), p.descricao, p.marca, p.genero
          ]).filter(Boolean);
          setSearchOptions([...new Set(options)]);
        } else {
          console.error("Erro ao buscar produtos:", productsResponse.mensagem)
        }

        // Buscar a contagem inicial do carrinho
        const cartResponse = await listarCarrinho()
        if (cartResponse.sucesso && cartResponse.carrinho) {
          setCartItemCount(cartResponse.carrinho.totalItens)
        } else {
          console.error("Erro ao buscar contagem do carrinho:", cartResponse.mensagem)
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error)
        setSnackbar({
          open: true,
          message: "Erro ao carregar dados. Verifique a conexão com o servidor.",
          severity: "error",
        })
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData()
  }, [])

  const handleOpenProductModal = (produto) => {
    setProdutoSelecionado(produto)
    setOpenProductModal(true)
  }

  const handleCloseProductModal = () => {
    setOpenProductModal(false)
  }

  // Função para adicionar ao carrinho (ícone na tabela e no modal)
  const handleAddToCart = async (produto) => {
    try {
      const result = await adicionarAoCarrinho(produto, 1)
      if (result.sucesso) {
        console.log("Produto adicionado ao carrinho com sucesso!", result.carrinho)
        setCartItemCount(result.carrinho.totalItens) // Atualiza a contagem
        setSnackbar({
          open: true,
          message: `"${produto.descricao}" adicionado ao carrinho!`,
          severity: "success",
        })
        setOpenProductModal(false); // Fecha o modal após adicionar
      } else {
        console.error("Erro ao adicionar produto ao carrinho:", result.mensagem)
        setSnackbar({
          open: true,
          message: `Erro ao adicionar produto ao carrinho: ${result.mensagem}`,
          severity: "error",
        })
      }
    } catch (error) {
      console.error("Erro inesperado ao adicionar produto ao carrinho:", error)
      setSnackbar({
        open: true,
        message: "Ocorreu um erro inesperado ao adicionar o produto ao carrinho.",
        severity: "error",
      })
    }
  }

  // Função para navegar diretamente para a página do carrinho
  const handleNavigateToCart = () => {
    router.push("/vendas/carrinho") // Assumindo que a página do carrinho está em /vendas/carrinho
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false })

  const filteredProdutos = useMemo(() => {
    return produtos.filter((produto) => {
      const query = searchQuery.toLowerCase();
      return (
        produto.id?.toString().toLowerCase().includes(query) ||
        produto.descricao?.toLowerCase().includes(query) ||
        produto.marca?.toLowerCase().includes(query) ||
        produto.genero?.toLowerCase().includes(query)
      );
    });
  }, [produtos, searchQuery]);


  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />

      {/* Botão do Carrinho no canto superior direito */}
      <Box
        sx={{
          position: 'fixed',
          top: 72, // Ajustado para mover mais para baixo
          right: 140, // Ajustado para mover mais para a esquerda
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={handleNavigateToCart}
          sx={{
            bgcolor: '#FADADD', // Cor rosa padrão
            color: '#333', // Cor do ícone
            '&:hover': {
              bgcolor: '#ffb6c1', // Cor rosa mais clara ao passar o mouse
            },
            borderRadius: '50%', // Botão redondo
            width: 56, // Largura fixa
            height: 56, // Altura fixa
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra para destaque
          }}
        >
          <Badge badgeContent={cartItemCount} color="error"> {/* Badge para a contagem */}
            <ShoppingCartIcon sx={{ fontSize: 30 }} />
          </Badge>
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          marginLeft: { xs: 0, sm: "290px" },
          maxHeight: "1000px",
          overflow: "auto",
          backgroundColor: "#9AE4FF",
          paddingTop: "3rem",
          paddingX: { xs: "1rem", sm: "2rem" },
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header - Padrão de Fornecedores */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "80px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "50px",
              color: "#000000",
            }}
          >
            Estoque
          </Typography>
        </Box>

        {/* Search Bar - Padrão de Fornecedores */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
            width: "100%",
          }}
        >
          <Autocomplete
            freeSolo
            options={searchOptions}
            value={searchQuery}
            onChange={(event, newValue) => {
              setSearchQuery(newValue || "")
            }}
            onInputChange={(event, newValue) => {
              setSearchQuery(newValue || "")
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pesquisar produtos por ID, descrição, marca ou gênero"
                variant="outlined"
                size="medium"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#000000", fontSize: 24 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    pl: 1,
                  },
                }}
                sx={{
                  width: "100%",
                  maxWidth: "1800px",
                  backgroundColor: "#F5F5F5",
                  marginBottom: "50px",
                  marginTop: "50px",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    borderRadius: "10px",
                    "& fieldset": {
                      borderColor: "#CCCCCC",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00509E",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00509E",
                    },
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                  },
                  "& .MuiInputBase-input": {
                    padding: "14px 20px",
                    fontSize: "18px",
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

        {/* Tabela de Produtos em Estoque - Padrão de Fornecedores */}
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
          {/* Novo título para a tabela */}
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
            Produtos disponíveis
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
                    ID
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
                    Valor
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontSize: "18px",
                      textAlign: "center",
                      backgroundColor: "#FADADD",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                        <CircularProgress size={40} sx={{ color: "#FADADD" }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : filteredProdutos.length > 0 ? (
                  filteredProdutos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produto, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.id}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.descricao}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.marca || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.tamanho || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.genero || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.estadoConservacao}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        {produto.quantidade || 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: { xs: "14px", sm: "16px", md: "18px" },
                          padding: { xs: "8px 4px", sm: "16px 8px" },
                          textAlign: "center",
                        }}
                      >
                        R$ {produto.preco ? produto.preco.toFixed(2).replace(".", ",") : "0,00"}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          padding: "8px",
                          minWidth: "150px",
                        }}
                      >
                        <IconButton onClick={() => handleOpenProductModal(produto)} sx={{ color: "#00509E" }}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAddToCart(produto)} sx={{ color: "#00509E" }}>
                          <ShoppingCartIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                      Nenhum produto encontrado no estoque
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredProdutos.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      </Box>

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
        {produtoSelecionado && (
          <>
            <DialogTitle
              sx={{
                bgcolor: "#FADADD",
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
                      label={produtoSelecionado.estadoConservacao}
                      color="success"
                      sx={{ fontWeight: 600, fontSize: "1rem", py: 2.5, px: 1 }}
                    />
                  </Box>
                </Grid>

                {/* Informações do Produto */}
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#333" }}>
                    {produtoSelecionado.descricao}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoneyIcon sx={{ color: "#00509E", mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#00509E" }}>
                      R$ {produtoSelecionado.preco ? produtoSelecionado.preco.toFixed(2).replace(".", ",") : "0,00"}
                    </Typography>
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>ID:</strong> {produtoSelecionado.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Tamanho:</strong> {produtoSelecionado.tamanho || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CategoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Gênero:</strong> {produtoSelecionado.genero || "-"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Quantidade:</strong> {produtoSelecionado.quantidade || 1}
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
                        <strong>Marca:</strong> {produtoSelecionado.marca || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Estado:</strong> {produtoSelecionado.estadoConservacao}
                      </Typography>
                    </Grid>
                  </Grid>
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
                onClick={() => handleAddToCart(produtoSelecionado)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  bgcolor: "#FADADD",
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
          </>
        )}
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}