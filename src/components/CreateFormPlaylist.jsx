import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { createPlaylist } from "../services/playlistService";
import { toast } from "sonner";

// Recibimos 3 órdenes del padre (Sidebar):
// isOpen: ¿Debo mostrarme?
// onClose: Función para cerrarme
// onPlaylistCreated: Función para avisar de que recargues la lista
export const CreateFormPlaylist = ({ isOpen, onClose, onPlaylistCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Si isOpen es falso, devolvemos null (no pintamos NADA en el HTML)
  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      // 1. Llamamos al servicio
      await createPlaylist(data);
      
      // 2. Feedback visual
      toast.success("¡Playlist creada! 🎵");
      
      // 3. Limpiamos el formulario
      reset();
      
      // 4. Avisamos al padre y cerramos
      onPlaylistCreated(); 
      onClose();
      
    } catch (error) {
      toast.error("Error al crear la playlist");
    }
  };

  return (
    // EL FONDO OSCURO (Overlay)
    // fixed inset-0: Ocupa toda la pantalla fija
    // bg-black/80: Fondo negro semitransparente
    // z-50: Se pone encima de todo
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      
      {/* LA CAJA FLOTANTE */}
      <div className="bg-spotify-light p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Botón Cerrar (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Crear Playlist</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Nombre</label>
            <input 
              {...register("nombre", { required: "Ponle un nombre chulo" })}
              className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none"
              placeholder="Ej: Rock para programar"
              autoFocus // Para que el cursor se ponga solo aquí al abrir
            />
            {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
          </div>

          <div>
            <label className="text-sm font-bold text-white mb-1 block">Descripción</label>
            <textarea 
              {...register("descripcion")}
              className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none resize-none h-24"
              placeholder="¿De qué va esta lista?"
            />
          </div>

          <div className="flex justify-end pt-2">
             <button 
               type="submit"
               className="bg-white text-black font-bold py-2 px-8 rounded-full hover:scale-105 transition-transform"
             >
               Crear
             </button>
          </div>
        </form>

      </div>
    </div>
  );
};