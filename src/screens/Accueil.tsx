import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, User } from 'lucide-react'
import { useGameStore } from '../store/game'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import logoMark from '../assets/logo-mark.svg'

// Floating suit glyphs — low opacity, non-interactive backdrop
const BACKDROP_ITEMS = [
  { glyph: '♠', left: '8%',  top: '12%', size: 38, color: 'var(--violet-500)', opacity: 0.10 },
  { glyph: '♥', left: '78%', top: '16%', size: 30, color: 'var(--rose-500)',   opacity: 0.10 },
  { glyph: '♦', left: '16%', top: '70%', size: 26, color: 'var(--jaune-500)',  opacity: 0.10 },
  { glyph: '♣', left: '82%', top: '74%', size: 34, color: 'var(--orange-500)', opacity: 0.10 },
  { glyph: '♠', left: '50%', top: '40%', size: 22, color: 'var(--violet-300)', opacity: 0.06 },
]

export default function Accueil() {
  const [pseudo, setPseudo] = useState('')
  const [code, setCode] = useState('')

  const createGame = useGameStore((s) => s.createGame)
  const joinGame   = useGameStore((s) => s.joinGame)
  const navigate   = useNavigate()

  const trimmedPseudo = pseudo.trim()
  const canCreate = trimmedPseudo.length >= 2
  const canJoin   = code.length >= 3 && trimmedPseudo.length >= 2

  const handleCreate = () => {
    if (!canCreate) return
    createGame(trimmedPseudo)
    const { gameCode } = useGameStore.getState()
    navigate(`/lobby/${gameCode}`)
  }

  const handleJoin = () => {
    if (!canJoin) return
    const upperCode = code.toUpperCase()
    joinGame(upperCode, trimmedPseudo)
    navigate(`/lobby/${upperCode}`)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        background: 'var(--grad-night)',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop suit glyphs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {BACKDROP_ITEMS.map((it, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: it.left,
              top: it.top,
              fontSize: it.size,
              color: it.color,
              opacity: it.opacity,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            {it.glyph}
          </span>
        ))}
      </div>

      {/* Content column — max 440 px, full height */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 'var(--screen-max)',
          display: 'flex',
          flexDirection: 'column',
          padding: '54px var(--gutter) 24px',
          minHeight: '100dvh',
        }}
      >
        {/* Logo + title section (takes available vertical space) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <img
            src={logoMark}
            alt="TRINQUE"
            width={96}
            height={96}
            style={{
              marginBottom: 8,
              filter: 'drop-shadow(0 12px 28px rgba(255, 77, 157, 0.40))',
            }}
          />

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'var(--text-6xl)',
              lineHeight: 0.95,
              textAlign: 'center',
              background: 'var(--grad-party)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
            }}
          >
            TRINQUE
          </h1>

          <p
            style={{
              margin: '4px 0 0',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.14em',
              fontSize: 13,
              textTransform: 'uppercase',
            }}
          >
            Pioche · Bois · Recommence
          </p>
        </div>

        {/* CTA section — anchored at bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
          {/* Pseudo field — required for both actions */}
          <Input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Ton prénom"
            maxLength={20}
            iconLeft={<User size={18} />}
            autoComplete="given-name"
          />

          {/* Primary CTA */}
          <Button
            variant="party"
            size="lg"
            block
            disabled={!canCreate}
            iconLeft={<Plus size={22} />}
            onClick={handleCreate}
          >
            Créer une partie
          </Button>

          {/* Join row */}
          <div style={{ display: 'flex', gap: 10, minWidth: 0 }}>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              variant="code"
              placeholder="CODE"
              maxLength={6}
              containerStyle={{ flex: 1, minWidth: 0 }}
            />
            <Button
              variant="secondary"
              size="md"
              disabled={!canJoin}
              onClick={handleJoin}
            >
              Rejoindre
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
