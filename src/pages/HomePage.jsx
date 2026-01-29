import { Search, Bell, User } from "lucide-react";

export const HomePage = () => {
    return (
        <>
            {/* HEADER (Buscador) */}
            <header className="sticky top-0 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between z-10">
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-96 group focus-within:bg-white/20 transition">
                    <Search size={20} className="text-gray-400 group-focus-within:text-white" />
                    <input
                        type="text"
                        placeholder="¿Qué quieres escuchar?"
                        className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-400 text-sm"
                    />
                </div>
                {/* Iconos... */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white"><Bell size={20} /></button>

                    <Link to="/perfil">
                        <div className="bg-black/50 p-1 rounded-full cursor-pointer hover:scale-105 transition">
                            <User size={24} className="text-white bg-gray-700 rounded-full p-1" />
                        </div>
                    </Link>

                </div>
            </header>

            {/* CONTENIDO */}
            <div className="p-6 pt-2">
                <h1 className="text-3xl font-bold text-white mb-6">Buenos días ☀️</h1>
                {/* Aquí tus Grids de álbumes... */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* ... tu código de los cuadros ... */}
                </div>
            </div>
        </>
    );
};