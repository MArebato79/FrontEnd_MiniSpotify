import { Play, SkipBack, SkipForward, Repeat, Shuffle } from "lucide-react";

export const Player = () => {
  return (
    <div className="h-full flex items-center justify-between px-4 text-white">
        {/* Info Canción */}
        <div className="w-1/3">
            <div className="text-sm font-bold">Nombre Canción</div>
            <div className="text-xs text-gray-400">Artista</div>
        </div>

        {/* Controles */}
        <div className="flex flex-col items-center w-1/3">
            <div className="flex items-center gap-6 mb-2">
                <Shuffle size={16} className="text-gray-400 hover:text-white cursor-pointer" />
                <SkipBack size={20} className="fill-white hover:scale-105 cursor-pointer" />
                <div className="bg-white rounded-full p-2 hover:scale-105 cursor-pointer text-black">
                    <Play size={20} className="fill-black ml-0.5" />
                </div>
                <SkipForward size={20} className="fill-white hover:scale-105 cursor-pointer" />
                <Repeat size={16} className="text-gray-400 hover:text-white cursor-pointer" />
            </div>
            {/* Barra de progreso falsa */}
            <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-white rounded-full"></div>
            </div>
        </div>

        {/* Volumen (Hueco derecho) */}
        <div className="w-1/3"></div>
    </div>
  );
};