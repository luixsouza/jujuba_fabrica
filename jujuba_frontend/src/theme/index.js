import { createTheme } from '@mui/material/styles';
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from '../constants';

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primaryBlue,
      light: COLORS.actionBlueHover,
      dark: COLORS.actionBlue,
      contrastText: COLORS.textSecondary,
    },
    secondary: {
      main: COLORS.primaryPink,
      light: COLORS.actionPinkHover,
      dark: COLORS.sidebarBackground,
      contrastText: COLORS.textSecondary,
    },
    success: {
      main: COLORS.success,
    },
    error: {
      main: COLORS.error,
    },
    warning: {
      main: COLORS.warning,
    },
    info: {
      main: COLORS.info,
    },
    background: {
      default: COLORS.background,
      paper: COLORS.backgroundPaper,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h4: {
      fontWeight: 'bold',
      fontSize: FONT_SIZES.pageTitle,
      color: COLORS.textPrimary,
    },
    h6: {
      fontWeight: 'bold',
      color: COLORS.textSecondary,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: SPACING.buttonBorderRadius,
          textTransform: 'none',
          fontWeight: 'bold',
          fontSize: FONT_SIZES.button,
          transition: COLORS.transition,
        },
      },
      variants: [
        {
          props: { variant: 'jujubaPrimary' },
          style: {
            backgroundColor: COLORS.primaryPink,
            color: COLORS.textSecondary,
            boxShadow: SHADOWS.button,
            padding: '12px 32px',
            '&:hover': {
              backgroundColor: COLORS.actionPinkHover,
              transform: 'translateY(-2px)',
            },
          },
        },
        {
          props: { variant: 'jujubaSecondary' },
          style: {
            backgroundColor: COLORS.primaryBlue,
            color: COLORS.textSecondary,
            boxShadow: SHADOWS.button,
            padding: '12px 32px',
            '&:hover': {
              backgroundColor: COLORS.actionBlueHover,
              transform: 'translateY(-2px)',
            },
          },
        },
        {
          props: { variant: 'jujubaDanger' },
          style: {
            backgroundColor: COLORS.warning,
            color: COLORS.backgroundWhite,
            boxShadow: '0px 4px 12px rgba(255, 87, 34, 0.4)',
            padding: '12px 32px',
            '&:hover': {
              backgroundColor: '#e64a19',
              transform: 'translateY(-2px)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: SPACING.cardBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
          boxShadow: SHADOWS.card,
          border: `2px solid ${COLORS.borderMedium}`,
          padding: SPACING.cardPadding,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: COLORS.backgroundPaper,
            borderRadius: SPACING.inputBorderRadius,
            '& fieldset': {
              borderColor: COLORS.borderLight,
            },
            '&:hover fieldset': {
              borderColor: COLORS.actionBlue,
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.actionBlue,
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: COLORS.tableHeaderBackground,
          fontWeight: 'bold',
          fontSize: FONT_SIZES.tableHeader,
          textAlign: 'center',
        },
        body: {
          fontSize: FONT_SIZES.tableCell,
          textAlign: 'center',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: SPACING.inputBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: SPACING.modalBorderRadius,
          backgroundColor: COLORS.backgroundPaper,
          boxShadow: SHADOWS.modal,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: SPACING.inputBorderRadius,
          fontWeight: 'bold',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.action-view': {
            color: COLORS.actionBlue,
          },
          '&.action-edit': {
            color: COLORS.actionBlue,
          },
          '&.action-delete': {
            color: COLORS.error,
          },
        },
      },
    },
  },
});

export default theme;
