import { type ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { IconButton } from './IconButton'

interface HeaderProps {
  title: string
  onBack?: () => void
  right?: ReactNode
}

export function Header({ title, onBack, right }: HeaderProps) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
      }}
    >
      {onBack && (
        <IconButton label="Retour" variant="soft" size="sm" onClick={onBack}>
          <ChevronLeft size={20} />
        </IconButton>
      )}
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--text-xl)',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </span>
      {right}
    </div>
  )
}
