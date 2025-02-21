import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/router';
import axios from 'axios';

const EstoquePage = () => {
  const [produtos, setProdutos] = useState([ ]);

  const BASE_URL = 'http://localhost:8080/api/produtos';// url da api 


  const [page, setPage] = useState(0);
  const [quantidadeExibida, setQuantidadeExibida] = useState(0); 
  const [valorExibido, setValorExibido] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const router = useRouter();
  

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error.message);
      }
    };
    fetchProdutos();
  }, []);

  // função para excluir um produto
  const handleDeleteProduto = async (id) => {
    try {
      await axios.delete(`${BASE_URL}?id=${id}`);
      setProdutos((prev) => prev.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error.message);
    }
  };

  

  const handleNavigateToRegister = () => {
    if (router) {
      router.push('./cadastro_produto');
    }
  };
  useEffect(() => {
    if (produtos.length > 0) {
        // calcula a quantidade total e o valor total  dos produtos
        const quantidade = produtos.reduce((acc, p) => acc + p.quantidade, 0);
        const valor = produtos.reduce((acc, p) => acc + p.quantidade * p.preco, 0);

        setQuantidadeExibida(quantidade);
        setValorExibido(valor);
    }
}, [produtos]);

  // filtra os  produtos pelo campo de pesquisa
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex',backgroundColor: '#9AE4FF',minHeight: '100vh'  }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: '250px',
          padding: '20px',
          height: '100vh',
          overflow: 'hidden',
          marginTop: '50px',
        }}
      >
        <Box sx={{ marginBottom: '50px' }}>
          <Typography variant="h4" sx={{  justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '50px', }}>
            Controle de Estoque
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Card
            sx={{
              flex: 0.5,
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              borderRadius: '50px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              backgroundColor: '#F5F5F5'
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            TOTAL DE VENDAS NO ÚLTIMO MÊS
            </Typography>
            <Typography variant="h4" sx={{  }}>
             R$ {valorExibido.toFixed(2)}
            </Typography>
          </Card>

          <Card
            sx={{
              flex: 0.5,
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '30px',
              borderRadius: '50px',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              backgroundColor: '#F5F5F5'
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: '10px' }}>
             VALOR TOTAL DE HOJE 
            </Typography>
            <Typography variant="h4" sx={{  }}>
              R$ {valorExibido.toFixed(2)}
            </Typography>
          </Card>
          <Button
      sx={{
        marginLeft: '40px', 
        alignSelf: 'center',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
        width:'300px',
        height: '120px',
        borderRadius: '70px',
        backgroundColor: '#FADADD',
        textAlign: 'center',
        display: 'flex',
        color: 'black',
        fontSize: '20px',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 20px',
      }}
      variant="contained"
    >
      Cadastar Lote
  </Button>
          
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
         <TextField 
  label="Pesquisar"
  variant="outlined"
  size="medium"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  sx={{
    height: '80px',
    width: '1800px',
    backgroundColor: '#F5F5F5', 
    marginRight: '10px',
    marginBottom: '50px',
    marginTop: '50px',
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F5F5F5', 
      color: '#000000',
      height: '160px',
      '& fieldset': {
        borderColor: '#CCCCCC',
      },
      '&:hover fieldset': {
        borderColor: '#00509E',
      },
      '&.Mui-focused fieldset': {},
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)', 
    },
    '& .MuiInputBase-input': {
      color: '#000000',
    },
    '& .MuiInputLabel-root': {
      transform: 'translateY(25px) translateX(50px)', 
      color: '#000000',
      fontSize: '20px',  
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#00509E',
    },
  }}
/>
        </Box>

        <Card
  sx={{
    padding: '20px',
    bgcolor: 'white',
    marginTop: '20px',
    backgroundColor: '#F5F5F5', 
    borderRadius: '20px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 'bold',
      textAlign: 'LEFT',
      marginBottom: '40px',
      fontSize: '35px',
      color: '#333',
      marginTop: '20px',
    }}
  >
    Últimos itens vendidos
  </Typography>

  <TableContainer sx={{ maxHeight: '600px', borderRadius: '10px', overflow: 'hidden', }}>
    <Table stickyHeader>
      <TableHead>
      <TableRow>
    <TableCell 
      sx={{ 
        fontSize: '18px', 
        fontWeight: 'normal', 
        backgroundColor: '#FADADD', 
        borderRight: '2px solid #F5F5F5',
        textAlign: 'center', 
      }}
    >
    Código do produto
    </TableCell>
    <TableCell 
      sx={{ 
        fontSize: '18px', 
        backgroundColor: '#FADADD', 
        fontWeight: 'normal', 
        borderRight: '2px solid #F5F5F5',
        textAlign: 'center',
      }}
    >
     Data da venda
    </TableCell>
    <TableCell 
      sx={{ 
        fontSize: '18px', 
        fontWeight: 'lighter', 
        backgroundColor: '#FADADD', 
        borderRight: '2px solid #F5F5F5',
        textAlign: 'center',  
      }}
    >
    Fornecedora
    </TableCell>
    <TableCell 
      sx={{ 
        fontSize: '18px', 
        fontWeight: 'normal', 
        backgroundColor: '#FADADD', 
        borderRight: '2px solid #F5F5F5',
        textAlign: 'center', 
      }}
    >
      Forma de pagamento
    </TableCell>
    <TableCell 
      sx={{ 
        fontSize: '18px', 
        fontWeight: 'normal', 
        backgroundColor: '#FADADD', 
        borderRight: '2px solid #F5F5F5',
        textAlign: 'center', 
      }}
    >
    Valor da venda
    </TableCell>
    <TableCell 
      align="center" 
      sx={{ 
        fontSize: '18px', 
        fontWeight: 'normal', 
        backgroundColor: '#FADADD', 
        borderRight: '2px solid #F5F5F5',
        textAlign: 'center', 
      }}
    >
     Ações
    </TableCell>
  </TableRow>
      </TableHead>
      <TableBody>
        {produtosFiltrados
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((produto) => (
            <TableRow key={produto.id} hover>
              <TableCell>
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '5px',
                    objectFit: 'cover',
                  }}
                />
              </TableCell>
              <TableCell>{produto.nome}</TableCell>
              <TableCell>{produto.quantidade}</TableCell>
              <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
              <TableCell>R$ {(produto.quantidade * produto.preco).toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton sx={{ marginRight: 1, color: '#00509E' }}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton sx={{ marginRight: 1, color: '#00509E' }}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteProduto(produto.id)}
                  sx={{ color: '#00509E' }}
                >
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
      marginTop: '10px',
      bgcolor: '#F5F5F5',
      borderRadius: '10px',
     
    }}
  />
</Card>
 <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px', }}>
        <Button
    sx={{
      backgroundColor: '#FADADD',
      color: 'black',
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
      border: '2px solid #FADADD',
      fontWeight: 'bold',
      fontSize: '20px',
      borderRadius: '60px',
      padding: '10px 0',
      width: '300px', 
      height: '50px',
      textTransform: 'none',
    }}
    onClick={handleNavigateToRegister}
  >
    Cadastrar produto 
  </Button>
</Box>
      </Box>
    </Box>
  );
};

export default EstoquePage;
