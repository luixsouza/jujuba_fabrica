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
  TextField,
  Button,
  TablePagination,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useRouter } from 'next/router';

const BASE_URL = 'http://localhost:8080/api/fornecedoras';

const FornecedoresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setFornecedores(response.data);
      } catch (error) {
        console.error('Erro ao buscar fornecedores:', error.message);
      }
    };
    fetchFornecedores();
  }, []);

  const handleDeleteFornecedor = async (id) => {
    try {
      await axios.delete(`${BASE_URL}?id=${id}`);
      setFornecedores((prev) => prev.filter((fornecedor) => fornecedor.id !== id));
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNavigateToRegister = () => {
    if (router) {
      router.push('./cadastro_fornecedores');
    }
  };

  const handleEditNavigation = (id) => {
    router.push(`./editar_fornecedores?id=${id}`);
  };

  const handleNavigation = () => {
    router.push('./visualizar_fornecedor');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredFornecedores = fornecedores.filter((fornecedora) => {
    return fornecedora.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: '250px',
          padding: '20px',
          maxHeight: '1000px', 
          overflow: 'auto',
          marginTop: '60px',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
          Fornecedores
        </Typography>
        <Card
          sx={{
            padding: '20px',
            bgcolor: 'white',
            boxShadow: 3,
            marginTop: '10px',
            borderRadius: '25px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <TextField
              label="Pesquisar produto"
              variant="outlined"
              size="small"
              value={search}
              align="left"
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: '800px', // Aumenta a largura
                height: '50px', // Aumenta a altura
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px', // Arredonda as bordas
                  '& fieldset': {
                    borderColor: '#00509E', // Cor das bordas
                    borderWidth: '2px', // Espessura das bordas
                  },
                  '&:hover fieldset': {
                    borderColor: '#00509E', // Cor ao passar o mouse
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00509E', // Cor ao focar
                  },
                },
              }}
            />
            <Button
              sx={{
                backgroundColor: '#00509E',
                color: 'white',
                borderRadius: '30px',
                padding: '8px 20px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#003b6e',
                },
              }}
              onClick={handleNavigateToRegister}
            >
              Adicionar
            </Button>
          </Box>
            <TableContainer sx={{ maxHeight: '1000px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Contato</strong></TableCell>
                  <TableCell><strong>Endereço</strong></TableCell>
                  <TableCell><strong>Chave Pix</strong></TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFornecedores
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((fornecedora) => (
                    <TableRow key={fornecedora.id}>
                      <TableCell>{fornecedora.nome}</TableCell>
                      <TableCell>{fornecedora.contato}</TableCell>
                      <TableCell>{fornecedora.endereco}</TableCell>
                      <TableCell>{fornecedora.chavePix}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={handleNavigation}
                          sx={{ marginRight: 1, color: '#00509E' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditNavigation(fornecedora.id)}
                          sx={{ marginRight: 1, color: '#00509E' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteFornecedor(fornecedora.id)}
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
            count={filteredFornecedores.length}
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

export default FornecedoresPage;
