import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Music, Upload, Loader2, Clock } from "lucide-react";
import { createCancion } from "../services/cancionService";
import { uploadToCloudinary } from "../services/cloudinaryService"; // <--- Importar Cloudinary
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export const CreateFormCancion = ({ isOpen, onClose, onSongCreated }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  // Lógica de subida de imagen
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue("imagenUrl", url);
      toast.success("Carátula subida");
    } catch (error) {
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Convertir duración 'mm:ss' a segundos (si usas input de texto) o enviarla directa
      // Asumiremos que el backend espera un entero (segundos) o string.
      // Aquí un ejemplo simple enviando los datos directos:
      const cancionData = {
        ...data,
        artistId: user.artistId, // Asociar al artista logueado
      };

      await createCancion(cancionData);

      toast.success("¡Canción subida con éxito! 🎵");
      reset();
      if (onSongCreated) onSongCreated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la canción");
    }
  };

  const imagenUrlValue = watch("imagenUrl");

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Music className="text-blue-500" /> Nueva Canción
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* TÍTULO */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">
              Título
            </label>
            <input
              {...register("titulo", { required: "El título es obligatorio" })}
              className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Bohemian Rhapsody"
              autoFocus
            />
            {errors.titulo && (
              <span className="text-red-500 text-xs">
                {errors.titulo.message}
              </span>
            )}
          </div>

          {/* DURACIÓN (Ejemplo simple en segundos) */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">
              Duración (segundos)
            </label>
            <div className="relative">
              <Clock
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="number"
                {...register("duracion", { required: true, min: 1 })}
                className="w-full p-3 pl-10 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: 210"
              />
            </div>
          </div>

          {/* CARÁTULA (SINGLE) */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">
              Carátula del Single
            </label>
            <div className="flex gap-2">
              <input
                {...register("imagenUrl")}
                className="flex-1 p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                placeholder="https://..."
              />
              <label className="bg-white/10 hover:bg-white/20 text-white p-3 rounded cursor-pointer transition flex items-center justify-center min-w-[50px]">
                {uploading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Upload size={20} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
            {imagenUrlValue && (
              <img
                src={imagenUrlValue}
                className="mt-2 w-20 h-20 object-cover rounded shadow"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform w-full mt-2"
          >
            Subir Canción
          </button>
        </form>
      </div>
    </div>
  );
};
