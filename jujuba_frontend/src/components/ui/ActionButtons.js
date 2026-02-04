"use client";

import { Box, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { COLORS } from "../../constants";

/**
 * Componente de botões de ação padronizados para tabelas
 * @param {Object} props
 * @param {Function} props.onView - Callback ao clicar em visualizar
 * @param {Function} props.onEdit - Callback ao clicar em editar
 * @param {Function} props.onDelete - Callback ao clicar em deletar
 * @param {Function} props.onAddToCart - Callback ao clicar em adicionar ao carrinho
 * @param {boolean} props.showView - Se deve mostrar botão de visualizar
 * @param {boolean} props.showEdit - Se deve mostrar botão de editar
 * @param {boolean} props.showDelete - Se deve mostrar botão de deletar
 * @param {boolean} props.showAddToCart - Se deve mostrar botão de carrinho
 * @param {boolean} props.disableAddToCart - Se o botão de carrinho está desabilitado
 * @param {string} props.addToCartTitle - Título do botão de carrinho
 */
const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  onAddToCart,
  showView = true,
  showEdit = true,
  showDelete = true,
  showAddToCart = false,
  disableAddToCart = false,
  addToCartTitle = "Adicionar ao carrinho",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
      }}
    >
      {showView && onView && (
        <IconButton
          onClick={onView}
          sx={{ color: COLORS.actionBlue }}
          title="Visualizar"
        >
          <VisibilityIcon />
        </IconButton>
      )}

      {showEdit && onEdit && (
        <IconButton
          onClick={onEdit}
          sx={{ color: COLORS.actionBlue }}
          title="Editar"
        >
          <EditIcon />
        </IconButton>
      )}

      {showDelete && onDelete && (
        <IconButton
          onClick={onDelete}
          sx={{ color: COLORS.error }}
          title="Excluir"
        >
          <DeleteIcon />
        </IconButton>
      )}

      {showAddToCart && onAddToCart && (
        <IconButton
          onClick={onAddToCart}
          sx={{ color: COLORS.actionBlue }}
          title={addToCartTitle}
          disabled={disableAddToCart}
        >
          <ShoppingCartIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ActionButtons;
