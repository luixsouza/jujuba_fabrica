"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Box,
} from "@mui/material";
import { COLORS, SIDEBAR_WIDTH, SHADOWS } from "../constants";

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

  const getMenuItemStyle = (isActive) => ({
    marginBottom: "8px",
    borderRadius: "8px",
    padding: "10px 12px",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.3)" : "transparent",
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transform: "translateX(5px)",
    },
    transition: "all 0.3s ease",
  });

  const iconStyle = {
    size: 20,
    strokeWidth: 2,
    color: "black",
  };

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: `${SIDEBAR_WIDTH - 46}px`,
        backgroundColor: COLORS.sidebarBackground,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxShadow: SHADOWS.sidebar,
        zIndex: 1200,
      }}
    >
      {/* Logo Container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0 40px",
        }}
      >
        <Box
          sx={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <Image
            src="/Imagens/LogoJujuba.png"
            alt="Jujuba Logo"
            width={245}
            height={142}
            priority
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ width: "100%", padding: "0 8px" }}>
        {menuItems.map((item) => {
          const isActive = pathname?.includes(item.id);

          return (
            <Tooltip title={item.tooltip} placement="right" arrow key={item.id}>
              <ListItemButton
                sx={getMenuItemStyle(isActive)}
                onClick={() => router.push(item.path)}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <item.icon {...iconStyle} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: "black",
                    "& .MuiListItemText-primary": {
                      fontWeight: isActive ? 600 : 400,
                    },
                  }}
                />
                {isActive && <ChevronRight size={16} color="black" />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}
