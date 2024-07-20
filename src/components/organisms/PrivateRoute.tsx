import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const user = localStorage.getItem('code'); // Check for user in localStorage

  return user ? <Outlet /> : <Navigate to="/" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
