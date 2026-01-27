// 1. IMPORTACIONES OBLIGATORIAS (Faltaban estas)
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import { AppRouter } from "./routes/AppRouter";
import './App.css'; // Opcional si lo vaciaste

function App() {
  return (
    <BrowserRouter>
      {/* Notificaciones globales */}
      <Toaster richColors position="top-center" />
      
      {/* Nuestro gestor de rutas */}
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;