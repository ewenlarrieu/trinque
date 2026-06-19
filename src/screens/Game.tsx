import { useGameStore } from '../store/game'
import RevealedCard from './RevealedCard'

export default function Game() {
  const drawnCard = useGameStore((s) => s.drawnCard)
  const nextTurn = useGameStore((s) => s.nextTurn)

  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh"
      style={{ background: 'var(--grad-night)', padding: 'var(--gutter)' }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-4xl)',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-tight)',
        }}
      >
        Jeu
      </h1>

      {drawnCard && <RevealedCard card={drawnCard} onNext={nextTurn} />}
    </div>
  )
}
