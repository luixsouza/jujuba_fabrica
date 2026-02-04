"use client";

import { useState, useEffect, useMemo } from "react";
import { Box, Card, Button, Avatar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

// Componentes padronizados
import {
  PageLayout,
  PageTitle,
  SearchBar,
  DataTable,
  ActionButtons,
  ConfirmDialog,
  SnackbarAlert,
} from "../../components/ui";

// Hooks padronizados
import { useSnackbar } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING } from "../../constants";

// API
import { getAllLotes, deletarLote } from "../api/lotes";

const LotePage = () => {
  const [lotes, setLotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, lote: null });

  const router = useRouter();
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();

  // Buscar lotes
  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    setLoading(true);
    try {
      const response = await getAllLotes();
      if (response && Array.isArray(response)) {
        const lotesFormatados = response.map((lote) => ({
          id: lote.id,
          numero: `L${lote.id}`,
          data: lote.dataCriacao || new Date().toISOString(),
          fornecedora: lote.fornecedora?.nome || "Fornecedora não especificada",
        }));
        setLotes(lotesFormatados);
      } else {
        setLotes([]);
      }
    } catch (error) {
      showError("Erro ao carregar lotes");
    } finally {
      setLoading(false);
    }
  };

  // Deletar lote
  const handleConfirmDelete = async () => {
    if (!deleteModal.lote) return;
    try {
      setLoading(true);
      await deletarLote(deleteModal.lote.id);
      setLotes((prev) => prev.filter((l) => l.id !== deleteModal.lote.id));
      showSuccess("Lote excluído com sucesso");
    } catch (error) {
      showError("Falha ao excluir lote");
    } finally {
      setLoading(false);
      setDeleteModal({ open: false, lote: null });
    }
  };

  // Navegações
  const handleNavigateToRegister = () => router.push("/lotes/cadastrar_lote");
  const handleView = (lote) => router.push(`/lotes/visualizar_lote?id=${lote.id}`);
  const handleEdit = (lote) => router.push(`/lotes/editar_lote?id=${lote.id}`);

  // Modal de exclusão
  const handleDeleteClick = (lote) => setDeleteModal({ open: true, lote });
  const handleCloseDeleteModal = () => setDeleteModal({ open: false, lote: null });

  // Filtro de busca
  const lotesFiltrados = useMemo(() => {
    if (!search?.trim()) return lotes;
    const s = search.toLowerCase();
    return lotes.filter(
      (lote) =>
        lote.numero.toLowerCase().includes(s) ||
        lote.fornecedora.toLowerCase().includes(s)
    );
  }, [lotes, search]);

  // Opções de busca
  const searchOptions = useMemo(() => {
    return [...new Set(
      lotes.flatMap((lote) => [lote.numero, lote.fornecedora]).filter(Boolean)
    )];
  }, [lotes]);

  // Configuração das colunas da tabela
  const columns = [
    { id: "numero", label: "Número do Lote" },
    {
      id: "data",
      label: "Data de Criação",
      render: (row) => new Date(row.data).toLocaleDateString("pt-BR"),
    },
    { id: "fornecedora", label: "Fornecedora" },
    {
      id: "acoes",
      label: "Ações",
      width: 150,
      render: (row) => (
        <ActionButtons
          onView={() => handleView(row)}
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDeleteClick(row)}
        />
      ),
    },
  ];

  // Conteúdo do modal de confirmação
  const deleteModalContent = deleteModal.lote && (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: "16px 24px",
        borderRadius: "15px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        border: `2px solid rgba(154, 228, 255, 0.5)`,
      }}
    >
      <Avatar sx={{ backgroundColor: COLORS.primaryBlue, width: 50, height: 50 }}>
        <Typography sx={{ fontWeight: "bold", color: COLORS.textSecondary }}>L</Typography>
      </Avatar>
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS.textSecondary, mb: 0.5 }}>
          Lote {deleteModal.lote.numero}
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.textMuted, fontSize: "14px" }}>
          ID: {deleteModal.lote.id}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <PageLayout title="Lotes">
      <PageTitle title="Lotes" />

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Pesquisar lotes..."
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
          Lotes cadastrados ({lotesFiltrados.length})
        </Typography>

        <DataTable
          columns={columns}
          data={lotesFiltrados}
          loading={loading}
          emptyMessage="Nenhum lote encontrado"
          rowKeyExtractor={(row) => row.id}
        />
      </Card>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          onClick={handleNavigateToRegister}
          sx={{
            backgroundColor: COLORS.primaryPink,
            color: COLORS.textSecondary,
            boxShadow: SHADOWS.button,
            fontWeight: "bold",
            fontSize: "17px",
            borderRadius: SPACING.buttonBorderRadius,
            padding: "12px 40px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: COLORS.actionPinkHover,
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Cadastrar Lote
        </Button>
      </Box>

      <ConfirmDialog
        open={deleteModal.open}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este lote?"
        subMessage="Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="danger"
        content={deleteModalContent}
      />

      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
};

export default LotePage;
