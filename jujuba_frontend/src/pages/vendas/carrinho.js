"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Autocomplete,
  Dialog,
  DialogContent,
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from "@mui/icons-material"
import Sidebar from "../../components/sidebar"

export default function CarrinhoPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [openSellModal, setOpenSellModal] = useState(false)

  // Opções de pesquisa (simuladas)
  const options = ["Crocs Minnie", "Camiseta Lacoste", "Tênis Nike", "Vestido Lilica"]

  // Dados dos itens no carrinho
  const cartItems = [
    {
      id: 1,
      descricao: "Crocs Minnie Tamanho 19/20",
      estado: "Ótimo",
      valor: 47.5,
      lote: "B321",
    },
    {
      id: 2,
      descricao: "Camiseta Lacoste 8 anos",
      estado: "Ótimo",
      valor: 68.9,
      lote: "B321",
    },
  ]

  const totalValue = cartItems.reduce((total, item) => total + item.valor, 0)

  const handleOpenSellModal = () => {
    setOpenSellModal(true)
  }

  const handleCloseSellModal = () => {
    setOpenSellModal(false)
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#a8e1ff" }}>
      {/* Importando o componente Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ ml: "244px", flex: 1, p: 2, pt: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 1,
            mt: 2, // Reduzido para mover os ícones para cima
          }}
        >
          <IconButton onClick={() => router.back()} sx={{ color: "#333", p: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              color: "#333",
              fontWeight: 700,
              position: "absolute",
              left: "55%",
              transform: "translateX(-50%)",
              fontSize: "3rem",
            }}
          >
            Vendas
          </Typography>
          <IconButton sx={{ color: "#333", p: 1 }}>
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Search Bar - Novo estilo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Autocomplete
            freeSolo
            options={options}
            value={search}
            onChange={(event, newValue) => {
              setSearch(newValue || "")
            }}
            onInputChange={(event, newValue) => {
              setSearch(newValue || "")
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pesquisar produto"
                variant="outlined"
                size="medium"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  maxWidth: "1800px",
                  backgroundColor: "#F5F5F5",
                  marginBottom: "50px",
                  marginTop: "50px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    height: "80px",
                    "& fieldset": {
                      borderColor: "#CCCCCC",
                    },
                    "&:hover fieldset": {
                      borderColor: "#00509E",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#00509E",
                    },
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
                  },
                  "& .MuiInputBase-input": {
                    color: "#000000",
                    padding: "0 20px",
                    fontSize: "18px",
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "20px",
                    color: "#000000",
                    transform: "translate(20px, 28px)",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#00509E",
                  },
                  "& .MuiInputLabel-shrink": {
                    transform: "translate(20px, -6px) scale(0.75)",
                  },
                }}
              />
            )}
            sx={{
              width: "100%",
              maxWidth: "1800px",
            }}
          />
        </Box>

        {/* Cart Section */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            bgcolor: "#fff5f7",
            overflow: "visible",
            p: 2,
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#333",
                fontSize: "2rem",
              }}
            >
              Itens no carrinho
            </Typography>

            {/* Cart Items Table */}
            <Table sx={{ mb: 3 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: "25%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                    }}
                  >
                    Descrição
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "25%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Estado de conservação
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Valor
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "15%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Lote
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "20%",
                      color: "#333",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #e0e0e0",
                      p: 1,
                      textAlign: "center",
                    }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      bgcolor: "#f9f9f9",
                      borderBottom: index < cartItems.length - 1 ? "1px solid #e0e0e0" : "none",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        borderBottom: "none",
                      }}
                    >
                      {item.descricao}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {item.estado}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      R$ {item.valor.toFixed(2).replace(".", ",")}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        color: "#333",
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {item.lote}
                    </TableCell>
                    <TableCell
                      sx={{
                        p: 1,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ p: 0.5 }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Total Value */}
            <Box
              sx={{
                display: "inline-block",
                bgcolor: "#b3e5fc",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", color: "#333" }}>
                Valor Total: R$ {totalValue.toFixed(2).replace(".", ",")}
              </Typography>
            </Box>

            {/* Action Buttons - Aumentados */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#ffc1cc",
                  color: "black",
                  "&:hover": { bgcolor: "#ffb6c1" },
                  borderRadius: 10,
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  fontSize: "1rem",
                  minWidth: "180px",
                }}
              >
                Vender para fornecedor
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenSellModal}
                sx={{
                  bgcolor: "#ffc1cc",
                  color: "black",
                  "&:hover": { bgcolor: "#ffb6c1" },
                  borderRadius: 10,
                  px: 5,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  fontSize: "1rem",
                  minWidth: "140px",
                }}
              >
                Vender
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Modal de Venda */}
      <Dialog
        open={openSellModal}
        onClose={handleCloseSellModal}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            bgcolor: "white", // Alterado para branco
            maxWidth: "350px",
            width: "100%",
            m: 0,
            p: 0,
          },
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseSellModal}
              aria-label="close"
              sx={{ p: 0.5, mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.2rem",
                color: "#333",
                flex: 1,
                textAlign: "center",
                mr: 4,
              }}
            >
              Vender
            </Typography>
          </Box>

          {/* Tabela de Pagamento */}
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#ffc1cc",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Forma de pagamento
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#ffc1cc",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Total da compra
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  Pix
                </TableCell>
                <TableCell
                  sx={{
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    fontSize: "0.9rem",
                    p: 1.5,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  R$ 137,80
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Botões de Confirmação */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleCloseSellModal}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 10,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                fontSize: "1rem",
                width: "45%",
              }}
            >
              Sim
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseSellModal}
              sx={{
                bgcolor: "#ffc1cc",
                color: "black",
                "&:hover": { bgcolor: "#ffb6c1" },
                borderRadius: 10,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                fontSize: "1rem",
                width: "45%",
              }}
            >
              Não
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
