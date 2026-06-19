import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'accent' | 'party' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const SIZES: Record<Size, { height: string; padding: string; font: string }> = {
  sm: { height: 'var(--control-sm)', padding: '0 18px', font: 'var(--text-sm)' },
  md: { height: 'var(--control-md)', padding: '0 24px', font: 'var(--text-lg)' },
  lg: { height: 'var(--control-lg)', padding: '0 30px', font: 'var(--text-xl)' },
}

const VARIANTS: Record<Variant, { background: string; color: string; glow: string }> = {
  primary:   { background: 'var(--violet-500)',  color: 'var(--text-on-violet)', glow: 'var(--glow-violet)' },
  secondary: { background: 'var(--rose-500)',    color: '#fff',                  glow: 'var(--glow-rose)' },
  accent:    { background: 'var(--jaune-500)',   color: 'var(--text-on-vivid)',  glow: 'var(--glow-jaune)' },
  party:     { background: 'var(--grad-party)',  color: '#fff',                  glow: 'var(--glow-rose)' },
  ghost:     { background: 'var(--night-700)',   color: 'var(--text-primary)',   glow: 'none' },
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  ...rest
}: ButtonProps) {
  const s = SIZES[size]
  const v = VARIANTS[variant]

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        width: block ? '100%' : 'auto',
        height: s.height,
        padding: s.padding,
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-bold)',
        fontSize: s.font,
        letterSpacing: 'var(--tracking-tight)',
        color: v.color,
        background: v.background,
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        boxShadow: disabled ? 'none' : v.glow,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'transform var(--dur-fast) var(--ease-bounce), box-shadow var(--dur-base) var(--ease-out)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onPointerDown={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)' }}
      onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
