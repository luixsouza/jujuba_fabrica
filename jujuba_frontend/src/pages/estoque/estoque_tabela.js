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
  IconButton,
  TablePagination,
  TextField,
  Button,
} from "@mui/material"
import Sidebar from "../../components/sidebar"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useRouter } from "next/router"
import axios from "axios"

const BASE_URL = "http://localhost:8080/api/produtos"

const EstoquePage = () => {
  const [produtos, setProdutos] = useState([])
  const [page, setPage] = useState(0)
  const [quantidadeExibida, setQuantidadeExibida] = useState(0)
  const [valorExibido, setValorExibido] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchProdutos()
  }, [])

  useEffect(() => {
    if (produtos.length > 0) {
      const quantidade = produtos.reduce((acc, p) => acc + p.quantidade, 0)
      const valor = produtos.reduce((acc, p) => acc + p.quantidade * p.preco, 0)
      setQuantidadeExibida(quantidade)
      setValorExibido(valor)
    }
  }, [produtos])

  const fetchProdutos = async () => {
    try {
      const response = await axios.get(BASE_URL)
      setProdutos(response.data)
    } catch (error) {
      console.error("Erro ao buscar produtos:", error.message)
    }
  }

  const handleDeleteProduto = async (id) => {
    try {
      await axios.delete(`${BASE_URL}?id=${id}`)
      setProdutos((prev) => prev.filter((produto) => produto.id !== id))
    } catch (error) {
      console.error("Erro ao excluir produto:", error.message)
    }
  }

  const handleNavigateToRegister = () => {
    if (router) {
      router.push("./cadastro_produto")
    }
  }

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const produtosFiltrados = produtos.filter((produto) => produto.nome.toLowerCase().includes(search.toLowerCase()))

  return (
    <Box sx={{ display: "flex", backgroundColor: "#9AE4FF", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: "250px",
          padding: "20px",
          height: "150vh",
          overflow: "hidden",
          marginTop: "50px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "50px",
            marginBottom: "50px",
          }}
        >
          Controle de Estoque
        </Typography>

        <SummaryCards valorExibido={valorExibido} />
        <SearchField search={search} setSearch={setSearch} />
        <ProductTable
          produtosFiltrados={produtosFiltrados}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleDeleteProduto={handleDeleteProduto}
        />
        <AddProductButton handleNavigateToRegister={handleNavigateToRegister} />
      </Box>
    </Box>
  )
}

const SummaryCards = ({ valorExibido }) => (
  <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
    <SummaryCard title="TOTAL DE VENDAS NO ÚLTIMO MÊS" value={valorExibido} />
    <SummaryCard title="VALOR TOTAL DE HOJE" value={valorExibido} />
    <CadastrarLoteButton />
  </Box>
)

const SummaryCard = ({ title, value }) => (
  <Card
    sx={{
      flex: 0.5,
      height: "180px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      borderRadius: "50px",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
      backgroundColor: "#F5F5F5",
    }}
  >
    <Typography variant="h6" sx={{ marginBottom: "10px" }}>
      {title}
    </Typography>
    <Typography variant="h4">R$ {value.toFixed(2)}</Typography>
  </Card>
)

const CadastrarLoteButton = () => (
  <Button
    sx={{
      marginLeft: "40px",
      alignSelf: "center",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
      width: "300px",
      height: "120px",
      borderRadius: "70px",
      backgroundColor: "#FADADD",
      textAlign: "center",
      display: "flex",
      color: "black",
      fontSize: "20px",
      fontWeight: "bold",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 20px",
    }}
    variant="contained"
  >
    Cadastar Lote
  </Button>
)

const SearchField = ({ search, setSearch }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "30px",
    }}
  >
    <TextField
      label="Pesquisar"
      variant="outlined"
      size="medium"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
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
  </Box>
)

const ProductTable = ({
  produtosFiltrados,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteProduto,
}) => (
  <Card
    sx={{
      padding: "20px",
      bgcolor: "white",
      marginTop: "20px",
      backgroundColor: "#F5F5F5",
      borderRadius: "20px",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        textAlign: "LEFT",
        marginBottom: "40px",
        fontSize: "35px",
        color: "#333",
        marginTop: "20px",
      }}
    >
      Últimos itens vendidos
    </Typography>

    <TableContainer sx={{ maxHeight: "600px", borderRadius: "10px", overflow: "hidden" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {["Código do produto", "Data da venda", "Fornecedora", "Forma de pagamento", "Valor da venda", "Ações"].map(
              (header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontSize: "18px",
                    fontWeight: "normal",
                    backgroundColor: "#FADADD",
                    borderRight: "2px solid #F5F5F5",
                    textAlign: "center",
                  }}
                >
                  {header}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {produtosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produto) => (
            <TableRow key={produto.id} hover>
              <TableCell>
                <img
                  src={produto.imagem || "/placeholder.svg"}
                  alt={produto.nome}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                    objectFit: "cover",
                  }}
                />
              </TableCell>
              <TableCell>{produto.nome}</TableCell>
              <TableCell>{produto.quantidade}</TableCell>
              <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
              <TableCell>R$ {(produto.quantidade * produto.preco).toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton sx={{ marginRight: 1, color: "#00509E" }}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton sx={{ marginRight: 1, color: "#00509E" }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteProduto(produto.id)} sx={{ color: "#00509E" }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={produtosFiltrados.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25]}
      sx={{
        marginTop: "10px",
        bgcolor: "#F5F5F5",
        borderRadius: "10px",
      }}
    />
  </Card>
)

const AddProductButton = ({ handleNavigateToRegister }) => (
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
      }}
      onClick={handleNavigateToRegister}
    >
      Cadastrar produto
    </Button>
  </Box>
)

export default EstoquePage

