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
  Chip,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Slide,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import Sidebar from "../../components/sidebar"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import InventoryIcon from "@mui/icons-material/Inventory"
import { forwardRef } from "react"
import { useRouter } from "next/navigation"

// Importações da API corrigidas
import { listarProdutos } from "../api/produtos"
import { adicionarAoCarrinho, listarCarrinho } from "../api/carrinho" // Agora aponta para o arquivo correto

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

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

const formatarPreco = (preco) => {
  const precoNumerico = Number(preco) || 0
  return precoNumerico.toFixed(2).replace(".", ",")
}

export default function EstoquePage() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [produtos, setProdutos] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [searchOptions, setSearchOptions] = useState([])
  const [cartItemCount, setCartItemCount] = useState(0)
  const [tabValue, setTabValue] = useState(0)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [openProductModal, setOpenProductModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    })
  }

  const buscarDadosIniciais = async () => {
    try {
      setLoading(true)

      const produtosResponse = await listarProdutos()
      if (produtosResponse?.sucesso && Array.isArray(produtosResponse.produtos)) {
        const produtosNormalizados = produtosResponse.produtos
          .map(normalizarProduto)
          .filter((produto) => produto !== null && produto.ativo)
        setProdutos(produtosNormalizados)
        setSearchOptions(criarOpcoesBusca(produtosNormalizados))
      } else {
        console.error("Erro ao buscar produtos:", produtosResponse?.mensagem)
        mostrarSnackbar(produtosResponse?.mensagem || "Erro ao carregar produtos", "error")
      }

      // Esta chamada agora deve funcionar corretamente
      const carrinhoResponse = await listarCarrinho()
      if (carrinhoResponse?.sucesso && carrinhoResponse.carrinho) {
        const totalItens = Number(carrinhoResponse.carrinho.totalItens) || 0
        setCartItemCount(totalItens)
      } else {
        console.error("Erro ao buscar carrinho:", carrinhoResponse?.mensagem)
        // Opcional: mostrar snackbar se o carrinho falhar, mas pode não ser crítico
        // mostrarSnackbar(carrinhoResponse?.mensagem || "Não foi possível carregar o carrinho", "warning");
      }
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error)
      mostrarSnackbar("Erro fatal ao carregar dados. Verifique a conexão.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarDadosIniciais()
  }, [])

  const handleOpenProductModal = (produto) => {
    const produtoNormalizado = normalizarProduto(produto)
    if (produtoNormalizado) {
      setProdutoSelecionado(produtoNormalizado)
      setOpenProductModal(true)
      setTabValue(0)
    }
  }

  const handleCloseProductModal = () => {
    setOpenProductModal(false)
    setProdutoSelecionado(null)
    setTabValue(0)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

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
        handleCloseProductModal() // Fecha o modal após adicionar
      } else {
        const mensagemErro = resultado?.mensagem || "Erro desconhecido ao adicionar"
        mostrarSnackbar(`Erro: ${mensagemErro}`, "error")
      }
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error)
      mostrarSnackbar("Erro inesperado ao adicionar produto", "error")
    }
  }

  const handleNavigateToCart = () => {
    router.push("/vendas/carrinho")
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const produtosFiltrados = useMemo(() => {
    return filtrarProdutos(produtos, searchQuery)
  }, [produtos, searchQuery])

  const produtosPaginados = useMemo(() => {
    const inicio = page * rowsPerPage
    const fim = inicio + rowsPerPage
    return produtosFiltrados.slice(inicio, fim)
  }, [produtosFiltrados, page, rowsPerPage])

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          marginLeft: { xs: 0, sm: "290px" },
          overflow: "auto",
          backgroundColor: "#9AE4FF",
          paddingTop: "3rem",
          paddingX: { xs: "1rem", sm: "2rem" },
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Cabeçalho: título central + botão do carrinho à direita (mesma largura da busca) */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "1800px", // mesmo limite da barra de pesquisa
            mx: "auto",
            mb: "50px", // mantém respiro antes da busca
          }}
        >
          {/* Título exatamente como estava */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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

          {/* Botão do carrinho alinhado à direita, na mesma linha visual do título */}
          <IconButton
            onClick={handleNavigateToCart}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "#FADADD",
              color: "#333",
              "&:hover": { bgcolor: "#ffb6c1" },
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
            onInputChange={(event, newInputValue) => {
              setSearchQuery(newInputValue || "")
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
            <Table stickyHeader>
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
                          fontWeight: "bold",
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
                      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress size={40} sx={{ color: "#FADADD" }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : produtosPaginados.length > 0 ? (
                  produtosPaginados.map((produto, index) => (
                    <TableRow key={produto.id || index} hover>
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
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4, fontSize: "1.1rem" }}>
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

      <Dialog
        open={openProductModal}
        TransitionComponent={Transition}
        keepMounted
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
                backgroundColor: "#9AE4FF",
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <InventoryIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
              }}
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
              color: "#333", // cor padrão quando não selecionado
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#9AE4FF", // cor azul quando ativo
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#9AE4FF", // cor da linha embaixo da aba ativa
              },
            }}
          >
            <Tab label="Informações Básicas" />
            <Tab label="Detalhes Adicionais" />
          </Tabs>

          {/* Tab 0: Informações Básicas */}
          {tabValue === 0 && produtoSelecionado && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
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
                      <Chip label={produtoSelecionado.estadoConservacao} color="success" size="small" />
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, backgroundColor: "#FADADD" }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
                      Preço e Estoque
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: "18px", fontWeight: "bold", color: "#4CAF50" }}>
                      <strong>Preço:</strong> R$ {formatarPreco(produtoSelecionado.preco)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Quantidade:</strong> {produtoSelecionado.quantidade} unidades
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Tamanho:</strong> {produtoSelecionado.tamanho}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab 1: Detalhes Adicionais */}
          {tabValue === 1 && produtoSelecionado && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, backgroundColor: "#FADADD" }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
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
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
                      Controle
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Data de Adição:</strong>{" "}
                      {produtoSelecionado.dataAdicao
                        ? new Date(produtoSelecionado.dataAdicao).toLocaleDateString("pt-BR")
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

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 4,
            pb: 4,
          }}
        >
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
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>

          <Button
            startIcon={<ShoppingCartIcon />}
            onClick={() => handleAddToCart(produtoSelecionado)}
            sx={{
              backgroundColor: "#FADADD",
              color: "#333",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "25px",
              padding: "12px 32px",
              minWidth: "180px",
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(250, 218, 221, 0.4)",
              "&:hover": {
                backgroundColor: "#FFB6C1",
                transform: "translateY(-2px)",
                boxShadow: "0px 6px 16px rgba(250, 218, 221, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogActions>
      </Dialog>

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
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
