import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Avatar, Stack, Alert, AlertTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginResponse, authServices, dtoLogin } from '../../services/auth/authService';

const LoginPage: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const code = localStorage.getItem('code');
    const photo = localStorage.getItem('photo');
    const fullname = localStorage.getItem('fullName');
    const userId = localStorage.getItem('_id');
    
    if (code) {
      navigate('/employee'); // Redirect to employee if already authenticated
    }
  }, [navigate]);

  const handleLogin = async () => {
    const dtoAuxLogin: dtoLogin = {
      username: username,
      password: password
    };
    
    try {
      if(username.length === 0  || password.length === 0){
        setSuccessMessage('Debes de escribir tu usuario y contraseña.');
        setMessage('Datos Obligatorios.')
      }else{
        const response = await authServices.Auth(dtoAuxLogin, "");
        if (response.code === 200) {
          // console.log('entro?')
          // Store user data in localStorage
          localStorage.setItem('code', response.code);
          localStorage.setItem('photo', response.items[0].photo);
          localStorage.setItem('fullname', response.items[0].fullName);
          localStorage.setItem('_id', response.items[0]._id);
          navigate('/employee');
        } else {
          setSuccessMessage('Usuario o Contraseña incorrecta, verifica tus datos.');
        }
      }
      
    } catch (error) {
      console.error('Error during login:', error);
      setSuccessMessage('Ocurrió un error, intenta nuevamente.');
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
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
          src="https://harmony-web.s3.amazonaws.com/logo.jpg"
        />
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
            margin="normal"
            label="Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Contraseña"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nombre de usuario"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleSearchChange}
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
            value={password}
            onChange={handleSearchChange}
          /> */}
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
      {successMessage && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert
            severity="error"
            onClose={() => setSuccessMessage('')}
          >
            <AlertTitle>
              {message}
              </AlertTitle>
            {successMessage}
          </Alert>
        </Stack>
      )}
    </Container>
  );
};

export default LoginPage;
