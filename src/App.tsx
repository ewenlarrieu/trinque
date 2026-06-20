import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import { useGameStore } from './store/game'
import Accueil from './screens/Accueil'
import Lobby from './screens/Lobby'
import Game from './screens/Game'
import { Backdrop } from './components/ui/Backdrop'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady]     = useState(false)
  const setMyPlayerId         = useGameStore((s) => s.setMyPlayerId)

  useEffect(() => {
    signInAnonymously(auth).catch(console.error)
    return onAuthStateChanged(auth, (user) => {
      if (user) setMyPlayerId(user.uid)
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <div
        style={{
          minHeight:      '100dvh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'var(--grad-night)',
          position:       'relative',
        }}
      >
        <Backdrop />
        <p
          style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    600,
            fontSize:      'var(--text-lg)',
            color:         'var(--text-secondary)',
            letterSpacing: '0.08em',
          }}
        >
          Connexion…
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route path="/"             element={<Accueil />} />
          <Route path="/lobby/:code"  element={<Lobby />} />
          <Route path="/game/:code"   element={<Game />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  )
}
