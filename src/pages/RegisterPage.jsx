import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; 
import { UserPlus } from "lucide-react"; 
import { registerUser } from "../services/authService"; // Importamos la función de registro

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Llamamos al backend para registrar
      // IMPORTANTE: Las claves (email, userName...) deben coincidir con tu DTO de Java
      await registerUser(data);
      
      toast.success("¡Cuenta creada con éxito! Ahora inicia sesión.");
      navigate("/login"); // Te mandamos al login para que entres
    } catch (error) {
      // Si el backend dice "Email ya existe", saldrá aquí
      toast.error(error.message || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-spotify-dark p-8 rounded-lg w-full max-w-md border border-white/10 shadow-2xl">
        
        {/* Cabecera */}
        <div className="flex justify-center mb-6 text-white">
            <UserPlus size={40} className="text-spotify-green" />
            <h1 className="text-3xl font-bold ml-2 tracking-tighter">Únete</h1>
        </div>
        <h2 className="text-white text-center text-xl mb-6">Crea tu cuenta gratis</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Nombre de Usuario */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Nombre de Usuario</label>
            <input 
              type="text" 
              placeholder="¿Cómo te llamamos?"
              {...register("userName", { required: "El nombre es obligatorio" })}
              className="w-full p-3 rounded bg-spotify-light text-white border border-transparent focus:border-spotify-green focus:outline-none transition"
            />
            {errors.userName && <span className="text-red-500 text-xs">{errors.userName.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Email</label>
            <input 
              type="email" 
              placeholder="tu@email.com"
              {...register("email", { 
                required: "El email es obligatorio",
                pattern: { value: /^\S+@\S+$/i, message: "Email inválido" }
              })}
              className="w-full p-3 rounded bg-spotify-light text-white border border-transparent focus:border-spotify-green focus:outline-none transition"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Contraseña</label>
            <input 
              type="password" 
              placeholder="Crea una contraseña segura"
              {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
              className="w-full p-3 rounded bg-spotify-light text-white border border-transparent focus:border-spotify-green focus:outline-none transition"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          {/* URL de Foto (Opcional) */}
          <div>
            <label className="text-sm font-bold text-white mb-1 block">Foto de Perfil (URL)</label>
            <input 
              type="text" 
              placeholder="https://imgur.com/..."
              {...register("imagenUrl")}
              className="w-full p-3 rounded bg-spotify-light text-white border border-transparent focus:border-spotify-green focus:outline-none transition"
            />
          </div>

          {/* Botón */}
          <button 
            type="submit" 
            className="w-full bg-spotify-green text-black font-bold py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-sm mt-4"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-8 text-center text-spotify-gray text-xs">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-white hover:underline font-bold">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};