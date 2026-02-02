import api from './api';

export const getMyPlaylists = async () => {
    try {
        const response = await api.get('/playlists'); // Tu endpoint GET /playlists devuelve las del usuario
        return response.data.content || response.data || [];
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


export const updatePlaylist = async (id, data) => {
    const response = await api.put(`/playlists/${id}`, data);
    return response.data;
};

export const deletePlaylist = async (id) => {
    try{
        await api.delete(`/playlists/${id}`);
    }catch(error){
        console.error("Error borrando playlist", error);
        throw error;
    }
}
