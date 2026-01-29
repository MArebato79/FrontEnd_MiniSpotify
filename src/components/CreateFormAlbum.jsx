import { useForm } from "react-hook-form";
import { X, Disc } from "lucide-react";
import { createAlbum } from "../services/albumService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const CreateFormAlbum = ({ isOpen, onClose, onAlbumCreated }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        try {
            // FECHA AUTOMÁTICA: Usamos el año actual
            const currentYear = new Date().getFullYear();

            const albumData = {
                ...data,
                anio: currentYear, // <--- AQUÍ ESTÁ EL CAMBIO
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

                    {/* EL INPUT DE AÑO HA SIDO ELIMINADO PORQUE ES AUTOMÁTICO */}

                    <div>
                        <label className="text-sm font-bold text-white mb-1 block">Carátula (URL)</label>
                        <input
                            {...register("imagenUrl")}
                            className="w-full p-3 rounded bg-[#3E3E3E] text-white border-none focus:ring-2 focus:ring-spotify-green outline-none"
                            placeholder="https://..."
                        />
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