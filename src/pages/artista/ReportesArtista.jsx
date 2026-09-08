import { useState } from "react";
import axiosClient from "../../services/axiosClient";

export default function ReportesArtista() {
  const hoy = new Date().toISOString().split("T")[0];

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState(hoy);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState("");

  const manejarDescargar = async (e) => {
    e.preventDefault();
    setError("");

    if (!fechaInicio || !fechaFin) {
      setError("Selecciona ambas fechas");
      return;
    }

    if (fechaInicio > fechaFin) {
      setError("La fecha de inicio no puede ser posterior a la fecha fin");
      return;
    }

    setGenerando(true);
    try {
      const response = await axiosClient.get("/reportes/mis-reproducciones", {
        params: { FechaInicio: fechaInicio, FechaFin: fechaFin },
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");


      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error("Error al generar el reporte:", err);
      setError("No se pudo generar el reporte. Intenta de nuevo.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0d14] px-8 pt-10">
      <h1 className="text-3xl font-bold text-white mb-2">Reportes</h1>
      <p className="text-slate-400 text-sm mb-8">
        Descarga un reporte en PDF de tus reproducciones en un rango de fechas.
      </p>

      <form
        onSubmit={manejarDescargar}
        className="max-w-md bg-[#1a1722] border border-[#2a2635] rounded-xl p-6 flex flex-col gap-4"
      >
        {error && (
          <div className="p-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Desde</label>
          <input
            type="date"
            required
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            max={hoy}
            className="bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">Hasta</label>
          <input
            type="date"
            required
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            max={hoy}
            className="bg-[#221f2e] border border-[#3a3550] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={generando}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          <i className="pi pi-file-pdf" />
          {generando ? "Generando..." : "Descargar reporte"}
        </button>
      </form>
    </div>
  );
}