import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { AiOutlineUser, AiOutlineAppstoreAdd, AiOutlineDollarCircle } from 'react-icons/ai'; // Novos ícones
import { useRouter } from 'next/router';

export default function Sidebar() {
    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <Box
            sx={{
                width: '250px',
                height: '100vh',
                backgroundColor: '#9e9e9e',
                color: '#FFFFFF', 
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed', 
                padding: '1rem',
                paddingTop: '4rem',
            }}
        >
         
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '0.3rem', 
                flexShrink: 0, 
            }}>
                <img 
                    src="/imagens/bbdefin.png"
                    alt="Logo"
                    style={{
                        width: '250px', 
                        height: 'auto', 
                        borderRadius: '5px', 
                    }}
                />
            </Box>

          
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: '"Pacifico", cursive', 
                        color: '#FFFFFF', 
                        fontWeight: 'bold', 
                    }}
                >
                    Brechó da Jujuba
                </Typography>
            </Box>

          
            <List sx={{ flexGrow: 1 }}> 
                <ListItem
                    button
                    sx={{
                        marginBottom: '1rem',
                        paddingLeft: '1rem',
                        
                    }}
                    onClick={() => handleNavigation('../../fornecedores/fornecedores_tabela')}
                >
                    <ListItemIcon sx={{ marginTop: '10px' }}>
                        <AiOutlineUser color="#FFFFFF" size={32} /> 
                    </ListItemIcon>
                    <ListItemText primary="Fornecedores" sx={{ color: '#FFFFFF' }} />
                </ListItem>

                <ListItem
                    button
                    sx={{
                        marginBottom: '1rem',
                        paddingLeft: '1rem',
                      
                    }}
                    onClick={() => handleNavigation('../../estoque/estoque_tabela')}
                >
                    <ListItemIcon sx={{ marginTop: '10px' }}>
                        <AiOutlineAppstoreAdd color="#FFFFFF" size={32} /> 
                    </ListItemIcon>
                    <ListItemText primary="Estoque" sx={{ color: '#FFFFFF' }} />
                </ListItem>

                <ListItem
                    button
                    sx={{
                        marginBottom: '1rem',
                        paddingLeft: '1rem',
                       
                    }}
                    onClick={() => handleNavigation('/Caixa')}
                >
                    <ListItemIcon sx={{ marginTop: '10px' }}>
                        <AiOutlineDollarCircle color="#FFFFFF" size={32} /> 
                    </ListItemIcon>
                    <ListItemText primary="Caixa" sx={{ color: '#FFFFFF' }} />
                </ListItem>
            </List>
        </Box>
    );
}
