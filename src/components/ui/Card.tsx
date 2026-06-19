import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string
  glow?: boolean
}

export function Card({ children, padding = 'var(--space-5)', glow = false, style, ...rest }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-hairline)',
        boxShadow: glow
          ? 'var(--shadow-card), var(--glow-violet)'
          : 'var(--shadow-card), var(--ring-inner)',
        padding,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
