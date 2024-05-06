// src/components/molecules/LoginForm.tsx
import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const LoginForm: React.FC = () => {
  return (
    <Box>
      <TextField label="Username" fullWidth />
      <TextField label="Password" type="password" fullWidth />
      <Button variant="contained" color="primary" fullWidth>
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
