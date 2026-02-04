"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

// Material-UI
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// Icons
import {
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from "@mui/icons-material";

// Componentes padronizados
import {
  PageLayout,
  PageTitle,
  SearchBar,
  DataTable,
  SnackbarAlert,
} from "../../components/ui";

// Hooks padronizados
import { useSnackbar } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING, FONT_SIZES } from "../../constants";

// APIs locais
import { listarCarrinho } from "../api/carrinho";
import { finalizarVendaFornecedora } from "../api/vendas";
import { listarProdutos } from "../api/produtos";

export default function VenderFornecedorPage() {
  const router = useRouter();
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  // Estados principais
  const [searchTerm, setSearchTerm] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFornecedorForSale, setSelectedFornecedorForSale] = useState(null);

  // Estados do carrinho
  const [carrinhoItems, setCarrinhoItems] = useState([]);
  const [totalVenda, setTotalVenda] = useState(0);

  // Estados dos modais
  const [openFinalizarModal, setOpenFinalizarModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);

  // Estados da finalização
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [orderRef, setOrderRef] = useState(null);
  const [confirmedReview, setConfirmedReview] = useState(false);
  const [paymentDinheiro, setPaymentDinheiro] = useState(0);
  const [paymentCartao, setPaymentCartao] = useState(0);
  const [paymentPix, setPaymentPix] = useState(0);

  // Funções utilitárias
  const formatarValor = (valor) => {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return "0,00";
    }
    return Number(valor).toFixed(2).replace(".", ",");
  };

  const obterValorSeguro = (valor) => {
    return valor !== null && valor !== undefined && !isNaN(valor) ? Number(valor) : 0;
  };

  // Fetch fornecedores
  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        setLoading(true);
        const response = await api.get("/fornecedoras");
        setFornecedores(response.data);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
        showError("Erro ao carregar fornecedores");
      } finally {
        setLoading(false);
      }
    };
    fetchFornecedores();
  }, []);

  // Fetch carrinho
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await listarCarrinho();
        if (response.sucesso && response.carrinho) {
          const items = response.carrinho.itens || [];
          setCarrinhoItems(items);
          setTotalVenda(Number(response.carrinho.valorTotal) || 0);
        } else {
          setCarrinhoItems([]);
          setTotalVenda(0);
        }
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
        setCarrinhoItems([]);
        setTotalVenda(0);
      }
    };
    fetchCartItems();
  }, []);

  // Filtro de busca
  const fornecedoresFiltrados = useMemo(() => {
    if (!searchTerm?.trim()) return fornecedores;
    const s = searchTerm.toLowerCase();
    return fornecedores.filter((f) => {
      if (!f) return false;
      return (
        String(f.id || "").toLowerCase().includes(s) ||
        (f.nome || "").toLowerCase().includes(s) ||
        (f.contato || "").toLowerCase().includes(s) ||
        (f.endereco || "").toLowerCase().includes(s) ||
        (f.chavePix || "").toLowerCase().includes(s)
      );
    });
  }, [fornecedores, searchTerm]);

  // Opções de busca
  const searchOptions = useMemo(() => {
    return [
      ...new Set(
        fornecedores
          .flatMap((f) => [
            f?.nome,
            f?.contato,
            f?.endereco,
            f?.chavePix,
            f?.id ? String(f.id) : null,
          ])
          .filter(Boolean)
      ),
    ];
  }, [fornecedores]);

  // Handlers
  const handleDownloadContrato = () => {
    if (selectedFornecedor?.contratoUrl) {
      window.open(selectedFornecedor.contratoUrl, "_blank");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewFornecedor = async (id) => {
    try {
      const response = await api.get(`/fornecedoras/${id}`);
      setSelectedFornecedor(response.data);
      setOpenViewModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes do fornecedor:", error);
      showError("Erro ao carregar detalhes do fornecedor");
    }
  };

  const handleSelectFornecedorForSale = async (fornecedorOrId) => {
    try {
      const id = typeof fornecedorOrId === "object" ? fornecedorOrId.id : fornecedorOrId;
      if (!id) return;
      const resp = await api.get(`/fornecedoras/${id}`);
      setSelectedFornecedorForSale(resp.data);
    } catch (e) {
      console.error("Erro ao selecionar fornecedora:", e);
      if (typeof fornecedorOrId === "object") {
        setSelectedFornecedorForSale(fornecedorOrId);
      }
    }
  };

  const handleFinalizarCompra = () => {
    if (!selectedFornecedorForSale) {
      showError("Por favor, selecione um fornecedor antes de finalizar a compra.");
      return;
    }
    setOrderRef(`VND-${Date.now()}`);
    setConfirmedReview(false);
    setOpenFinalizarModal(true);
  };

  // Cálculos de crédito e pagamento
  const calcularCreditoFinal = () => {
    if (!selectedFornecedorForSale) return 0;
    const credito = obterValorSeguro(
      selectedFornecedorForSale.creditoLoja ?? selectedFornecedorForSale.valorCredito
    );
    const totalPago = pagamentoTotal();
    return credito + totalPago - totalVenda;
  };

  const calcularDeficit = () => {
    const credito = obterValorSeguro(
      selectedFornecedorForSale?.creditoLoja ?? selectedFornecedorForSale?.valorCredito
    );
    const deficit = Number(totalVenda) - credito;
    return deficit > 0 ? deficit : 0;
  };

  const pagamentoTotal = () => {
    return (
      (Number(paymentDinheiro) || 0) +
      (Number(paymentCartao) || 0) +
      (Number(paymentPix) || 0)
    );
  };

  const handleConfirmarCompra = async () => {
    if (!selectedFornecedorForSale || carrinhoItems.length === 0) return;

    try {
      setIsLoading(true);

      const deficit = calcularDeficit();
      let resultado = null;

      if (deficit > 0) {
        const totalPago = pagamentoTotal();
        if (totalPago < deficit) {
          showError("Complete o valor do pagamento para cobrir o déficit do fornecedor.");
          setIsLoading(false);
          return;
        }

        resultado = await finalizarVendaFornecedora(
          selectedFornecedorForSale.id.toString(),
          { dinheiro: paymentDinheiro, cartao: paymentCartao, pix: paymentPix }
        );

        if (!resultado.sucesso) {
          throw new Error(resultado.mensagem || "Falha ao finalizar venda com pagamento");
        }
      } else {
        resultado = await finalizarVendaFornecedora(
          selectedFornecedorForSale.id.toString(),
          { dinheiro: 0, cartao: 0, pix: 0 }
        );

        if (!resultado.sucesso) {
          throw new Error(resultado.mensagem || "Falha ao finalizar venda");
        }
      }

      if (!resultado || !resultado.sucesso) {
        throw new Error(resultado?.mensagem || "Falha ao finalizar venda");
      }

      localStorage.removeItem("carrinho");
      setCarrinhoItems([]);
      setOpenFinalizarModal(false);
      showSuccess("Venda realizada ao fornecedor com sucesso!");

      try {
        await listarProdutos();
      } catch (e) {
        console.warn("Falha ao atualizar produtos após venda para fornecedor", e);
      }

      try {
        window.dispatchEvent(new Event("estoque-atualizado"));
      } catch (e) {
        /* noop */
      }

      setTimeout(() => {
        router.push("/vendas");
      }, 2000);
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      showError(error.message || "Falha ao finalizar a venda. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
      setPaymentDinheiro(0);
      setPaymentCartao(0);
      setPaymentPix(0);
    }
  };

  const handlePrintRecibo = () => {
    const rowsHtml = carrinhoItems
      .map((it) => {
        const q = Number(it.quantidade) || 1;
        const pu = Number(it.preco) || 0;
        return `<tr><td style="padding:6px;border:1px solid #ddd">${it.descricao}</td><td style="padding:6px;border:1px solid #ddd;text-align:center">${q}</td><td style="padding:6px;border:1px solid #ddd;text-align:right">R$ ${formatarValor(pu)}</td><td style="padding:6px;border:1px solid #ddd;text-align:right">R$ ${formatarValor(q * pu)}</td></tr>`;
      })
      .join("");

    const receiptHtml = `
      <html>
        <head>
          <title>Recibo ${orderRef || ""}</title>
          <meta charset="utf-8" />
        </head>
        <body style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;">
          <h2>Recibo - ${orderRef || ""}</h2>
          <p>Data: ${new Date().toLocaleString()}</p>
          <table style="border-collapse:collapse;width:100%;margin-top:12px">
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #ddd;text-align:left">Descrição</th>
                <th style="padding:8px;border:1px solid #ddd;text-align:center">Qtde</th>
                <th style="padding:8px;border:1px solid #ddd;text-align:right">Valor unit.</th>
                <th style="padding:8px;border:1px solid #ddd;text-align:right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div style="margin-top:12px;text-align:right">
            <div style="font-weight:bold">Total: R$ ${formatarValor(totalVenda)}</div>
          </div>
          <div style="margin-top:12px">
            <div><strong>Fornecedor:</strong> ${selectedFornecedorForSale?.nome || "-"}</div>
            <div>Crédito antes: R$ ${formatarValor(selectedFornecedorForSale?.creditoLoja ?? selectedFornecedorForSale?.valorCredito ?? 0)}</div>
            <div>Crédito após venda: R$ ${formatarValor(calcularCreditoFinal())}</div>
          </div>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return showError("Não foi possível abrir janela de impressão.");
    w.document.open();
    w.document.write(receiptHtml);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      id: "nome",
      label: "Fornecedores",
      wordWrap: true,
      maxWidth: 180,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              fontWeight: selectedFornecedorForSale?.id === row.id ? "bold" : "normal",
              color: selectedFornecedorForSale?.id === row.id ? COLORS.success : COLORS.textSecondary,
              fontSize: FONT_SIZES.tableCell,
            }}
          >
            {row.nome || "N/A"}
          </Typography>
          {selectedFornecedorForSale?.id === row.id && (
            <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 18 }} />
          )}
        </Box>
      ),
    },
    {
      id: "contato",
      label: "Contato",
      hideOnMobile: true,
    },
    {
      id: "creditoLoja",
      label: "Crédito na Loja",
      render: (row) => `R$ ${formatarValor(row.creditoLoja ?? row.valorCredito ?? 0)}`,
    },
    {
      id: "chavePix",
      label: "Chave Pix",
      hideOnMobile: true,
    },
    {
      id: "acoes",
      label: "Ações",
      width: 80,
      render: (row) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleViewFornecedor(row.id);
          }}
          sx={{ color: COLORS.actionBlue }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <PageLayout title="Vender para Fornecedor">
      <PageTitle title="Selecionar Fornecedor" />

      {/* Card do fornecedor selecionado */}
      {selectedFornecedorForSale && (
        <Card
          sx={{
            mb: 3,
            maxWidth: "1200px",
            mx: "auto",
            backgroundColor: COLORS.backgroundPaper,
            borderRadius: SPACING.cardBorderRadius,
            boxShadow: SHADOWS.card,
            border: `2px solid ${COLORS.success}`,
          }}
        >
          <CardContent sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: COLORS.primaryBlue, width: 44, height: 44 }}>
                  <PersonIcon sx={{ color: "#fff" }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                    {selectedFornecedorForSale.nome}
                  </Typography>
                  <Typography sx={{ fontSize: FONT_SIZES.bodySmall, color: COLORS.textMuted }}>
                    Crédito disponível: R$ {formatarValor(selectedFornecedorForSale.creditoLoja ?? selectedFornecedorForSale.valorCredito ?? 0)}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedFornecedorForSale(null)}
                sx={{
                  color: COLORS.textMuted,
                  borderColor: COLORS.borderMedium,
                  fontSize: FONT_SIZES.bodySmall,
                  "&:hover": {
                    borderColor: COLORS.textSecondary,
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Desselecionar
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Barra de busca */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar fornecedores"
          useAutocomplete
          options={searchOptions}
        />
      </Box>

      {/* Tabela de fornecedores */}
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
          sx={{
            mb: 2,
            fontWeight: 700,
            color: COLORS.textSecondary,
            fontSize: FONT_SIZES.sectionTitle,
          }}
        >
          Fornecedores disponíveis ({fornecedoresFiltrados.length})
        </Typography>

        <DataTable
          columns={columns}
          data={fornecedoresFiltrados}
          loading={loading}
          emptyMessage="Nenhum fornecedor encontrado"
          rowKeyExtractor={(row) => row.id}
          onRowClick={(row) => handleSelectFornecedorForSale(row)}
          maxHeight={{ xs: 350, sm: 450, md: 500 }}
        />
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Botão de finalizar */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleFinalizarCompra}
          disabled={!selectedFornecedorForSale}
          sx={{
            bgcolor: selectedFornecedorForSale ? COLORS.primaryPink : "#e0e0e0",
            color: selectedFornecedorForSale ? COLORS.textSecondary : COLORS.textMuted,
            px: { xs: 4, md: 6 },
            py: 1.5,
            fontSize: FONT_SIZES.button,
            fontWeight: "bold",
            borderRadius: SPACING.buttonBorderRadius,
            boxShadow: SHADOWS.button,
            textTransform: "none",
            "&:hover": {
              bgcolor: selectedFornecedorForSale ? COLORS.actionPinkHover : "#e0e0e0",
              transform: selectedFornecedorForSale ? "translateY(-2px)" : "none",
            },
            transition: "all 0.3s ease",
          }}
        >
          {selectedFornecedorForSale ? "Finalizar compra" : "Selecione um fornecedor"}
        </Button>

        <Typography sx={{ fontSize: FONT_SIZES.bodySmall, color: COLORS.textMuted }}>
          Fornecedor selecionado: {selectedFornecedorForSale ? "✓" : "✗"} | Itens no carrinho: {carrinhoItems.length}
        </Typography>
      </Box>

      {/* Modal de Visualização */}
      <Dialog
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: SPACING.modalBorderRadius,
            backgroundColor: COLORS.primaryPink,
            p: { xs: 2, md: 3 },
            boxShadow: SHADOWS.modal,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: FONT_SIZES.sectionTitle,
            color: COLORS.textSecondary,
            position: "relative",
            pb: 2,
          }}
        >
          Visualizar Fornecedor
          <IconButton
            onClick={() => setOpenViewModal(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: COLORS.textMuted,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: COLORS.primaryPink, borderRadius: 2, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Chip
              label={`ID: ${selectedFornecedor?.id || "Carregando..."}`}
              sx={{
                backgroundColor: COLORS.backgroundWhite,
                color: COLORS.textSecondary,
                fontWeight: "bold",
              }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Nome
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.nome || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: COLORS.backgroundWhite }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Data de Nascimento
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.dataNascimento || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: COLORS.backgroundWhite }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Contato
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.contato || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: COLORS.backgroundWhite }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Endereço
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.endereco || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: COLORS.backgroundWhite }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Chave Pix
              </Typography>
              <TextField
                fullWidth
                value={selectedFornecedor?.chavePix || ""}
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: COLORS.backgroundWhite }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Crédito na Loja
              </Typography>
              <TextField
                fullWidth
                value={
                  selectedFornecedor?.creditoLoja
                    ? `R$ ${parseFloat(selectedFornecedor.creditoLoja).toFixed(2).replace(".", ",")}`
                    : "R$ 0,00"
                }
                InputProps={{ readOnly: true }}
                variant="outlined"
                sx={{ backgroundColor: COLORS.backgroundWhite }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Contrato
              </Typography>
              {selectedFornecedor?.contratoUrl ? (
                <Button
                  onClick={handleDownloadContrato}
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                >
                  Visualizar Contrato
                </Button>
              ) : (
                <Typography>Contrato não disponível</Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Modal de Finalização */}
      <Dialog
        open={openFinalizarModal}
        keepMounted
        onClose={() => setOpenFinalizarModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: SPACING.modalBorderRadius,
            background: COLORS.backgroundPaper,
            boxShadow: SHADOWS.modal,
            overflow: "visible",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 2, pt: 4, position: "relative" }}>
          <IconButton
            onClick={() => setOpenFinalizarModal(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: COLORS.textMuted,
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                backgroundColor: COLORS.primaryBlue,
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: { xs: 30, md: 40 }, color: "white" }} />
            </Avatar>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: COLORS.textSecondary,
                textAlign: "center",
                fontSize: FONT_SIZES.sectionTitle,
              }}
            >
              Finalizar Venda
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, md: 4 }, pb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: FONT_SIZES.body,
                color: COLORS.textSecondary,
                minWidth: { xs: 100, sm: 160 },
              },
              "& .MuiTab-root.Mui-selected": { color: COLORS.primaryBlue },
              "& .MuiTabs-indicator": { backgroundColor: COLORS.primaryBlue },
            }}
          >
            <Tab label="Resumo e Total" />
            <Tab label="Fornecedor" />
          </Tabs>

          {/* Tab 0: Resumo e Total */}
          {tabValue === 0 && (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                    Ref: {orderRef || "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Data: {new Date().toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                  <Typography variant="subtitle2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                    Itens: {carrinhoItems.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qtd total: {carrinhoItems.reduce((s, it) => s + (Number(it.quantidade) || 1), 0)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2, maxHeight: 200, overflow: "auto" }}>
                {carrinhoItems.map((item, index) => {
                  const quantidade = Number(item.quantidade || 1);
                  const precoUnit = Number(item.preco || 0);
                  const subtotal = quantidade * precoUnit;
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        px: 1,
                        bgcolor: index % 2 === 0 ? COLORS.backgroundWhite : COLORS.backgroundPaper,
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: FONT_SIZES.bodySmall }}>
                          {item.descricao}
                        </Typography>
                      </Box>
                      <Box sx={{ width: { xs: 120, md: 160 }, textAlign: "right" }}>
                        <Typography variant="body2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                          {quantidade} × R$ {formatarValor(precoUnit)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: FONT_SIZES.bodySmall }}>
                          R$ {formatarValor(subtotal)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box sx={{ borderTop: `1px solid ${COLORS.borderLight}`, pt: 2, mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1" sx={{ fontSize: FONT_SIZES.body }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: FONT_SIZES.body }}>
                    R$ {formatarValor(totalVenda)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: FONT_SIZES.sectionTitle }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: FONT_SIZES.sectionTitle }}>
                    R$ {formatarValor(totalVenda)}
                  </Typography>
                </Box>

                {selectedFornecedorForSale && (
                  <Box sx={{ mt: 1, bgcolor: "#f3f6f4", p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                      <strong>Fornecedor:</strong> {selectedFornecedorForSale.nome}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                      Crédito antes: R$ {formatarValor(selectedFornecedorForSale.creditoLoja ?? selectedFornecedorForSale.valorCredito ?? 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                      Crédito após venda: R$ {formatarValor(calcularCreditoFinal())}
                    </Typography>

                    {/* Seção de pagamento se houver déficit */}
                    {calcularDeficit() > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: COLORS.recentItemBackground,
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: COLORS.actionBlue, fontSize: FONT_SIZES.bodySmall }}
                        >
                          Crédito insuficiente — completar com pagamento
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.actionBlue }}>
                          Déficit: R$ {formatarValor(calcularDeficit())}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            mt: 2,
                            alignItems: { xs: "stretch", sm: "center" },
                          }}
                        >
                          <TextField
                            label="Dinheiro"
                            type="number"
                            size="small"
                            value={paymentDinheiro}
                            onChange={(e) => setPaymentDinheiro(e.target.value)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Cartão"
                            type="number"
                            size="small"
                            value={paymentCartao}
                            onChange={(e) => setPaymentCartao(e.target.value)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            label="Pix"
                            type="number"
                            size="small"
                            value={paymentPix}
                            onChange={(e) => setPaymentPix(e.target.value)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            }}
                            sx={{ flex: 1 }}
                          />
                        </Box>

                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" sx={{ color: COLORS.actionBlue }}>
                            Total pagamento:
                          </Typography>
                          <Typography variant="body2" sx={{ color: COLORS.actionBlue }}>
                            R$ {formatarValor(pagamentoTotal())}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 1 }}>
                          {pagamentoTotal() < calcularDeficit() ? (
                            <Typography color="error" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                              A soma dos pagamentos é menor que o déficit. Complete os valores.
                            </Typography>
                          ) : (
                            <Typography sx={{ color: COLORS.info, fontSize: FONT_SIZES.bodySmall }}>
                              Pagamento suficiente para cobrir o déficit.
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: FONT_SIZES.bodySmall }}>
                Confirme os dados antes de finalizar a compra.
              </Typography>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confirmedReview}
                      onChange={(e) => setConfirmedReview(e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: FONT_SIZES.bodySmall }}>
                      Li e conferi os itens, valores e fornecedor selecionado
                    </Typography>
                  }
                />
              </Box>
            </Box>
          )}

          {/* Tab 1: Fornecedor */}
          {tabValue === 1 && selectedFornecedorForSale && (
            <Box sx={{ mb: 3, p: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: COLORS.success, fontSize: FONT_SIZES.sectionTitle }}
              >
                Fornecedor Selecionado
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                <strong>Nome:</strong> {selectedFornecedorForSale.nome}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                <strong>Contato:</strong> {selectedFornecedorForSale.contato || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                <strong>Crédito disponível:</strong> R$ {formatarValor(selectedFornecedorForSale.creditoLoja ?? selectedFornecedorForSale.valorCredito ?? 0)}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: FONT_SIZES.body }}>
                <strong>Chave Pix:</strong> {selectedFornecedorForSale.chavePix || "N/A"}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
            px: { xs: 2, md: 4 },
            pb: 4,
          }}
        >
          <Button
            onClick={() => setOpenFinalizarModal(false)}
            sx={{
              backgroundColor: COLORS.primaryPink,
              color: COLORS.textSecondary,
              fontWeight: "bold",
              fontSize: FONT_SIZES.button,
              borderRadius: SPACING.buttonBorderRadius,
              padding: { xs: "10px 24px", md: "12px 32px" },
              minWidth: { xs: "100px", md: "140px" },
              textTransform: "none",
              boxShadow: SHADOWS.button,
              "&:hover": {
                backgroundColor: COLORS.actionPinkHover,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handlePrintRecibo}
            startIcon={<PrintIcon />}
            sx={{
              backgroundColor: COLORS.info,
              color: "#fff",
              fontWeight: "bold",
              fontSize: FONT_SIZES.bodySmall,
              borderRadius: SPACING.buttonBorderRadius,
              padding: { xs: "8px 16px", md: "10px 20px" },
              minWidth: { xs: "100px", md: "120px" },
              textTransform: "none",
            }}
          >
            Imprimir Recibo
          </Button>

          <Button
            onClick={handleConfirmarCompra}
            disabled={!confirmedReview || isLoading}
            sx={{
              backgroundColor: !confirmedReview || isLoading ? "#9e9e9e" : COLORS.success,
              color: "#fff",
              fontWeight: "bold",
              fontSize: FONT_SIZES.button,
              borderRadius: SPACING.buttonBorderRadius,
              padding: { xs: "10px 24px", md: "12px 32px" },
              minWidth: { xs: "100px", md: "140px" },
              textTransform: "none",
              boxShadow: "0px 4px 12px rgba(76, 175, 80, 0.4)",
              "&:hover": {
                backgroundColor: !confirmedReview || isLoading ? "#9e9e9e" : "#45a049",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Confirmar Compra"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificações */}
      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
}
