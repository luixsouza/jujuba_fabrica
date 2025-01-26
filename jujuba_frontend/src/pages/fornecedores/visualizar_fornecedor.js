import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, TextField, Button } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { useRouter } from 'next/router';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/fornecedoras'; //url base da API
export default function SupplierDetails() {
    const [newValues, setNewValues] = useState(null); // dados da fornecedora
    const [isLoading, setIsLoading] = useState(true); // estado de carregamento
    const router = useRouter();
    const { id: fornecedoraid } = router.query; // captura a ID da URL

    ////  moss, aqui ele faz a requesição pro back do json
    useEffect(() => {
        const fetchFornecedoraData = async () => {
            if (fornecedoraid) {
                try {
                    
                    const response = await axios.get(`${BASE_URL}/${fornecedoraid}`);
    
                    setNewValues({
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
    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (!newValues) {
        return <div>Erro ao carregar os dados da fornecedora.</div>;
    }

   
   

    return (
        <Box sx={{ display: "flex", backgroundColor: "#50abe4", minHeight: "100vh" }}>
        
            <Box sx={{ width: "250px", backgroundColor: "#50abe4" }}>
                <Sidebar />
            </Box>

           
            <Box sx={{ flex: 1, p: 3, backgroundColor: "#F5F5DC" }}></Box>

        
            <Box sx={{ flex: 1, p: 3, backgroundColor: "#F5F5DC"  }}>
                <Box sx={{ mb: 4, textAlign: "left", mt: 8 }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                        Visualizar Fornecedor
                    </Typography>
                </Box>

                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow: 3,
                        p: 3,
                        maxWidth: "100%",
                        mx: "auto",
                        mt: 8,
                        height: "auto",
                    }}
                >
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Nome do Fornecedor"
                                    variant="outlined"
                                    fullWidth
                                    value={newValues.nome}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Contato"
                                    variant="outlined"
                                    fullWidth
                                    value={newValues.contratoUrl}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Endereço"
                                    variant="outlined"
                                    fullWidth
                                    value={newValues.endereco}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Chave Pix"
                                    variant="outlined"
                                    fullWidth
                                    value={newValues.chavePix}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Contrato
    </Typography>
    {newValues.contratoUrl ? (
        newValues.contratoUrl.endsWith(".pdf") ? (
            <Box sx={{ mt: 2 }}>
                <iframe
                    src={newValues.contratoUrl}
                    width="100%"
                    height="500px"
                    style={{ border: "none" }}
                />
            </Box>
        ) : newValues.contratoUrl.endsWith(".doc") || newValues.contratoUrl.endsWith(".docx") ? (
            <Box sx={{ mt: 2 }}>
                <a href={newValues.contratoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="contained">Abrir Contrato</Button>
                </a>
            </Box>
        ) : newValues.contratoUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? ( 
            <Box sx={{ mt: 2 }}>
                <img
                    src={newValues.contratoUrl}
                    alt="Contrato"
                    style={{ maxWidth: "100%", height: "auto" }}
                />
            </Box>
        ) : (
            <Typography variant="body2">Formato de contrato não suportado</Typography>
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
