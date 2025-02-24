import { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Grid, IconButton } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { useRouter } from 'next/router';
import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/fornecedoras'; // URL base da API
import { ArrowBack, Home } from '@mui/icons-material'; // Importe os ícones
import {  ArrowForward } from '@mui/icons-material'; // Importa os ícones de seta
export default function FornecedoresCadastro() {
    const [newValues, setNewValues] = useState({
        nome: '',
        contato: '',
        endereco: '',
        chavePix: '',
        contratoUrl: '',
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // atualiza o estado com os valores dos campos
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewValues((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setNewValues((prev) => ({
            ...prev,
            contratoUrl: file || '', // armazenando o arquivo completo, não apenas o nome
        }));
    };
    // função para criar um fornecedor na API
    const createFornecedora = async (values) => {
        try {
            const formData = new FormData();

            // serializa o objeto fornecedora como JSON
            formData.append("fornecedora", JSON.stringify({
                nome: values.nome || "N/A",
                contato: values.contato || "N/A",
                endereco: values.endereco || "N/A",
                chavePix: values.chavePix || "N/A",
                contratoUrl: values.contratoUrl || null, // agora usando contratoUrl
            }));

            // adiciona o contrato ao FormData
            const contrato = document.querySelector('input[name="contrato"]')?.files[0];
            if (contrato) {
                formData.append("contratoUrl", contrato);
            } else {
                throw new Error("O arquivo do contrato é obrigatório!");
            }
    
            // faz a requisição para o backend
            const response = await axios.post(BASE_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", 
                },
            });

            return response.data;
        } catch (error) {
            console.error("Erro ao criar fornecedor:", error);
            throw error;
        }
    };
    
    const handleImageChange = (event) => {
        setImagem(event.target.files[0]);
    };
    // envia os dados para a API
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const data = await createFornecedora(newValues); // cria o fornecedor na API
            console.log('Fornecedor criado com sucesso:', data);
            alert('Fornecedor criado com sucesso!');
            setNewValues({
                nome: '',
                contato: '',
                endereco: '',
                chavePix: '',
                contratoUrl: '', // resetando também o contratoUrl
            });
        } catch (error) {
            console.error('Erro ao criar fornecedor:', error);
            alert('Erro ao criar fornecedor.');
        } finally {
            setLoading(false);
        }
    };
    const handleEditClick = () => {
        // Redireciona para a página de edição, passando o ID do fornecedor
        router.push('./editar_produto');
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
                         
                            backgroundColor:'#9AE4FF',
                            p: 3,
                            maxWidth: '62%',
                            mx: 'auto',
                            mt: 8,
                            height: 'auto',
                            marginRight:'590px'
                          
                           
                           
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

    {}
    <Grid item xs={12}>
        <Typography
            variant="h4"
            sx={{
                mb: 4,
                fontSize: '50px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginLeft: '-80px',
            }}
        >
          Cadastrar Produto
        </Typography>
    </Grid>
</Grid>
    </Grid>
    <Grid item xs={8} sm={7}> {}
    <Grid 
    item
    xs={12}
    sm={12}
    sx={{
        display: 'flex',
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        marginLeft: '500px', 
        marginBottom: 3,
    }}
>
    {}
    <IconButton sx={{ color: 'gray', '&:hover': { color: 'black' } }}>
        <ArrowBack fontSize="large" />
    </IconButton>

    {}
    <Box
        sx={{
            width: '850px',
            height: '150px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Typography variant="body2" color="gray">
            Imagem
        </Typography>
    </Box>

    {}
    <IconButton sx={{ color: 'gray', '&:hover': { color: 'black' } }}>
        <ArrowForward fontSize="large" />
    </IconButton>
</Grid>


    </Grid>
    <Grid item xs={12} >
    <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
          
        </Typography>
        <TextField
            fullWidth
            label="Descrição"
            name="descrição"
            onChange={handleChange}
            required
            value={newValues?.descricao || ''}
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                },
            }}
        />
    </Grid>
    <Grid item xs={4} >
    <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
          
        </Typography>
        <TextField
            fullWidth
            label="Código"
            name="código"
            onChange={handleChange}
            required
            value={newValues?.codigo || ''}
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                },
            }}
        />
        
    </Grid>
    <Grid item xs={4} >
    <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray' }}>
           
        </Typography>
        <TextField
            fullWidth
            label="Lote"
            name="lote"
            onChange={handleChange}
            value={newValues?.lote || ''}
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                },
            }}
        />
        
    </Grid>
    <Grid item xs={4} >
    <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray' }}>
       
        </Typography>
        <TextField
            fullWidth
            label="Estado"
            name="estado"
            onChange={handleChange}
            value={newValues?.estado || ''}
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                },
            }}
        />
        
    </Grid>
    
    <Grid item xs={4} >
    <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
          
        </Typography>
        <TextField
            fullWidth
            label="Fornecedora"
            name="fornecedora"
            onChange={handleChange}
            required
            value={newValues?.fornecedora || ''}
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                },
            }}
        />
       
    </Grid>
    <Grid item xs={4} >
    <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
           
        </Typography>
        <TextField
            fullWidth
            label="Valor"
            name="valor"
            onChange={handleChange}
            required
            value={newValues?.valor || ''}
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                },
            }}
        />
       
    </Grid>
    <Grid item xs={4} >
    <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray'  }}>
          
        </Typography>
        <TextField
            fullWidth
            label="Status"
            name="status"
            onChange={handleChange}
            required
            value={newValues?.Status|| ''}
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    backgroundColor: '#F5F5F5',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
                    borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                },
            }}
        />
    </Grid>
    <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
  <Box
    sx={{
      display: 'flex',
      gap: '20px', 
      marginTop: '30px', 
    }}
  >
    <Button
      sx={{
        backgroundColor: '#FADADD',
        color: 'black',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
        border: '2px solid #FADADD',
        fontWeight: 'bold',
        fontSize: '17px',
        borderRadius: '60px',
        padding: '10px 0',
        width: '300px',
        height: '50px',
        textTransform: 'none',
      }}
    >
      Excluir
    </Button>
    <Button
      sx={{
        backgroundColor: '#FADADD',
        color: 'black',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
        border: '2px solid #FADADD',
        fontWeight: 'bold',
        fontSize: '17px',
        borderRadius: '60px',
        padding: '10px 0',
        width: '300px',
        height: '50px',
        textTransform: 'none',
      }}
    >
      Adicionar ao carrinho
    </Button>
    <Button
       onClick={handleEditClick} 
      sx={{
        backgroundColor: '#FADADD',
        color: 'black',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
        border: '2px solid #FADADD',
        fontWeight: 'bold',
        fontSize: '17px',
        borderRadius: '60px',
        padding: '10px 0',
        width: '300px',
        height: '50px',
        textTransform: 'none',
      }}
    >
      Editar
    </Button>
  </Box>
</Grid>
   </Grid>   
              </CardContent>

                        
                    </Card>
                </form>
            </Box>
        </Box>
    );
}
