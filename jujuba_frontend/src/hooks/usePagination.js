import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../constants';

/**
 * Hook personalizado para gerenciar paginação de tabelas
 * @param {number} initialRowsPerPage - Número inicial de linhas por página
 * @returns {Object} Estado e funções de paginação
 */
export const usePagination = (initialRowsPerPage = PAGINATION.defaultRowsPerPage) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  /**
   * Manipula mudança de página
   * @param {Event} event - Evento do MUI
   * @param {number} newPage - Nova página
   */
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  /**
   * Manipula mudança de linhas por página
   * @param {Event} event - Evento de mudança
   */
  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  /**
   * Reseta a paginação para a primeira página
   */
  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  /**
   * Retorna os itens paginados de um array
   * @param {Array} items - Array de itens a paginar
   * @returns {Array} Itens da página atual
   */
  const getPaginatedItems = useCallback((items) => {
    if (!Array.isArray(items)) return [];
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, rowsPerPage]);

  /**
   * Propriedades para o componente TablePagination do MUI
   */
  const paginationProps = useMemo(() => ({
    component: 'div',
    page,
    rowsPerPage,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
    rowsPerPageOptions: PAGINATION.rowsPerPageOptions,
    labelRowsPerPage: 'Linhas por página:',
    labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count}`,
  }), [page, rowsPerPage, handleChangePage, handleChangeRowsPerPage]);

  return {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPage,
    getPaginatedItems,
    paginationProps,
  };
};

export default usePagination;
