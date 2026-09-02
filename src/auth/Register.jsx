import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSesion } from "./SesionTemporal";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(true);
  const [tipoCuenta, setTipoCuenta] = useState("USUARIO");
  const { iniciarSesion, registrarUsuarioMock } = useSesion();
  const navigate = useNavigate();

const manejarEnvio = (evento) => {
  evento.preventDefault();
  const datosUsuario = { nombre: username, email, tipoCuenta };

  registrarUsuarioMock(datosUsuario); // guarda el tipo de cuenta real para este correo
  iniciarSesion(datosUsuario);

  if (tipoCuenta === "ARTISTA") {
    navigate(`/artista/${username}`);
  } else {
    navigate("/");
  }
};



  return (
    <div className="h-screen w-full flex bg-[#18151f] overflow-hidden">
      {/* Panel izquierdo */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#4c3d6b] to-[#1e1b2e] text-white text-center px-8 shrink-0">
        <svg className="w-24 h-24 lg:w-28 lg:h-28 mb-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
        <h1 className="text-4xl font-bold mb-2">Groovify</h1>
        <p className="text-purple-200">Únete y arma tu propia banda sonora.</p>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-6 py-10 h-full overflow-y-auto">
        <div className="w-full max-w-sm lg:max-w-md">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Crear cuenta
          </h2>

          <form onSubmit={manejarEnvio}>
            <label className="block text-sm text-slate-300 mb-2">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setTipoCuenta("USUARIO")}
                className={`flex flex-col items-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
                  tipoCuenta === "USUARIO"
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-[#3a3550] bg-[#221f2e] text-slate-400 hover:bg-[#2a273a]"
                }`}
              >
                <i className="pi pi-user text-xl" />
                <span className="text-sm font-medium">Usuario</span>
              </button>

              <button
                type="button"
                onClick={() => setTipoCuenta("ARTISTA")}
                className={`flex flex-col items-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
                  tipoCuenta === "ARTISTA"
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-[#3a3550] bg-[#221f2e] text-slate-400 hover:bg-[#2a273a]"
                }`}
              >
                <i className="pi pi-microphone text-xl" />
                <span className="text-sm font-medium">Artista</span>
              </button>
            </div>

            <label className="block text-sm text-slate-300 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_usuario"
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-3 mb-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="block text-sm text-slate-300 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="flex items-center gap-2 mb-6 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded"
              />
              Acepto los{" "}
              <a href="#" className="text-purple-400 font-semibold hover:text-purple-300">
                términos y condiciones
              </a>
            </label>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold py-3 rounded-full transition-colors"
            >
              Crear cuenta
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}