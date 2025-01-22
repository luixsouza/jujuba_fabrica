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
  InputAdornment,
} from '@mui/material';
import Sidebar from '../../components/sidebar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import axios from 'axios';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx'; 
import SearchIcon from '@mui/icons-material/Search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

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

  const deleteFornecedora = async (id, values) => {
    try {
      const formData = new FormData();
      formData.append(
        "fornecedora",
        JSON.stringify({
          id,
          nome: values.nome,
          contato: values.contato,
          endereco: values.endereco,
          chavePix: values.chavePix,
        })
      );
      const response = await axios.post(`${BASE_URL}/delete`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('Fornecedor deletado com sucesso:', response.data);
      setFornecedores((prev) => prev.filter((fornecedora) => fornecedora.id !== id));
      alert('Fornecedor deletado com sucesso!');
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      alert('Erro ao deletar fornecedor.');
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

 

  const handleExportToExcel = () => {
   
    console.log('Exportando fornecedores:', fornecedores);
  
    
    const headers = ['Nome', 'Contato', 'Endereço', 'Chave Pix'];
  
    
    const dataForExport = fornecedores.length > 0
      ? fornecedores.map((fornecedora) => ({
          Nome: fornecedora.nome || 'N/A',
          Contato: fornecedora.contato || 'N/A',
          Endereço: fornecedora.endereco || 'N/A',
          'Chave Pix': fornecedora.chavePix || 'N/A',
        }))
      : [{ Nome: 'N/A', Contato: 'N/A', Endereço: 'N/A', 'Chave Pix': 'N/A' }]; 
  
 
    const sheetData = [headers, ...dataForExport.map(item => Object.values(item))];
  
    // Criar a planilha a partir de um Array of Arrays (aoa)
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  
    // Criar o workbook
    const workbook = XLSX.utils.book_new();
  
    // Adicionar a planilha ao livro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fornecedores');
  
  
    XLSX.writeFile(workbook, 'fornecedores.xlsx');
  };
  const filteredFornecedores = fornecedores.filter((fornecedora) => {
    return fornecedora.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#blue', minHeight: '100vh',backgroundColor: '#F0E1D2'  }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          marginLeft: '290px',
          maxHeight: '1000px',
          overflow: 'auto',
          backgroundColor: '#F0E1D2',
          paddingTop: '3rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', 
            marginBottom: '50px',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Fornecedores
          </Typography>
          <Button
            sx={{

              color: 'black',
            
              borderRadius: '25px',
              padding: '10px 20px',
              textTransform: 'none',
              
              display: 'flex',
              alignItems: 'center',
              marginRight: '140px',
              width:'180px',
              '&:hover': {
                backgroundColor: ' #50abe4', 
              },
            }}
            onClick={handleExportToExcel}
          >
            <FileDownloadOutlinedIcon sx={{ marginRight: '8px' }} />
            Exportar Excel
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
        label="Pesquisar fornecedor"
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
              <SearchOutlinedIcon sx={{ color: '#00509E' }} /> {/* Novo ícone de pesquisa */}
            </InputAdornment>
          ),
        }}
      />
          <Button
            sx={{
              backgroundColor: '#50abe4',
              color: 'white',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              border: '2px solid #50abe4',
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
            Cadastrar fornecedor
          </Button>
        </Box>

        <Card
          sx={{
            padding: '20px',
            bgcolor: 'white',
            boxShadow: 3,
            borderRadius: '25px',
            width: '80%',
            margin: '0 auto',
            border: "'2px solid #B0B0B0'",
          }}
        >
          <TableContainer
            sx={{ maxHeight: '1000px', width: '100%', margin: '0 auto' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Nome</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Contato</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Endereço</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Chave Pix</strong>
                  </TableCell>
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
                          onClick={() => deleteFornecedora(fornecedora.id)}
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
