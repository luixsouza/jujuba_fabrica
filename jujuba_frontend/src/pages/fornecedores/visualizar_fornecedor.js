import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, TextField, } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ArrowBack, Home } from '@mui/icons-material'; 


const BASE_URL = 'http://localhost:8080/api/fornecedoras'; //url base da API
export default function SupplierDetails() {
    const [ setIsLoading] = useState(false); // estado de carregamento// mudar pra true quando tiver for clicado 
    const router = useRouter();
    const { id: fornecedoraid } = router.query; // captura a ID da URL
    const [OldValues, setOldValues] = useState({});

    ////  moss, aqui ele faz a requesição pro back do json
    useEffect(() => {
        const fetchFornecedoraData = async () => {
            if (fornecedoraid) {
                try {
                    
                    const response = await axios.get(`${BASE_URL}/${fornecedoraid}`);
    
                    setOldValues({
                        Nome: response.data.nome || "N/A",
                        Contato: response.data.contato || "N/A",
                        Endereço: response.data.endereco || "N/A",
                        chavePix: response.data.chavePix || "N/A",
                        contrato: response.data.contratoUrl || null, 
                    });
                } catch (error) {
                    console.error("Erro ao buscar fornecedor:", error.message);
                } finally {
                    setIsLoading(false);
                }
            }
        };
    
       
        fetchFornecedoraData();
    }, [fornecedoraid]); 
    
   
   

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
                 
         
                         <form autoComplete="off" >
                             <Card
                                 sx={{
                                     borderRadius: 10,
                                     backgroundColor:'#FADADD',
                                     p: 3,
                                     maxWidth: '150%',
                                     mx: 'auto',
                                     mt: 8,
                                     height: 'auto',
                                   
                                    
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
                     Visualizar Fornecedor
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
                     required
                     value={OldValues?.nome || ''}
                     variant="outlined"
                     disabled
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
                   
                     required
                     value={OldValues?.contato || ''}
                     disabled
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
                     required
                     value={OldValues?.endereco || ''}
                     variant="outlined"
                     disabled
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
             <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray' }}>
                     Contrato
                 </Typography>
                 <TextField
                     fullWidth
                     label="contrato"
                     name="contratoFile"
                     value={OldValues?.contratoFile|| ''}
                     variant="outlined"
                     disabled
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
             <Typography variant="body2" sx={{ fontWeight: 'normal', fontSize: '18px', marginBottom: '4px',color: 'gray' }}>
                     Chave Pix
                 </Typography>
                 <TextField
                     fullWidth
                     label="Chave Pix"
                     name="chavePix"
                     value={OldValues?.chavePix || ''}
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
                     Data de nascimento
                 </Typography>
                 <TextField
                     fullWidth
                     label="Data de nascimento"
                     name="Data de nascimento"
                     required
                     value={OldValues?.dataDeNascimento || ''}
                     variant="outlined"
                     disabled
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
         </Grid>                 </CardContent>
         
                                 
                             </Card>
                         </form>
                     </Box>
                 </Box>
             );
         }