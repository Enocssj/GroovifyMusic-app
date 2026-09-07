import { createContext, useContext, useState, useRef, useEffect } from "react";
import axiosClient from "../services/axiosClient";

const ReproductorContext = createContext(null);

export function ReproductorProvider({ children }) {
  const [cancionActual, setCancionActual] = useState(null);
  const [cola, setCola] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [colaPanelAbierto, setColaPanelAbierto] = useState(false);
  const [tiempoActual, setTiempoActual] = useState(0);
  const [duracionAudio, setDuracionAudio] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => setTiempoActual(audio.currentTime);
    const handleLoadedMetadata = () => setDuracionAudio(audio.duration || 0);
    const handleEnded = () => siguienteCancion();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar la canción nueva cuando cambia cancionActual
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (cancionActual?.archivoAudio) {
      audio.src = cancionActual.archivoAudio;
      setTiempoActual(0);
      setDuracionAudio(0);
      audio.play().catch(() => {});

      if (cancionActual.id) {
        axiosClient
          .post("/reproducciones", { cancionId: cancionActual.id })
          .catch(() => {});
      }
    } else {
      audio.pause();
      audio.removeAttribute("src");
    }
  }, [cancionActual]);

  // Sincronizar play/pause manual (botón de pausa)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !cancionActual?.archivoAudio) return;

    if (reproduciendo) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [reproduciendo]);

  const reproducirCancion = (cancion, nuevaCola = []) => {
    setHistorial([]);
    setCola(nuevaCola);
    setCancionActual(cancion);
    setReproduciendo(true);
  };

  const alternarReproduccion = () => {
    if (!cancionActual) return;
    setReproduciendo((prev) => !prev);
  };

  const siguienteCancion = () => {
    setCola((prevCola) => {
      if (prevCola.length === 0) {
        setReproduciendo(false);
        return prevCola;
      }
      const [siguiente, ...resto] = prevCola;
      setHistorial((prevHist) =>
        cancionActual ? [...prevHist, cancionActual] : prevHist,
      );
      setCancionActual(siguiente);
      setReproduciendo(true);
      return resto;
    });
  };

  const anteriorCancion = () => {
    setHistorial((prevHist) => {
      if (prevHist.length === 0) return prevHist;
      const anterior = prevHist[prevHist.length - 1];
      setCola((prevCola) =>
        cancionActual ? [cancionActual, ...prevCola] : prevCola,
      );
      setCancionActual(anterior);
      setReproduciendo(true);
      return prevHist.slice(0, -1);
    });
  };

  const reproducirDesdeCola = (indice) => {
    setCola((prevCola) => {
      const seleccionada = prevCola[indice];
      if (!seleccionada) return prevCola;
      const anteriores = prevCola.slice(0, indice);
      const restantes = prevCola.slice(indice + 1);
      setHistorial((prevHist) => [
        ...prevHist,
        ...(cancionActual ? [cancionActual] : []),
        ...anteriores,
      ]);
      setCancionActual(seleccionada);
      setReproduciendo(true);
      return restantes;
    });
  };

  const buscarEnTiempo = (segundos) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = segundos;
    setTiempoActual(segundos);
  };

  const alternarColaPanel = () => {
    setColaPanelAbierto((prev) => !prev);
  };

  const value = {
    cancionActual,
    cola,
    reproduciendo,
    colaPanelAbierto,
    tiempoActual,
    duracionAudio,
    reproducirCancion,
    alternarReproduccion,
    siguienteCancion,
    anteriorCancion,
    reproducirDesdeCola,
    buscarEnTiempo,
    alternarColaPanel,
  };

  return (
    <ReproductorContext.Provider value={value}>
      {children}
    </ReproductorContext.Provider>
  );
}

export const useReproductor = () => {
  const context = useContext(ReproductorContext);
  if (!context) {
    throw new Error(
      "Error interno",
    );
  }
  return context;
};
