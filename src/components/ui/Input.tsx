import { useState, type InputHTMLAttributes } from 'react'

type Variant = 'default' | 'code'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: Variant
  iconLeft?: React.ReactNode
  containerStyle?: React.CSSProperties
}

export function Input({
  variant = 'default',
  iconLeft,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false)
  const isCode = variant === 'code'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        height: 'var(--control-md)',
        padding: '0 18px',
        background: 'var(--night-700)',
        borderRadius: 'var(--radius-lg)',
        border: `2px solid ${focused ? 'var(--violet-500)' : 'var(--border-hairline)'}`,
        boxShadow: focused ? 'var(--glow-violet)' : 'var(--ring-inner)',
        transition: 'border-color var(--dur-fast), box-shadow var(--dur-base)',
        ...containerStyle,
      }}
    >
      {iconLeft && (
        <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}>{iconLeft}</span>
      )}
      <input
        onFocus={(e) => { setFocused(true); onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); onBlur?.(e) }}
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-primary)',
          fontFamily: isCode ? 'var(--font-mono)' : 'var(--font-body)',
          fontWeight: isCode ? 700 : 500,
          fontSize: isCode ? 'var(--text-2xl)' : 'var(--text-lg)',
          letterSpacing: isCode ? 'var(--tracking-code)' : 'normal',
          textAlign: isCode ? 'center' : 'left',
          textTransform: isCode ? 'uppercase' : 'none',
          ...style,
        }}
        {...rest}
      />
    </div>
  )
}
