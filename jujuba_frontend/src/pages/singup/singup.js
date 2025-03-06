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
  InputAdornment,
  IconButton,
  Container,
  Paper,
  Grid,
  Divider,
  Avatar,
} from "@mui/material"
import { useRouter } from "next/router"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Link from "next/link"

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Nome é obrigatório"),
      lastName: Yup.string().required("Sobrenome é obrigatório"),
      email: Yup.string()
        .email("Email inválido")
        .required("Email é obrigatório")
        .matches(
          /^[\w._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/,
          "O e-mail deve ser de um dos domínios permitidos: gmail.com, hotmail.com, yahoo.com, outlook.com",
        ),
      password: Yup.string()
        .required("Senha é obrigatória")
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
        .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
        .matches(/[0-9]/, "A senha deve conter pelo menos um número"),
      confirmPassword: Yup.string()
        .required("Confirmação de senha é obrigatória")
        .oneOf([Yup.ref("password")], "As senhas não coincidem"),
      phone: Yup.string()
        .required("Telefone é obrigatório")
        .matches(/^$$\d{2}$$ \d{5}-\d{4}$/, "Formato inválido. Use (XX) XXXXX-XXXX"),
    }),
    onSubmit: async (values) => {
      try {
    
        console.log("Dados do formulário:", values)
        alert("Conta criada com sucesso!")
        router.push("/")
      } catch (error) {
        console.error("Erro ao criar conta:", error)
        formik.setErrors({ submit: "Ocorreu um erro ao criar sua conta. Tente novamente." })
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
  })

 
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    let formattedValue = ""

    if (value.length <= 2) {
      formattedValue = value
    } else if (value.length <= 7) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`
    } else {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`
    }

    formik.setFieldValue("phone", formattedValue)
  }

  return (
    <>
      <Head>
        <title>Criar Conta - Brechó da Jujuba</title>
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
          overflowY: "auto",
          padding: "2rem 0",
        }}
      >
        <Container maxWidth="md">
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
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
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
                <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "1.8rem" },
                      fontWeight: 700,
                      color: "#333",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Brechó da Jujuba
                  </Typography>
                </Box>
                <Box sx={{ width: 40 }} /> 
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    backgroundColor: "rgba(154, 228, 255, 0.8)",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <PersonAddAltIcon sx={{ fontSize: 40, color: "#fff" }} />
                </Avatar>
              </Box>

              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="Nome"
                      variant="outlined"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                      helperText={formik.touched.firstName && formik.errors.firstName}
                      sx={{
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Sobrenome"
                      variant="outlined"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                      helperText={formik.touched.lastName && formik.errors.lastName}
                      sx={{
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
                  </Grid>
                  <Grid item xs={12}>
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
                      sx={{
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
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Telefone"
                      variant="outlined"
                      value={formik.values.phone}
                      onChange={handlePhoneChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                      placeholder="(XX) XXXXX-XXXX"
                      sx={{
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
                  </Grid>

                  

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Senha"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={formik.touched.password && formik.errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirmar Senha"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="outlined"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                      helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={toggleConfirmPasswordVisibility}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
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
                  </Grid>

                  <Grid item xs={12}>
                   
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        py: 1.5,
                        background: "linear-gradient(90deg, #9AE4FF 0%, #FADADD 100%)",
                        color: "#333",
                        fontWeight: 600,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "linear-gradient(90deg, #7bc8ff 0%, #f8c8cb 100%)",
                          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                          transform: "translateY(-2px)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                      }}
                    >
                      Criar Conta
                    </Button>
                  </Grid>
                </Grid>
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

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Já tem uma conta?{" "}
                  <Link href="../auth/login" passHref>
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
                      Entrar
                    </Typography>
                  </Link>
                </Typography>
              </Box>

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
            position: "fixed",
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

export default Signup

