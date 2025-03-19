"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Users, ShoppingBag, DollarSign, Package, ChevronRight } from "lucide-react"
import { Tooltip, ListItem, ListItemIcon, ListItemText, List } from "@mui/material"

export default function Sidebar({ lotes = [] }) {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("")

  const handleNavigation = (path, itemName) => {
    setActiveItem(itemName)
    router.push(path)
  }

  // Style function for menu items
  const getMenuItemStyle = (itemName) => ({
    marginBottom: "8px",
    borderRadius: "8px",
    padding: "10px 12px",
    backgroundColor: activeItem === itemName ? "rgba(255, 255, 255, 0.3)" : "transparent",
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transform: "translateX(5px)",
    },
    transition: "all 0.3s ease",
  })

  // Style for icons
  const iconStyle = {
    size: 20,
    strokeWidth: 2,
  }

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <Image src="/jujba2.png" alt="Jujuba Logo" width={140} height={140} priority />
        </div>
      </div>

      <List sx={{ width: "100%", padding: "0 8px" }}>
        <Tooltip title="Gerenciar Fornecedores" placement="right" arrow>
          <ListItem
            button
            sx={getMenuItemStyle("fornecedores")}
            onClick={() => handleNavigation("../../fornecedores/fornecedores_tabela", "fornecedores")}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <Users {...iconStyle} color="black" />
            </ListItemIcon>
            <ListItemText
              primary="Fornecedores"
              sx={{
                color: "black",
                "& .MuiListItemText-primary": {
                  fontWeight: activeItem === "fornecedores" ? 600 : 400,
                },
              }}
            />
            {activeItem === "fornecedores" && <ChevronRight size={16} color="black" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Gerenciar Estoque" placement="right" arrow>
          <ListItem
            button
            sx={getMenuItemStyle("estoque")}
            onClick={() => handleNavigation("../../estoque/estoque_tabela", "estoque")}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <ShoppingBag {...iconStyle} color="black" />
            </ListItemIcon>
            <ListItemText
              primary="Estoque"
              sx={{
                color: "black",
                "& .MuiListItemText-primary": {
                  fontWeight: activeItem === "estoque" ? 600 : 400,
                },
              }}
            />
            {activeItem === "estoque" && <ChevronRight size={16} color="black" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Acessar Caixa" placement="right" arrow>
          <ListItem button sx={getMenuItemStyle("caixa")} onClick={() => handleNavigation("/Caixa", "caixa")}>
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <DollarSign {...iconStyle} color="black" />
            </ListItemIcon>
            <ListItemText
              primary="Caixa"
              sx={{
                color: "black",
                "& .MuiListItemText-primary": {
                  fontWeight: activeItem === "caixa" ? 600 : 400,
                },
              }}
            />
            {activeItem === "caixa" && <ChevronRight size={16} color="black" />}
          </ListItem>
        </Tooltip>

        <Tooltip title="Gerenciar Lotes" placement="right" arrow>
          <ListItem
            button
            sx={getMenuItemStyle("lotes")}
            onClick={() => handleNavigation("../../lotes/lotes_geral", "lotes")}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <Package {...iconStyle} color="black" />
            </ListItemIcon>
            <ListItemText
              primary="Lotes"
              sx={{
                color: "black",
                "& .MuiListItemText-primary": {
                  fontWeight: activeItem === "lotes" ? 600 : 400,
                },
              }}
            />
            {activeItem === "lotes" && <ChevronRight size={16} color="black" />}
          </ListItem>
        </Tooltip>
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
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
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
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .lotes-list {
          margin-top: 40px;
        }

        .lotes-list h3 {
          color: #6b7280;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: bold;
        }

        .lote-item {
          display: flex;
          justify-content: space-between;
          background-color: #ffd0e8;
          padding: 8px 12px;
          margin-bottom: 6px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .lote-item:hover {
          transform: scale(1.02);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  )
}

