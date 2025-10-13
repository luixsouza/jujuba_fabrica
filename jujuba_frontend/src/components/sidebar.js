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
} from "@mui/material";

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
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <Image
            src="/Imagens/LogoJujuba.png"
            alt="Jujuba Logo"
            width={245}
            height={142}
            priority
          />
        </div>
      </div>

      <List sx={{ width: "100%", padding: "0 8px" }}>
        {menuItems.map((item) => {
          const isActive = pathname.includes(item.id);

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

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 244px;
          background-color: #f8c0e0;
          display: flex;
          flex-direction: column;
          padding: 20px;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }
        .logo-container {
          display: flex;
          justify-content: center;
          margin: 20px 0 40px;
        }
        .logo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
