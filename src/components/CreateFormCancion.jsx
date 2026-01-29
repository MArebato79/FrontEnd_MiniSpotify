import { useForm } from "react-hook-form";
import { X, Music } from "lucide-react";
import { createCancion } from "../services/cancionService";
import { toast } from "sonner";

export const CreateFormCancion = ({ isOpen, onClose, albumId, onSongCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      // Convertimos duración a número y añadimos el albumId
      const cancionData = {
        titulo: data.titulo,
        duracion: parseInt(data.duracion), 
        albumId: albumId // Vital para relacionarla
      };

      await createCancion(cancionData);
      
      toast.success("¡Canción añadida! 🎵");
      reset();
      
      if (onSongCreated) onSongCreated(); // Para recargar la lista de canciones al instante
      onClose();

    } catch (error) {
      console.error(error);
      toast.error("Error al subir la canción");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Music className="text-spotify-green"/> Añadir Canción
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Título */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Título</label>
            <input 
              {...register("titulo", { required: "El título es obligatorio" })}
              className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none"
              placeholder="Ej: Bohemian Rhapsody"
              autoFocus
            />
            {errors.titulo && <span className="text-red-500 text-xs">{errors.titulo.message}</span>}
          </div>

          {/* Duración */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Duración (segundos)</label>
            <input 
              type="number"
              {...register("duracion", { 
                  required: "La duración es obligatoria",
                  min: { value: 1, message: "Debe durar algo" } 
              })}
              className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none"
              placeholder="Ej: 215"
            />
            <p className="text-xs text-gray-400 mt-1">
                Tip: 3 min 30 seg = 210 segundos
            </p>
            {errors.duracion && <span className="text-red-500 text-xs">{errors.duracion.message}</span>}
          </div>

          <div className="flex justify-end pt-2">
             <button 
               type="submit"
               className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform w-full"
             >
               Añadir Track
             </button>
          </div>
        </form>

      </div>
    </div>
  );
};