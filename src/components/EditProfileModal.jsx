import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Save, Upload, Loader2, User } from "lucide-react";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { updateArtist } from "../services/artistaService"; // Usaremos este si es artista
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import api from "../services/api"; // Importar api para llamar al usuario directo si hace falta

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth(); // Importante: updateUser del contexto
  const { register, handleSubmit, setValue, watch } = useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setValue("username", user.username);
      if (user.imagenUrl) setValue("foto", user.imagenUrl); 
    }
  }, [user, isOpen, setValue]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
        const url = await uploadToCloudinary(file);
        setValue("foto", url); // Asegúrate de que tu backend espera "foto" o "imagenUrl"
    } finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    try {
        // Llamada al backend (Ajusta la ruta según tu UsuarioController)
        const response = await api.put(`/usuarios/${user.id}`, {
            username: data.username,
            foto: data.foto // O fotoUrl
        });

        // ACTUALIZAR EL CONTEXTO GLOBAL (Para que cambie el nombre en la barra lateral al momento)
        updateUser({ 
            username: response.data.username, 
            imagenUrl: response.data.imagenUrl || response.data.foto 
        });
        
        toast.success("Perfil actualizado");
        onClose();
    } catch (error) {
        toast.error("Error al actualizar perfil");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><User/> Editar Perfil</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-white">Nombre de Usuario</label>
            <input {...register("username", { required: true })} className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Foto de Perfil</label>
            <div className="flex gap-2">
                <input {...register("foto")} className="flex-1 p-3 rounded bg-[#3E3E3E] text-white" placeholder="URL..." />
                <label className="bg-white/10 hover:bg-white/20 text-white p-3 rounded cursor-pointer">
                    {uploading ? <Loader2 className="animate-spin"/> : <Upload />}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            {watch("foto") && <img src={watch("foto")} className="mt-2 w-16 h-16 rounded-full object-cover"/>}
          </div>
          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-full hover:scale-105 transition">Guardar</button>
        </form>
      </div>
    </div>
  );
};