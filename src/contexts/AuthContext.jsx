import { createContext, useState, useContext, useEffect } from 'react';
import { logout as logoutAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Verificar si hay token al cargar la app
  useEffect(() => {
    if (token) {
      // Aquí podrías hacer una llamada para validar el token
      // Por ahora asumimos que si hay token, hay usuario
      const role = localStorage.getItem('role');
      setUser({ role });
    }
    setLoading(false);
  }, [token]);

  const login = (tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('role', userData.role);
    setToken(tokenData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutAPI(); // Llamada a la API para logout
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setToken(null);
      setUser(null);
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };