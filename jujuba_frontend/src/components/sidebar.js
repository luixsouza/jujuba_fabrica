"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import {
  Tooltip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  COLORS,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  SHADOWS,
  FONTS,
} from "../constants";
import { useSidebar } from "../contexts";

const menuItems = [
  {
    id: "fornecedores",
    label: "Fornecedores",
    icon: Users,
    path: "/fornecedores",
    tooltip: "Gerenciar Fornecedores",
  },
  {
    id: "estoque",
    label: "Estoque",
    icon: ShoppingBag,
    path: "/estoque",
    tooltip: "Gerenciar Estoque",
  },
  {
    id: "vendas",
    label: "Vendas",
    icon: DollarSign,
    path: "/vendas",
    tooltip: "Vendas",
  },
  {
    id: "lotes",
    label: "Lotes",
    icon: Package,
    path: "/lotes",
    tooltip: "Gerenciar Lotes",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isCollapsed, isMobileOpen, toggleCollapsed, toggleMobile, closeMobile } = useSidebar();

  const currentWidth = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  const getMenuItemStyle = (isActive) => ({
    marginBottom: "4px",
    borderRadius: "12px",
    padding: isCollapsed ? "12px" : "12px 16px",
    backgroundColor: isActive
      ? "rgba(255, 255, 255, 0.4)"
      : "transparent",
    justifyContent: isCollapsed ? "center" : "flex-start",
    minHeight: "48px",
    "&:hover": {
      backgroundColor: isActive
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(255, 255, 255, 0.25)",
      transform: isCollapsed ? "scale(1.05)" : "translateX(4px)",
    },
    transition: "all 0.2s ease",
  });

  const iconStyle = {
    size: 22,
    strokeWidth: 2,
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (isMobile) {
      closeMobile();
    }
  };

  const SidebarContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(180deg, ${COLORS.sidebarBackground} 0%, #f0a0c0 100%)`,
        position: "relative",
      }}
    >
      {/* Toggle Button - Desktop (canto superior direito) */}
      {!isMobile && (
        <Tooltip title={isCollapsed ? "Expandir" : "Recolher"} placement="right" arrow>
          <IconButton
            onClick={toggleCollapsed}
            sx={{
              position: "absolute",
              right: isCollapsed ? 8 : 10,
              top: 10,
              width: 28,
              height: 28,
              backgroundColor: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.6)",
              color: COLORS.textSecondary,
              zIndex: 10,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.8)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </IconButton>
        </Tooltip>
      )}

      {/* Close Button - Mobile */}
      {isMobile && (
        <IconButton
          onClick={closeMobile}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: COLORS.textSecondary,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.3)",
            },
          }}
        >
          <X size={20} />
        </IconButton>
      )}

      {/* Logo Container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: isCollapsed ? "20px 8px" : "24px 16px",
          marginTop: isMobile ? "40px" : isCollapsed ? "40px" : "16px",
        }}
      >
        <Box
          sx={{
            width: isCollapsed ? 50 : 100,
            height: isCollapsed ? 50 : 100,
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <Image
            src="/Imagens/LogoJujuba.png"
            alt="Jujuba Logo"
            width={isCollapsed ? 80 : 180}
            height={isCollapsed ? 46 : 104}
            priority
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* Brand Name */}
      {!isCollapsed && (
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
            opacity: isCollapsed ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: FONTS.title,
              fontSize: "1.4rem",
              fontWeight: "bold",
              color: COLORS.textSecondary,
              letterSpacing: "2px",
            }}
          >
            JUJUBA
          </Box>
          <Box
            component="span"
            sx={{
              display: "block",
              fontFamily: FONTS.body,
              fontSize: "0.7rem",
              color: COLORS.textMuted,
              letterSpacing: "3px",
              mt: 0.5,
            }}
          >
            BRECHÓ
          </Box>
        </Box>
      )}

      {/* Menu Items */}
      <List sx={{ flex: 1, padding: isCollapsed ? "8px" : "8px 12px" }}>
        {menuItems.map((item) => {
          const isActive = pathname?.includes(item.id);

          const button = (
            <ListItemButton
              sx={getMenuItemStyle(isActive)}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 40,
                  justifyContent: "center",
                  color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
                }}
              >
                <item.icon {...iconStyle} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: FONTS.body,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.95rem",
                      color: isActive ? COLORS.textPrimary : COLORS.textSecondary,
                    },
                  }}
                />
              )}
              {!isCollapsed && isActive && (
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    backgroundColor: COLORS.textPrimary,
                    borderRadius: 2,
                    ml: 1,
                  }}
                />
              )}
            </ListItemButton>
          );

          return isCollapsed ? (
            <Tooltip title={item.label} placement="right" arrow key={item.id}>
              {button}
            </Tooltip>
          ) : (
            <Box key={item.id}>{button}</Box>
          );
        })}
      </List>

    </Box>
  );

  // Mobile: Drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <IconButton
          onClick={toggleMobile}
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 1100,
            backgroundColor: COLORS.sidebarBackground,
            boxShadow: SHADOWS.button,
            "&:hover": {
              backgroundColor: COLORS.actionPinkHover,
            },
          }}
        >
          <Menu size={24} color={COLORS.textSecondary} />
        </IconButton>

        <Drawer
          anchor="left"
          open={isMobileOpen}
          onClose={closeMobile}
          PaperProps={{
            sx: {
              width: SIDEBAR_WIDTH,
              border: "none",
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: currentWidth,
        boxShadow: SHADOWS.sidebar,
        zIndex: 1200,
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <SidebarContent />
    </Box>
  );
}
