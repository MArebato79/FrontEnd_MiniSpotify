import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
// ❌ BORRA ESTA LÍNEA: import { Player } from "./components/Player";

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar Fija */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <Sidebar />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Añadimos pb-24 para que el Player (que es fixed) no tape el contenido final */}
        <main className="flex-1 overflow-y-auto bg-[#121212] md:rounded-lg md:m-2 pb-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
