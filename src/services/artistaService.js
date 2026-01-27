import api from './api';

export const getArtistById = async (id) => {
  try {
    const response = await api.get(`/artistas?search=${id}`); // Usamos el buscador o un endpoint específico
    // NOTA: Según tu backend, tienes getArtistaById en el controller pero quizás la ruta sea /artistas/{id}
    // Si tu ruta es /artistas/{id}, usa esta línea:
    const responseDirect = await api.get(`/artistas/${id}`); 
    return responseDirect.data;
  } catch (error) {
    console.error("Error obteniendo artista", error);
    return null;
  }
};