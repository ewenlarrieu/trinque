import { type HTMLAttributes } from 'react'
import { type Suit } from '../../data/deck'

interface PlayingCardProps extends HTMLAttributes<HTMLDivElement> {
  rank?: string
  suit?: Suit
  faceDown?: boolean
  rule?: string | null
  width?: number
}

const SUITS: Record<Suit, { color: string }> = {
  '♠': { color: 'var(--suit-black)' },
  '♣': { color: 'var(--suit-black)' },
  '♥': { color: 'var(--suit-red)' },
  '♦': { color: 'var(--suit-red)' },
}

export function PlayingCard({
  rank = 'K',
  suit = '♠',
  faceDown = false,
  rule = null,
  width = 240,
  style,
  ...rest
}: PlayingCardProps) {
  const height = width * 1.4
  const s = SUITS[suit] ?? SUITS['♠']

  if (faceDown) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: 'var(--radius-lg)',
          background: 'repeating-linear-gradient(45deg, #2A1356 0 14px, #34186A 14px 28px)',
          boxShadow: 'var(--shadow-playcard)',
          border: '3px solid rgba(255,255,255,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            width: '64%',
            height: '78%',
            borderRadius: 'var(--radius-md)',
            border: '2px solid rgba(255,255,255,0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--grad-party)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.25)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: width * 0.34, color: '#fff' }}>
            ♠
          </span>
        </div>
      </div>
    )
  }

  const Corner = ({ flip }: { flip?: boolean }) => (
    <div
      style={{
        position: 'absolute',
        ...(flip
          ? { right: width * 0.05, bottom: width * 0.05, transform: 'rotate(180deg)' }
          : { left: width * 0.05, top: width * 0.05 }),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        lineHeight: 0.9,
        color: s.color,
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
      }}
    >
      <span style={{ fontSize: width * 0.13 }}>{rank}</span>
      <span style={{ fontSize: width * 0.11 }}>{suit}</span>
    </div>
  )

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--paper)',
        boxShadow: 'var(--shadow-playcard)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <Corner />
      <Corner flip />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: rule ? width * 0.04 : 0,
          padding: `0 ${width * 0.14}px`,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: width * 0.46,
            color: s.color,
            lineHeight: 1,
          }}
        >
          {suit}
        </span>
        {rule && (
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: width * 0.075,
              color: 'var(--suit-black)',
              lineHeight: 1.3,
            }}
          >
            {rule}
          </span>
        )}
      </div>
    </div>
  )
}
