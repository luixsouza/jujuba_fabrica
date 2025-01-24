import { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Grid } from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { useRouter } from 'next/router'; 

const BASE_URL = 'http://localhost:8080/api/fornecedoras'; 

export default function FornecedoresEdit() {
    const router = useRouter(); // usa o useRouter para acessar os parâmetros da URL
    const { id: fornecedoraid } = router.query; 

    const [newValues, setNewValues] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   

    // atualiza o estado quando os campos são alterados
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();

       
        formData.append('fornecedora', JSON.stringify(newValues));

        // adiciona o arquivo do contrato se houver
        const contratoFile = document.querySelector('input[name="contrato"]').files[0];
        if (contratoFile) {
            formData.append('contrato', contratoFile);
        }

        try {
            // envia a requisição PUT para o backend
            const response = await axios.put(`${BASE_URL}/${fornecedoraid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Content-Type': 'multipart/form-data', 
                },
            });
            console.log('Fornecedor atualizado:', response.data);
            
            // Exibe a mensagem de sucesso
            alert('Fornecedor atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar fornecedor:', error);
            setError('Erro ao atualizar fornecedor');
        }
    };

    if (loading) {
        return <Typography>Carregando dados do fornecedor...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ display: 'flex',backgroundColor: '#ADD8E6', }}>
            <Box sx={{ width: '250px',backgroundColor: '#ADD8E6', }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3,backgroundColor: '#ADD8E6', }}>
                <Box sx={{ mb: 4, textAlign: 'left', mt: 8,backgroundColor: '#ADD8E6', }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2,color:'black' }}>
                        Editar Fornecedor
                    </Typography>
                </Box>

                <form autoComplete="off" onSubmit={handleSubmit}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, maxWidth: '100%', mx: 'auto', mt: 8, height: 'auto', backgroundColor:'#FADADD', }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2,color:"black" }}>
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
                                    <label htmlFor="contrato" style={{ display: 'block', marginBottom: '8px' }}>
                                        Upload do Contrato:
                                    </label>
                                    <input
                                        type="file"
                                        id="contrato"
                                        name="contrato"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleChange}
                                        style={{ marginTop: '8px' }}
                                    />
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
                                Salvar
                            </Button>
                        </Box>
                    </Card>
                </form>
            </Box>
        </Box>
    );
}