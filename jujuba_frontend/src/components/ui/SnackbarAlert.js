"use client";

import { Snackbar, Alert } from "@mui/material";
import { COLORS } from "../../constants";

/**
 * Componente de Snackbar/Alert reutilizável
 * @param {Object} props
 * @param {boolean} props.open - Se o snackbar está aberto
 * @param {string} props.message - Mensagem a ser exibida
 * @param {string} props.severity - Tipo do alerta ('success' | 'error' | 'warning' | 'info')
 * @param {Function} props.onClose - Callback ao fechar
 * @param {number} props.autoHideDuration - Duração em ms antes de fechar automaticamente
 * @param {Object} props.anchorOrigin - Posição do snackbar
 */
const SnackbarAlert = ({
  open,
  message,
  severity = "success",
  onClose,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          borderRadius: "10px",
          fontWeight: "bold",
        }}
        elevation={6}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
