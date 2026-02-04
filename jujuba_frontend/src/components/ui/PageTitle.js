"use client";

import { Box, Typography } from "@mui/material";
import { COLORS, FONT_SIZES } from "../../constants";

/**
 * Componente de título de página padronizado com responsividade
 * @param {Object} props
 * @param {string} props.title - Título da página
 * @param {React.ReactNode} props.rightContent - Conteúdo opcional à direita do título
 * @param {Object} props.sx - Estilos adicionais
 * @param {boolean} props.small - Usa tamanho menor de fonte
 */
const PageTitle = ({ title, rightContent, sx = {}, small = false }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "1800px",
        mx: "auto",
        mb: { xs: '20px', sm: '30px', md: '50px' },
        px: { xs: 1, sm: 2 },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: small ? FONT_SIZES.pageTitleSmall : FONT_SIZES.pageTitle,
            color: COLORS.textPrimary,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
      </Box>

      {rightContent && (
        <Box
          sx={{
            position: { xs: 'relative', md: 'absolute' },
            right: { md: 0 },
            top: { md: '50%' },
            transform: { md: 'translateY(-50%)' },
            mt: { xs: 2, md: 0 },
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {rightContent}
        </Box>
      )}
    </Box>
  );
};

export default PageTitle;
