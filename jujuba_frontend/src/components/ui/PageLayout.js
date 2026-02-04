"use client";

import { Box } from "@mui/material";
import Head from "next/head";
import Sidebar from "../sidebar";
import { COLORS, SIDEBAR_WIDTH, SIDEBAR_WIDTH_MOBILE, SPACING } from "../../constants";

/**
 * Componente de layout de página padronizado
 * @param {Object} props
 * @param {string} props.title - Título da página (para o Head)
 * @param {React.ReactNode} props.children - Conteúdo da página
 * @param {Object} props.sx - Estilos adicionais para o container principal
 */
const PageLayout = ({ title, children, sx = {} }) => {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: COLORS.background,
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>Jujuba - {title}</title>
      </Head>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          marginLeft: { xs: `${SIDEBAR_WIDTH_MOBILE}px`, sm: `${SIDEBAR_WIDTH}px` },
          overflow: "auto",
          backgroundColor: COLORS.background,
          paddingTop: SPACING.pagePaddingTop,
          paddingX: { xs: SPACING.pagePaddingXMobile, sm: SPACING.pagePaddingX },
          transition: "margin-left 0.3s ease",
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
