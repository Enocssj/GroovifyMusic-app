import { useState } from 'react'
import ArtistPerfil from './components/artist/ArtistPerfil'
import AlbumDetalle from './components/artist/AlbumDetalle'
import './App.css'

function App() {
  const [vistaActual, setVistaActual] = useState('perfil') // 'perfil' | 'album'
  const [albumSeleccionado, setAlbumSeleccionado] = useState(null)

  function abrirAlbum(nombreAlbum) {
    setAlbumSeleccionado(nombreAlbum)
    setVistaActual('album')
  }

  function volverAlPerfil() {
    setVistaActual('perfil')
    setAlbumSeleccionado(null)
  }

  if (vistaActual === 'album') {
    return (
      <AlbumDetalle nombreAlbum={albumSeleccionado} onVolver={volverAlPerfil} />
    )
  }

  return <ArtistPerfil onAlbumClick={abrirAlbum} />
}

export default App