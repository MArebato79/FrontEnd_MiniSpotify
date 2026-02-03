import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Music, Upload, Loader2 } from "lucide-react";
import { createCancion } from "../services/cancionService";
import { uploadToCloudinary } from "../services/cloudinaryService";
import api from "../services/api"; 
import { toast } from "sonner";

export const CreateFormCancion = ({ isOpen, onClose, onSongCreated }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [uploading, setUploading] = useState(false);
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    if (isOpen) {
        api.get("/canciones/generos")
           .then(res => setGeneros(res.data))
           .catch(() => setGeneros(["POP", "ROCK", "OTRO"]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
        const url = await uploadToCloudinary(file);
        setValue("imagenUrl", url);
        toast.success("Carátula cargada");
    } catch (error) { toast.error("Error al subir"); } finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    try {
      const cancionData = {
          titulo: data.titulo,
          imagenUrl: data.imagenUrl,
          genero: data.genero,
          publica: data.publica
      };
      await createCancion(cancionData);
      toast.success("¡Canción publicada!");
      reset();
      if (onSongCreated) onSongCreated();
      onClose();
    } catch (error) { toast.error("Error al subir"); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Music className="text-blue-500"/> Nueva Canción</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-white">Título</label>
            <input {...register("titulo", { required: true })} className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none" placeholder="Ej: Song 2" />
          </div>
          <div>
            <label className="text-sm font-bold text-white">Género</label>
            <select {...register("genero", { required: true })} className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none cursor-pointer">
                <option value="">Selecciona...</option>
                {generos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-white block mb-1">Carátula</label>
            <div className="flex gap-2">
                <input {...register("imagenUrl")} className="flex-1 p-3 rounded bg-[#3E3E3E] text-white" placeholder="https://..." />
                <label className="bg-white/10 hover:bg-white/20 text-white p-3 rounded cursor-pointer">
                    {uploading ? <Loader2 className="animate-spin"/> : <Upload />}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            
            {/* VISTA PREVIA PROTEGIDA */}
            {watch("imagenUrl") && watch("imagenUrl").length > 5 && (
                <div className="mt-2 flex justify-center">
                    <img src={watch("imagenUrl")} className="w-20 h-20 object-cover rounded shadow"
                        onError={(e) => e.target.style.display = 'none'} 
                        onLoad={(e) => e.target.style.display = 'block'}
                    />
                </div>
            )}
          </div>
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-md">
            <input type="checkbox" {...register("publica")} className="w-5 h-5 accent-blue-500" defaultChecked={true} />
            <label className="text-sm text-white">Visible para todos</label>
          </div>
          <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full w-full mt-2">Subir Canción</button>
        </form>
      </div>
    </div>
  );
};