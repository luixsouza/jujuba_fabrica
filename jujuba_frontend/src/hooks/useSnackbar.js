import { useState, useCallback } from 'react';

/**
 * Hook personalizado para gerenciar estado e ações do Snackbar
 * @returns {Object} Estado do snackbar e funções de controle
 */
export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
  });

  /**
   * Exibe uma mensagem no snackbar
   * @param {string} message - Mensagem a ser exibida
   * @param {string} severity - Tipo da mensagem ('success' | 'error' | 'warning' | 'info')
   */
  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  /**
   * Exibe mensagem de sucesso
   * @param {string} message - Mensagem de sucesso
   */
  const showSuccess = useCallback((message) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  /**
   * Exibe mensagem de erro
   * @param {string} message - Mensagem de erro
   */
  const showError = useCallback((message) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  /**
   * Exibe mensagem de aviso
   * @param {string} message - Mensagem de aviso
   */
  const showWarning = useCallback((message) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  /**
   * Exibe mensagem informativa
   * @param {string} message - Mensagem informativa
   */
  const showInfo = useCallback((message) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  /**
   * Fecha o snackbar
   */
  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeSnackbar,
  };
};

export default useSnackbar;
