"use client";

import { useState, useEffect, useMemo, forwardRef } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Grid,
  Divider,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";

// Componentes padronizados
import {
  PageLayout,
  PageTitle,
  SearchBar,
  SnackbarAlert,
} from "../../components/ui";

// Hooks padronizados
import { useSnackbar } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING, FONT_SIZES, TABLE_CELL_PADDING } from "../../constants";

// API
import api from "../../utils/api";

// Transição personalizada para o modal
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VendasPage = () => {
  const [vendas, setVendas] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [detailsModal, setDetailsModal] = useState({ open: false, venda: null });
  const [tabValue, setTabValue] = useState(0);
  const [pageTabValue, setPageTabValue] = useState(0);

  const { snackbar, showError, closeSnackbar } = useSnackbar();

  // Ordenar vendas por data (mais recente primeiro)
  const ordenarVendasPorData = (vendas) => {
    return vendas.sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda));
  };

  // Buscar vendas
  useEffect(() => {
    const fetchVendas = async () => {
      setLoading(true);
      try {
        const response = await api.get("/vendas");
        const vendasOrdenadas = ordenarVendasPorData(response.data);
        setVendas(vendasOrdenadas);
      } catch (error) {
        showError("Erro ao carregar vendas");
      } finally {
        setLoading(false);
      }
    };
    fetchVendas();
  }, []);

  // Formatadores
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);
  };

  // Verificar se venda é recente (últimas 3)
  const isVendaRecente = (index) => index < 3;

  // Handlers do modal
  const handleDetailsClick = (venda) => setDetailsModal({ open: true, venda });
  const handleCloseDetailsModal = () => {
    setDetailsModal({ open: false, venda: null });
    setTabValue(0);
  };

  // Handlers de paginação
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers de tabs
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handlePageTabChange = (event, newValue) => setPageTabValue(newValue);

  // Obter fornecedores dos itens
  const getFornecedoresDosItens = (itens) => {
    const fornecedoresMap = new Map();
    itens.forEach((item) => {
      if (item.produto?.lote?.fornecedora) {
        const fornecedora = item.produto.lote.fornecedora;
        if (!fornecedoresMap.has(fornecedora.id)) {
          fornecedoresMap.set(fornecedora.id, { ...fornecedora, produtos: [] });
        }
        fornecedoresMap.get(fornecedora.id).produtos.push({
          produto: item.produto,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: item.subtotal,
        });
      }
    });
    return Array.from(fornecedoresMap.values());
  };

  // Filtro de busca
  const filteredVendas = useMemo(() => {
    if (!search?.trim()) return vendas;
    const searchLower = search.toLowerCase();
    const idMatch = searchLower.match(/^#(\d+)/);
    const searchId = idMatch ? idMatch[1] : searchLower;

    return vendas.filter((venda) => {
      const idString = venda.id.toString();
      const tipoString = venda.tipoVenda?.toLowerCase() || "";
      const fornecedoraNome = venda.fornecedora?.nome?.toLowerCase() || "";

      if (idMatch || (!isNaN(searchId) && searchId.trim() !== "")) {
        if (idString.includes(searchId)) return true;
      }

      return (
        idString.includes(searchLower) ||
        tipoString.includes(searchLower) ||
        fornecedoraNome.includes(searchLower) ||
        getFornecedoresDosItens(venda.itens || []).some((f) =>
          f.nome.toLowerCase().includes(searchLower)
        ) ||
        (venda.itens || []).some((item) =>
          item.produto?.descricao?.toLowerCase().includes(searchLower)
        )
      );
    });
  }, [vendas, search]);

  // Opções de busca
  const searchOptions = useMemo(() => {
    return [
      ...new Set(
        vendas.flatMap((venda) => [
          `#${venda.id}`,
          venda.fornecedora?.nome,
          ...(venda.itens || []).map((item) => item.produto?.descricao),
        ]).filter(Boolean)
      ),
    ];
  }, [vendas]);

  // Estilos de célula da tabela (responsivos)
  const headerCellStyle = {
    fontSize: FONT_SIZES.tableHeader,
    textAlign: "center",
    backgroundColor: COLORS.primaryPink,
    borderRight: `2px solid ${COLORS.backgroundPaper}`,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    padding: TABLE_CELL_PADDING.default,
    whiteSpace: 'nowrap',
  };

  const bodyCellStyle = {
    fontSize: FONT_SIZES.tableCell,
    padding: TABLE_CELL_PADDING.default,
    textAlign: "center",
  };

  return (
    <PageLayout title="Vendas">
      <PageTitle title="Histórico de Vendas" />

      {/* Abas principais */}
      <Box sx={{ mb: { xs: 2, md: 3 }, display: "flex", justifyContent: "center" }}>
        <Tabs
          value={pageTabValue}
          onChange={handlePageTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
              fontSize: FONT_SIZES.button,
              color: COLORS.textSecondary,
              minWidth: { xs: 120, sm: 160, md: 200 },
              backgroundColor: "white",
              margin: "0 3px",
              borderRadius: "10px 10px 0 0",
              padding: { xs: '8px 12px', sm: '12px 16px' },
            },
            "& .MuiTab-root.Mui-selected": {
              color: COLORS.actionBlue,
              backgroundColor: COLORS.backgroundPaper,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: COLORS.actionBlue,
              height: 3,
            },
          }}
        >
          <Tab label="Vendas" />
          <Tab label="Relatório Fornecedores" />
        </Tabs>
      </Box>

      {/* Barra de pesquisa */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: { xs: 2, md: 3 } }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar vendas..."
          useAutocomplete
          options={searchOptions}
        />
      </Box>

      {/* Aba de Vendas */}
      {pageTabValue === 0 && (
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
            sx={{ mb: 2, fontWeight: 700, color: COLORS.textSecondary, fontSize: FONT_SIZES.sectionTitle }}
          >
            Vendas realizadas ({filteredVendas.length})
          </Typography>

          <TableContainer sx={{ maxHeight: { xs: 400, sm: 500, md: 600 }, borderRadius: "10px", overflow: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellStyle}>Itens</TableCell>
                  <TableCell sx={{ ...headerCellStyle, display: { xs: 'none', sm: 'table-cell' } }}>Data/Hora</TableCell>
                  <TableCell sx={{ ...headerCellStyle, display: { xs: 'none', md: 'table-cell' } }}>Tipo</TableCell>
                  <TableCell sx={headerCellStyle}>Total</TableCell>
                  <TableCell sx={{ ...headerCellStyle, borderRight: "none" }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: { xs: 2, md: 4 } }}>
                      <Typography sx={{ fontSize: FONT_SIZES.body }}>Carregando...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredVendas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: { xs: 2, md: 4 } }}>
                      <Typography sx={{ color: COLORS.textMuted, fontSize: FONT_SIZES.body }}>
                        Nenhuma venda encontrada
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendas
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((venda, index) => {
                      const globalIndex = page * rowsPerPage + index;
                      const isRecente = isVendaRecente(globalIndex);
                      return (
                        <TableRow
                          key={venda.id}
                          sx={{
                            backgroundColor: isRecente ? COLORS.recentItemBackground : "inherit",
                            "&:hover": {
                              backgroundColor: isRecente ? COLORS.recentItemHover : "#f5f5f5",
                            },
                          }}
                        >
                          <TableCell sx={{ ...bodyCellStyle, fontWeight: isRecente ? "bold" : "normal" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                              {venda.itens?.slice(0, 2).map((item, idx) => (
                                <Typography key={idx} variant="body2" sx={{ fontSize: FONT_SIZES.tableCellSmall }}>
                                  {item.produto?.descricao || "Produto"}
                                </Typography>
                              ))}
                              {venda.itens?.length > 2 && (
                                <Typography variant="body2" sx={{ fontSize: { xs: '9px', sm: '10px' }, color: COLORS.textMuted }}>
                                  +{venda.itens.length - 2} mais
                                </Typography>
                              )}
                              {isRecente && (
                                <Chip
                                  label="Nova"
                                  size="small"
                                  sx={{
                                    backgroundColor: COLORS.success,
                                    color: "white",
                                    fontSize: FONT_SIZES.chip,
                                    height: { xs: '18px', sm: '20px' }
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ ...bodyCellStyle, fontWeight: isRecente ? "bold" : "normal", display: { xs: 'none', sm: 'table-cell' } }}>
                            {formatarData(venda.dataVenda)}
                          </TableCell>
                          <TableCell sx={{ ...bodyCellStyle, display: { xs: 'none', md: 'table-cell' } }}>
                            <Chip
                              label={venda.tipoVenda === "VENDA_SIMPLES" ? "Simples" : "Fornecedor"}
                              color={venda.tipoVenda === "VENDA_SIMPLES" ? "primary" : "secondary"}
                              size="small"
                              sx={{ fontSize: FONT_SIZES.chip }}
                            />
                          </TableCell>
                          <TableCell sx={{ ...bodyCellStyle, fontWeight: "bold", color: COLORS.success }}>
                            {formatarValor(venda.total)}
                          </TableCell>
                          <TableCell sx={{ ...bodyCellStyle, minWidth: { xs: '50px', sm: '80px' } }}>
                            <IconButton
                              onClick={() => handleDetailsClick(venda)}
                              sx={{ color: COLORS.actionBlue, padding: { xs: '4px', sm: '8px' } }}
                              size="small"
                            >
                              <VisibilityIcon sx={{ fontSize: { xs: 18, sm: 22, md: 24 } }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredVendas.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: FONT_SIZES.bodySmall,
              },
              '& .MuiTablePagination-select': {
                fontSize: FONT_SIZES.bodySmall,
              },
            }}
          />
        </Card>
      )}

      {/* Aba de Relatório Fornecedores */}
      {pageTabValue === 1 && (
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
            sx={{ mb: 2, fontWeight: 700, color: COLORS.textSecondary, fontSize: FONT_SIZES.sectionTitle }}
          >
            Relatório por Fornecedores
          </Typography>

          <TableContainer sx={{ maxHeight: { xs: 400, sm: 500, md: 600 }, borderRadius: "10px", overflow: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellStyle}>Fornecedor</TableCell>
                  <TableCell sx={{ ...headerCellStyle, display: { xs: 'none', sm: 'table-cell' } }}>Valor Forn.</TableCell>
                  <TableCell sx={{ ...headerCellStyle, display: { xs: 'none', md: 'table-cell' } }}>Valor Brechó</TableCell>
                  <TableCell sx={headerCellStyle}>Total</TableCell>
                  <TableCell sx={{ ...headerCellStyle, borderRight: "none" }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  const vendasComFornecedor = [];
                  vendas.forEach((venda) => {
                    if (venda.fornecedora) {
                      vendasComFornecedor.push({
                        fornecedor: venda.fornecedora.nome,
                        valorFornecedor: venda.valorFornecedora || 0,
                        valorBrecho: venda.valorBrecho || 0,
                        total: venda.total || 0,
                        venda,
                      });
                    }
                    const fornecedores = getFornecedoresDosItens(venda.itens || []);
                    fornecedores.forEach((fornecedora) => {
                      const valorProdutos = fornecedora.produtos.reduce((sum, p) => sum + (p.subtotal || 0), 0);
                      vendasComFornecedor.push({
                        fornecedor: fornecedora.nome,
                        valorFornecedor: valorProdutos * 0.7,
                        valorBrecho: valorProdutos * 0.3,
                        total: valorProdutos,
                        venda,
                      });
                    });
                  });

                  if (vendasComFornecedor.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: "center", py: { xs: 2, md: 4 } }}>
                          <Typography sx={{ color: COLORS.textMuted, fontSize: FONT_SIZES.body }}>
                            Nenhuma venda com fornecedor encontrada
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return vendasComFornecedor.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={bodyCellStyle}>{item.fornecedor}</TableCell>
                      <TableCell sx={{ ...bodyCellStyle, fontWeight: "bold", color: COLORS.info, display: { xs: 'none', sm: 'table-cell' } }}>
                        {formatarValor(item.valorFornecedor)}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, display: { xs: 'none', md: 'table-cell' } }}>
                        {formatarValor(item.valorBrecho)}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, fontWeight: "bold", color: COLORS.success }}>
                        {formatarValor(item.total)}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellStyle, minWidth: { xs: '50px', sm: '80px' } }}>
                        <IconButton
                          onClick={() => handleDetailsClick(item.venda)}
                          sx={{ color: COLORS.actionBlue, padding: { xs: '4px', sm: '8px' } }}
                          size="small"
                        >
                          <VisibilityIcon sx={{ fontSize: { xs: 18, sm: 22, md: 24 } }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Modal de Detalhes */}
      <Dialog
        open={detailsModal.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: '12px', md: '20px' },
            background: COLORS.backgroundPaper,
            boxShadow: SHADOWS.card,
            overflow: "visible",
            maxHeight: "90vh",
            margin: { xs: '16px', sm: '32px' },
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 2, pt: { xs: 2, md: 4 }, position: "relative" }}>
          <IconButton
            onClick={handleCloseDetailsModal}
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: { xs: 1, md: 2 } }}>
            <Avatar
              sx={{
                width: { xs: 50, sm: 60, md: 80 },
                height: { xs: 50, sm: 60, md: 80 },
                backgroundColor: COLORS.primaryBlue,
                boxShadow: "0px 8px 20px rgba(0, 80, 158, 0.3)",
              }}
            >
              <ReceiptIcon sx={{ fontSize: { xs: 24, sm: 30, md: 40 }, color: "white" }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.sectionTitle }}>
              Detalhes da Venda #{detailsModal.venda?.id}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: { xs: 2, md: 3 },
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: FONT_SIZES.bodySmall,
                color: COLORS.textSecondary,
                minWidth: { xs: 80, sm: 120 },
                padding: { xs: '6px 8px', sm: '12px 16px' },
              },
              "& .MuiTab-root.Mui-selected": { color: COLORS.primaryBlue },
              "& .MuiTabs-indicator": { backgroundColor: COLORS.primaryBlue },
            }}
          >
            <Tab label="Geral" />
            <Tab label="Itens" />
            <Tab label="Fornecedores" />
          </Tabs>

          {/* Tab 0: Informações Gerais */}
          {tabValue === 0 && detailsModal.venda && (
            <Box>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink }}>
                    <Typography variant="h6" sx={{ mb: { xs: 1, md: 2 }, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.cardTitle }}>
                      Dados da Venda
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                      <strong>ID:</strong> #{detailsModal.venda.id}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                      <strong>Data/Hora:</strong> {formatarData(detailsModal.venda.dataVenda)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                      <strong>Tipo:</strong>{" "}
                      <Chip
                        label={detailsModal.venda.tipoVenda === "VENDA_SIMPLES" ? "Venda Simples" : "Venda Fornecedor"}
                        color={detailsModal.venda.tipoVenda === "VENDA_SIMPLES" ? "primary" : "secondary"}
                        size="small"
                        sx={{ fontSize: FONT_SIZES.chip }}
                      />
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink }}>
                    <Typography variant="h6" sx={{ mb: { xs: 1, md: 2 }, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.cardTitle }}>
                      Valores
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body, fontWeight: "bold", color: COLORS.success }}>
                      <strong>Total:</strong> {formatarValor(detailsModal.venda.total)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                      <strong>Valor Brechó:</strong> {formatarValor(detailsModal.venda.valorBrecho)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                      <strong>Valor Fornecedora:</strong> {formatarValor(detailsModal.venda.valorFornecedora)}
                    </Typography>
                  </Paper>
                </Grid>
                {detailsModal.venda.fornecedora && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: { xs: 1.5, md: 2 }, backgroundColor: COLORS.primaryPink }}>
                      <Typography variant="h6" sx={{ mb: { xs: 1, md: 2 }, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.cardTitle }}>
                        Fornecedora Principal
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                        <strong>Nome:</strong> {detailsModal.venda.fornecedora.nome}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                        <strong>Contato:</strong> {detailsModal.venda.fornecedora.contato}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1, fontSize: FONT_SIZES.body }}>
                        <strong>Chave Pix:</strong> {detailsModal.venda.fornecedora.chavePix}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Tab 1: Itens Vendidos */}
          {tabValue === 1 && detailsModal.venda && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.cardTitle }}>
                Produtos Vendidos ({detailsModal.venda.itens?.length || 0} itens)
              </Typography>
              {detailsModal.venda.itens?.map((item, index) => (
                <Paper key={index} sx={{ p: { xs: 1.5, md: 2 }, mb: 2, backgroundColor: COLORS.primaryPink }}>
                  <Grid container spacing={{ xs: 1, md: 2 }} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 0.5, fontSize: FONT_SIZES.body }}>
                        {item.produto?.descricao || "Produto sem descrição"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: COLORS.textMuted, fontSize: FONT_SIZES.bodySmall }}>
                        {item.produto?.marca || "N/A"} | {item.produto?.tamanho || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="body2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                        <strong>Qtd:</strong> {item.quantidade}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: FONT_SIZES.bodySmall }}>
                        <strong>Unit:</strong> {formatarValor(item.precoUnitario)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography sx={{ fontWeight: "bold", color: COLORS.success, textAlign: { xs: 'left', sm: 'right' }, fontSize: FONT_SIZES.body }}>
                        {formatarValor(item.subtotal)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}

          {/* Tab 2: Fornecedores dos Produtos */}
          {tabValue === 2 && detailsModal.venda && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.cardTitle }}>
                Fornecedores dos Produtos
              </Typography>
              {(() => {
                const fornecedores = getFornecedoresDosItens(detailsModal.venda.itens || []);
                if (fornecedores.length === 0) {
                  return (
                    <Paper sx={{ p: { xs: 2, md: 3 }, backgroundColor: COLORS.primaryPink, textAlign: "center" }}>
                      <Typography variant="body1" sx={{ color: COLORS.textMuted, fontSize: FONT_SIZES.body }}>
                        Nenhum fornecedor associado.
                      </Typography>
                    </Paper>
                  );
                }
                return fornecedores.map((fornecedora) => (
                  <Paper key={fornecedora.id} sx={{ p: { xs: 2, md: 3 }, mb: 2, backgroundColor: COLORS.primaryPink }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ backgroundColor: COLORS.actionBlue, mr: 2, width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}>
                        <PersonIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS.textSecondary, fontSize: FONT_SIZES.body }}>
                          {fornecedora.nome}
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLORS.textMuted, fontSize: FONT_SIZES.bodySmall }}>
                          {fornecedora.contato} | {fornecedora.chavePix}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    {fornecedora.produtos.map((produtoInfo, prodIndex) => (
                      <Box key={prodIndex} sx={{ mb: 1, p: 1 }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={6}>
                            <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: FONT_SIZES.bodySmall }}>
                              {produtoInfo.produto.descricao}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" sx={{ fontSize: FONT_SIZES.bodySmall }}>Qtd: {produtoInfo.quantidade}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: COLORS.success, fontSize: FONT_SIZES.bodySmall }}>
                              {formatarValor(produtoInfo.subtotal)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                    <Box sx={{ mt: 2, p: 1, borderTop: `1px solid ${COLORS.borderLight}` }}>
                      <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "right", fontSize: FONT_SIZES.body }}>
                        Total: {formatarValor(fornecedora.produtos.reduce((sum, p) => sum + (p.subtotal || 0), 0))}
                      </Typography>
                    </Box>
                  </Paper>
                ));
              })()}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2, px: { xs: 2, md: 4 }, pb: { xs: 2, md: 4 } }}>
          <Button
            onClick={handleCloseDetailsModal}
            sx={{
              backgroundColor: COLORS.primaryPink,
              color: COLORS.textSecondary,
              fontWeight: "bold",
              fontSize: FONT_SIZES.button,
              borderRadius: SPACING.buttonBorderRadius,
              padding: { xs: '8px 20px', md: '12px 32px' },
              minWidth: { xs: '100px', md: '120px' },
              textTransform: "none",
              boxShadow: SHADOWS.button,
              "&:hover": {
                backgroundColor: COLORS.actionPinkHover,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
};

export default VendasPage;
