import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Disc, Upload, Loader2 } from "lucide-react";
import { createAlbum } from "../services/albumService";
import { uploadToCloudinary } from "../services/cloudinaryService"; // <--- Importar servicio
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const CreateFormAlbum = ({ isOpen, onClose, onAlbumCreated }) => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

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
            const currentYear = new Date().getFullYear();
            const albumData = {
                ...data,
                anio: currentYear,
                artistId: user.artistId
            };

            const newAlbum = await createAlbum(albumData);

            toast.success(`¡Álbum lanzado! (${currentYear}) 💿`);
            reset();

            if (onAlbumCreated) onAlbumCreated();
            onClose();

            if (newAlbum && newAlbum.id) {
                navigate(`/album/${newAlbum.id}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al publicar el álbum");
        }
    };

    const imagenUrlValue = watch("imagenUrl");

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md border border-white/10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Disc className="text-spotify-green" /> Nuevo Álbum
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label className="text-sm font-bold text-white mb-1 block">Título del Álbum</label>
                        <input
                            {...register("nombre", { required: "El título es obligatorio" })}
                            className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none"
                            placeholder="Ej: Grandes Éxitos"
                            autoFocus
                        />
                        {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
                    </div>

                    {/* CARÁTULA (HÍBRIDO) */}
                    <div>
                        <label className="text-sm font-bold text-white mb-1 block">Carátula</label>
                        <div className="flex gap-2">
                            <input
                                {...register("imagenUrl")}
                                className="flex-1 p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none placeholder-gray-500"
                                placeholder="https://..."
                            />
                            <label className="bg-white/10 hover:bg-white/20 text-white p-3 rounded cursor-pointer transition flex items-center justify-center min-w-[50px]">
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
                        {imagenUrlValue && (
                            <div className="mt-2 flex justify-center">
                                <img
                                    src={imagenUrlValue}
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
                            id="publica_album"
                            {...register("publica")}
                            className="w-5 h-5 accent-spotify-green cursor-pointer"
                            defaultChecked={true}
                        />
                        <label htmlFor="publica_album" className="text-sm text-white cursor-pointer select-none">
                            ¿Álbum Público?
                            <span className="block text-xs text-gray-400">Desmarca para mantenerlo oculto.</span>
                        </label>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-spotify-green text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform w-full">
                            Publicar Ahora
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};