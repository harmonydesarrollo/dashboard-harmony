import React, { ReactNode } from 'react';
import { Container, Paper } from '@mui/material';

interface AuthTemplateProps {
  children: ReactNode;
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children }) => {
  return (
    <Container maxWidth="xs">
      <Paper sx={{ padding: 2, marginTop: 8 }}>{children}</Paper>
    </Container>
  );
};

export default AuthTemplate;
