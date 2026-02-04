"use client";

import { useState, useEffect, useMemo, forwardRef } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Badge,
  Grid,
  Chip,
  Avatar,
  Paper,
  Tabs,
  Tab,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useRouter } from "next/navigation";

// Componentes padronizados
import {
  PageLayout,
  PageTitle,
  SearchBar,
  DataTable,
  ActionButtons,
  SnackbarAlert,
} from "../../components/ui";

// Hooks padronizados
import { useSnackbar } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING } from "../../constants";

// API
import { listarProdutos, buscarProdutoPorId } from "../api/produtos";
import { adicionarAoCarrinho, listarCarrinho } from "../api/carrinho";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Funções auxiliares
const normalizarProduto = (produto) => {
  if (!produto || typeof produto !== "object") return null;
  const quantidade = Number(produto.quantidade);
  const preco = Number(produto.preco);
  return {
    id: produto.id || null,
    descricao: produto.descricao || "Produto sem descrição",
    marca: produto.marca || "Marca não informada",
    tamanho: produto.tamanho || "Tamanho não informado",
    genero: produto.genero || "UNISSEX",
    estadoConservacao: produto.estadoConservacao || "Não informado",
    quantidade: isNaN(quantidade) ? 0 : Math.floor(quantidade),
    preco: isNaN(preco) ? 0 : preco,
    categoria: produto.categoria || "Sem categoria",
    cor: produto.cor || "Não informada",
    material: produto.material || "Não informado",
    dataAdicao: produto.dataAdicao || new Date().toISOString(),
    ativo: produto.ativo !== false,
  };
};

const criarOpcoesBusca = (produtos) => {
  if (!Array.isArray(produtos)) return [];
  const opcoes = new Set();
  produtos.forEach((p) => {
    const prod = normalizarProduto(p);
    if (prod) {
      if (prod.id) opcoes.add(prod.id.toString());
      if (prod.descricao) opcoes.add(prod.descricao);
      if (prod.tamanho !== "Tamanho não informado") opcoes.add(prod.tamanho);
      if (prod.marca !== "Marca não informada") opcoes.add(prod.marca);
      if (prod.genero !== "Não especificado") opcoes.add(prod.genero);
    }
  });
  return Array.from(opcoes).sort();
};

const filtrarProdutos = (produtos, query) => {
  if (!Array.isArray(produtos) || !query?.trim()) return produtos;
  const q = query.toLowerCase().trim();
  return produtos.filter((p) => {
    const prod = normalizarProduto(p);
    if (!prod) return false;
    return [prod.id?.toString(), prod.descricao, prod.marca, prod.genero, prod.tamanho, prod.cor]
      .some((campo) => campo?.toLowerCase().includes(q));
  });
};

const formatarPreco = (preco) => (Number(preco) || 0).toFixed(2).replace(".", ",");

export default function EstoquePage() {
  const router = useRouter();
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  const [searchQuery, setSearchQuery] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [searchOptions, setSearchOptions] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [modalQty, setModalQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // Buscar dados iniciais
  const buscarDadosIniciais = async () => {
    try {
      setLoading(true);
      const produtosResponse = await listarProdutos();
      if (produtosResponse?.sucesso && Array.isArray(produtosResponse.produtos)) {
        const produtosNormalizados = produtosResponse.produtos
          .map(normalizarProduto)
          .filter((p) => p !== null && p.ativo && p.quantidade > 0);
        setProdutos(produtosNormalizados);
        setSearchOptions(criarOpcoesBusca(produtosNormalizados));
      } else {
        showError(produtosResponse?.mensagem || "Erro ao carregar produtos");
      }

      const carrinhoResponse = await listarCarrinho();
      if (carrinhoResponse?.sucesso && carrinhoResponse.carrinho) {
        const itens = carrinhoResponse.carrinho.itens || [];
        setCartItemCount(itens.reduce((sum, item) => sum + Number(item.quantidade || 0), 0));
        setCartItems(itens);
      }
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      showError("Erro fatal ao carregar dados. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDadosIniciais();
    const handler = () => buscarDadosIniciais();
    window.addEventListener("estoque-atualizado", handler);
    return () => window.removeEventListener("estoque-atualizado", handler);
  }, []);

  // Handlers do modal
  const handleOpenProductModal = (produto) => {
    const prod = normalizarProduto(produto);
    if (prod) {
      setProdutoSelecionado(prod);
      setModalQty(1);
      setOpenProductModal(true);
      setTabValue(0);
    }
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setProdutoSelecionado(null);
    setTabValue(0);
  };

  // Adicionar ao carrinho
  const handleAddToCart = async (produto, quantidade = 1) => {
    try {
      const prod = normalizarProduto(produto);
      if (!prod) { showError("Produto inválido"); return; }

      const desired = Number(quantidade) || 1;
      const produtoAtual = await buscarProdutoPorId(prod.id);
      const estoqueDisponivel = Number(produtoAtual?.produto?.quantidade) || 0;

      if (desired > estoqueDisponivel) {
        showError(`Estoque insuficiente: disponíveis ${estoqueDisponivel} unidade(s).`);
        return;
      }

      const resultado = await adicionarAoCarrinho(prod, desired);
      if (resultado?.sucesso) {
        setProdutos((prev) => prev.map((p) =>
          p.id === prod.id ? { ...p, quantidade: Math.max(0, p.quantidade - desired) } : p
        ));
        const itens = resultado.carrinho?.itens || [];
        setCartItemCount(itens.reduce((sum, item) => sum + Number(item.quantidade || 0), 0));
        setCartItems(itens);
        showSuccess(`"${prod.descricao}" adicionado ao carrinho!`);
        handleCloseProductModal();
      } else {
        showError(`Erro: ${resultado?.mensagem || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      showError("Erro inesperado ao adicionar produto");
    }
  };

  const podeAdicionarAoCarrinho = (produto) => (Number(produto.quantidade) || 0) > 0;
  const produtosFiltrados = useMemo(() => filtrarProdutos(produtos, searchQuery), [produtos, searchQuery]);

  // Configuração das colunas
  const columns = [
    { id: "id", label: "ID", width: 60 },
    { id: "descricao", label: "Descrição", wordWrap: true, maxWidth: 200 },
    { id: "marca", label: "Marca" },
    { id: "tamanho", label: "Tamanho" },
    { id: "genero", label: "Gênero" },
    { id: "estadoConservacao", label: "Estado" },
    { id: "quantidade", label: "Quantidade" },
    { id: "preco", label: "Valor", render: (row) => `R$ ${formatarPreco(row.preco)}` },
    {
      id: "acoes",
      label: "Ações",
      width: 120,
      render: (row) => (
        <ActionButtons
          onView={() => handleOpenProductModal(row)}
          showEdit={false}
          showDelete={false}
          showAddToCart
          onAddToCart={() => handleAddToCart(row, 1)}
          disableAddToCart={!podeAdicionarAoCarrinho(row)}
          addToCartTitle={podeAdicionarAoCarrinho(row) ? "Adicionar ao carrinho" : "Sem estoque"}
        />
      ),
    },
  ];

  // Botão do carrinho
  const cartButton = (
    <IconButton
      onClick={() => router.push("/vendas/carrinho")}
      sx={{
        bgcolor: COLORS.primaryPink,
        color: COLORS.textSecondary,
        "&:hover": { bgcolor: COLORS.actionPinkHover },
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
  );

  return (
    <PageLayout title="Estoque">
      <PageTitle title="Estoque" rightContent={cartButton} />

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Pesquisar produtos por ID, descrição, marca ou gênero"
          useAutocomplete
          options={searchOptions}
        />
      </Box>

      <Card
        sx={{
          padding: SPACING.cardPadding,
          boxShadow: SHADOWS.card,
          borderRadius: SPACING.cardBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
          border: `2px solid ${COLORS.borderMedium}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: COLORS.textSecondary, fontSize: "1.5rem" }}
        >
          Produtos em estoque ({produtosFiltrados.length})
        </Typography>

        <DataTable
          columns={columns}
          data={produtosFiltrados}
          loading={loading}
          emptyMessage={searchQuery ? `Nenhum produto encontrado para "${searchQuery}"` : "Nenhum produto encontrado no estoque"}
          rowKeyExtractor={(row) => row.id}
        />
      </Card>

      {/* Modal de Visualização do Produto */}
      <Dialog
        open={openProductModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseProductModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: SPACING.modalBorderRadius, background: COLORS.backgroundPaper, boxShadow: SHADOWS.modal, maxHeight: "90vh" } }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 2, pt: 4, position: "relative" }}>
          <IconButton onClick={handleCloseProductModal} sx={{ position: "absolute", right: 8, top: 8, color: COLORS.textMuted, "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" } }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 80, height: 80, backgroundColor: COLORS.primaryBlue, boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)" }}>
              <InventoryIcon sx={{ fontSize: 40, color: "white" }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: COLORS.textSecondary, textAlign: "center" }}>
              {produtoSelecionado?.descricao || "Produto"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 4, pb: 2 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered sx={{ mb: 3, "& .MuiTab-root": { fontWeight: "bold", fontSize: "16px", color: COLORS.textSecondary }, "& .MuiTab-root.Mui-selected": { color: COLORS.primaryBlue }, "& .MuiTabs-indicator": { backgroundColor: COLORS.primaryBlue } }}>
            <Tab label="Informações Básicas" />
            <Tab label="Detalhes Adicionais" />
          </Tabs>

          {tabValue === 0 && produtoSelecionado && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: COLORS.primaryPink }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>Dados do Produto</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>ID:</strong> #{produtoSelecionado.id || "N/A"}</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Descrição:</strong> {produtoSelecionado.descricao}</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Estado:</strong> <Chip label={produtoSelecionado.estadoConservacao} color="success" size="small" /></Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: COLORS.primaryPink }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>Preço e Estoque</Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: "18px", fontWeight: "bold", color: COLORS.success }}><strong>Preço:</strong> R$ {formatarPreco(produtoSelecionado.preco)}</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Quantidade:</strong> {produtoSelecionado.quantidade} unidades</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Tamanho:</strong> {produtoSelecionado.tamanho}</Typography>
                </Paper>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && produtoSelecionado && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: COLORS.primaryPink }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>Características</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Marca:</strong> {produtoSelecionado.marca}</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Gênero:</strong> {produtoSelecionado.genero}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: COLORS.primaryPink }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary }}>Controle</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Data de Adição:</strong> {produtoSelecionado.dataAdicao ? new Date(produtoSelecionado.dataAdicao).toLocaleDateString("pt-BR") : "Não informada"}</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}><strong>Status:</strong> <Chip label={produtoSelecionado.ativo ? "Ativo" : "Inativo"} color={produtoSelecionado.ativo ? "success" : "error"} size="small" /></Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, px: 4, pb: 4 }}>
          <Button onClick={handleCloseProductModal} sx={{ backgroundColor: COLORS.primaryPink, color: COLORS.textSecondary, fontWeight: "bold", fontSize: "16px", borderRadius: SPACING.buttonBorderRadius, padding: "12px 32px", textTransform: "none", "&:hover": { backgroundColor: COLORS.actionPinkHover, transform: "translateY(-2px)" }, transition: "all 0.3s ease" }}>
            Fechar
          </Button>
          <TextField label="Quantidade" type="number" value={modalQty} onChange={(e) => setModalQty(Math.min(Math.max(1, Number(e.target.value)), produtoSelecionado?.quantidade || 1))} inputProps={{ min: 1, max: produtoSelecionado?.quantidade || 1 }} sx={{ width: 120 }} />
          <Button startIcon={<ShoppingCartIcon />} onClick={() => handleAddToCart(produtoSelecionado, modalQty)} disabled={produtoSelecionado && !podeAdicionarAoCarrinho(produtoSelecionado)} sx={{ backgroundColor: COLORS.primaryPink, color: COLORS.textSecondary, fontWeight: "bold", fontSize: "16px", borderRadius: SPACING.buttonBorderRadius, padding: "12px 32px", textTransform: "none", "&:hover": { backgroundColor: COLORS.actionPinkHover, transform: "translateY(-2px)" }, "&:disabled": { backgroundColor: "#e0e0e0", color: "#999" }, transition: "all 0.3s ease" }}>
            {produtoSelecionado && !podeAdicionarAoCarrinho(produtoSelecionado) ? "Sem estoque" : "Adicionar ao Carrinho"}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
}
