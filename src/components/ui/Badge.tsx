import { type HTMLAttributes } from 'react'

type Tone = 'violet' | 'rose' | 'jaune' | 'orange' | 'success'
type Fill = 'soft' | 'solid'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  fill?: Fill
}

const TONES: Record<Tone, [string, string]> = {
  violet:  ['var(--violet-500)',        'rgba(155, 77, 255, 0.18)'],
  rose:    ['var(--rose-500)',          'rgba(255, 77, 157, 0.18)'],
  jaune:   ['var(--jaune-500)',         'rgba(255, 210, 63, 0.20)'],
  orange:  ['var(--orange-500)',        'rgba(255, 122, 26, 0.18)'],
  success: ['var(--color-success)',     'rgba(43, 217, 140, 0.18)'],
}

export function Badge({ children, tone = 'violet', fill = 'soft', style, ...rest }: BadgeProps) {
  const [base, tint] = TONES[tone]
  const solid = fill === 'solid'
  const onSolid = tone === 'jaune' ? 'var(--text-on-vivid)' : '#fff'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        height: 26,
        padding: '0 12px',
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-xs)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: solid ? onSolid : base,
        background: solid ? base : tint,
        borderRadius: 'var(--radius-pill)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}
