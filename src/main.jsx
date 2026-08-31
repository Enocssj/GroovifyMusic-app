import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import './index.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import App from './App.jsx'
import { SesionProvider } from './auth/SesionTemporal.jsx'
import { ReproductorProvider } from './app/ReproductorContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <SesionProvider>
        <ReproductorProvider>
          <App />
        </ReproductorProvider>
      </SesionProvider>
    </PrimeReactProvider>
  </StrictMode>,
)