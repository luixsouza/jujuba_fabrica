"use client";

import { useState, useEffect } from "react";
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
  Button,
  CircularProgress,
  Grid,
  Paper,
  Chip,
  Avatar,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams, useRouter } from "next/navigation";

// Componentes padronizados
import { PageLayout, PageTitle, SnackbarAlert } from "../../components/ui";

// Hooks padronizados
import { useSnackbar } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING, FONT_SIZES, TABLE_CELL_PADDING } from "../../constants";

// API
import { getLoteById } from "../api/lotes";

export default function VisualizarLotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loteInfo, setLoteInfo] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { snackbar, showError, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchLoteDetails = async () => {
      const id = searchParams.get("id");
      if (!id) {
        showError("ID do lote não especificado");
        return;
      }

      try {
        setLoading(true);
        const loteData = await getLoteById(id);

        if (loteData) {
          const valorTotal = calcularValorTotal(loteData.produtos || []);

          setLoteInfo({
            id: loteData.id,
            numero: `L${loteData.id}`,
            data: new Date(loteData.dataCriacao).toLocaleDateString("pt-BR"),
            fornecedora: loteData.fornecedora?.nome || "Fornecedora não especificada",
            totalProdutos: loteData.totalProdutos || (loteData.produtos ? loteData.produtos.length : 0),
            valorTotal: valorTotal,
            status: loteData.status || "ATIVO",
          });

          if (loteData.produtos && Array.isArray(loteData.produtos)) {
            setProdutos(loteData.produtos);
          } else {
            setProdutos([]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do lote:", error);
        showError("Não foi possível carregar os detalhes do lote.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoteDetails();
  }, [searchParams]);

  const calcularValorTotal = (produtos) => {
    return produtos.reduce(
      (total, produto) => total + produto.preco * (produto.quantidade != null ? produto.quantidade : 1),
      0
    );
  };

  const handleEditLote = () => {
    const id = searchParams.get("id");
    if (id) {
      router.push(`/lotes/editar_lote?id=${id}`);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  // Estilos de célula da tabela
  const headerCellStyle = {
    fontSize: FONT_SIZES.tableHeader,
    textAlign: "center",
    backgroundColor: COLORS.primaryPink,
    borderRight: `2px solid ${COLORS.backgroundPaper}`,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    padding: TABLE_CELL_PADDING.default,
    whiteSpace: "nowrap",
  };

  const bodyCellStyle = {
    fontSize: FONT_SIZES.tableCell,
    padding: TABLE_CELL_PADDING.default,
    textAlign: "center",
  };

  // Estado de carregamento
  if (loading) {
    return (
      <PageLayout title="Visualizar Lote">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: 4,
              backgroundColor: COLORS.backgroundWhite,
              borderRadius: SPACING.cardBorderRadius,
              boxShadow: SHADOWS.card,
            }}
          >
            <CircularProgress size={60} sx={{ color: COLORS.primaryPink }} />
            <Typography variant="h6" sx={{ color: COLORS.textSecondary, fontWeight: "500" }}>
              Carregando detalhes do lote...
            </Typography>
          </Box>
        </Box>
      </PageLayout>
    );
  }

  // Estado sem lote
  if (!loteInfo) {
    return (
      <PageLayout title="Visualizar Lote">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Paper
            sx={{
              padding: 4,
              borderRadius: SPACING.cardBorderRadius,
              textAlign: "center",
              backgroundColor: COLORS.primaryPink,
              boxShadow: SHADOWS.card,
            }}
          >
            <Typography variant="h6" sx={{ color: COLORS.textSecondary, fontWeight: "bold" }}>
              Lote não encontrado
            </Typography>
          </Paper>
        </Box>
        <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Visualizar Lote">
      <PageTitle
        title="Visualizar Lote"
        subtitle={`Detalhes do lote ${loteInfo.numero}`}
      />

      {/* Card de Informações do Lote */}
      <Card
        sx={{
          padding: SPACING.cardPadding,
          boxShadow: SHADOWS.card,
          borderRadius: SPACING.cardBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
          border: `2px solid ${COLORS.borderMedium}`,
          mb: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
          <Avatar
            sx={{
              width: { xs: 50, sm: 60, md: 80 },
              height: { xs: 50, sm: 60, md: 80 },
              backgroundColor: COLORS.primaryPink,
              margin: "0 auto 16px",
              boxShadow: "0px 8px 20px rgba(250, 173, 221, 0.3)",
            }}
          >
            <InventoryIcon sx={{ fontSize: { xs: 24, sm: 30, md: 40 }, color: COLORS.textSecondary }} />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.sectionTitle }}>
            Informações do Lote {loteInfo.numero}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Número do Lote */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink, borderRadius: "15px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Avatar sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: 36, height: 36 }}>
                  <InventoryIcon sx={{ color: COLORS.textSecondary, fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                  Número
                </Typography>
              </Box>
              <Typography sx={{ fontSize: FONT_SIZES.sectionTitle, fontWeight: "bold", color: COLORS.textSecondary }}>
                {loteInfo.numero}
              </Typography>
            </Paper>
          </Grid>

          {/* Data de Criação */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink, borderRadius: "15px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Avatar sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: 36, height: 36 }}>
                  <CalendarTodayIcon sx={{ color: COLORS.textSecondary, fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                  Data de Criação
                </Typography>
              </Box>
              <Typography sx={{ fontSize: FONT_SIZES.sectionTitle, fontWeight: "bold", color: COLORS.textSecondary }}>
                {loteInfo.data}
              </Typography>
            </Paper>
          </Grid>

          {/* Fornecedora */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink, borderRadius: "15px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Avatar sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: 36, height: 36 }}>
                  <BusinessIcon sx={{ color: COLORS.textSecondary, fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                  Fornecedora
                </Typography>
              </Box>
              <Typography sx={{ fontSize: FONT_SIZES.sectionTitle, fontWeight: "bold", color: COLORS.textSecondary }}>
                {loteInfo.fornecedora}
              </Typography>
            </Paper>
          </Grid>

          {/* Total de Produtos */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink, borderRadius: "15px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Avatar sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: 36, height: 36 }}>
                  <InventoryIcon sx={{ color: COLORS.textSecondary, fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                  Total de Produtos
                </Typography>
              </Box>
              <Typography sx={{ fontSize: FONT_SIZES.sectionTitle, fontWeight: "bold", color: COLORS.textSecondary }}>
                {loteInfo.totalProdutos}
              </Typography>
            </Paper>
          </Grid>

          {/* Valor Total */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink, borderRadius: "15px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Avatar sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: 36, height: 36 }}>
                  <AttachMoneyIcon sx={{ color: COLORS.success, fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                  Valor Total
                </Typography>
              </Box>
              <Typography sx={{ fontSize: FONT_SIZES.sectionTitle, fontWeight: "bold", color: COLORS.success }}>
                {formatarValor(loteInfo.valorTotal)}
              </Typography>
            </Paper>
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink, borderRadius: "15px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Avatar sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: 36, height: 36 }}>
                  <CheckCircleIcon sx={{ color: COLORS.info, fontSize: 18 }} />
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                  Status
                </Typography>
              </Box>
              <Chip
                label={loteInfo.status}
                sx={{
                  backgroundColor: COLORS.success,
                  color: "white",
                  fontWeight: "bold",
                  fontSize: FONT_SIZES.chip,
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Card>

      {/* Tabela de Produtos */}
      <Card
        sx={{
          padding: SPACING.cardPadding,
          boxShadow: SHADOWS.card,
          borderRadius: SPACING.cardBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
          border: `2px solid ${COLORS.borderMedium}`,
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 700, color: COLORS.textSecondary, fontSize: FONT_SIZES.sectionTitle }}
        >
          Produtos do Lote ({produtos.length})
        </Typography>

        <TableContainer sx={{ maxHeight: { xs: 400, sm: 500, md: 600 }, borderRadius: "10px", overflow: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellStyle}>ID</TableCell>
                <TableCell sx={headerCellStyle}>Descrição</TableCell>
                <TableCell sx={{ ...headerCellStyle, display: { xs: "none", sm: "table-cell" } }}>Marca</TableCell>
                <TableCell sx={{ ...headerCellStyle, display: { xs: "none", md: "table-cell" } }}>Tamanho</TableCell>
                <TableCell sx={{ ...headerCellStyle, display: { xs: "none", lg: "table-cell" } }}>Estado</TableCell>
                <TableCell sx={headerCellStyle}>Qtd</TableCell>
                <TableCell sx={headerCellStyle}>Preço</TableCell>
                <TableCell sx={{ ...headerCellStyle, borderRight: "none" }}>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.length > 0 ? (
                produtos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((produto, index) => (
                    <TableRow
                      key={produto.id || index}
                      sx={{
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        "&:nth-of-type(even)": { backgroundColor: "rgba(245, 245, 245, 0.5)" },
                      }}
                    >
                      <TableCell sx={{ ...bodyCellStyle, fontWeight: "bold", color: COLORS.textMuted }}>
                        {produto.id}
                      </TableCell>
                      <TableCell sx={bodyCellStyle}>
                        {produto.descricao || produto.nome || "Sem descrição"}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, display: { xs: "none", sm: "table-cell" } }}>
                        {produto.marca || "-"}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, display: { xs: "none", md: "table-cell" } }}>
                        {produto.tamanho || "-"}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, display: { xs: "none", lg: "table-cell" } }}>
                        <Chip
                          label={produto.estadoConservacao || "-"}
                          size="small"
                          sx={{ backgroundColor: COLORS.recentItemBackground, color: COLORS.info, fontWeight: "500", fontSize: FONT_SIZES.chip }}
                        />
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, fontWeight: "bold" }}>
                        {produto.quantidade || 1}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, color: COLORS.success, fontWeight: "500" }}>
                        {formatarValor(produto.preco)}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, fontWeight: "bold", color: COLORS.success }}>
                        {formatarValor((produto.preco || 0) * (produto.quantidade || 1))}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <InventoryIcon sx={{ fontSize: 48, color: COLORS.borderLight }} />
                      <Typography sx={{ color: COLORS.textMuted, fontSize: FONT_SIZES.body }}>
                        Nenhum produto encontrado neste lote
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {produtos.length > 0 && (
          <TablePagination
            component="div"
            count={produtos.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: FONT_SIZES.bodySmall,
              },
              "& .MuiTablePagination-select": {
                fontSize: FONT_SIZES.bodySmall,
              },
            }}
          />
        )}
      </Card>

      {/* Botão de Editar */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Button
          onClick={handleEditLote}
          variant="contained"
          startIcon={<EditIcon />}
          sx={{
            backgroundColor: COLORS.primaryPink,
            color: COLORS.textSecondary,
            fontWeight: "bold",
            fontSize: FONT_SIZES.button,
            borderRadius: SPACING.buttonBorderRadius,
            padding: { xs: "10px 24px", md: "14px 40px" },
            minWidth: { xs: "160px", md: "200px" },
            textTransform: "none",
            boxShadow: SHADOWS.button,
            "&:hover": {
              backgroundColor: COLORS.actionPinkHover,
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Editar Lote
        </Button>
      </Box>

      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
}
