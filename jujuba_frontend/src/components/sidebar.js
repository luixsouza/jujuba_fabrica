import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FaBox, FaUsers, FaCashRegister } from 'react-icons/fa'; 
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
                backgroundColor: '#dcdcdc',
                color: '#000000', 
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed', 
                padding: '1rem',
                paddingTop: '8rem', 
                borderRadius: '15px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
           
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <img src="/imagens/logodefiniti.png" alt="Logo" style={{ width: '100px' }} />
            </Box>

            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem', color: '#000000' }}>
                Brechó da Jujuba
            </h2>
            <List>
              
                <ListItem
                    button
                    sx={{
                        marginBottom: '1rem',
                        '&:hover': { backgroundColor: '#2A2A3E' },
                    }}
                    onClick={() => handleNavigation('../../fornecedores/fornecedores_tabela')}
                >
                    <ListItemIcon>
                        <FaUsers color="#000000" size={24} /> 
                    </ListItemIcon>
                    <ListItemText primary="Fornecedores" />
                </ListItem>

               
                <ListItem
                    button
                    sx={{
                        marginBottom: '1rem',
                        '&:hover': { backgroundColor: '#2A2A3E' },
                    }}
                    onClick={() => handleNavigation('../../estoque/estoque_tabela')}
                >
                    <ListItemIcon>
                        <FaBox color="#000000" size={24} /> 
                    </ListItemIcon>
                    <ListItemText primary="Estoque" />
                </ListItem>

       
                <ListItem
                    button
                    sx={{
                        marginBottom: '1rem',
                        '&:hover': { backgroundColor: '#2A2A3E' },
                    }}
                    onClick={() => handleNavigation('/Caixa')}
                >
                    <ListItemIcon>
                        <FaCashRegister color="#000000" size={24} /> 
                    </ListItemIcon>
                    <ListItemText primary="Caixa" />
                </ListItem>
            </List>
        </Box>
    );
}
