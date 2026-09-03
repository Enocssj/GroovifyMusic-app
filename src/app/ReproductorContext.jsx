import { createContext, useContext, useState } from "react";

const ReproductorContext = createContext(null);

export function ReproductorProvider({ children }) {
  const [cancionActual, setCancionActual] = useState(null);
  const [cola, setCola] = useState([]);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [colaPanelAbierto, setColaPanelAbierto] = useState(false);

  const reproducirCancion = (cancion, nuevaCola = []) => {
    setCancionActual(cancion);
    setCola(nuevaCola);
    setReproduciendo(true);
  };

  const alternarReproduccion = () => {
    setReproduciendo((prev) => !prev);
  };

  const alternarColaPanel = () => {
    setColaPanelAbierto((prev) => !prev);
  };

  const value = {
    cancionActual,
    cola,
    reproduciendo,
    colaPanelAbierto,
    reproducirCancion,
    alternarReproduccion,
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
    throw new Error("useReproductor debe usarse dentro de un ReproductorProvider");
  }
  return context;
};