import api from "./api";

export const getAllCanciones = async () => {
    try {
        const response = await api.get('/canciones')
        return response.data
    } catch (error) {
        console.log("Error al coger las canciones",error)
    }
}

export const getCancionById = async (id) =>{
    try {
        const response = await api.get(`/canciones/${id}`)
        return response.data
    } catch (error) {
        console.log("Error al acceder a la cancion",error)
    }
}

export const createCancion = async (cancionData)=>{ 
    try {
        const response = await api.post('/canciones',cancionData)
        return response.data
    } catch (error) {
        console.log("Error al crear la cancion",error)
    }
}