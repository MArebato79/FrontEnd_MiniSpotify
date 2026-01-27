import { Home, Search, Library, LogOut, Music } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Sidebar = () => {
  const { logout } = useAuth();
  
  return (
    <div className="p-6 h-full flex flex-col justify-between text-gray-400">
        {/* Navegación Superior */}
        <div className="space-y-6">
            <div className="flex text-white font-bold text-xl px-2 p-8">MiniFy<Music size={20} className="text-spotify-green" /></div>
            <nav className="space-y-4 p-4">
                <a href="#" className="flex items-center gap-4 hover:text-white transition font-medium text-sm">
                    <Home size={24} /> Inicio
                </a>
                <a href="#" className="flex items-center gap-4 hover:text-white transition font-medium text-sm">
                    <Search size={24} /> Buscar
                </a>
                <a href="#" className="flex items-center gap-4 hover:text-white transition font-medium text-sm">
                    <Library size={24} /> Tu Biblioteca
                </a>
            </nav>
        </div>

        {/* Botón Salir Abajo */}
        <button onClick={logout} className="flex items-center gap-4 hover:text-white transition font-medium text-sm px-2">
            <LogOut size={20} /> Cerrar Sesión
        </button>
    </div>
  );
};