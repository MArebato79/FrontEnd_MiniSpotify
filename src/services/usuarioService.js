import api from './api';

// Esta función obtiene la lista de artistas que sigue el usuario

export const getFollowedArtists = async () => {
    try {
        const response = await api.get('/usuarios/following'); 
        return response.data;
    } catch (error) {
        console.error("Error obteniendo artistas seguidos", error);
        return [];
    }
};

export const followArtist = async (artistId) => {
    await api.post(`/usuarios/follow/${artistId}`);
};

export const unfollowArtist = async (artistId) => {
    await api.delete(`/usuarios/follow/${artistId}`);
};


