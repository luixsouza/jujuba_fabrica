"use client"

import React, { useState } from "react"
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Tooltip,
  Avatar,
  Button,
} from "@mui/material"
import { Users, ShoppingBag, DollarSign, Package, LogOut, ChevronRight } from "lucide-react"
import { useRouter } from "next/router"

export default function Sidebar() {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("")

  const handleNavigation = (path, itemName) => {
    setActiveItem(itemName)
    router.push(path)
  }

  const handleLogout = () => {
    // Implementar lógica de logout aqui
    router.push("/")
  }

  // Verificar qual item está ativo com base na rota atual
  React.useEffect(() => {
    if (router.pathname.includes("fornecedores")) {
      setActiveItem("fornecedores")
    } else if (router.pathname.includes("estoque")) {
      setActiveItem("estoque")
    } else if (router.pathname.includes("caixa")) {
      setActiveItem("caixa")
    } else if (router.pathname.includes("lotes")) {
      setActiveItem("lotes")
    }
  }, [router.pathname])

  // Estilo comum para os ícones
  const iconStyle = {
    strokeWidth: 1.5,
    size: 24,
  }

  // Estilo para os itens de menu
  const getMenuItemStyle = (itemName) => ({
    marginBottom: "0.5rem",
    paddingLeft: "1rem",
    borderRadius: "10px",
    height: "48px",
    transition: "all 0.3s ease",
    backgroundColor: activeItem === itemName ? "rgba(255, 255, 255, 0.3)" : "transparent",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      transform: "translateX(5px)",
    },
  })

  return (
    <Box
      sx={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#FADADD",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        padding: "1rem",
        paddingTop: "1rem",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "0.3rem",
          flexShrink: 0,
        }}
      >
        <img
          src="/imagens/bbdefin.png"
          alt="Logo"
          style={{
            width: "220px",
            height: "auto",
            borderRadius: "5px",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Pacifico", cursive',
            color: "black",
            fontWeight: "bold",
            marginBottom: "0.4rem",
          }}
        >
          Brechó da Jujuba
        </Typography>
      </Box>

      <Divider
        sx={{
          mb: 2,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          width: "90%",
          mx: "auto",
        }}
      />

      <List sx={{ flexGrow: 1 }}>
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

    
      <Box sx={{ mt: "auto", mb: 2 }}>
        <Divider
          sx={{
            mb: 2,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            width: "90%",
            mx: "auto",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#9AE4FF",
              border: "2px solid white",
            }}
          >
            JJ
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" sx={{ color: "black", fontWeight: 600 }}>
              Administrador
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.7)" }}>
              admin@brechojujuba.com
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<LogOut size={18} />}
          onClick={handleLogout}
          sx={{
            width: "90%",
            mx: "auto",
            display: "flex",
            justifyContent: "flex-start",
            color: "black",
            borderColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderColor: "rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          Sair do Sistema
        </Button>
      </Box>
    </Box>
  )
}

