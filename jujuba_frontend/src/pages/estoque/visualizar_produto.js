import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Divider, Typography, Grid, CircularProgress, Link } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { useRouter } from 'next/router';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/produtos'; // url da api 

export default function ProdutoDetails() {
    const [newValues, setNewValues] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; // id do produto pego pela a url 

    useEffect(() => {
        const fetchProduto = async () => {
            if (id) {
                try {
                    const response = await axios.get(`${BASE_URL}/${id}`); // busca produto pelo ID
                    setNewValues(response.data);
                } catch (error) {
                    console.error('Erro ao buscar produto:', error.message);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchProduto();
    }, [id]);

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
                <Typography variant="h6">Produto não encontrado</Typography>
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
                        Visualizar Produto
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
                                    Nome do Produto
                                </Typography>
                                <Typography variant="body2">{newValues.nome}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Quantidade
                                </Typography>
                                <Typography variant="body2">{newValues.quantidade}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Preço/Unidade
                                </Typography>
                                <Typography variant="body2">{newValues.precoUnidade}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Valor Total
                                </Typography>
                                <Typography variant="body2">{newValues.valorTotal}</Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Imagem
                                </Typography>
                                <Link href={newValues.imagem} target="_blank" rel="noopener">
                                    Visualizar Imagem
                                </Link>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

