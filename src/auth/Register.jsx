import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axiosClient from "../services/axiosClient";

export default function RegisterPage() {
  const [alias, setAlias] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("USUARIO");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setError("");
    setCargando(true);

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden");
      setCargando(false);
      return;
    }

    try {
      const formData = new FormData();
      const usuarioData = {
        alias,
        correo,
        password,
        rol: tipoCuenta,
        fechaNacimiento: fechaNacimiento || "2000-01-01",
      };

      const usuarioBlob = new Blob([JSON.stringify(usuarioData)], {
        type: "application/json",
      });
      formData.append("usuario", usuarioBlob);
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await axiosClient.post("/auth/register", formData);
      const data = response.data;

      if (data.token) {
        login(data.token);
        navigate("/");
      } else {
        const loginResponse = await axiosClient.post("/auth/login", {
          correo,
          password,
        });
        login(loginResponse.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.message || "Error al registrar usuario",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#18151f] overflow-hidden">
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#4c3d6b] to-[#1e1b2e] text-white text-center px-8 shrink-0">
        <svg
          className="w-16 h-16 lg:w-20 lg:h-20 mb-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
        <h1 className="text-3xl font-bold mb-2">Groovify</h1>
        <p className="text-purple-200 text-sm">Únete y arma tu propia banda sonora.</p>
      </div>

      <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-6 h-full">
        <div className="w-full max-w-sm lg:max-w-md">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Crear cuenta
          </h2>

          {error && (
            <div className="mb-3 p-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={manejarEnvio}>
            <label className="block text-xs text-slate-300 mb-1">
              Tipo de cuenta
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setTipoCuenta("USUARIO")}
                className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-colors ${
                  tipoCuenta === "USUARIO"
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-[#3a3550] bg-[#221f2e] text-slate-400 hover:bg-[#2a273a]"
                }`}
              >
                <i className="pi pi-user text-lg" />
                <span className="text-xs font-medium">Usuario</span>
              </button>
              <button
                type="button"
                onClick={() => setTipoCuenta("ARTISTA")}
                className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-colors ${
                  tipoCuenta === "ARTISTA"
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-[#3a3550] bg-[#221f2e] text-slate-400 hover:bg-[#2a273a]"
                }`}
              >
                <i className="pi pi-microphone text-lg" />
                <span className="text-xs font-medium">Artista</span>
              </button>
            </div>

            <label className="block text-xs text-slate-300 mb-1">Alias</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="tu_usuario"
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-3 py-2 mb-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="block text-xs text-slate-300 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="nombre@correo.com"
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-3 py-2 mb-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="block text-xs text-slate-300 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-3 py-2 mb-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="block text-xs text-slate-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-3 py-2 mb-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="block text-xs text-slate-300 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-3 py-2 mb-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="block text-xs text-slate-300 mb-1">
              Foto de perfil (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files?.[0] || null)}
              className="w-full bg-[#221f2e] border border-[#3a3550] rounded-lg px-3 py-2 mb-3 text-xs text-white file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-400"
            />

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-3">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}