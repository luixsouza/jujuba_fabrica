"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Constantes padronizadas
import { COLORS, SHADOWS, SPACING } from "../../constants";

// API
import api from "../../utils/api";

// Estilos padronizados para inputs
const inputStyles = {
  backgroundColor: "white",
  borderRadius: SPACING.inputBorderRadius,
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: COLORS.borderLight },
    "&:hover fieldset": { borderColor: COLORS.primaryBlue },
    "&.Mui-focused fieldset": { borderColor: COLORS.primaryBlue },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.primaryBlue },
};

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await api.post("/usuarios", {
        username: email,
        password: password,
      });
      alert("Conta criada com sucesso!");
      router.push("/auth/login");
    } catch (err) {
      console.error("Erro ao criar conta:", err);
      setError("Erro ao criar conta. Verifique os dados e tente novamente.");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length <= 2) {
      formattedValue = value;
    } else if (value.length <= 7) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }

    setPhone(formattedValue);
  };

  return (
    <>
      <Head>
        <title>Jujuba - Criar Conta</title>
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
          background: `linear-gradient(135deg, ${COLORS.primaryPink} 0%, ${COLORS.primaryBlue} 100%)`,
          overflowY: "auto",
          padding: "2rem 0",
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: SHADOWS.card,
              minHeight: "600px",
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Lado esquerdo - Logo e nuvens */}
            <Box
              sx={{
                width: { xs: "100%", md: "40%" },
                backgroundColor: COLORS.primaryBlue,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                padding: 4,
              }}
            >
              {/* Nuvens decorativas */}
              {[
                { top: "15%", left: "15%", width: "60px", height: "30px" },
                { bottom: "20%", right: "20%", width: "80px", height: "40px" },
                { top: "70%", left: "25%", width: "50px", height: "25px" },
              ].map((cloud, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    ...cloud,
                    backgroundColor: "white",
                    borderRadius: cloud.width,
                  }}
                />
              ))}

              {/* Logo */}
              <Box
                sx={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  backgroundColor: "#FFD700",
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
                    backgroundColor: COLORS.primaryBlue,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "4px solid white",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Comic Sans MS', cursive",
                      fontSize: "24px",
                      color: "#FF69B4",
                      fontWeight: "bold",
                    }}
                  >
                    jujuba
                  </Typography>
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
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    zIndex: 0,
                  }}
                />
              ))}
            </Box>

            {/* Lado direito - Formulário */}
            <Box
              sx={{
                width: { xs: "100%", md: "60%" },
                backgroundColor: COLORS.primaryPink,
                padding: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Link href="/auth/login" passHref>
                  <IconButton
                    sx={{
                      color: COLORS.textMuted,
                      "&:hover": { color: COLORS.primaryBlue },
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Link>
                <Typography
                  variant="h4"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: COLORS.textSecondary,
                    flex: 1,
                  }}
                >
                  Criar Conta
                </Typography>
                <Box sx={{ width: 40 }} />
              </Box>

              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  color: COLORS.textMuted,
                  mb: 4,
                }}
              >
                Preencha os dados abaixo
              </Typography>

              {error && (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    color: COLORS.error,
                    mb: 2,
                  }}
                >
                  {error}
                </Typography>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="Nome"
                      variant="outlined"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      sx={inputStyles}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Sobrenome"
                      variant="outlined"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      sx={inputStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      sx={inputStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Telefone"
                      variant="outlined"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(XX) XXXXX-XXXX"
                      required
                      sx={inputStyles}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                color: COLORS.textMuted,
                                "&:hover": { color: COLORS.primaryBlue },
                              }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              sx={{
                                color: COLORS.textMuted,
                                "&:hover": { color: COLORS.primaryBlue },
                              }}
                            >
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={inputStyles}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        py: 1.5,
                        mt: 2,
                        backgroundColor: COLORS.primaryBlue,
                        color: COLORS.textSecondary,
                        fontWeight: 600,
                        borderRadius: SPACING.buttonBorderRadius,
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: SHADOWS.button,
                        "&:hover": {
                          backgroundColor: COLORS.actionBlueHover,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Criar Conta
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                  Já tem uma conta?{" "}
                  <Link href="/auth/login" passHref>
                    <Typography
                      component="span"
                      sx={{
                        color: COLORS.textSecondary,
                        fontWeight: 600,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
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
                    color: COLORS.textMuted,
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
  );
}
