import { Sidebar } from "../components/Sidebar";
import { Player } from "../components/Player";

export const HomePage = () => {
  return (
    // CONTENEDOR TOTAL (Ocupa toda la altura de la pantalla 'h-screen' y no tiene scroll general 'overflow-hidden')
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      
      {/* PARTE SUPERIOR: Sidebar + Contenido Principal */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 1. SIDEBAR (Izquierda) */}
        {/* w-64: Ancho fijo de 16rem (unos 250px) */}
        <aside className="w-64 bg-black hidden md:flex flex-col">
           <Sidebar />
        </aside>

        {/* 2. AREA PRINCIPAL (Centro) */}
        {/* flex-1: Ocupa todo el espacio sobrante */}
        {/* overflow-y-auto: Solo esta parte hace scroll vertical si hay mucho contenido */}
        {/* bg-gradient-to-b: Degradado chulo de Spotify */}
        <main className="flex-1 bg-gradient-to-b from-spotify-light/30 to-spotify-dark overflow-y-auto p-6 rounded-lg m-2">
            {/* AQUÍ IRÁ TU CONTENIDO VARIABLE */}
            <h1 className="text-3xl font-bold text-white mb-6">Buenos días ☀️</h1>
            
            {/* Unas cajas de ejemplo para que veas el scroll */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-40 bg-white/5 rounded-md hover:bg-white/10 transition cursor-pointer"></div>
                ))}
            </div>
        </main>

      </div>

      {/* 3. REPRODUCTOR (Abajo) */}
      {/* h-24: Altura fija de 6rem (unos 96px) */}
      <footer className="h-24 bg-black border-t border-white/10 w-full z-50">
        <Player />
      </footer>

    </div>
  );
};