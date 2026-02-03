import { createContext, useContext, useState } from "react";
// Importamos los nombres correctos que tienes en tu servicio
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Leemos el usuario del localStorage al iniciar para no perder la sesión
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 👇👇 FUNCIÓN ARREGLADA: Acepta (email, password) por separado 👇👇
  const login = async (email, password) => {
    try {
      // Ahora sí pasamos las variables directas al servicio
      const response = await loginUser(email, password);

      // Guardamos la respuesta completa del backend
      const userData = response;

      setUser(userData);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Error en AuthContext login:", error);
      throw error;
    }
  };

  const register = async (data) => {
    await registerUser(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
