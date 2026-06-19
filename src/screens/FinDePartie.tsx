import { useEffect } from 'react'
import { RotateCcw, LogOut } from 'lucide-react'
import { useGameStore } from '../store/game'
import { Backdrop } from '../components/ui/Backdrop'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Card as CardPanel } from '../components/ui/Card'
import { useSound } from '../audio/useSound'

// ── Confetti (suit glyphs tombants) ──────────────────────────────────────────

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

// Positions déterministes (pas de Math.random() → stable entre renders)
const PIECES = Array.from({ length: 24 }, (_, i) => ({
  suit:     SUITS[i % 4],
  color:    COLORS[i % 4],
  left:     `${3 + (i * 4.1) % 94}%`,
  size:     14 + (i % 3) * 7,
  delay:    `${(i * 0.085).toFixed(2)}s`,
  duration: `${(1.1 + (i % 5) * 0.17).toFixed(2)}s`,
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

// ── Stat helper ───────────────────────────────────────────────────────────────

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize:   'var(--text-3xl)',
          color:      'var(--text-primary)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'var(--text-xs)',
          color:      'var(--text-tertiary)',
          textAlign:  'center',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ── FinDePartie ───────────────────────────────────────────────────────────────

interface FinDePartieProps {
  onReplay: () => void  // startGame() → repart avec les mêmes joueurs
  onQuit:   () => void  // resetGame() → retour Accueil
}

export default function FinDePartie({ onReplay, onQuit }: FinDePartieProps) {
  const players    = useGameStore((s) => s.players)
  const drawnCount = useGameStore((s) => s.drawnCount)
  const drawCounts = useGameStore((s) => s.drawCounts)
  const { play }   = useSound()

  useEffect(() => { play('special') }, [])  // fanfare à l'arrivée

  // Classement décroissant par cartes piochées
  const ranked = [...players].sort(
    (a, b) => (drawCounts[b.id] ?? 0) - (drawCounts[a.id] ?? 0),
  )

  const maxCount = drawCounts[ranked[0]?.id] ?? 0
  const mvpList  = ranked.filter((p) => (drawCounts[p.id] ?? 0) === maxCount && maxCount > 0)

  const mvpMsg =
    mvpList.length === 0
      ? 'Tout le monde a joué pareil 🍻'
      : mvpList.length > 1
        ? `Égalité entre ${mvpList.map((p) => p.pseudo).join(' & ')} 🍻`
        : `${mvpList[0].pseudo} a pioché le plus — ${maxCount} carte${maxCount > 1 ? 's' : ''} !`

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
        overflowY:  'auto',
      }}
    >
      <Backdrop />
      <Confetti />

      <div
        style={{
          position:       'relative',
          width:          '100%',
          maxWidth:       'var(--screen-max)',
          display:        'flex',
          flexDirection:  'column',
          padding:        '54px var(--gutter) 24px',
          minHeight:      '100dvh',
          zIndex:         2,
        }}
      >
        {/* ── Titre ── */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 10 }}>🏆</div>
          <h1
            style={{
              margin:     0,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize:   'var(--text-4xl)',
              lineHeight: 1.0,
              background: 'var(--grad-party)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color:      'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            Partie<br />terminée !
          </h1>
        </div>

        {/* ── Stats globales ── */}
        <CardPanel style={{ marginBottom: 20 }} padding="var(--space-5)">
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: 8 }}>
            <Stat value={drawnCount} label="cartes piochées" />
            <div style={{ width: 1, background: 'var(--border-hairline)' }} />
            <Stat value={players.length} label={`joueur${players.length > 1 ? 's' : ''}`} />
          </div>
        </CardPanel>

        {/* ── Classement ── */}
        <p
          style={{
            margin:        '0 0 10px',
            fontFamily:    'var(--font-display)',
            fontWeight:    700,
            fontSize:      'var(--text-sm)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color:         'var(--text-tertiary)',
          }}
        >
          Classement
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {ranked.map((p, idx) => {
            const count   = drawCounts[p.id] ?? 0
            const isFirst = idx === 0
            return (
              <div
                key={p.id}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            12,
                  padding:        '10px 14px',
                  background:     isFirst ? 'rgba(155, 77, 255, 0.12)' : 'var(--night-700)',
                  borderRadius:   'var(--radius-lg)',
                  border:         `1px solid ${isFirst ? 'rgba(155, 77, 255, 0.30)' : 'var(--border-hairline)'}`,
                }}
              >
                {/* Rang */}
                <span
                  style={{
                    width:      20,
                    textAlign:  'center',
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize:   'var(--text-sm)',
                    color:      isFirst ? 'var(--violet-400)' : 'var(--text-tertiary)',
                  }}
                >
                  {isFirst ? '🏆' : `#${idx + 1}`}
                </span>

                <Avatar name={p.pseudo} size={36} />

                <span
                  style={{
                    flex:       1,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize:   'var(--text-base)',
                    color:      'var(--text-primary)',
                  }}
                >
                  {p.pseudo}
                  {p.isHost && (
                    <span style={{ marginLeft: 5, fontSize: 'var(--text-xs)' }}>👑</span>
                  )}
                </span>

                {/* Nb cartes */}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize:   'var(--text-sm)',
                    color:      isFirst ? 'var(--violet-400)' : 'var(--text-secondary)',
                  }}
                >
                  {count} 🃏
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Carte MVP ── */}
        <CardPanel glow style={{ marginBottom: 28, textAlign: 'center' }} padding="var(--space-5)">
          <p
            style={{
              margin:     0,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize:   'var(--text-base)',
              color:      'var(--text-primary)',
              lineHeight: 1.4,
            }}
          >
            {mvpMsg}
          </p>
        </CardPanel>

        {/* ── CTAs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
          <Button variant="party" size="lg" block iconLeft={<RotateCcw size={20} />} onClick={onReplay}>
            Rejouer
          </Button>
          <Button variant="ghost" size="lg" block iconLeft={<LogOut size={20} />} onClick={onQuit}>
            Quitter
          </Button>
        </div>
      </div>
    </div>
  )
}
