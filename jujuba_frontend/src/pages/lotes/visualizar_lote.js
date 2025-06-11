"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import HomeIcon from "@mui/icons-material/Home"
import EditIcon from "@mui/icons-material/Edit"
import { useSearchParams, useRouter } from "next/navigation"
import Sidebar from "../../components/sidebar"

// Importando as funções da API
import { getLoteById, getAllLotes } from "../api/lotes"

export default function VisualizarLotePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loteInfo, setLoteInfo] = useState(null)
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLoteDetails = async () => {
      const id = searchParams.get("id")
      if (!id) return

      try {
        setLoading(true)
        const loteData = await getLoteById(id)

        if (loteData) {
          const valorTotal = calcularValorTotal(loteData.produtos || [])

          setLoteInfo({
            id: loteData.id,
            numero: `L${loteData.id}`,
            data: new Date(loteData.dataCriacao).toLocaleDateString("pt-BR"),
            fornecedora: loteData.fornecedora?.nome || "Fornecedora não especificada",
            totalProdutos: loteData.totalProdutos || (loteData.produtos ? loteData.produtos.length : 0),
            valorTotal: valorTotal,
            status: loteData.status || "ATIVO",
          })

          if (loteData.produtos && Array.isArray(loteData.produtos)) {
            setProdutos(loteData.produtos)
          } else {
            setProdutos([])
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do lote:", error)
        setError("Não foi possível carregar os detalhes do lote.")
      } finally {
        setLoading(false)
      }
    }

    fetchLoteDetails()
  }, [searchParams])

  const calcularValorTotal = (produtos) => {
    return produtos.reduce((total, produto) => total + produto.preco * (produto.quantidade || 1), 0)
  }

  const handleGoBack = () => {
    router.push("./lotes_geral")
  }

  const handleGoHome = () => {
    router.push("../fornecedores/fornecedores_tabela")
  }

  const handleEditLote = () => {
    const id = searchParams.get("id")
    if (id) {
      router.push(`./editar_lote?id=${id}`)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
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
          <CircularProgress size={60} sx={{ color: "#FADADD" }} />
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
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
          <Typography variant="h6" color="error" sx={{ marginBottom: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={handleGoBack}
            sx={{
              backgroundColor: "#FADADD",
              color: "black",
              "&:hover": {
                backgroundColor: "#F8BBD9",
              },
            }}
          >
            Voltar
          </Button>
        </Box>
      </Box>
    )
  }

  if (!loteInfo) {
    return (
      <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
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
          <Typography variant="h6">Lote não encontrado</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: "250px",
          padding: "20px",
          marginTop: "50px",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <IconButton
            onClick={handleGoBack}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontSize: "50px",
              color: "#000000",
              textAlign: "center",
            }}
          >
            VISUALIZAR LOTE
          </Typography>

          <IconButton
            onClick={handleGoHome}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Informações do Lote */}
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#000000",
              textAlign: "center",
            }}
          >
            Informações do Lote {loteInfo.numero}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Número do Lote:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "18px" }}>
                  {loteInfo.numero}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Data de Criação:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "18px" }}>
                  {loteInfo.data}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Fornecedora:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "18px" }}>
                  {loteInfo.fornecedora}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Total de Produtos:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "18px" }}>
                  {loteInfo.totalProdutos}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Valor Total:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "18px", color: "#2E7D32" }}>
                  R$ {loteInfo.valorTotal.toFixed(2).replace(".", ",")}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  padding: "20px",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                  Status:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "18px" }}>
                  {loteInfo.status}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Card>

        {/* Tabela de Produtos */}
        <Card
          sx={{
            borderRadius: "20px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#000000",
              textAlign: "center",
            }}
          >
            Produtos do Lote
          </Typography>

          <TableContainer>
            <Table stickyHeader aria-label="produtos table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    ID
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Descrição
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Marca
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Tamanho
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Gênero
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Estado
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Quantidade
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Preço Unitário
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "18px", backgroundColor: "#FADADD" }}>
                    Subtotal
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtos.length > 0 ? (
                  produtos.map((produto, index) => (
                    <TableRow key={produto.id || index} hover>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        {produto.id}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        {produto.descricao || produto.nome || "Sem descrição"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        {produto.marca || "Não informado"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        {produto.tamanho || "Não informado"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        {produto.genero || "Não informado"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        {produto.estadoConservacao || "Não informado"}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        {produto.quantidade || 1}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px" }}>
                        R$ {(produto.preco || 0).toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell align="center" sx={{ fontSize: "16px", fontWeight: "bold", color: "#2E7D32" }}>
                        R$ {((produto.preco || 0) * (produto.quantidade || 1)).toFixed(2).replace(".", ",")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ fontSize: "18px", padding: "40px" }}>
                      Nenhum produto encontrado neste lote
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Botão de Editar */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <Button
            sx={{
              backgroundColor: "#FADADD",
              color: "black",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
              border: "2px solid #FADADD",
              fontWeight: "bold",
              fontSize: "20px",
              borderRadius: "60px",
              padding: "10px 0",
              width: "300px",
              height: "50px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F8BBD9",
                transform: "translateY(-2px)",
              },
            }}
            onClick={handleEditLote}
            variant="contained"
            startIcon={<EditIcon />}
          >
            Editar Lote
          </Button>
        </Box>
      </Box>
    </Box>
  )
}