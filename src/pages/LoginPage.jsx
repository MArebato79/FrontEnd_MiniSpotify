import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner"; // Para las alertas
import { Music } from "lucide-react"; // Icono chulo

export const LoginPage = () => {
  // 1. Hook del formulario (gestiona los inputs)
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // 2. Hooks de nuestra app
  const { login } = useAuth();
  const navigate = useNavigate();

  // 3. Función que se ejecuta SOLO si el formulario es válido
  const onSubmit = async (data) => {
    try {
      // data.email y data.password vienen solos gracias a 'register'
        await login(data.email, data.password);
      
        toast.success("¡Bienvenido de nuevo! 🎧");
        navigate("/home"); // Redirigimos al Dashboard
    } catch (error) {
        toast.error("Credenciales incorrectas o error en servidor");
        console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-spotify-dark p-8 rounded-lg w-full max-w-sm border border-white/10 shadow-2xl">
        
        {/* LOGO */}
        <div className="flex justify-center mb-8 text-white">
            <Music size={48} className="text-spotify-green" />
            <h1 className="text-3xl font-bold ml-2 tracking-tighter">MiniSpotify</h1>
        </div>

        <h2 className="text-white text-center text-2xl font-bold mb-8">Iniciar Sesión</h2>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Email o usuario</label>
            <input 
              type="email" 
              placeholder="usuario@ejemplo.com"
              {...register("email", { required: "El email es obligatorio" })}
              className="w-full p-3 rounded bg-spotify-light text-white border border-transparent focus:border-spotify-green focus:outline-none transition"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Contraseña</label>
            <input 
              type="password" 
              placeholder="Contraseña"
              {...register("password", { required: "La contraseña es obligatoria" })}
              className="w-full p-3 rounded bg-spotify-light text-white border border-transparent focus:border-spotify-green focus:outline-none transition"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          {/* Botón Submit */}
          <button 
            type="submit" 
            className="w-full bg-spotify-green text-black font-bold py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-sm"
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-spotify-gray text-xs">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-white hover:underline font-bold">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};