import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || 'USER');

  const login = (newToken, userRole = 'USER') => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userRole);
    setToken(newToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken('');
    setRole('USER');
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);