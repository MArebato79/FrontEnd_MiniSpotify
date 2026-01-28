import api from "./api";

export const getAllCanciones = async () => {
    try {
        const response = await api.get('/canciones')
        return response.data
    } catch (error) {
        console.log("Error al coger las canciones",error)
    }
}