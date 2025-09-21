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
import Image from "next/image"

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
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              height: "450px",
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {/* Left side - Logo and clouds */}
            <Box
              sx={{
                width: "50%",
                backgroundColor: "#9AE4FF",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                padding: 4,
              }}
            >
              {/* Nuvens com imagem */}
              <Image
                src="/Imagens/Nuvem.png"
                alt="Nuvem"
                width={110}
                height={70}
                style={{
                  position: "absolute",
                  top: "15%",
                  left: "15%",
                  objectFit: "contain",
                }}
              />
              <Image
                src="/Imagens/Nuvem.png"
                alt="Nuvem"
                width={110}
                height={70}
                style={{
                  position: "absolute",
                  bottom: "20%",
                  right: "20%",
                  objectFit: "contain",
                }}
              />
              <Image
                src="/Imagens/Nuvem.png"
                alt="Nuvem"
                width={70}
                height={50}
                style={{
                  position: "absolute",
                  top: "70%",
                  left: "25%",
                  objectFit: "contain",
                }}
              />
              <Image
                src="/Imagens/Nuvem.png"
                alt="Nuvem extra"
                width={90}
                height={60}
                style={{
                  position: "absolute",
                  top: "10%",
                  right: "10%",
                  objectFit: "contain",
                }}
              />
              <Image
                src="/Imagens/Nuvem.png"
                alt="Nuvem extra"
                width={100}
                height={65}
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "10%",
                  objectFit: "contain",
                }}
              />
              <Image
                src="/Imagens/Nuvem.png"
                alt="Nuvem extra"
                width={80}
                height={50}
                style={{
                  position: "absolute",
                  top: "40%",
                  left: "5%",
                  objectFit: "contain",
                }}
              />

              {/* Logo com imagem */}
              <Box
                sx={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF9ac",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    backgroundColor: "#9AE4FF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/Imagens/LogoJujuba.png"
                    alt="Logo"
                    width={345}
                    height={242}
                    style={{ borderRadius: "50%" }}
                  />
                </Box>
              </Box>

              {/* Anéis ao redor da logo */}
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    width: `${180 + i * 20}px`,
                    height: `${180 + i * 20}px`,
                    borderRadius: "50%",
                    border: `1px solid rgba(255, 255, 255, ${1 - i * 0.2})`,
                    boxShadow: `0 0 ${2 * i}px rgba(0, 0, 0, ${0.1 - i * 0.02})`,
                    backdropFilter: "blur(1px)",
                    zIndex: 0,
                  }}
                />
              ))}
            </Box>

            {/* Right side - Reset password form */}
            <Box
              sx={{
                width: "50%",
                backgroundColor: "#FADADD",
                padding: 4,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 1,
                overflowY: "auto",
              }}
            >
              {/* Alinha o botão voltar e título na mesma linha */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 1,
                }}
              >
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
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#333",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    m: 0,
                  }}
                >
                  Redefinir Senha
                </Typography>
              </Box>

              {/* Texto explicativo */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.9rem",
                  color: "#666",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  mb: 2,
                  px: 1,
                }}
              >
                Digite seu email abaixo e enviaremos instruções para redefinir sua senha
              </Typography>

              <Divider sx={{ width: "60%", margin: "0 auto 1.5rem auto", opacity: 0.6 }} />

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
                    mb: 3,
                    backgroundColor: "white",
                    borderRadius: "4px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#E0E0E0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#9AE4FF",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#9AE4FF",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#9AE4FF",
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={resetSent}
                  sx={{
                    py: 1.5,
                    backgroundColor: "#9AE4FF",
                    color: "#333",
                    fontWeight: 600,
                    borderRadius: "20px",
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      backgroundColor: "#7bc8ff",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {resetSent ? "Email Enviado" : "Enviar Instruções"}
                </Button>
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
      </Box>
    </>
  )
}

export default ResetPassword