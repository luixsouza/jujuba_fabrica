import Head from 'next/head'; 
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const ResetPassword = () => {
    const [invalidEmail, setInvalidEmail] = useState('');
    const router = useRouter();

    const buildResetPasswordConfirmUrl = (email) => {
        return `/${CONST_NAME_PAGE.AUTH}/${CONST_NAME_PAGE.RESET_PASSWORD}/${encodeURIComponent(email)}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault(); 
      
        router.push('/fornecedores/fornecedores_tabela');
      };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email inválido')
                .required('Email é obrigatório')
                .matches(
                    /^[\w._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/,
                    'O e-mail deve ser de um dos domínios permitidos: gmail.com, hotmail.com, yahoo.com, outlook.com'
                ),
            password: Yup.string()
                .required('Senha é obrigatória')
                .min(8, 'A senha deve ter pelo menos 8 caracteres'),
        }),
        onSubmit: async (values) => {
            setInvalidEmail('');
            try {
                const resetPasswordConfirmUrl = buildResetPasswordConfirmUrl(values.email);
                // substitua com a lógica de back-end aqui
                console.log('URL de confirmação:', resetPasswordConfirmUrl);
                alert('E-mail de redefinição de senha enviado com sucesso!');
            } catch (error) {
                console.error('Erro ao enviar o e-mail:', error);
                formik.setErrors({ submit: 'Ocorreu um erro ao enviar o e-mail. Tente novamente.' });
                setInvalidEmail(values.email);
            }
        },
        validateOnChange: false,
        validateOnBlur: true,
    });

    return (
        <>
            <Head>
                <title>login</title>
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap" rel="stylesheet" />
            </Head>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        backgroundImage: 'url(/imagens/backinground.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        filter: 'blur(8px)',
                        zIndex: 0,
                    }}
                />

<Box 
    sx={{
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 80, 158, 0.8)',
        maxWidth: '400px', 
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
        backdropFilter: 'blur(10px)', 
    }}
>
                    <Box sx={{ marginBottom: '1rem', marginTop: '-1rem' }}>
                        <img src="/imagens/logodefiniti.png" alt="Logo" style={{ width: '120px' }} />
                    </Box>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: '1.7rem',
                            marginBottom: '1.5rem',
                            color: '#000',
                            marginTop: '1.5rem',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 'bold',
                        }}
                    >
                        Brechó da Jujuba
                    </Typography>
                    <Typography
    variant="h1"
    sx={{
        fontSize: '0.8rem', 
        marginBottom: '1.5rem',
        color: '#000',
        marginTop: '1.5rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 'normal', 
    }}
>
    Clique em entrar para começar
</Typography>
<form onSubmit={handleSubmit}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Button
          type="submit"
          sx={{
            width: 'auto',
            maxWidth: 'auto',
            padding: 0,
            backgroundColor: 'transparent',
            color: '#00509E',
            border: 'none',
            borderRadius: 0,
            fontSize: '0.9375rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#003d6a',
            },
          }}
        >
          Entrar
        </Button>
      </Box>
    </form>
                        {formik.errors.submit && (
                            <Typography
                                color="error"
                                sx={{
                                    mt: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                                variant="body2"
                            >
                                {formik.errors.submit}
                            </Typography>
                        )}
                </Box>
            </Box>
        </>
    );
};

export default ResetPassword;
