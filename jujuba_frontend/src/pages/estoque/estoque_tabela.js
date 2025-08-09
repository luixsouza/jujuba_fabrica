"use client"

import { useState, useEffect, useMemo } from "react"
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
  Badge,
  Grid,
  Divider,
  Chip,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Sidebar from "../../components/sidebar"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import InventoryIcon from "@mui/icons-material/Inventory"
import QrCodeIcon from "@mui/icons-material/QrCode"
import CategoryIcon from "@mui/icons-material/Category"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { useRouter } from "next/navigation"


import { listarProdutos } from "../api/produtos"
import { adicionarAoCarrinho, listarCarrinho } from "../api/carrinho"


const normalizarProduto = (produto) => {
  if (!produto || typeof produto !== "object") {
    return null
  }

  return {
    id: produto.id || null,
    descricao: produto.descricao || "Produto sem descrição",
    marca: produto.marca || "Marca não informada",
    tamanho: produto.tamanho || "Tamanho não informado",
    genero: produto.genero || "Não especificado",
    estadoConservacao: produto.estadoConservacao || "Não informado",
    quantidade: Number(produto.quantidade) || 1,
    preco: Number(produto.preco) || 0,
    categoria: produto.categoria || "Sem categoria",
    cor: produto.cor || "Não informada",
    material: produto.material || "Não informado",
    dataAdicao: produto.dataAdicao || new Date().toISOString(),
    ativo: produto.ativo !== false, 
  }
}


const criarOpcoesBusca = (produtos) => {
  if (!Array.isArray(produtos) || produtos.length === 0) {
    return []
  }

  const opcoes = new Set()

  produtos.forEach((produto) => {
    const produtoNormalizado = normalizarProduto(produto)
    if (produtoNormalizado) {
      // Adicionar diferentes campos para busca
      if (produtoNormalizado.id) opcoes.add(produtoNormalizado.id.toString())
      if (produtoNormalizado.descricao) opcoes.add(produtoNormalizado.descricao)
      if (produtoNormalizado.marca && produtoNormalizado.marca !== "Marca não informada") {
        opcoes.add(produtoNormalizado.marca)
      }
      if (produtoNormalizado.genero && produtoNormalizado.genero !== "Não especificado") {
        opcoes.add(produtoNormalizado.genero)
      }
      if (produtoNormalizado.categoria && produtoNormalizado.categoria !== "Sem categoria") {
        opcoes.add(produtoNormalizado.categoria)
      }
    }
  })

  return Array.from(opcoes).sort()
}

// Função para filtrar produtos otimizada
const filtrarProdutos = (produtos, query) => {
  if (!Array.isArray(produtos) || !query || typeof query !== "string") {
    return produtos
  }

  const queryLower = query.toLowerCase().trim()

  return produtos.filter((produto) => {
    const produtoNormalizado = normalizarProduto(produto)
    if (!produtoNormalizado) return false

    const campos = [
      produtoNormalizado.id?.toString(),
      produtoNormalizado.descricao,
      produtoNormalizado.marca,
      produtoNormalizado.genero,
      produtoNormalizado.categoria,
      produtoNormalizado.tamanho,
      produtoNormalizado.cor,
    ]

    return campos.some((campo) => campo && campo.toLowerCase().includes(queryLower))
  })
}

// Função para formatar preço
const formatarPreco = (preco) => {
  const precoNumerico = Number(preco) || 0
  return precoNumerico.toFixed(2).replace(".", ",")
}

export default function EstoquePage() {
  const router = useRouter()

  // Estados principais
  const [searchQuery, setSearchQuery] = useState("")
  const [produtos, setProdutos] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [searchOptions, setSearchOptions] = useState([])
  const [cartItemCount, setCartItemCount] = useState(0)

  // Estados de paginação
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Estados de UI
  const [openProductModal, setOpenProductModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Função para buscar dados iniciais
  const buscarDadosIniciais = async () => {
    try {
      setLoading(true)

      // Buscar produtos
      const produtosResponse = await listarProdutos()

      if (produtosResponse?.sucesso && Array.isArray(produtosResponse.produtos)) {
        const produtosNormalizados = produtosResponse.produtos
          .map(normalizarProduto)
          .filter((produto) => produto !== null && produto.ativo)

        setProdutos(produtosNormalizados)
        setSearchOptions(criarOpcoesBusca(produtosNormalizados))
      } else {
        console.error("Erro ao buscar produtos:", produtosResponse?.mensagem)
        mostrarSnackbar("Erro ao carregar produtos", "error")
      }

      // Buscar carrinho
      const carrinhoResponse = await listarCarrinho()

      if (carrinhoResponse?.sucesso && carrinhoResponse.carrinho) {
        const totalItens = Number(carrinhoResponse.carrinho.totalItens) || 0
        setCartItemCount(totalItens)
      } else {
        console.error("Erro ao buscar carrinho:", carrinhoResponse?.mensagem)
      }
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error)
      mostrarSnackbar("Erro ao carregar dados. Verifique a conexão.", "error")
    } finally {
      setLoading(false)
    }
  }

  // Função para mostrar snackbar
  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  // Efeito para carregar dados iniciais
  useEffect(() => {
    buscarDadosIniciais()
  }, [])

  // Função para abrir modal do produto
  const handleOpenProductModal = (produto) => {
    const produtoNormalizado = normalizarProduto(produto)
    if (produtoNormalizado) {
      setProdutoSelecionado(produtoNormalizado)
      setOpenProductModal(true)
    }
  }

  // Função para fechar modal
  const handleCloseProductModal = () => {
    setOpenProductModal(false)
    setProdutoSelecionado(null)
  }

  // Função para adicionar ao carrinho
  const handleAddToCart = async (produto) => {
    try {
      const produtoNormalizado = normalizarProduto(produto)
      if (!produtoNormalizado) {
        mostrarSnackbar("Produto inválido", "error")
        return
      }

      const resultado = await adicionarAoCarrinho(produtoNormalizado, 1)

      if (resultado?.sucesso) {
        const novoTotal = Number(resultado.carrinho?.totalItens) || cartItemCount + 1
        setCartItemCount(novoTotal)
        mostrarSnackbar(`"${produtoNormalizado.descricao}" adicionado ao carrinho!`, "success")
        setOpenProductModal(false)
      } else {
        const mensagemErro = resultado?.mensagem || "Erro desconhecido"
        mostrarSnackbar(`Erro ao adicionar produto: ${mensagemErro}`, "error")
      }
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error)
      mostrarSnackbar("Erro inesperado ao adicionar produto", "error")
    }
  }

  // Função para navegar ao carrinho
  const handleNavigateToCart = () => {
    router.push("/vendas/carrinho")
  }

  // Handlers de paginação
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  // Handler para fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  // Produtos filtrados com memoização
  const produtosFiltrados = useMemo(() => {
    return filtrarProdutos(produtos, searchQuery)
  }, [produtos, searchQuery])

  // Produtos paginados
  const produtosPaginados = useMemo(() => {
    const inicio = page * rowsPerPage
    const fim = inicio + rowsPerPage
    return produtosFiltrados.slice(inicio, fim)
  }, [produtosFiltrados, page, rowsPerPage])

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />

      {/* Botão do Carrinho */}
      <Box
        sx={{
          position: "fixed",
          top: 72,
          right: 140,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={handleNavigateToCart}
          sx={{
            bgcolor: "#FADADD",
            color: "#333",
            "&:hover": {
              bgcolor: "#ffb6c1",
            },
            borderRadius: "50%",
            width: 56,
            height: 56,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Badge badgeContent={cartItemCount} color="error">
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
        {/* Header */}
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
              fontWeight: "bold",
              fontSize: "50px",
              color: "#000000",
              textAlign: "center",
            }}
          >
            Estoque
          </Typography>
        </Box>

        {/* Barra de Pesquisa */}
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

        {/* Tabela de Produtos */}
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
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#333",
              fontSize: "2rem",
              textAlign: "left",
              pl: 1,
            }}
          >
            Produtos disponíveis ({produtosFiltrados.length})
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
                  {["ID", "Descrição", "Marca", "Tamanho", "Gênero", "Estado", "Quantidade", "Valor", "Ações"].map(
                    (header, index) => (
                      <TableCell
                        key={header}
                        align="center"
                        sx={{
                          fontSize: "18px",
                          textAlign: "center",
                          backgroundColor: "#FADADD",
                          borderRight: index < 8 ? "2px solid #F5F5F5" : "none",
                        }}
                      >
                        {header}
                      </TableCell>
                    ),
                  )}
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
                ) : produtosPaginados.length > 0 ? (
                  produtosPaginados.map((produto, index) => (
                    <TableRow key={produto.id || index}>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>{produto.id || "-"}</TableCell>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>{produto.descricao}</TableCell>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>{produto.marca}</TableCell>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>{produto.tamanho}</TableCell>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>{produto.genero}</TableCell>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>{produto.estadoConservacao}</TableCell>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>{produto.quantidade}</TableCell>
                      <TableCell sx={{ fontSize: "16px", textAlign: "center" }}>
                        R$ {formatarPreco(produto.preco)}
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
                        <IconButton
                          onClick={() => handleOpenProductModal(produto)}
                          sx={{ color: "#00509E" }}
                          title="Visualizar produto"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleAddToCart(produto)}
                          sx={{ color: "#00509E" }}
                          title="Adicionar ao carrinho"
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                      {searchQuery
                        ? `Nenhum produto encontrado para "${searchQuery}"`
                        : "Nenhum produto encontrado no estoque"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={produtosFiltrados.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Card>
      </Box>

      {/* Modal de Detalhes do Produto */}
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
                      R$ {formatarPreco(produtoSelecionado.preco)}
                    </Typography>
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <QrCodeIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>ID:</strong> {produtoSelecionado.id || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Tamanho:</strong> {produtoSelecionado.tamanho}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <CategoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Gênero:</strong> {produtoSelecionado.genero}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <InventoryIcon sx={{ color: "#666", mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Quantidade:</strong> {produtoSelecionado.quantidade}
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
                        <strong>Marca:</strong> {produtoSelecionado.marca}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Estado:</strong> {produtoSelecionado.estadoConservacao}
                      </Typography>
                    </Grid>
                    {produtoSelecionado.categoria && produtoSelecionado.categoria !== "Sem categoria" && (
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Categoria:</strong> {produtoSelecionado.categoria}
                        </Typography>
                      </Grid>
                    )}
                    {produtoSelecionado.cor && produtoSelecionado.cor !== "Não informada" && (
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Cor:</strong> {produtoSelecionado.cor}
                        </Typography>
                      </Grid>
                    )}
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
