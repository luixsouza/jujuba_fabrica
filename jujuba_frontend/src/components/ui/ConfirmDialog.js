"use client";

import { forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { COLORS, SHADOWS } from "../../constants";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Componente de diálogo de confirmação reutilizável
 * @param {Object} props
 * @param {boolean} props.open - Se o diálogo está aberto
 * @param {Function} props.onClose - Callback ao fechar
 * @param {Function} props.onConfirm - Callback ao confirmar
 * @param {string} props.title - Título do diálogo
 * @param {string} props.message - Mensagem principal
 * @param {string} props.subMessage - Mensagem secundária
 * @param {React.ReactNode} props.content - Conteúdo customizado
 * @param {string} props.confirmText - Texto do botão de confirmação
 * @param {string} props.cancelText - Texto do botão de cancelamento
 * @param {string} props.confirmColor - Cor do botão de confirmação ('danger' | 'primary' | 'secondary')
 * @param {React.ReactNode} props.icon - Ícone customizado
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar Ação",
  message = "Tem certeza que deseja continuar?",
  subMessage,
  content,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "danger",
  icon,
}) => {
  const getConfirmButtonStyle = () => {
    switch (confirmColor) {
      case "danger":
        return {
          backgroundColor: COLORS.warning,
          color: "white",
          boxShadow: "0px 4px 12px rgba(255, 87, 34, 0.4)",
          "&:hover": {
            backgroundColor: "#e64a19",
            transform: "translateY(-2px)",
            boxShadow: "0px 6px 16px rgba(255, 87, 34, 0.6)",
          },
        };
      case "primary":
        return {
          backgroundColor: COLORS.primaryBlue,
          color: COLORS.textSecondary,
          boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
          "&:hover": {
            backgroundColor: COLORS.actionBlueHover,
            transform: "translateY(-2px)",
            boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
          },
        };
      default:
        return {
          backgroundColor: COLORS.primaryPink,
          color: COLORS.textSecondary,
          boxShadow: "0px 4px 12px rgba(250, 218, 221, 0.4)",
          "&:hover": {
            backgroundColor: COLORS.actionPinkHover,
            transform: "translateY(-2px)",
            boxShadow: "0px 6px 16px rgba(250, 218, 221, 0.6)",
          },
        };
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: `linear-gradient(135deg, ${COLORS.primaryPink} 0%, #FFE4E1 100%)`,
          boxShadow: SHADOWS.modal,
          overflow: "visible",
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
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: COLORS.textMuted,
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
              backgroundColor: COLORS.warning,
              boxShadow: "0px 8px 20px rgba(255, 87, 34, 0.3)",
            }}
          >
            {icon || <WarningAmberIcon sx={{ fontSize: 40, color: "white" }} />}
          </Avatar>

          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: COLORS.textSecondary,
              textAlign: "center",
            }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", px: 4, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {content}

          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: "18px",
              lineHeight: 1.6,
              maxWidth: "400px",
            }}
          >
            {message}
            {subMessage && (
              <>
                <br />
                <strong>{subMessage}</strong>
              </>
            )}
          </Typography>
        </Box>
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
          onClick={onClose}
          sx={{
            backgroundColor: COLORS.primaryBlue,
            color: COLORS.textSecondary,
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "25px",
            padding: "12px 32px",
            minWidth: "120px",
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(154, 228, 255, 0.4)",
            "&:hover": {
              backgroundColor: COLORS.actionBlueHover,
              transform: "translateY(-2px)",
              boxShadow: "0px 6px 16px rgba(154, 228, 255, 0.6)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "25px",
            padding: "12px 32px",
            minWidth: "120px",
            textTransform: "none",
            transition: "all 0.3s ease",
            ...getConfirmButtonStyle(),
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
