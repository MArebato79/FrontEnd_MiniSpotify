import api from './api';

export const getMyPlaylists = async () => {
    try {
        const response = await api.get('/playlists/my'); // Tu endpoint GET /playlists devuelve las del usuario
        return response.data;
    } catch (error) {
        console.error("Error obteniendo playlists", error);
    return [];
    }
};

export const createPlaylist = async (playlistData) => { 
    try {
        const response = await api.post('/playlists', playlistData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la playlist", error);
        throw error;
    }
}

export const deletePlaylist = async (id) => {
    try{
        const response = await api.delete(`/playlists/${id}`)
    }catch(error){
        console.error("Error borrando playlist", error);
        throw error;
    }
}

