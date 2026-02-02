import { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode"; // <--- Importamos la librería
import { loginUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para decodificar el token
  const processToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      // Guardamos el token Y los datos importantes (nombre, si es artista, etc)
      setUser({ 
        token,
        username: decoded.sub,
        artistId: decoded.artistId || null // Si no es artista, esto será null
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token inválido", error);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      processToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data.token) {
        processToken(data.token);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (newData) => {
    // 1. Fusionamos los datos actuales con los nuevos (ej: añadimos artistId)
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);