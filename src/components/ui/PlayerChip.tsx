import { type HTMLAttributes } from 'react'
import { Avatar } from './Avatar'

interface PlayerChipProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  isHost?: boolean
  isYou?: boolean
}

export function PlayerChip({ name, isHost = false, isYou = false, style, ...rest }: PlayerChipProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: '10px 14px',
        background: 'var(--night-700)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-hairline)',
        boxShadow: 'var(--ring-inner)',
        ...style,
      }}
      {...rest}
    >
      <Avatar name={name} size={40} />
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 'var(--weight-semibold)',
          fontSize: 'var(--text-lg)',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {name}
        {isYou && (
          <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}> · toi</span>
        )}
      </span>
      {isHost && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            height: 26,
            padding: '0 10px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--jaune-500)',
            color: 'var(--text-on-vivid)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
          }}
        >
          👑 Hôte
        </span>
      )}
    </div>
  )
}
