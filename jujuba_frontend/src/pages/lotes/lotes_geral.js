"use client"

import { useState, useEffect, useMemo } from "react"
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
  Autocomplete,
  InputAdornment,
} from "@mui/material"
import Sidebar from "../../components/sidebar"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SearchIcon from "@mui/icons-material/Search"
import { useRouter } from "next/router"
import { ProdutoService } from "../services/produto-service"

const EstoquePage = () => {
  const [produtos, setProdutos] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Dados mocados conforme solicitado
  const mockedData = {
    totalVendasUltimoMes: 27850.75,
    valorTotalHoje: 3450.25,
    dataCriacao: new Date().toLocaleDateString("pt-BR"),
    formasPagamento: ["Cartão de Crédito", "Cartão de Débito", "Pix", "Dinheiro", "Boleto"],
  }

  // Estatísticas calculadas a partir dos produtos
  const estatisticas = useMemo(() => {
    return ProdutoService.calcularEstatisticas(produtos)
  }, [produtos])

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    setLoading(true)
    try {
      const produtosData = await ProdutoService.getProdutos()
      setProdutos(produtosData)
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Corrigido o erro removendo o await desnecessário
  const handleDeleteProduto = (id) => {
    try {
      // Usando Promise.then em vez de await
      ProdutoService.deleteProduto(id).then((success) => {
        if (success) {
          setProdutos((prev) => prev.filter((produto) => produto.id !== id))
        } else {
          console.error("Falha ao excluir produto")
        }
      })
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
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

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => produto.descricao.toLowerCase().includes(search.toLowerCase()))
  }, [produtos, search])

  const descricaoOptions = useMemo(() => {
    return [...new Set(produtos.map((produto) => produto.descricao))]
  }, [produtos])

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

        <SummaryCards valorUltimoMes={mockedData.totalVendasUltimoMes} valorHoje={mockedData.valorTotalHoje} />

        <SearchField search={search} setSearch={setSearch} options={descricaoOptions} />

        <ProductTable
          produtosFiltrados={produtosFiltrados}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleDeleteProduto={handleDeleteProduto}
          router={router}
          loading={loading}
        />

        <AddProductButton handleNavigateToRegister={handleNavigateToRegister} />
      </Box>
    </Box>
  )
}

const SummaryCards = ({ valorUltimoMes, valorHoje }) => (
  <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
    <SummaryCard title="TOTAL DE VENDAS NO ÚLTIMO MÊS" value={valorUltimoMes} />
    <SummaryCard title="VALOR TOTAL DE HOJE" value={valorHoje} />
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
    Cadastrar Lote
  </Button>
)

const SearchField = ({ search, setSearch, options }) => (
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
)

const ProductTable = ({
  produtosFiltrados,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteProduto,
  router,
  loading,
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
      Produtos em Estoque
    </Typography>

    <TableContainer sx={{ maxHeight: "600px", borderRadius: "10px", overflow: "hidden" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {["Descrição", "Marca", "Tamanho", "Estado", "Gênero", "Preço", "Ações"].map((header) => (
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
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Carregando produtos...
              </TableCell>
            </TableRow>
          ) : produtosFiltrados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          ) : (
            produtosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produto) => (
              <TableRow key={produto.id} hover>
                <TableCell>{produto.descricao}</TableCell>
                <TableCell>{produto.marca}</TableCell>
                <TableCell>{produto.tamanho}</TableCell>
                <TableCell>{produto.estadoConservacao}</TableCell>
                <TableCell>{produto.genero}</TableCell>
                <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => router.push(`./visualizar_produto?id=${produto.id}`)}
                    sx={{ marginRight: 1, color: "#00509E" }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => router.push(`./editar_produto?id=${produto.id}`)}
                    sx={{ marginRight: 1, color: "#00509E" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProduto(produto.id)} sx={{ color: "#00509E" }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
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
      labelRowsPerPage="Itens por página"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
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

