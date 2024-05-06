import React from 'react';
import { Container, Typography, Box, TextField, Button, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  const handleLogin = () => {
    // Aquí iría la lógica para verificar las credenciales y realizar el inicio de sesión
    // Por ahora, simplemente redirigimos al usuario a la página de inicio después de hacer clic en el botón
    navigate('/home'); // Redirige al usuario a la página de inicio
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{ width: 80, height: 80, mb: 2 }}
          alt="Logo"
          src="https://content.wepik.com/statics/27179704/preview-page0.jpg"
        />
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#00D6B2', color: 'white' }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
