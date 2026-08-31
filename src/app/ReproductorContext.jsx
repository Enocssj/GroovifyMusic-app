import { createContext, useContext, useState } from "react";

const ReproductorContext = createContext(null);

export function ReproductorProvider({ children }) {
  const [cancionActual, setCancionActual] = useState(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [cola, setCola] = useState([]);
  const [colaPanelAbierto, setColaPanelAbierto] = useState(false);

  const reproducirCancion = (cancion, colaSiguiente = []) => {
    setCancionActual(cancion);
    setCola(colaSiguiente);
    setReproduciendo(true);
  };

  const alternarReproduccion = () => setReproduciendo((actual) => !actual);
  const alternarColaPanel = () => setColaPanelAbierto((actual) => !actual);

  return (
    <ReproductorContext.Provider
      value={{
        cancionActual,
        reproduciendo,
        cola,
        colaPanelAbierto,
        reproducirCancion,
        alternarReproduccion,
        alternarColaPanel,
      }}
    >
      {children}
    </ReproductorContext.Provider>
  );
}

export function useReproductor() {
  const context = useContext(ReproductorContext);
  if (!context) {
    throw new Error("useReproductor debe usarse dentro de un ReproductorProvider");
  }
  return context;
}