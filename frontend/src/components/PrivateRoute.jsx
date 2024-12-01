import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivateRoute = () => {
  const { user } = useUser(); // Check user authentication

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
