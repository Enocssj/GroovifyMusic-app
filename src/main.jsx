import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ReproductorProvider } from "./app/ReproductorContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ReproductorProvider>
        <App />
      </ReproductorProvider>
    </AuthProvider>
  </StrictMode>,
<<<<<<< HEAD
);
=======
)
>>>>>>> 04d20475eea36708cd782a8d2e7216a1683cb823
