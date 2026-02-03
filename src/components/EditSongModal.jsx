import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Loader2, Music } from "lucide-react";
import { updateCancion } from "../services/cancionService";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { toast } from "sonner";

export const EditSongModal = ({ isOpen, onClose, song, onUpdated }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (song && isOpen) {
      setValue("titulo", song.titulo);
      // El backend puede enviar 'foto' o 'imagenUrl', pero el form usa 'imagenUrl'
      setValue("imagenUrl", song.imagenUrl || song.foto);
    }
  }, [song, isOpen, setValue]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
        const url = await uploadToCloudinary(file);
        setValue("imagenUrl", url);
    } finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    try {
      // 👇👇 PREPARAMOS EL PAQUETE CON MUCHO CUIDADO 👇👇
      const payload = {
          titulo: data.titulo,
          imagenUrl: data.imagenUrl,
          
          // 1. GÉNERO: Usamos el que ya tiene la canción, o "POP" por defecto.
          // Importante: Si tu Enum en Java es "Pop" o "Rock", asegúrate de que esto coincida.
          genero: song.genero || "POP",
          
          // 2. PÚBLICA: Aseguramos que sea booleano (true/false)
          publica: song.publica !== undefined ? song.publica : true,
          
          // 3. ÁLBUM: Si tiene álbum, enviamos el ID como String. Si no, null.
          albumId: song.album && song.album.id ? String(song.album.id) : null,
          
          // 4. COLABORADORES: Enviamos null en vez de [] para evitar errores de deserialización
          colaboradores: null
      };

      // 🔍 DEBUG: Mira la consola del navegador si vuelve a salir error 400
      console.log("Enviando Payload al Backend:", payload);

      await updateCancion(song.id, payload);
      
      toast.success("Canción actualizada");
      if(onUpdated) onUpdated();
      onClose();
    } catch (e) { 
        console.error("Error al actualizar:", e);
        // Mostramos el mensaje detallado si el backend lo envía
        const errorMsg = e.response?.data?.message || "Error de validación (400)";
        toast.error(`Error: ${errorMsg}`); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
        <h2 className="text-xl font-bold text-white mb-6 flex gap-2"><Music/> Editar Canción</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="text-sm font-bold text-white">Título</label>
            <input {...register("titulo", { required: true })} className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none" />
          </div>

          <div>
            <label className="text-sm font-bold text-white mb-1 block">Carátula</label>
            <div className="flex gap-2">
                <input {...register("imagenUrl")} className="flex-1 p-3 rounded bg-[#3E3E3E] text-white" placeholder="URL..." />
                <label className="bg-white/10 p-3 rounded cursor-pointer text-white">
                    {uploading ? <Loader2 className="animate-spin"/> : <Upload />}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            
            {watch("imagenUrl") && watch("imagenUrl").length > 5 && (
                <div className="mt-2 flex justify-center">
                    <img 
                        src={watch("imagenUrl")} 
                        className="w-20 h-20 object-cover rounded shadow"
                        onError={(e) => e.target.style.display = 'none'} 
                        onLoad={(e) => e.target.style.display = 'block'}
                    />
                </div>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-full">Guardar</button>
        </form>
      </div>
    </div>
  );
};