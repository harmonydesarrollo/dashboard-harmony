import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate

const AppointmentPage: React.FC = () => {
  const navigate = useNavigate(); // Usa el hook useNavigate para la navegación

  const handleLogout = () => {
    // Redirige al inicio de sesión por ahora
    navigate('/');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography component="h1" variant="h3" gutterBottom>
          Bienvenido a la Página de Citas
        </Typography>
        <Typography variant="body1" gutterBottom>
          ¡Estás en la página de inicio de tu aplicación! Aquí puedes agregar contenido relevante o funcionalidad específica
          para la página de inicio.
        </Typography>
        <Button onClick={handleLogout} variant="contained" sx={{ mt: 3, bgcolor: '#FF6F61', color: 'white' }}>
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default AppointmentPage;
