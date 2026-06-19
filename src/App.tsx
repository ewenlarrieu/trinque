import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Accueil from './screens/Accueil'
import Lobby from './screens/Lobby'
import Game from './screens/Game'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/lobby/:code" element={<Lobby />} />
        <Route path="/game/:code" element={<Game />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
