"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Card, Button, Avatar, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import api from "../../utils/api";

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
import { useSnackbar, usePagination } from "../../hooks";

// Constantes
import { COLORS, SHADOWS, SPACING } from "../../constants";

const FornecedoresPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    fornecedor: null,
  });

  const router = useRouter();
  const { snackbar, showSuccess, showError, closeSnackbar } = useSnackbar();
  const { getPaginatedItems, paginationProps } = usePagination();

  // Buscar fornecedores
  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        setLoading(true);
        const response = await api.get("/fornecedoras");
        setFornecedores(response.data);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error.message);
        showError("Erro ao carregar fornecedores");
      } finally {
        setLoading(false);
      }
    };
    fetchFornecedores();
  }, []);

  // Deletar fornecedor
  const deleteFornecedora = useCallback(async (id) => {
    try {
      await api.delete(`/fornecedoras/${id}`);
      setFornecedores((prev) => prev.filter((f) => f.id !== id));
      showSuccess("Fornecedor deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      showError("Erro ao deletar fornecedor. Tente novamente.");
    }
  }, [showSuccess, showError]);

  // Navegações
  const handleNavigateToRegister = () => router.push("/fornecedores/cadastro_fornecedores");
  const handleView = (id) => router.push(`/fornecedores/visualizar_fornecedor?id=${id}`);
  const handleEdit = (id) => router.push(`/fornecedores/editar_fornecedores?id=${id}`);

  // Modal de exclusão
  const handleDeleteClick = (fornecedor) => setDeleteModal({ open: true, fornecedor });
  const handleCloseDeleteModal = () => setDeleteModal({ open: false, fornecedor: null });
  const handleConfirmDelete = async () => {
    if (deleteModal.fornecedor) {
      await deleteFornecedora(deleteModal.fornecedor.id);
      handleCloseDeleteModal();
    }
  };

  // Filtro de busca
  const filteredFornecedores = useMemo(() => {
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
    return [...new Set(
      fornecedores.flatMap((f) => [
        f?.nome, f?.contato, f?.endereco, f?.chavePix, f?.id ? String(f.id) : null
      ]).filter(Boolean)
    )];
  }, [fornecedores]);

  // Configuração das colunas da tabela
  const columns = [
    { id: "nome", label: "Nome", wordWrap: true, maxWidth: 150 },
    { id: "contato", label: "Contato" },
    { id: "endereco", label: "Endereço", wordWrap: true, maxWidth: 200 },
    { id: "chavePix", label: "Chave Pix" },
    {
      id: "acoes",
      label: "Ações",
      width: 150,
      render: (row) => (
        <ActionButtons
          onView={() => handleView(row.id)}
          onEdit={() => handleEdit(row.id)}
          onDelete={() => handleDeleteClick(row)}
        />
      ),
    },
  ];

  // Conteúdo do modal de confirmação
  const deleteModalContent = deleteModal.fornecedor && (
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
        <PersonIcon sx={{ color: COLORS.textSecondary }} />
      </Avatar>
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS.textSecondary, mb: 0.5 }}>
          {deleteModal.fornecedor.nome}
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.textMuted, fontSize: "14px" }}>
          ID: {deleteModal.fornecedor.id}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <PageLayout title="Fornecedoras">
      <PageTitle title="Fornecedores" />

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar fornecedores..."
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
          Fornecedores cadastrados ({filteredFornecedores.length})
        </Typography>

        <DataTable
          columns={columns}
          data={filteredFornecedores}
          loading={loading}
          emptyMessage="Nenhum fornecedor encontrado"
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
          Cadastrar fornecedor
        </Button>
      </Box>

      <ConfirmDialog
        open={deleteModal.open}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este fornecedor?"
        subMessage="Esta ação não pode ser desfeita."
        confirmText="Excluir"
        confirmColor="danger"
        content={deleteModalContent}
      />

      <SnackbarAlert {...snackbar} onClose={closeSnackbar} />
    </PageLayout>
  );
};

export default FornecedoresPage;
