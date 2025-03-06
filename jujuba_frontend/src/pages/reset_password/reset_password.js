"use client"

import Head from "next/head"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Collapse,
} from "@mui/material"
import { useRouter } from "next/router"
import LockResetIcon from "@mui/icons-material/LockReset"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import Link from "next/link"

const ResetPassword = () => {
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  const buildResetPasswordConfirmUrl = (email) => {
    return `/auth/reset-password-confirm/${encodeURIComponent(email)}`
  }

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email inválido")
        .required("Email é obrigatório")
        .matches(
          /^[\w._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/,
          "O e-mail deve ser de um dos domínios permitidos: gmail.com, hotmail.com, yahoo.com, outlook.com",
        ),
    }),
    onSubmit: async (values) => {
      try {
        const resetPasswordConfirmUrl = buildResetPasswordConfirmUrl(values.email)
        console.log("URL de confirmação:", resetPasswordConfirmUrl)
        setResetSent(true)
      } catch (error) {
        console.error("Erro ao enviar o e-mail:", error)
        formik.setErrors({ submit: "Ocorreu um erro ao enviar o e-mail. Tente novamente." })
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  })

  return (
    <>
      <Head>
        <title>Redefinir Senha - Brechó da Jujuba</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #FADADD 0%, #9AE4FF 100%)",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              padding: { xs: "1.5rem", sm: "2.5rem" },
              borderRadius: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-5px)",
              },
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "linear-gradient(45deg, rgba(154, 228, 255, 0.2), rgba(250, 218, 221, 0.2))",
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(45deg, rgba(250, 218, 221, 0.2), rgba(154, 228, 255, 0.2))",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Link href="/" passHref>
                  <IconButton
                    sx={{
                      color: "#666",
                      "&:hover": {
                        color: "#9AE4FF",
                        background: "rgba(154, 228, 255, 0.1)",
                      },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Link>
                <Box sx={{ flexGrow: 1 }} />
              </Box>

              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      background: "linear-gradient(135deg, #9AE4FF, #FADADD)",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <LockResetIcon sx={{ fontSize: 40, color: "#fff" }} />
                  </Avatar>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.5rem", sm: "1.8rem" },
                    fontWeight: 700,
                    color: "#333",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    mb: 1,
                  }}
                >
                  Redefinir Senha
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.9rem",
                    color: "#666",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    mb: 1,
                    px: 2,
                  }}
                >
                  Digite seu email abaixo e enviaremos instruções para redefinir sua senha
                </Typography>
                <Divider sx={{ width: "60%", margin: "1rem auto", opacity: 0.6 }} />
              </Box>

              <Collapse in={resetSent}>
                <Alert
                  icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: "10px",
                    backgroundColor: "rgba(154, 228, 255, 0.2)",
                    color: "#333",
                    border: "1px solid rgba(154, 228, 255, 0.5)",
                    "& .MuiAlert-icon": {
                      color: "#9AE4FF",
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Email enviado com sucesso!
                  </Typography>
                  <Typography variant="caption">
                    Verifique sua caixa de entrada para as instruções de redefinição de senha.
                  </Typography>
                </Alert>
              </Collapse>

              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={resetSent}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "&.Mui-focused fieldset": {
                          borderColor: "#9AE4FF",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#FADADD",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#9AE4FF",
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  disabled={resetSent}
                  sx={{
                    py: 1.5,
                    background: resetSent
                      ? "rgba(154, 228, 255, 0.5)"
                      : "linear-gradient(90deg, #FADADD 0%, #9AE4FF 100%)",
                    color: resetSent ? "#666" : "#333",
                    fontWeight: 600,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: resetSent ? "none" : "0 4px 10px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: resetSent
                        ? "rgba(154, 228, 255, 0.5)"
                        : "linear-gradient(90deg, #f8c8cb 0%, #7bc8ff 100%)",
                      boxShadow: resetSent ? "none" : "0 6px 15px rgba(0, 0, 0, 0.1)",
                      transform: resetSent ? "none" : "translateY(-2px)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  {resetSent ? "Email Enviado" : "Enviar Instruções"}
                </Button>

                {resetSent && (
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button
                      component={Link}
                      href="/"
                      variant="outlined"
                      sx={{
                        borderRadius: "10px",
                        borderColor: "#9AE4FF",
                        color: "#666",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#FADADD",
                          backgroundColor: "rgba(250, 218, 221, 0.05)",
                        },
                      }}
                    >
                      Voltar para o Login
                    </Button>
                  </Box>
                )}
              </form>

              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}

              {!resetSent && (
                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Lembrou sua senha?{" "}
                    <Link href="/" passHref>
                      <Typography
                        component="span"
                        sx={{
                          color: "#9AE4FF",
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Voltar para o Login
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#888",
                    fontSize: "0.75rem",
                  }}
                >
                  © 2024 Brechó da Jujuba. Todos os direitos reservados.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: i === 0 ? "#FADADD" : i === 1 ? "#f8c8cb" : "#9AE4FF",
                animation: "bounce 1.5s infinite",
                animationDelay: `${i * 0.15}s`,
                "@keyframes bounce": {
                  "0%, 100%": {
                    transform: "translateY(0)",
                  },
                  "50%": {
                    transform: "translateY(-10px)",
                  },
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default ResetPassword

