import { useState, useEffect } from 'react'; 
import { Box, Card, CardContent, Typography, Grid, CircularProgress, TextField, Button,FormControlLabel,Checkbox } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { useRouter } from 'next/router';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/produtos'; 

export default function ProdutoDetails() {
    const [newValues, setNewValues] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; 

    useEffect(() => {
        const fetchProduto = async () => {
            if (id) {
                try {
                    const response = await axios.get(`${BASE_URL}/${id}`); 
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

    return (
        <Box sx={{ display: 'flex', backgroundColor: 'blue', minHeight: '100vh',  backgroundColor: '#ADD8E6', }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3,   backgroundColor: '#ADD8E6', }}>
                <Box sx={{ mb: 4, textAlign: 'left', mt: 8 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Visualizar Lote
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
                        backgroundColor: '#FADADD',
                    }}
                >
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Código"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Descrição"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Gênero"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Tamanho"
                                    variant="outlined"
                                    fullWidth
                                    value={newValues?.valorTotal || ''}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </Grid>

                           


                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="% Fornecedor"
                                    variant="outlined"
                                    fullWidth
                                    value={newValues?.valorTotal || ''}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </Grid>
                            
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="% Brechó"
                                    variant="outlined"
                                    fullWidth
                                    value={newValues?.valorTotal || ''}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        
                                      
                                        name="vendido"
                                        sx={{
                                            color: 'blue', 
                                            '&.Mui-checked': {
                                                color: 'blue', 
                                            },
                                        }}
                                    />
                                }
                                label="Vendido"
                                sx={{
                                      fontSize:'30px',
                                    '& .MuiFormControlLabel-label': {
                                        color: 'black',
                                        fontWeight:'Bold',
                                    },
                                }}
                            />
                        </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
