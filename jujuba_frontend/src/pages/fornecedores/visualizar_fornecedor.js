import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { useRouter } from 'next/router';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/fornecedoras'; // URL base da API

export default function SupplierDetails() {
    const [newValues, setNewValues] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id: fornecedoraid } = router.query; // Extrai o parâmetro 'id' da URL

    useEffect(() => {
        const fetchFornecedoraData = async () => {
            if (id) {
                try {
                    const response = await axios.get(`${BASE_URL}/${fornecedoraid}`); 
                    setNewValues(response.data);
                } catch (error) {
                    console.error('Erro ao buscar fornecedor:', error.message);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchFornecedoraData();
    }, [fornecedoraid]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!newValues) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6">Fornecedor não encontrado</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3 }}>
                <Box sx={{ mb: 4, textAlign: 'left', mt: 8 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Visualizar Fornecedor
                    </Typography>
                </Box>

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
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Nome do Fornecedor
                                </Typography>
                                <Typography variant="body2">{newValues.nome}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Contato
                                </Typography>
                                <Typography variant="body2">{newValues.contato}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Endereço
                                </Typography>
                                <Typography variant="body2">{newValues.endereco}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Chave Pix
                                </Typography>
                                <Typography variant="body2">{newValues.chavePix}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Contrato
                                </Typography>
                                {newValues.contratoUrl ? (
                                    newValues.contratoUrl.endsWith('.pdf') ? (
                                        <Box sx={{ mt: 2 }}>
                                            <iframe
                                                src={newValues.contratoUrl}
                                                width="100%"
                                                height="500px"
                                                style={{ border: 'none' }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box sx={{ mt: 2 }}>
                                            <img
                                                src={newValues.contrato}
                                                alt="Contrato"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        </Box>
                                    )
                                ) : (
                                    <Typography variant="body2">Contrato não disponível</Typography>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
