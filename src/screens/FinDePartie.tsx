import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, LogOut } from 'lucide-react'
import { useGameStore } from '../store/game'
import { Backdrop } from '../components/ui/Backdrop'
import { Button } from '../components/ui/Button'
import { useSound } from '../audio/useSound'

// ── Confetti ──────────────────────────────────────────────────────────────────

if (typeof document !== 'undefined' && !document.getElementById('trinque-confetti')) {
  const s = document.createElement('style')
  s.id = 'trinque-confetti'
  s.textContent = `
    @keyframes confettiDrop {
      0%   { transform: translateY(-40px) rotate(0deg);   opacity: 0; }
      12%  { opacity: 1; }
      88%  { opacity: 0.85; }
      100% { transform: translateY(110vh) rotate(420deg); opacity: 0; }
    }
  `
  document.head.appendChild(s)
}

const SUITS  = ['♠', '♥', '♦', '♣']
const COLORS = [
  'var(--violet-500)', 'var(--rose-500)',
  'var(--jaune-500)',  'var(--orange-500)',
]

const PIECES = Array.from({ length: 26 }, (_, i) => ({
  suit:     SUITS[i % 4],
  color:    COLORS[i % 4],
  left:     `${2 + (i * 3.8) % 94}%`,
  size:     13 + (i % 3) * 7,
  delay:    `${(i * 0.08).toFixed(2)}s`,
  duration: `${(1.0 + (i % 5) * 0.18).toFixed(2)}s`,
}))

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Confetti() {
  if (reducedMotion) return null
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {PIECES.map((p, i) => (
        <span
          key={i}
          style={{
            position:   'absolute',
            left:       p.left,
            top:        '-40px',
            fontSize:   p.size,
            color:      p.color,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            animation:  `confettiDrop ${p.duration} ${p.delay} ease-in forwards`,
          }}
        >
          {p.suit}
        </span>
      ))}
    </div>
  )
}

// ── Phrases ───────────────────────────────────────────────────────────────────

const PHRASES = [
  'La soirée ne fait que commencer… 🎶',
  'Qui ramène les verres ?',
  'On remet ça ? 🎲',
  'Hydratez-vous (avec de l\'eau aussi) 💧',
  'Vous avez tous survécu. Respect. 🍻',
  'La légende de ce soir s\'écrit ici.',
  'Personne n\'a vraiment perdu ce soir. 🤷',
  'Le deck est vide, les verres aussi ?',
]

// ── Écran ─────────────────────────────────────────────────────────────────────

export default function FinDePartie() {
  const gameCode  = useGameStore((s) => s.gameCode)
  const resetGame = useGameStore((s) => s.resetGame)
  const navigate  = useNavigate()
  const { play }  = useSound()

  const [phrase] = useState(
    () => PHRASES[Math.floor(Math.random() * PHRASES.length)],
  )

  useEffect(() => { play('special') }, [])

  const handleReplay = () => {
    navigate(`/lobby/${gameCode}`)
  }

  const handleQuit = () => {
    resetGame()
    navigate('/')
  }

  return (
    <div
      style={{
        position:   'fixed',
        inset:      0,
        background: 'var(--grad-night)',
        display:    'flex',
        justifyContent: 'center',
        zIndex:     50,
        overflowX:  'hidden',
        overflowY:  'hidden',
      }}
    >
      <Backdrop />
      <Confetti />

      <div
        style={{
          position:      'relative',
          width:         '100%',
          maxWidth:      'var(--screen-max)',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          justifyContent:'center',
          padding:       '54px var(--gutter) 24px',
          minHeight:     '100dvh',
          zIndex:        2,
          textAlign:     'center',
          gap:           20,
        }}
      >
        {/* Trophée */}
        <div style={{ fontSize: 72, lineHeight: 1 }}>🏆</div>

        {/* Titre festif */}
        <h1
          style={{
            margin:        0,
            fontFamily:    'var(--font-display)',
            fontWeight:    700,
            fontSize:      'var(--text-5xl)',
            lineHeight:    0.95,
            background:    'var(--grad-party)',
            WebkitBackgroundClip: 'text',
            backgroundClip:'text',
            color:         'transparent',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
        >
          Partie<br />terminée !
        </h1>

        {/* Phrase aléatoire */}
        <p
          style={{
            margin:     0,
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize:   'var(--text-lg)',
            color:      'var(--text-secondary)',
            lineHeight: 1.4,
            maxWidth:   280,
          }}
        >
          {phrase}
        </p>

        {/* CTAs */}
        <div
          style={{
            position:      'absolute',
            bottom:        24,
            left:          'var(--gutter)',
            right:         'var(--gutter)',
            display:       'flex',
            flexDirection: 'column',
            gap:           10,
          }}
        >
          <Button
            variant="party"
            size="lg"
            block
            iconLeft={<RotateCcw size={20} />}
            onClick={handleReplay}
          >
            Rejouer
          </Button>
          <Button
            variant="ghost"
            size="lg"
            block
            iconLeft={<LogOut size={20} />}
            onClick={handleQuit}
          >
            Quitter
          </Button>
        </div>
      </div>
    </div>
  )
}
