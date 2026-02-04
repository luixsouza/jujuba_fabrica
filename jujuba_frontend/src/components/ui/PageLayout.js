"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import Head from "next/head";
import Sidebar from "../sidebar";
import {
  COLORS,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_MOBILE,
  SPACING,
} from "../../constants";
import { useSidebar } from "../../contexts";

/**
 * Componente de layout de página padronizado
 * @param {Object} props
 * @param {string} props.title - Título da página (para o Head)
 * @param {React.ReactNode} props.children - Conteúdo da página
 * @param {Object} props.sx - Estilos adicionais para o container principal
 */
const PageLayout = ({ title, children, sx = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isCollapsed } = useSidebar();

  const sidebarWidth = isMobile
    ? SIDEBAR_WIDTH_MOBILE
    : isCollapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH;

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
          marginLeft: `${sidebarWidth}px`,
          overflow: "auto",
          backgroundColor: COLORS.background,
          paddingTop: isMobile ? "4rem" : SPACING.pagePaddingTop,
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
