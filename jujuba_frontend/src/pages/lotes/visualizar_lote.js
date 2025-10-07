"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer, ////
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Chip,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";

// Importando as funções da API
import { getLoteById } from "../api/lotes";

export default function VisualizarLotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loteInfo, setLoteInfo] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoteDetails = async () => {
      const id = searchParams.get("id");
      if (!id) return;

      try {
        setLoading(true);
        const loteData = await getLoteById(id);

        if (loteData) {
          const valorTotal = calcularValorTotal(loteData.produtos || []);

          setLoteInfo({
            id: loteData.id,
            numero: `L${loteData.id}`,
            data: new Date(loteData.dataCriacao).toLocaleDateString("pt-BR"),
            fornecedora:
              loteData.fornecedora?.nome || "Fornecedora não especificada",
            totalProdutos:
              loteData.totalProdutos ||
              (loteData.produtos ? loteData.produtos.length : 0),
            valorTotal: valorTotal,
            status: loteData.status || "ATIVO",
          });

          if (loteData.produtos && Array.isArray(loteData.produtos)) {
            setProdutos(loteData.produtos);
          } else {
            setProdutos([]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do lote:", error);
        setError("Não foi possível carregar os detalhes do lote.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoteDetails();
  }, [searchParams]);

  const calcularValorTotal = (produtos) => {
    return produtos.reduce(
      (total, produto) =>
        total +
        produto.preco * (produto.quantidade != null ? produto.quantidade : 1),
      0
    );
  };

  const handleGoBack = () => {
    router.push("./lotes_geral");
  };

  const handleGoHome = () => {
    router.push("../fornecedores/fornecedores_tabela");
  };

  const handleEditLote = () => {
    const id = searchParams.get("id");
    if (id) {
      router.push(`./editar_lote?id=${id}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
      >
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            marginLeft: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: 4,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "20px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#FADADD" }} />
            <Typography variant="h6" sx={{ color: "#333", fontWeight: "500" }}>
              Carregando detalhes do lote...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
      >
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            marginLeft: "250px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Paper
            sx={{
              padding: 4,
              borderRadius: "20px",
              textAlign: "center",
              background: "linear-gradient(135deg, #FFE4E1 0%, #FADADD 100%)",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography
              variant="h6"
              color="error"
              sx={{ marginBottom: 3, fontWeight: "bold" }}
            >
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={handleGoBack}
              sx={{
                backgroundColor: "#FADADD",
                color: "black",
                borderRadius: "25px",
                padding: "12px 24px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#F8BBD9",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 6px 16px rgba(248, 187, 217, 0.6)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Voltar
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  if (!loteInfo) {
    return (
      <Box
        sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
      >
        <Sidebar />
        <Box
          sx={{
            flex: 1,
            marginLeft: "250px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h6" sx={{ color: "#333", fontWeight: "500" }}>
            Lote não encontrado
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: "250px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            padding: "20px 0",
          }}
        >
          <IconButton
            onClick={handleGoBack}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": {
                backgroundColor: "#9AE4FF",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBackIcon sx={{ color: "#333" }} />
          </IconButton>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2rem", md: "3rem" },
                color: "#333",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                marginBottom: 1,
              }}
            >
              VISUALIZAR LOTE
            </Typography>
            <Chip
              label={loteInfo.numero}
              sx={{
                backgroundColor: "#FADADD",
                color: "#333",
                fontWeight: "bold",
                fontSize: "16px",
                padding: "8px 16px",
                boxShadow: "0px 4px 12px rgba(250, 173, 221, 0.4)",
              }}
            />
          </Box>

          <IconButton
            onClick={handleGoHome}
            sx={{
              backgroundColor: "#9AE4FF",
              "&:hover": {
                backgroundColor: "#9AE4FF",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <HomeIcon sx={{ color: "#333" }} />
          </IconButton>
        </Box>

        {/* Informações do Lote */}
        <Card
          sx={{
            borderRadius: "25px",
            background: "white",
            boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.1)",
            padding: "40px",
            marginBottom: "30px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: "#FADADD",
                margin: "0 auto 16px",
                boxShadow: "0px 8px 20px rgba(250, 173, 221, 0.3)",
              }}
            >
              <InventoryIcon sx={{ fontSize: 40, color: "#333" }} />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: 1,
              }}
            >
              Informações do Lote {loteInfo.numero}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666", fontSize: "18px" }}
            >
              Detalhes completos do lote selecionado
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "24px",
                  background:
                    "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
                  borderRadius: "20px",
                  boxShadow: "0px 8px 20px rgba(250, 173, 221, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 28px rgba(250, 173, 221, 0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <InventoryIcon sx={{ color: "#333", fontSize: 20 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Número do Lote
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
                >
                  {loteInfo.numero}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "24px",
                  background:
                    "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
                  borderRadius: "20px",
                  boxShadow: "0px 8px 20px rgba(154, 228, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 28px rgba(154, 228, 255, 0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <CalendarTodayIcon sx={{ color: "#333", fontSize: 20 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Data de Criação
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
                >
                  {loteInfo.data}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "24px",
                  background:
                    "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
                  borderRadius: "20px",
                  boxShadow: "0px 8px 20px rgba(200, 230, 201, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 28px rgba(200, 230, 201, 0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <BusinessIcon sx={{ color: "#333", fontSize: 20 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Fornecedor
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
                >
                  {loteInfo.fornecedora}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "24px",
                  background:
                    "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
                  borderRadius: "20px",
                  boxShadow: "0px 8px 20px rgba(255, 224, 178, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 28px rgba(255, 224, 178, 0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <InventoryIcon sx={{ color: "#333", fontSize: 20 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Total de Produtos
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
                >
                  {loteInfo.totalProdutos}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "24px",
                  background:
                    "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
                  borderRadius: "20px",
                  boxShadow: "0px 8px 20px rgba(165, 214, 167, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 28px rgba(165, 214, 167, 0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <AttachMoneyIcon sx={{ color: "#2E7D32", fontSize: 20 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Valor Total
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#2E7D32",
                  }}
                >
                  R$ {loteInfo.valorTotal.toFixed(2).replace(".", ",")}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "24px",
                  background:
                    "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
                  borderRadius: "20px",
                  boxShadow: "0px 8px 20px rgba(187, 222, 251, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 12px 28px rgba(187, 222, 251, 0.3)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <CheckCircleIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#333" }}
                  >
                    Status
                  </Typography>
                </Box>
                <Chip
                  label={loteInfo.status}
                  sx={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "8px 16px",
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Card>

        {/* Tabela de Produtos */}
        <Card
          sx={{
            padding: "20px",
            bgcolor: "white",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
            borderRadius: "25px",
            backgroundColor: "#F5F5F5",
            width: "100%",
            margin: "0 auto",
            border: "2px solid #F5F5F5",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: 1,
              }}
            >
              Produtos do Lote
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666", fontSize: "18px" }}
            >
              Lista completa de produtos incluídos neste lote
            </Typography>
          </Box>

          <TableContainer
            sx={{
              maxHeight: "600px",
              borderRadius: "10px",
              overflow: "auto",
              backgroundColor: "#F5F5F5",
              width: "100%",
            }}
          >
            <Table stickyHeader aria-label="produtos table">
              <TableHead>
                <TableRow>
                  {[
                    "ID",
                    "Descrição",
                    "Marca",
                    "Tamanho",
                    "Gênero",
                    "Estado",
                    "Quantidade",
                    "Preço Unitário",
                    "Subtotal",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      sx={{
                        fontSize: "18px",
                        textAlign: "center",
                        backgroundColor: "#FADADD",
                        borderRight: "2px solid #F5F5F5",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos.length > 0 ? (
                  produtos.map((produto, index) => (
                    <TableRow
                      key={produto.id || index}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(250, 173, 221, 0.1)",
                          transform: "scale(1.01)",
                        },
                        transition: "all 0.2s ease",
                        "&:nth-of-type(even)": {
                          backgroundColor: "rgba(245, 245, 245, 0.5)",
                        },
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#666",
                        }}
                      >
                        {produto.id}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "14px", maxWidth: "200px" }}
                      >
                        {produto.descricao || produto.nome || "Sem descrição"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "14px" }}>
                        {produto.marca || "Não informado"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "14px" }}>
                        {produto.tamanho || "Não informado"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "14px" }}>
                        {produto.genero || "Não informado"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "14px" }}>
                        <Chip
                          label={produto.estadoConservacao || "Não informado"}
                          size="small"
                          sx={{
                            backgroundColor: "#E3F2FD",
                            color: "#1976d2",
                            fontWeight: "500",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        {produto.quantidade || 1}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "14px",
                          color: "#2E7D32",
                          fontWeight: "500",
                        }}
                      >
                        R$ {(produto.preco || 0).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#2E7D32",
                        }}
                      >
                        R${" "}
                        {((produto.preco || 0) * (produto.quantidade || 1))
                          .toFixed(2)
                          .replace(".", ",")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ fontSize: "18px", padding: "60px", color: "#666" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 48, color: "#ccc" }} />
                        <Typography variant="h6" sx={{ color: "#666" }}>
                          Nenhum produto encontrado neste lote
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Botão de Editar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <Button
            sx={{
              background: "linear-gradient(135deg, #FADADD 0%, #FFE4E1 100%)",
              color: "#333",
              boxShadow: "0px 12px 24px rgba(250, 173, 221, 0.4)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              fontWeight: "bold",
              fontSize: "18px",
              borderRadius: "50px",
              padding: "16px 48px",
              minWidth: "280px",
              height: "60px",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #F8BBD9 0%, #FADADD 100%)",
                transform: "translateY(-4px)",
                boxShadow: "0px 16px 32px rgba(250, 173, 221, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={handleEditLote}
            variant="contained"
            startIcon={<EditIcon sx={{ fontSize: 24 }} />}
          >
            Editar Lote
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
