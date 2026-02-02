import axios from 'axios';

const CLOUD_NAME = "dyj699esy"; 
const UPLOAD_PRESET = "minispotify"; 

export const uploadToCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET); // Necesario para subir sin login backend

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
        );

        // Cloudinary devuelve la URL segura en secure_url
        return response.data.secure_url;
    } catch (error) {
        console.error("Error subiendo a Cloudinary", error);
        throw error;
    }
};