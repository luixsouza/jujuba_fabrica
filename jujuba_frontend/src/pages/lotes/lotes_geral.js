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
  FormControlLabel,
  Checkbox
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/router';
import axios from 'axios';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/icons-material/SearchOutlined';

const EstoquePage = () => {
  const [produtos, setProdutos] = useState([ ]);

  const BASE_URL = 'http://localhost:8080/api/produtos';// url da api 


  const [page, setPage] = useState(0);
  const [quantidadeExibida, setQuantidadeExibida] = useState(0); 
  const [valorExibido, setValorExibido] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const [isMaisVendidos, setIsMaisVendidos] = useState(false);
  const [isMaisBemAvaliados, setIsMaisBemAvaliados] = useState(false);
  const [isCNPJ, setIsCNPJ] = useState(false);
 
  

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
      router.push('./cadastrar_lote');
    }
  };
  useEffect(() => {
    if (produtos.length > 0) {
        const quantidade = produtos.reduce((acc, p) => acc + p.quantidade, 0);
        const valor = produtos.reduce((acc, p) => acc + p.quantidade * p.preco, 0);

        setQuantidadeExibida(quantidade);
        setValorExibido(valor);
    }
}, [produtos]);

  
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex',backgroundColor: '#ADD8E6', }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: '250px',
          padding: '20px',
          height: '100vh',
          overflow: 'auto',
          marginTop: '60px',
          backgroundColor: '#ADD8E6',
        }}
      >
        <Box sx={{ marginBottom: '20px', }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Controle de Lotes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Card
            sx={{
             
            }}
          >
           
          
          </Card>

          <Card
            sx={{
             

              
            }}
          >
          
           
          </Card>
          
        </Box>
        <Card sx={{ padding: '10px', bgcolor: 'white', boxShadow: 3, marginTop: '10px',  borderRadius: '25px',backgroundColor: '#FADADD',}}>
        <TableContainer sx={{ maxHeight: '600px' ,backgroundColor: '#FADADD',}}>
  <Table Header>
  <TableHead>
  <TableRow>
    <TableCell colSpan={6} align="left">
      <TextField
        label="Pesquisar lote "
        variant="outlined"
        size="medium"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          height: '50px',
          width: '500px',
          marginRight: '300px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '25px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            '& fieldset': {
              borderColor: '#CCCCCC',
            },
            '&:hover fieldset': {
              borderColor: '#00509E',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00509E',
            },
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiInputBase-input': {
            color: '#000000',
          },
          '& .MuiInputLabel-root': {
            color: '#000000',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00509E',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchOutlinedIcon sx={{ color: '#00509E' }} />
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '-50px',
          backgroundColor: '#FADADD',
        }}
      >
        <Button
          sx={{
            backgroundColor: ' #50abe4',
            color: 'white',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid  #50abe4',
            fontWeight: 'tine',
            fontSize: '15px',
            borderRadius: '60px',
            padding: '10px 0',
            width: '190px',
            height: '50px',
            textTransform: 'none',
          }}
          onClick={handleNavigateToRegister}
        >
          Adicionar
        </Button>
      </Box>
    </TableCell>
  </TableRow>
 
  <TableRow>
    
  </TableRow>
  <TableRow>
    <TableCell>
      <strong>Código</strong>
    </TableCell>
    <TableCell>
      <strong>Descrição</strong>
    </TableCell>
    
    <TableCell>
      <strong>Gênero</strong>
    </TableCell>
    <TableCell>
      <strong>Tamanho</strong>
    </TableCell>
    <TableCell>
      <strong>Ações</strong>
    </TableCell>
  </TableRow>
</TableHead>
    <TableBody>
      {produtosFiltrados
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((produto) => (
          <TableRow key={produto.id}>
            <TableCell>
              <img
                src={produto.imagem}
                alt={produto.nome}
                style={{ width: '50px', height: '50px', borderRadius: '5px' }}
              />
            </TableCell>
            <TableCell>{produto.nome}</TableCell>
            <TableCell>{produto.quantidade}</TableCell>
            <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
            <TableCell>R$ {(produto.quantidade * produto.preco).toFixed(2)}</TableCell>
            <TableCell>
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
          />
        </Card>
      </Box>
    </Box>
  );
};

export default EstoquePage;
