import { useState, type ButtonHTMLAttributes } from 'react'
import { Copy, Check } from 'lucide-react'

interface GameCodeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onCopy'> {
  code?: string
  onCopy?: (code: string) => void
}

export function GameCode({ code = 'ABC123', onCopy, style, ...rest }: GameCodeProps) {
  const [copied, setCopied] = useState(false)

  const handle = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    onCopy?.(code)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      onClick={handle}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-2)',
        width: '100%',
        padding: 'var(--space-5) var(--space-4)',
        background: 'var(--grad-violet-rose)',
        border: 'none',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--glow-rose)',
        cursor: 'pointer',
        transition: 'transform var(--dur-fast) var(--ease-bounce)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onPointerDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.98)' }}
      onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = '' }}
      {...rest}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 'var(--text-xs)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.80)',
        }}
      >
        Code de la partie
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 'var(--text-5xl)',
          letterSpacing: 'var(--tracking-code)',
          color: '#fff',
          lineHeight: 1,
        }}
      >
        {code}
      </span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
          color: '#fff',
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copié !' : 'Toucher pour copier'}
      </span>
    </button>
  )
}
