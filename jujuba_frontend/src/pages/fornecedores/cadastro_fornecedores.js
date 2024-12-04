import { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Grid, CircularProgress } from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';

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

    // Atualiza o estado com os valores dos campos
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewValues((prev) => ({ ...prev, [name]: value }));
    };

    // Função para criar um fornecedor na API
    const createFornecedora = async (values) => {
        try {
            const formData = new FormData();
    
            // Serializa o objeto fornecedora como JSON
            formData.append("fornecedora", JSON.stringify({
                nome: values.nome,
                contato: values.contato,
                endereco: values.endereco,
                chavePix: values.chavePix,
            }));
    
            // Adiciona o contrato ao FormData
            // Aqui, você precisa capturar o arquivo no frontend
            const contrato = document.querySelector('input[name="contrato"]')?.files[0];
            if (contrato) {
                formData.append("contrato", contrato);
            } else {
                throw new Error("O arquivo do contrato é obrigatório!");
            }
    
            // Faz a requisição para o backend
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
    

    // Envia os dados para a API
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const data = await createFornecedora(newValues); // Cria o fornecedor na API
            console.log('Fornecedor criado com sucesso:', data);
            alert('Fornecedor criado com sucesso!');
            setNewValues({
                nome: '',
                contato: '',
                endereco: '',
                chavePix: '',
                contratoUrl: '',
            });
        } catch (error) {
            console.error('Erro ao criar fornecedor:', error);
            alert('Erro ao criar fornecedor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3 }}>
                <Box sx={{ mb: 4, textAlign: 'left', mt: 8 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Cadastrar Fornecedor
                    </Typography>
                </Box>

                <form autoComplete="off" onSubmit={handleSubmit}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            boxShadow: 3,
                            p: 3,
                            maxWidth: '100%',
                            mx: 'auto',
                            mt: 8,
                            height: 'auto',
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Informações Gerais
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
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                         fullWidth
                                        type="file"
                                        inputProps={{ accept: ".pdf,.doc,.docx" }}
                                        name="contrato"
                                        variant="outlined"
                                 />
                                </Grid>

                            </Grid>
                        </CardContent>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                            <Button
                                type="submit"
                                disabled={loading}
                                sx={{
                                    mt: 2,
                                    color: '#00509E',
                                    backgroundColor: 'transparent',
                                    textTransform: 'none',
                                    fontSize: '18px',
                                    '&:hover': {
                                        color: '#003B6F',
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ marginRight: 2 }} />
                                ) : (
                                    'Salvar'
                                )}
                            </Button>
                        </Box>
                    </Card>
                </form>
            </Box>
        </Box>
    );
}
