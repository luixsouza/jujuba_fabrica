import { useState, useEffect } from 'react';   
import { Box, Button, Card, CardContent, TextField, Typography, Grid,IconButton } from '@mui/material';
import Sidebar from '../../components/sidebar';
import axios from 'axios';
import { ArrowBack, Home } from '@mui/icons-material'; 
import {  ArrowForward } from '@mui/icons-material'; 

const BASE_URL = 'http://localhost:8080/api/produtos'; // URL da API

export default function ProdutosEdit({ produtoId }) {
    const [produto, setProduto] = useState({});  // Produto vazio por enquanto
    const [loading, setLoading] = useState(false); // Não será carregado no momento
    const [error, setError] = useState(null);
    const [imagemPreview, setImagemPreview] = useState(null); 
    const [imagem, setImagem] = useState(null);
    const [newValues, setNewValues] = useState({
        nome: '',
        contato: '',
        endereco: '',
        chavePix: '',
        contratoUrl: '',
    });

    useEffect(() => {
        // No momento, não há necessidade de fazer a requisição
        // Caso precise de dados mais tarde, o código está preparado para buscar
        // async function fetchProdutoData() {
        //     try {
        //         const response = await axios.get(`${BASE_URL}/${produtoId}`);
        //         setProduto(response.data);
        //         setImagemPreview(response.data.imagem); 
        //         setLoading(false);
        //     } catch (error) {
        //         console.error('Erro ao carregar produto:', error);
        //         setError('Erro ao carregar os dados do produto');
        //         setLoading(false);
        //     }
        // }
        // fetchProdutoData();
    }, [produtoId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduto((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        setImagem(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Resetando o erro

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
                        maxWidth: '150%',
                        mx: 'auto',
                        mt: 8,
                        height: 'auto',
                      
                       
                       
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
      Editar Produto
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
        height: '280px',
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
    fontSize: '20px',
    borderRadius: '60px',
    padding: '10px 0',
    width: '300px',
    height: '50px',
    textTransform: 'none',
  }}
>
  Salvar Edição 
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