import { type ButtonHTMLAttributes } from 'react'

type Variant = 'soft' | 'vivid' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: Variant
  size?: Size
}

const SIZES: Record<Size, number> = { sm: 40, md: 48, lg: 56 }

const VARIANTS: Record<Variant, { background: string; color: string; shadow: string }> = {
  soft:  { background: 'var(--night-700)',         color: 'var(--text-primary)',   shadow: 'var(--ring-inner)' },
  vivid: { background: 'var(--grad-violet-rose)',  color: '#fff',                  shadow: 'var(--glow-violet)' },
  ghost: { background: 'transparent',              color: 'var(--text-secondary)', shadow: 'none' },
}

export function IconButton({
  children,
  label,
  variant = 'soft',
  size = 'md',
  style,
  ...rest
}: IconButtonProps) {
  const dim = SIZES[size]
  const v = VARIANTS[variant]

  return (
    <button
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim,
        height: dim,
        flex: '0 0 auto',
        color: v.color,
        background: v.background,
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        boxShadow: v.shadow,
        cursor: 'pointer',
        transition: 'transform var(--dur-fast) var(--ease-bounce)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onPointerDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.90)' }}
      onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      {...rest}
    >
      {children}
    </button>
  )
}
