import { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile'; 
const BASE_URL = 'http://localhost:8080/api/fornecedoras'; // URL base da API

export default function FornecedoresCadastro() {
    const [newValues, setNewValues] = useState({
        nome: '',
        contato: '',
        endereco: '',
        chavePix: '',
        contratoUrl: '',
    });

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
        <Box sx={{ display: 'flex', backgroundColor: '#ADD8E6', minHeight: '100vh' }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3 }}>
                <Box sx={{ mb: 4, textAlign: 'center', mt: 8, marginRight:'800px', }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Cadastrar Fornecedor
                    </Typography>
                </Box>
        

                <form autoComplete="off" onSubmit={handleSubmit}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            backgroundColor:'#FADADD',
                            p: 3,
                            maxWidth: '100%',
                            mx: 'auto',
                            mt: 8,
                            height: 'auto',
                           
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, }}>
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
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
                                                borderRadius: 4,
                                                backgroundColor: '#FFFFFF',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: '#FFFFFF',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
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
                                                borderRadius: 4,
                                                backgroundColor: '#FFFFFF',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: '#FFFFFF',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
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
                                                borderRadius: 4,
                                                backgroundColor: '#FFFFFF',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: '#FFFFFF',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Chave Pix"
                                        name="chavePix"
                                        onChange={handleChange}
                                        value={newValues?.chavePix || ''}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 4,
                                                backgroundColor: '#FFFFFF',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused': {
                                                backgroundColor: '#FFFFFF',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Upload do Contrato:
                                    </Typography>
                                    <input
                                        type="file"
                                        id="contratoUrl"
                                        name="contratoUrl"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="contratoUrl">
                                    <IconButton component="span" sx={{ color: 'black', fontSize: '30px' }}>
                                            <AttachFileIcon />
                                        </IconButton>
                                    </label>
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#50abe4',
                                    textTransform: 'none',
                                    fontSize: '15px',
                                    borderRadius: '50px',
                                    padding: '10px 30px',
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
                                    <CircularProgress size={24} sx={{ color: '#FFFFFF', marginRight: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', }} />
                                ) : (
                                    'Salvar Fornecedor'
                                )}
                            </Button>
                        </Box>
                    </Card>
                </form>
            </Box>
        </Box>
    );
}
