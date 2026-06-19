import { type HTMLAttributes } from 'react'

const PALETTE = [
  'var(--grad-violet-rose)',
  'var(--grad-rose-orange)',
  'var(--grad-sun)',
  'linear-gradient(135deg, var(--violet-500), var(--orange-500))',
]

interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name?: string
  size?: number
  ring?: boolean
}

export function Avatar({ name = '?', size = 44, ring = false, style, ...rest }: AvatarProps) {
  const initials = name.trim().slice(0, 2).toUpperCase()
  let h = 0
  for (let i = 0; i < name.length; i++) h = ((h * 31 + name.charCodeAt(i)) >>> 0)
  const bg = PALETTE[h % PALETTE.length]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: 'var(--radius-pill)',
        background: bg,
        color: '#fff',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-bold)',
        fontSize: size * 0.4,
        boxShadow: ring
          ? '0 0 0 3px var(--bg-page), 0 0 0 5px var(--jaune-500)'
          : 'var(--ring-inner)',
        ...style,
      }}
      {...rest}
    >
      {initials}
    </span>
  )
}
