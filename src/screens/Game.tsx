import { useNavigate } from 'react-router-dom'
import { Dices, RotateCcw } from 'lucide-react'
import { useGameStore } from '../store/game'
import { ruleFor } from '../data/deck'
import { Backdrop } from '../components/ui/Backdrop'
import { Header } from '../components/ui/Header'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { PlayingCard } from '../components/ui/PlayingCard'
import RevealedCard from './RevealedCard'

export default function Game() {
  const gameCode        = useGameStore((s) => s.gameCode)
  const players         = useGameStore((s) => s.players)
  const currentTurnIdx  = useGameStore((s) => s.currentTurnIndex)
  const deck            = useGameStore((s) => s.deck)
  const drawnCard       = useGameStore((s) => s.drawnCard)
  const drawCard        = useGameStore((s) => s.drawCard)
  const nextTurn        = useGameStore((s) => s.nextTurn)
  const resetGame       = useGameStore((s) => s.resetGame)
  const navigate        = useNavigate()

  const currentPlayer   = players[currentTurnIdx % Math.max(players.length, 1)]
  const deckEmpty       = deck.length === 0 && drawnCard === null

  const handleDraw = () => {
    if (deckEmpty) return
    drawCard()
  }

  const handleReplay = () => {
    resetGame()
    navigate('/')
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
      <Backdrop />

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
        {/* Header */}
        <Header
          title="Manche 1"
          onBack={() => navigate(`/lobby/${gameCode}`)}
          right={
            <Badge tone="violet">
              {players.length} joueur{players.length > 1 ? 's' : ''}
            </Badge>
          }
        />

        {/* Center content */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
          }}
        >
          {deckEmpty ? (
            /* ── Empty deck state ─────────────────────────────── */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  lineHeight: 1,
                }}
              >
                🎉
              </span>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'var(--text-2xl)',
                  color: 'var(--text-primary)',
                }}
              >
                Plus de cartes !
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-secondary)',
                }}
              >
                Vous avez survécu au deck. Bravo 🍻
              </p>
            </div>
          ) : (
            <>
              {/* ── Current player indicator ──────────────────── */}
              {currentPlayer && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Avatar name={currentPlayer.pseudo} size={64} ring />
                  <div style={{ textAlign: 'center' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 'var(--text-xs)',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                      }}
                    >
                      C'est au tour de
                    </p>
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: 'var(--text-3xl)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase',
                        lineHeight: 1.05,
                      }}
                    >
                      {currentPlayer.pseudo}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Draw pile ─────────────────────────────────── */}
              <button
                onClick={handleDraw}
                aria-label="Piocher une carte"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  width: 180,
                  height: 252,
                  padding: 0,
                  WebkitTapHighlightColor: 'transparent',
                }}
                onPointerDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
                onPointerUp={(e) => { e.currentTarget.style.transform = '' }}
                onPointerLeave={(e) => { e.currentTarget.style.transform = '' }}
              >
                {/* Bottom card — rotated right */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: 'translate(10px, 10px) rotate(6deg)',
                  }}
                >
                  <PlayingCard faceDown width={180} />
                </div>
                {/* Middle card — rotated left */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: 'translate(5px, 5px) rotate(-3deg)',
                  }}
                >
                  <PlayingCard faceDown width={180} />
                </div>
                {/* Top card — straight */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  <PlayingCard faceDown width={180} />
                </div>
              </button>
            </>
          )}
        </div>

        {/* Bottom CTA */}
        <div style={{ position: 'relative', paddingTop: 8 }}>
          {deckEmpty ? (
            <Button
              variant="ghost"
              size="lg"
              block
              iconLeft={<RotateCcw size={20} />}
              onClick={handleReplay}
            >
              Rejouer
            </Button>
          ) : (
            <Button
              variant="accent"
              size="lg"
              block
              iconLeft={<Dices size={22} />}
              onClick={handleDraw}
            >
              Piocher une carte
            </Button>
          )}
        </div>
      </div>

      {/* Revealed card overlay — mounted when a card has been drawn */}
      {drawnCard && (
        <RevealedCard
          card={drawnCard}
          rule={ruleFor(drawnCard)}
          onNext={nextTurn}
        />
      )}
    </div>
  )
}
