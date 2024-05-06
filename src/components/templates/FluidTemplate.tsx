import React, { ReactNode } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const FluidTemplate: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'red',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default FluidTemplate;
