"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.post("/auth", {
        username: email,
        password: password,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/fornecedores");
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error("Login failed", err);
      }
      const errorMessage = err.response?.data?.message || "Falha no login. Verifique suas credenciais.";
      setError(errorMessage);
    }
  };

  return (
    <>
      <Head>
        <title>Jujuba - Login</title>
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
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: SHADOWS.card,
              height: "450px",
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {/* Lado esquerdo - Logo e nuvens */}
            <Box
              sx={{
                width: "50%",
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
                { top: "15%", left: "15%", width: 110, height: 70 },
                { bottom: "20%", right: "20%", width: 110, height: 70 },
                { top: "70%", left: "25%", width: 70, height: 50 },
                { top: "10%", right: "10%", width: 90, height: 60 },
                { bottom: "10%", left: "10%", width: 100, height: 65 },
                { top: "40%", left: "5%", width: 80, height: 50 },
              ].map((cloud, index) => (
                <Image
                  key={index}
                  src="/Imagens/Nuvem.png"
                  alt="Nuvem"
                  width={cloud.width}
                  height={cloud.height}
                  style={{
                    position: "absolute",
                    ...cloud,
                    objectFit: "contain",
                  }}
                />
              ))}

              {/* Logo */}
              <Box
                sx={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  backgroundColor: "#FFF9AC",
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

            {/* Lado direito - Formulário */}
            <Box
              sx={{
                width: "50%",
                backgroundColor: COLORS.primaryPink,
                padding: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: COLORS.textSecondary,
                  mb: 1,
                }}
              >
                Login
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  color: COLORS.textMuted,
                  mb: 4,
                }}
              >
                Entre com seus dados
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
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2, ...inputStyles }}
                />
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  sx={{ mb: 3, ...inputStyles }}
                />

                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Button
                    type="submit"
                    sx={{
                      py: 1,
                      px: 4,
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
                      minWidth: "120px",
                    }}
                  >
                    Entrar
                  </Button>
                </Box>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Link href="/reset_password/reset_password" passHref>
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.textMuted,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                        fontSize: "0.875rem",
                      }}
                    >
                      Esqueceu a senha?
                    </Typography>
                  </Link>
                </Box>
              </form>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
