"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  CircularProgress,
} from "@mui/material";
import { COLORS, PAGINATION, FONT_SIZES, TABLE_CELL_PADDING } from "../../constants";
import { usePagination } from "../../hooks";

/**
 * Componente de tabela de dados reutilizável com responsividade
 * @param {Object} props
 * @param {Array} props.columns - Configuração das colunas [{id, label, width?, align?, render?, hideOnMobile?}]
 * @param {Array} props.data - Dados a serem exibidos
 * @param {boolean} props.loading - Estado de carregamento
 * @param {string} props.emptyMessage - Mensagem quando não há dados
 * @param {Function} props.onRowClick - Callback ao clicar em uma linha
 * @param {Function} props.rowKeyExtractor - Função para extrair a chave única de cada linha
 * @param {boolean} props.stickyHeader - Se o header deve ser fixo
 * @param {number|Object} props.maxHeight - Altura máxima da tabela (pode ser responsivo)
 * @param {boolean} props.showPagination - Se deve mostrar paginação
 * @param {number} props.initialRowsPerPage - Linhas por página inicial
 * @param {boolean} props.compact - Se deve usar padding compacto
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "Nenhum dado encontrado",
  onRowClick,
  rowKeyExtractor = (row, index) => row.id || index,
  stickyHeader = true,
  maxHeight = { xs: 400, sm: 500, md: 600 },
  showPagination = true,
  initialRowsPerPage = PAGINATION.defaultRowsPerPage,
  compact = false,
}) => {
  const { getPaginatedItems, paginationProps } = usePagination(initialRowsPerPage);

  const displayData = showPagination ? getPaginatedItems(data) : data;
  const cellPadding = compact ? TABLE_CELL_PADDING.compact : TABLE_CELL_PADDING.default;

  const renderCell = (row, column, rowIndex) => {
    if (column.render) {
      return column.render(row, rowIndex);
    }
    return row[column.id] ?? "-";
  };

  return (
    <Box>
      <TableContainer
        sx={{
          maxHeight: maxHeight,
          borderRadius: { xs: '8px', md: '10px' },
          overflow: "auto",
          backgroundColor: COLORS.backgroundPaper,
          width: "100%",
        }}
      >
        <Table stickyHeader={stickyHeader} size="small">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  align={column.align || "center"}
                  sx={{
                    fontSize: FONT_SIZES.tableHeader,
                    textAlign: "center",
                    backgroundColor: COLORS.tableHeaderBackground,
                    borderRight:
                      index < columns.length - 1
                        ? `2px solid ${COLORS.backgroundPaper}`
                        : "none",
                    fontWeight: "bold",
                    color: COLORS.textSecondary,
                    minWidth: column.width,
                    padding: cellPadding,
                    display: column.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", p: { xs: 2, md: 4 } }}
                  >
                    <CircularProgress
                      size={32}
                      sx={{ color: COLORS.primaryPink }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ) : displayData.length > 0 ? (
              displayData.map((row, rowIndex) => (
                <TableRow
                  key={rowKeyExtractor(row, rowIndex)}
                  hover
                  onClick={() => onRowClick?.(row, rowIndex)}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${rowKeyExtractor(row, rowIndex)}-${column.id}`}
                      align={column.align || "center"}
                      sx={{
                        fontSize: FONT_SIZES.tableCell,
                        padding: cellPadding,
                        textAlign: "center",
                        maxWidth: column.maxWidth,
                        wordWrap: column.wordWrap ? "break-word" : "normal",
                        whiteSpace: column.wordWrap ? "normal" : "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: column.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : 'table-cell',
                      }}
                    >
                      {renderCell(row, column, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    textAlign: "center",
                    py: { xs: 2, md: 4 },
                    fontSize: FONT_SIZES.body,
                    color: COLORS.textMuted,
                  }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <TablePagination
          {...paginationProps}
          count={data.length}
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: FONT_SIZES.bodySmall,
            },
            '& .MuiTablePagination-select': {
              fontSize: FONT_SIZES.bodySmall,
            },
          }}
        />
      )}
    </Box>
  );
};

export default DataTable;
