import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, Loader2, ListMusic } from "lucide-react";
import { updatePlaylist } from "../services/playlistService";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { toast } from "sonner";

export const EditPlaylistModal = ({ isOpen, onClose, playlist, onUpdated }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (playlist && isOpen) {
      setValue("nombre", playlist.nombre);
      setValue("descripcion", playlist.description || playlist.descripcion);
      setValue("publica", playlist.publica);
      setValue("imagenUrl", playlist.imagenUrl || playlist.foto);
    }
  }, [playlist, isOpen, setValue]);

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
      await updatePlaylist(playlist.id, data);
      toast.success("Playlist actualizada");
      if(onUpdated) onUpdated();
      onClose();
    } catch { toast.error("Error al actualizar playlist"); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
        <h2 className="text-xl font-bold text-white mb-6 flex gap-2"><ListMusic/> Editar Playlist</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-white">Nombre</label>
            <input {...register("nombre", { required: true })} className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-white">Descripción</label>
            <textarea {...register("descripcion")} className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none resize-none h-20" />
          </div>
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Portada</label>
            <div className="flex gap-2">
                <input {...register("imagenUrl")} className="flex-1 p-3 rounded bg-[#3E3E3E] text-white" />
                <label className="bg-white/10 p-3 rounded cursor-pointer text-white">
                    {uploading ? <Loader2 className="animate-spin"/> : <Upload />}
                    <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
            {/* VISTA PREVIA PROTEGIDA */}
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
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("publica")} className="w-5 h-5 accent-green-500" defaultChecked={playlist?.publica}/>
            <label className="text-white text-sm">Pública</label>
          </div>
          <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-full hover:scale-105 transition">Guardar</button>
        </form>
      </div>
    </div>
  );
};