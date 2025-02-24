import { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Grid, CircularProgress} from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/fornecedoras'; 
import { ArrowBack, Home } from '@mui/icons-material'; 

export default function FornecedoresCadastro() {
    const [newValues, setNewValues] = useState({
        nome: '',
        contato: '',
        endereco: '',
        chavePix: '',
        contratoUrl: '',
        
    });

    const [loading, setLoading] = useState(false); // estado de carregamento// mudar pra true quando tiver for clicado 

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
                            maxWidth: '100%',
                            mx: 'auto',
                            mt: 8,
                            height: 'auto',
                            marginLeft:'70px',
                           
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
            Cadastro de Fornecedor
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
            value={newValues?.nome || ''}
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
            value={newValues?.contato || ''}
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
            value={newValues?.endereco || ''}
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
                width:"250px",
                fontWeight: 'bold',
                marginLeft:"630px",
                fontSize: '17px',
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
                ' Upload de Contrato'
            )}
        </Button>   
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
            value={newValues?.chavePix || ''}
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
                width:"250px",

                fontWeight: 'bold',
                marginLeft:"630px",
                fontSize: '17px',
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
                'Cadastrar fornecedor'
            )}
        </Button>   
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
            value={newValues?.dataDeNascimento || ''}
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
                width:"250px",
                fontWeight: 'bold',
                marginLeft:"630px",
                fontSize: '17px',
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
                'Cadastrar Lote'
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
