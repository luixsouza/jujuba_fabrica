import { useState } from 'react'; 
import { Box, Button, Card, CardContent, TextField, Typography, Grid, CircularProgress } from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { CloudUpload } from '@mui/icons-material';  


const BASE_URL = 'http://localhost:8080/api/produtos'; // url da api 

export default function ProdutosCadastro() {
    const [newValues, setNewValues] = useState({
        nome: '',
        quantidade: '',
        precoUnidade: '',
        valorTotal: '',
        dataEntrada: '',
        dataSaida: '',
    });
    const [imagem, setImagem] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        setImagem(event.target.files[0]);
    };

    const createProduto = async (values, imagemFile) => {
        try {
            const formData = new FormData();
            formData.append('imagem', imagemFile); 
            formData.append('nome', values.nome);
            formData.append('quantidade', values.quantidade);
            formData.append('precoUnidade', values.precoUnidade);
            formData.append('valorTotal', values.valorTotal);
            formData.append('dataEntrada', values.dataEntrada);
            formData.append('dataSaida', values.dataSaida);

            const response = await axios.post(BASE_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const data = await createProduto(newValues, imagem); 
            console.log('Produto criado com sucesso:', data);
            alert('Produto criado com sucesso!');
            setNewValues({
                nome: '',
                quantidade: '',
                precoUnidade: '',
                valorTotal: '',
                dataEntrada: '',
                dataSaida: '',
            });
            setImagem(null);
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            alert('Erro ao criar produto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex',  backgroundColor: '#ADD8E6' }}>
            <Box sx={{ width: '250px',  backgroundColor: '#ADD8E6' }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3,  backgroundColor: '#ADD8E6', }}>
                <Box sx={{ mb: 4, textAlign: 'left', mt: 8,  backgroundColor: '#ADD8E6', }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2,  backgroundColor: '#ADD8E6', }}>
                        Cadastrar Lote
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
                            backgroundColor: '#FADADD',
                        }}
                    >
                        <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Informações do Lote
                            </Typography>

                         
                            <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'center',borderRadius: '25px' }}>
                            
                                {imagem && (
                                    <Typography variant="body2" sx={{ mt: 1, color: '#00509E', backgroundColor: 'white',}}>
                                        Imagem selecionada: {imagem.name}
                                    </Typography>
                                )}
                            </Grid>

                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                    sx={{  backgroundColor: 'white',}}
                                        fullWidth
                                        label="Código "
                                        name="nome"
                                        onChange={handleChange}
                                        required
                                        value={newValues?.nome || ''}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                    sx={{  backgroundColor: 'white',}}
                                        fullWidth
                                        label="Valor Total "
                                        name="Valor Total "
                                     
                                        onChange={handleChange}
                                        required
                                      
                                        value={newValues?.valorTotal || ''}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                    sx={{  backgroundColor: 'white',}}
                                        fullWidth
                                        label="Descrição"
                                        name="Descrição"
                                        onChange={handleChange}
                                        required
                                        value={newValues?.quantidade || ''}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                    sx={{  backgroundColor: 'white',}}
                                        fullWidth
                                        label="Tamanho"
                                        name="Tamanho"
                                        onChange={handleChange}
                                        required
                                        value={newValues?.precoUnidade || ''}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                    sx={{  backgroundColor: 'white',}}
                                        fullWidth
                                        label="Marca"
                                        name="Marca"
                                        onChange={handleChange}
                                        required
                                        value={newValues?.valorTotal || ''}
                                        variant="outlined"
                                    />
                                </Grid>
                             
                                <Grid item md={6} xs={12}>
                                    <TextField
                                    sx={{  backgroundColor: 'white',}}
                                        fullWidth
                                        label="% Brechó"
                                        name="% Brechó"
                                        onChange={handleChange}
                                        required
                                         value={newValues?.valorTotal || ''}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                    sx={{  backgroundColor: 'white',}}
                                        fullWidth
                                        label="%Fornecedor"
                                        name="%Fornecedor"
                                        onChange={handleChange}
                                        required
                                         value={newValues?.valorTotal || ''}
                                        variant="outlined"
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
                                {loading ? (
                                    <CircularProgress size={24} sx={{  backgroundColor: '#ADD8E6', color: '#FFFFFF', marginRight: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', }} />
                                ) : (
                                    'Salvar Lote'
                                )}
                            </Button>
                        </Box>
                    </Card>
                </form>
            </Box>
        </Box>
    );
}