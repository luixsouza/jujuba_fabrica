// Constantes centralizadas do projeto Jujuba Fábrica

// Layout
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 70;
export const SIDEBAR_WIDTH_MOBILE = 0;

// Fontes
export const FONTS = {
  title: '"Optima", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  body: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
};

// Breakpoints (em px) - compatível com MUI
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Cores do tema
export const COLORS = {
  // Cores primárias
  primaryBlue: '#9AE4FF',
  primaryPink: '#FADADD',

  // Cores de fundo
  background: '#9AE4FF',
  backgroundPaper: '#F5F5F5',
  backgroundWhite: '#FFFFFF',

  // Cores de texto
  textPrimary: '#000000',
  textSecondary: '#333333',
  textMuted: '#666666',

  // Cores de ação
  actionBlue: '#00509E',
  actionPinkHover: '#FFB6C1',
  actionBlueHover: '#7DD3FC',

  // Cores de status
  success: '#4CAF50',
  error: '#d32f2f',
  warning: '#ff5722',
  info: '#2196F3',

  // Cores de borda
  borderLight: '#CCCCCC',
  borderMedium: '#B0B0B0',

  // Cores especiais
  logoBackground: '#FFF9ac',
  sidebarBackground: '#f8c0e0',
  tableHeaderBackground: '#FADADD',
  recentItemBackground: '#E3F2FD',
  recentItemHover: '#BBDEFB',
};

// Espaçamentos padrão
export const SPACING = {
  pagePaddingTop: '3rem',
  pagePaddingX: '2rem',
  pagePaddingXMobile: '1rem',
  cardPadding: { xs: '12px', sm: '16px', md: '20px' },
  cardBorderRadius: { xs: '15px', md: '25px' },
  buttonBorderRadius: '25px',
  inputBorderRadius: '10px',
  modalBorderRadius: '20px',
};

// Tamanhos de fonte responsivos (usando objeto MUI sx)
export const FONT_SIZES = {
  // Títulos de página
  pageTitle: { xs: '28px', sm: '36px', md: '42px', lg: '50px' },
  pageTitleSmall: { xs: '24px', sm: '30px', md: '36px' },

  // Títulos de seção/card
  sectionTitle: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
  cardTitle: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },

  // Tabelas
  tableHeader: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
  tableCell: { xs: '11px', sm: '13px', md: '15px', lg: '16px' },
  tableCellSmall: { xs: '10px', sm: '11px', md: '12px' },

  // Botões e inputs
  button: { xs: '14px', sm: '15px', md: '16px' },
  input: { xs: '14px', sm: '16px', md: '18px' },

  // Chips e tags
  chip: { xs: '10px', sm: '11px', md: '12px' },

  // Corpo de texto
  body: { xs: '13px', sm: '14px', md: '16px' },
  bodySmall: { xs: '11px', sm: '12px', md: '14px' },

  // Labels
  label: { xs: '12px', sm: '13px', md: '14px' },
};

// Padding responsivo para células de tabela
export const TABLE_CELL_PADDING = {
  default: { xs: '6px 4px', sm: '10px 8px', md: '14px 12px', lg: '16px' },
  compact: { xs: '4px 2px', sm: '6px 4px', md: '8px 6px' },
};

// Sombras
export const SHADOWS = {
  card: '0px 8px 20px rgba(0, 0, 0, 0.3)',
  button: '0px 8px 20px rgba(0, 0, 0, 0.3)',
  input: '0px 8px 20px rgba(0, 0, 0, 0.1)',
  modal: '0px 20px 40px rgba(0, 0, 0, 0.3)',
  sidebar: '2px 0 10px rgba(0, 0, 0, 0.1)',
};

// Configurações de paginação
export const PAGINATION = {
  defaultRowsPerPage: 5,
  rowsPerPageOptions: [5, 10, 25, 50],
};

// Transições
export const TRANSITIONS = {
  default: 'all 0.3s ease',
  fast: 'all 0.2s ease',
  slow: 'all 0.5s ease',
};

// Margens responsivas para conteúdo principal (considerando sidebar)
export const MAIN_CONTENT_MARGIN = {
  xs: 0,
  sm: `${SIDEBAR_WIDTH}px`,
};
