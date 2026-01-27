import api from './api';

// Función para Login (Conecta con AuthController)
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Tu backend devuelve un JSON: { "token": "..." }
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    // Si falla, lanzamos el error para que lo capture el formulario y muestre la alerta roja
    console.error("Error en login:", error);
    throw error;
  }
};

// Función para Registro (Conecta con UsuarioController)
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/usuarios/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
};

// Función para Logout
export const logoutUser = () => {
  localStorage.removeItem('token');
};