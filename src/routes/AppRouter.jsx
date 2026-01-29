import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { MainLayout } from "../MainLayout"; 
import { PlaylistPage } from "../pages/PlaylistPage";
import { AlbumPage } from "../pages/AlbumPage";
import { ProfilePage } from "../pages/ProfilePage";
import { LibraryPage } from "../pages/LibraryPage";

export const AppRouter = () => {
    return (
        <Routes>
            {/* Rutas Públicas (Sin Sidebar) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* RUTAS PROTEGIDAS (Con Sidebar y Player) */}
            <Route element={<MainLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/playlist/:id" element={<PlaylistPage />} />
                <Route path="/perfil" element={<ProfilePage />} /> {/* Ahora sí funcionará */}
                <Route path="/album/:id" element={<AlbumPage/>} />
                <Route path="/library" element={<LibraryPage />} />
            </Route>

            {/* Redirección por defecto */}
            <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
    );
};