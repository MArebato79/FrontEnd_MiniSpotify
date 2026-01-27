import axios from 'axios';

// 1. Configuramos la URL de tu backend (Spring Boot corre en el 8080)
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. INTERCEPTOR MÁGICO
// Antes de lanzar la petición, mira si hay token y lo pega.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;