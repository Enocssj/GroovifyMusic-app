import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSesion } from "./SesionTemporal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const { iniciarSesion } = useSesion();
  const navigate = useNavigate();

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    // Conexión real con el backend se agrega después.
    const nombreTemporal = email.split("@")[0];
    iniciarSesion({ nombre: nombreTemporal, email, tipoCuenta: "USUARIO" });
    navigate("/");
  };

  return (
    <div className="h-screen w-full flex bg-[#18151f] overflow-hidden">
      {/* Panel izquierdo */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#4c3d6b] to-[#1e1b2e] text-white text-center px-8 shrink-0">
        <svg className="w-24 h-24 lg:w-28 lg:h-28 mb-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
        <h1 className="text-4xl font-bold mb-2">Groovify</h1>
        <p className="text-purple-200">Tu música, tu ritmo, en cualquier lugar.</p>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-6 h-full overflow-y-auto">
        <div className="w-full max-w-sm lg:max-w-md">
          <h2 className="text-3xl font-bold text-white text-center mb-1">
            Bienvenido de nuevo
          </h2>
          <p className="text-slate-400 text-center mb-8">
            Inicia sesión para continuar
          </p>

          <form onSubmit={manejarEnvio}>
            <label className="block text-sm text-slate-300 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-3 mb-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="block text-sm text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative mb-2">
              <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <i className={`pi ${mostrarPassword ? "pi-eye-slash" : "pi-eye"}`} />
              </button>
            </div>

            <div className="text-center mb-6">
              <a href="#" className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold py-3 rounded-full transition-colors"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}