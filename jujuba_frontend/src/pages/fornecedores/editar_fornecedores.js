import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Grid, CircularProgress } from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ArrowBack, Home } from '@mui/icons-material'; 

const BASE_URL = 'http://localhost:8080/api/fornecedoras';

export default function FornecedoresEdit() {
    const router = useRouter();
    const { id: fornecedoraid } = router.query;
    const [newValues, setNewValues] = useState({});
    const [loading, setLoading] = useState(false); // estado de carregamento// mudar pra true quando tiver for clicado 
    const [error, setError] = useState(null);
    const [OldValues, setOldValues] = useState({});

    // busca os dados do fornecedor 
    useEffect(() => {
        const fetchFornecedoraData = async () => {
            if (fornecedoraid) {
                try {
                    const response = await axios.get(`${BASE_URL}/${fornecedoraid}`);
                    setOldValues({
                        Nome: response.data.nome || "N/A",
                        Contato: response.data.contato || "N/A",
                        Endereço: response.data.endereco || "N/A",
                        chavePix: response.data.chavePix || "N/A",
                        contrato: response.data.contratoUrl || null, 
                    });
                } catch (error) {
                    console.error("Erro ao buscar fornecedor:", error.message);
                    setError('Erro ao carregar dados');
                } finally {
                    setLoading(false); 
                }
            }
        };

        fetchFornecedoraData();
    }, [fornecedoraid]);

    // atualiza o estado dos dados quando os campos são alterados
    const handleChange = (event) => {
        const { name, value } = event.target;
        setOldValues((prev) => ({ ...prev, [name]: value }));
        setNewValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) return; // Impede múltiplos envios enquanto está carregando

        setLoading(true); // Ativa o carregamento
        setError(null); // Reseta qualquer erro anterior

        const formData = new FormData();
        formData.append('fornecedora', JSON.stringify(newValues));

        // adiciona o arquivo do contrato
        const contratoFile = document.querySelector('input[name="contrato"]').files[0];
        if (contratoFile) {
            formData.append('contratoUrl', contratoFile);
        }

        try {
            // envia a requisição PUT para o backend
            const response = await axios.put(`${BASE_URL}/${fornecedoraid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Fornecedor atualizado com sucesso!');
            console.log('Fornecedor atualizado:', response.data);
            setLoading(false); // Desativa o carregamento após sucesso
            router.push('/fornecedores'); // Redireciona para a lista de fornecedores após sucesso
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error);
            setError('Erro ao atualizar fornecedor');
            setLoading(false); // Desativa o carregamento após erro
        }
    };
    

   

    return (
       <Box sx={{ display: 'flex', backgroundColor: '#9AE4FF', minHeight: '100vh' }}>
                  <Box sx={{ width: '250px' }}>
                      <Sidebar />
                  </Box>
      
                  <Box sx={{ flex: 1, p: 3 }}>
                      <Box sx={{ mb: 1, textAlign: 'center', mt: 8,  }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', marginButtom:'20px', fontSize:'40px'}}>
                             
                          </Typography>
                      </Box>
              
      
                      <form autoComplete="off" onSubmit={handleSubmit}>
                          <Card
                              sx={{
                                  borderRadius: 10,
                                  backgroundColor:'#FADADD',
                                  p: 3,
                                  maxWidth: '150%',
                                  mx: 'auto',
                                  mt: 8,
                                  height: 'auto',
                                
                                 
                                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                              }}
                          >
                              <CardContent>
                                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, }}>
                                  </Typography>
                                  <Grid container spacing={3}>
          <Grid item xs={12}>
          <Grid container direction="column" alignItems="center" spacing={1}>
         
          <Grid item xs={12} display="flex" justifyContent="flex-start" width="100%" alignItems="center">
              <ArrowBack
                  sx={{
                      fontSize: '30px',
                      cursor: 'pointer',
                      color: 'black', 
                  }}
                  onClick={() => {}}
              />
          </Grid>
      
      
          <Grid item xs={12} display="flex" justifyContent="flex-end" width="100%" alignItems="center">
              <Home
                  sx={{
                      fontSize: '30px',
                      cursor: 'pointer',
                      color: 'black',
                      marginTop: '-40px',
                  }}
                  onClick={() => {}}
              />
          </Grid>
      
       
          <Grid item xs={12}>
              <Typography
                  variant="h4"
                  sx={{
                      mb: 4,
                      fontSize: '45px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                  }}
              >
                  Editar Fornecedor
              </Typography>
          </Grid>
      </Grid>
          </Grid>
          <Grid item xs={8} sm={7}>
          <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
                  Nome
              </Typography>
              <TextField
                  fullWidth
                  label="Nome do Fornecedor"
                  name="nome"
                  onChange={handleChange}
                  required
                  value={OldValues?.nome || ''}
                  variant="outlined"
                  sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                      },
                  }}
              />
          </Grid>
          <Grid item xs={8} sm={7}>
          <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
                  Contato
              </Typography>
              <TextField
                  fullWidth
                  label="Contato"
                  name="contato"
                  onChange={handleChange}
                  required
                  value={OldValues?.contato || ''}
                  variant="outlined"
                  sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                      },
                  }}
              />
          </Grid>
          <Grid item xs={8} sm={7}>
          <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
                  Endereço
              </Typography>
              <TextField
                  fullWidth
                  label="Endereço"
                  name="endereco"
                  onChange={handleChange}
                  required
                  value={OldValues?.endereco || ''}
                  variant="outlined"
                  sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                      },
                  }}
              />  
          </Grid>
          <Grid item xs={8} sm={7}>
          <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray' }}>
                  Contrato
              </Typography>
              <TextField
                  fullWidth
                  label="contrato"
                  name="contratoFile"
                  onChange={handleChange}
                  value={OldValues?.contratoFile|| ''}
                  variant="outlined"
                  sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                      },
                  }}
              />
             
          </Grid>
          <Grid item xs={8} sm={7}>
          <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray' }}>
                  Chave Pix
              </Typography>
              <TextField
                  fullWidth
                  label="Chave Pix"
                  name="chavePix"
                  onChange={handleChange}
                  value={OldValues?.chavePix || ''}
                  variant="outlined"
                  sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                      },
                  }}
              />
             
          </Grid>
          <Grid item xs={8} sm={7}>
          <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
                  Data de nascimento
              </Typography>
              <TextField
                  fullWidth
                  label="Data de nascimento"
                  name="Data de nascimento"
                  onChange={handleChange}
                  required
                  value={OldValues?.dataDeNascimento || ''}
                  variant="outlined"
                  sx={{
                      '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused': {
                          backgroundColor: '#FFFFFF',
                      },
                  }}
              />
               <Button
                  type="submit"
                  disabled={loading}
                  sx={{
                      marginLeft: '18px', 
                      color: 'Black',
                      backgroundColor: '#50abe4',
                      textTransform: 'none',
                      width:"350px",
                      fontWeight: 'bold',
                      marginLeft:"900px",
                      fontSize: '24px',
                      marginTop:"-80px",
                      borderRadius: '50px',
                      padding: '10px 30px',
                      height: '56px',
                      '&:hover': {
                          backgroundColor: '#003B6F',
                      },
                      '&:disabled': {
                          backgroundColor: '#cccccc',
                          color: '#666666',
                      },
                  }}
              >
                  {loading ? (
                      <CircularProgress
                          size={30}
                          sx={{
                              color: '#FFFFFF',
                              marginRight: 2,
                              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                          }}
                      />
                  ) : (
                      'Salvar mudanças'
                  )}
              </Button>   
          </Grid>       
      </Grid>                 </CardContent>
      
                              
                          </Card>
                      </form>
                  </Box>
              </Box>
          );
      }