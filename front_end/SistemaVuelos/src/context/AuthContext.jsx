import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      let errorMsg = 'Error al iniciar sesión';
      
      if (errorData?.errors && errorData.errors.length > 0) {
        errorMsg = errorData.errors[0].msg; // Error de express-validator
      } else if (errorData?.message) {
        errorMsg = errorData.message; // Error del catch en backend
      }
      
      return { success: false, message: errorMsg };
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      navigate('/login');
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      let errorMsg = 'Error al registrarse';
      
      if (errorData?.errors && errorData.errors.length > 0) {
        errorMsg = errorData.errors[0].msg; // Error de express-validator
      } else if (errorData?.message) {
        errorMsg = errorData.message; // Error del catch en backend
      }
      
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
