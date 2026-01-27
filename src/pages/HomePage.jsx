import { Sidebar } from "../components/Sidebar";
import { Player } from "../components/Player";
import { Search, Bell, User } from "lucide-react"; // Iconos nuevos

export const HomePage = () => {
  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-black hidden md:flex flex-col border-r border-white/5">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 bg-gradient-to-b from-spotify-light/50 to-spotify-dark overflow-y-auto rounded-lg m-2 relative">
            
            {/* --- HEADER CON BUSCADOR (Sticky para que se quede arriba al hacer scroll) --- */}
            <header className="sticky top-0 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between z-10">
                
                {/* BUSCADOR ARRIBA */}
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-96 group focus-within:bg-white/20 transition">
                    <Search size={20} className="text-gray-400 group-focus-within:text-white" />
                    <input 
                        type="text" 
                        placeholder="¿Qué quieres escuchar?" 
                        className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-gray-400 text-sm"
                    />
                </div>

                {/* ICONOS PERFIL A LA DERECHA */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white"><Bell size={20}/></button>
                    <div className="bg-black/50 p-1 rounded-full cursor-pointer hover:scale-105 transition">
                        <User size={24} className="text-white bg-gray-700 rounded-full p-1" />
                    </div>
                </div>
            </header>

            {/* CONTENIDO DE LA PÁGINA */}
            <div className="p-6 pt-2">
                <h1 className="text-3xl font-bold text-white mb-6">Buenos días ☀️</h1>
                
                {/* Ejemplo de contenido */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="bg-spotify-light p-4 rounded-md hover:bg-white/10 transition cursor-pointer group">
                            <div className="w-full aspect-square bg-gray-800 rounded mb-4 shadow-lg group-hover:shadow-2xl relative overflow-hidden">
                                <img src={`https://picsum.photos/seed/${i}/200`} alt="Album" className="w-full h-full object-cover"/>
                            </div>
                            <div className="font-bold text-white truncate">Mix Diario {i}</div>
                            <div className="text-xs text-gray-400 line-clamp-2">Artistas recomendados para ti</div>
                        </div>
                    ))}
                </div>
            </div>

        </main>
      </div>

      <footer className="h-24 bg-black border-t border-white/10 w-full z-50">
         <Player />
      </footer>
    </div>
  );
};