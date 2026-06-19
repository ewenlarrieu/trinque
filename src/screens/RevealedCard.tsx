import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { type Card, type RankRule } from '../data/deck'
import { Backdrop } from '../components/ui/Backdrop'
import { Header } from '../components/ui/Header'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card as CardPanel } from '../components/ui/Card'
import { PlayingCard } from '../components/ui/PlayingCard'

interface RevealedCardProps {
  card: Card
  rule: RankRule
  onNext: () => void
}

export default function RevealedCard({ card, rule, onNext }: RevealedCardProps) {
  // Start hidden (rotateY 90°), flip to face after 30 ms — same pattern as skill kit
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(false)
    const t = setTimeout(() => setFlipped(true), 30)
    return () => clearTimeout(t)
  }, [card.id])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--grad-night)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        overflowX: 'hidden',
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
        {/* Header — back = "acknowledges card" = same as next turn */}
        <Header
          title={rule.titre}
          onBack={onNext}
          right={
            <Badge tone="rose" fill="solid">
              Manche 1
            </Badge>
          }
        />

        {/* Card + rule centered */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 22,
            perspective: 1200,
          }}
        >
          {/* Flip container */}
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped
                ? 'rotateY(0deg) scale(1)'
                : 'rotateY(90deg) scale(0.9)',
              transition: 'transform var(--dur-flip) var(--ease-bounce)',
            }}
          >
            <PlayingCard rank={card.rank} suit={card.suit} width={210} />
          </div>

          {/* Rule text */}
          <CardPanel
            glow
            style={{ width: '100%', maxWidth: 300 }}
            padding="var(--space-6)"
          >
            <p
              style={{
                margin: 0,
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: 'var(--text-lg)',
                lineHeight: 1.35,
                color: 'var(--text-primary)',
              }}
            >
              {rule.regle}
            </p>
          </CardPanel>
        </div>

        {/* CTA */}
        <div style={{ position: 'relative', paddingTop: 8 }}>
          <Button
            variant="party"
            size="lg"
            block
            iconRight={<ArrowRight size={22} />}
            onClick={onNext}
          >
            Carte suivante
          </Button>
        </div>
      </div>
    </div>
  )
}
