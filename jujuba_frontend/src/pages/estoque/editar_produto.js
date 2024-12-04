import { useState, useEffect } from 'react';   
import { Box, Button, Card, CardContent, TextField, Typography, Grid } from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/produtos'; // URL da API

export default function ProdutosEdit({ produtoId }) {
    const [produto, setProduto] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null); // Estado para o preview da imagem
    const [imagem, setImagem] = useState(null);

    // Carregar os dados do produto
    useEffect(() => {
        async function fetchProdutoData() {
            try {
                const response = await axios.get(`${BASE_URL}/${produtoId}`);
                setProduto(response.data);
                setImagemPreview(response.data.imagem); // Define a imagem atual do produto
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar produto:', error);
                setError('Erro ao carregar os dados do produto');
                setLoading(false);
            }
        }
        fetchProdutoData();
    }, [produtoId]);

    // Atualiza o estado quando os campos são alterados
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduto((prev) => ({ ...prev, [name]: value }));
    };

    // Atualiza o estado da imagem quando um novo arquivo é selecionado
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProduto((prev) => ({ ...prev, imagem: file }));
            setImagemPreview(URL.createObjectURL(file)); // Exibe o preview da imagem
        }
    };

    // Submeter o formulário para atualizar o produto
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); 

        // FormData para enviar a imagem junto com outros dados
        const formData = new FormData();
        formData.append('nome', produto.nome);
        formData.append('quantidade', produto.quantidade);
        formData.append('precoUnidade', produto.precoUnidade);
        formData.append('valorTotal', produto.valorTotal);
        formData.append('imagem', produto.imagem);

        try {
            const response = await axios.put(`${BASE_URL}/${produtoId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }); 
            console.log('Produto atualizado com sucesso:', response.data);
            alert('Produto atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            setError('Erro ao atualizar produto');
            alert('Erro ao atualizar produto.');
        }
    };

    if (loading) {
        return <Typography>Carregando dados do produto...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '250px' }}>
                <Sidebar />
            </Box>

            <Box sx={{ flex: 1, p: 3 }}>
                <Box sx={{ mb: 4, textAlign: 'left', mt: 8 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Editar Produto
                    </Typography>
                </Box>

                <form autoComplete="off" onSubmit={handleSubmit}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, maxWidth: '100%', mx: 'auto', mt: 8, height: 'auto' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                Informações do Produto
                            </Typography>
                            <Grid container spacing={3}>
                                {/* Campo de imagem no início */}
                                <Grid item md={6} xs={12}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        fullWidth
                                        sx={{ textAlign: 'left', color: '#00509E' }}
                                    >
                                        Upload de Imagem
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                    {imagem && (
                                        <Typography variant="body2" sx={{ mt: 1, color: '#00509E' }}>
                                            Imagem selecionada: {imagem.name}
                                        </Typography>
                                    )}
                                    {imagemPreview && (
                                        <Box sx={{ mt: 2 }}>
                                            <img src={imagemPreview} alt="Imagem do Produto" style={{ width: '100px', height: '100px' }} />
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome do Produto"
                                        name="nome"
                                        onChange={handleChange}
                                        required
                                        value={produto?.nome || ''}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade"
                                        name="quantidade"
                                        onChange={handleChange}
                                        required
                                        value={produto?.quantidade || ''}
                                        variant="outlined"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Preço Unitário"
                                        name="precoUnidade"
                                        onChange={handleChange}
                                        required
                                        value={produto?.precoUnidade || ''}
                                        variant="outlined"
                                        type="number"
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Valor Total"
                                        name="valorTotal"
                                        onChange={handleChange}
                                        value={produto?.valorTotal || ''}
                                        variant="outlined"
                                        type="number"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                            <Button
                                type="submit"
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
                                Salvar
                            </Button>
                        </Box>
                    </Card>
                </form>
            </Box>
        </Box>
    );
}
