import { type Card } from '../data/deck'

interface RevealedCardProps {
  card: Card
  onNext: () => void
}

export default function RevealedCard(_props: RevealedCardProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(16, 6, 32, 0.92)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 'var(--gutter)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
        }}
      >
        Carte révélée
      </h2>
    </div>
  )
}
