import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Loader2, Music } from "lucide-react";
import { updateCancion } from "../services/cancionService";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { toast } from "sonner";

export const EditSongModal = ({ isOpen, onClose, song, onUpdated }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (song && isOpen) {
      setValue("titulo", song.titulo);
      setValue("duracion", song.duracion);
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
      await updateCancion(song.id, data);
      toast.success("Canción actualizada");
      onUpdated();
      onClose();
    } catch { toast.error("Error al actualizar"); }
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
            <label className="text-sm font-bold text-white">Duración (segundos)</label>
            <input type="number" {...register("duracion")} className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Carátula</label>
            <div className="flex gap-2">
                <input {...register("imagenUrl")} className="flex-1 p-3 rounded bg-[#3E3E3E] text-white" />
                <label className="bg-white/10 p-3 rounded cursor-pointer text-white">
                    {uploading ? <Loader2 className="animate-spin"/> : <Upload />}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-full">Guardar</button>
        </form>
      </div>
    </div>
  );
};