"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import api from "../../utils/api";

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
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/fornecedores");
      }
    } catch (err) {
      // Apenas loga erro se não for erro de autenticação (401)
      if (err.response?.status !== 401) {
        console.error("Login failed", err);
      }
      const errorMessage = err.response?.data?.message || "Falha no login. Verifique suas credenciais.";
      setError(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
            {/* Nuvens adicionais */}
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

            {/* Anéis ao redor da logo com profundidade (sem pulsação) */}
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

          {/* Right side - Login form */}
          <Box
            sx={{
              width: "50%",
              backgroundColor: "#FADADD",
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
                color: "#333",
                mb: 1,
              }}
            >
              Login
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "#555",
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
                  color: "red",
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
                sx={{
                  mb: 2,
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
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          color: "#666",
                          "&:hover": {
                            color: "#9AE4FF",
                          },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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

              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Button
                  type="submit"
                  sx={{
                    py: 1,
                    px: 4,
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
                      color: "#555",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
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
  );
}
