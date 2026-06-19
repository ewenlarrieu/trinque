import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { type Card, type RankRule } from '../data/deck'
import { useSound } from '../audio/useSound'
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

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function RevealedCard({ card, rule, onNext }: RevealedCardProps) {
  // false = rotateY 90° (caché), true = rotateY 0° (visible)
  // Avec reduced-motion : démarre directement visible, pas d'animation
  const [flipped, setFlipped] = useState(reducedMotion)
  const { play } = useSound()

  // Son à jouer selon le rang : fanfare pour Roi / As, whoosh sinon
  const sfx = card.rank === 'K' || card.rank === 'A' ? 'special' : 'flip'

  // Bloquer le scroll de l'arrière-plan tant que l'overlay est monté
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Déclencher le flip (et le son) à chaque nouvelle carte
  useEffect(() => {
    if (reducedMotion) {
      play(sfx)
      return
    }
    setFlipped(false)
    const t = setTimeout(() => {
      setFlipped(true)
      play(sfx)
    }, 30)
    return () => clearTimeout(t)
  // play est stable (useCallback), sfx dépend de card.rank
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        // Voile sombre semi-transparent + blur par-dessus Game
        background: 'rgba(10, 5, 30, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        overflowX: 'hidden',
        overflowY: 'hidden',
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
        {/* Retour = confirme la carte = nextTurn */}
        <Header
          title={rule.titre}
          onBack={onNext}
          right={
            <Badge tone="rose" fill="solid">
              Manche 1
            </Badge>
          }
        />

        {/* Carte + règle centrées */}
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
          {/* Conteneur du flip 3D */}
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped
                ? 'rotateY(0deg) scale(1)'
                : 'rotateY(90deg) scale(0.9)',
              transition: reducedMotion
                ? 'none'
                : 'transform var(--dur-flip) var(--ease-bounce)',
            }}
          >
            <PlayingCard rank={card.rank} suit={card.suit} width={210} />
          </div>

          {/* Règle du rang */}
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

        {/* CTA bas */}
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
