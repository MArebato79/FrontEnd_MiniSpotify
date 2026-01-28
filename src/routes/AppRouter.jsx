import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { MainLayout } from "../MainLayout"; // Asegúrate de que la ruta sea correcta
import { PlaylistPage } from "../pages/PlaylistPage";

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas Públicas (Sin Sidebar) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* RUTAS PROTEGIDAS (Con Sidebar y Player) */}
            <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/playlist/:id" element={<PlaylistPage />} /> {/* :id es variable */}
                {/* Puedes añadir más: <Route path="/perfil" element={<ProfilePage />} /> */}
            </Route>

            {/* Redirección por defecto */}
            <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
    );
};