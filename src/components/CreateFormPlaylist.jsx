import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, ListMusic, Upload, Loader2 } from "lucide-react";
import { createPlaylist } from "../services/playlistService";
import { uploadToCloudinary } from "../services/cloudinaryService"; // <--- Importar servicio
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const CreateFormPlaylist = ({ isOpen, onClose, onPlaylistCreated }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false); // Estado de carga

  if (!isOpen) return null;

  // Lógica para subir imagen
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue("imagenUrl", url); // Pone la URL en el formulario
      toast.success("Portada subida correctamente");
    } catch (error) {
      toast.error("Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const newPlaylist = await createPlaylist(data);
      toast.success("¡Playlist creada!");
      reset();
      if (onPlaylistCreated) onPlaylistCreated();
      onClose();
      if (newPlaylist && newPlaylist.id) {
        navigate(`/playlist/${newPlaylist.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la playlist");
    }
  };

  const imagenUrlValue = watch("imagenUrl"); // Para la vista previa

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ListMusic className="text-spotify-green" /> Nueva Playlist
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* NOMBRE */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Nombre</label>
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none"
              placeholder="Ej: Para entrenar"
              autoFocus
            />
            {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Descripción</label>
            <textarea
              {...register("description")}
              className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none resize-none h-24"
              placeholder="¿De qué va esta lista?"
            />
          </div>

          {/* PORTADA (HÍBRIDO: URL O SUBIDA) */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Portada</label>
            <div className="flex gap-2">
              {/* Input de URL manual */}
              <input
                {...register("imagenUrl")}
                className="flex-1 p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none placeholder-gray-500"
                placeholder="https://..."
              />

              {/* Botón de Subida */}
              <label className="bg-white/10 hover:bg-white/20 text-white p-3 rounded cursor-pointer transition flex items-center justify-center min-w-[50px] border border-white/5">
                {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Vista Previa */}
            {imagenUrlValue && (
              <div className="mt-2 flex justify-center">
                <img
                  src={imagenUrlValue}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded shadow-lg border border-white/10"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          {/* PRIVACIDAD */}
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-md">
            <input
              type="checkbox"
              id="publica"
              {...register("publica")}
              className="w-5 h-5 accent-spotify-green cursor-pointer"
              defaultChecked={true}
            />
            <label htmlFor="publica" className="text-sm text-white cursor-pointer select-none">
              ¿Hacer pública?
              <span className="block text-xs text-gray-400">Si la desmarcas, solo tú podrás verla.</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform w-full">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};