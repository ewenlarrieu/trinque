const ITEMS = [
  { glyph: '♠', left: '8%',  top: '12%', size: 38, color: 'var(--violet-500)', opacity: 0.10 },
  { glyph: '♥', left: '78%', top: '16%', size: 30, color: 'var(--rose-500)',   opacity: 0.10 },
  { glyph: '♦', left: '16%', top: '70%', size: 26, color: 'var(--jaune-500)',  opacity: 0.10 },
  { glyph: '♣', left: '82%', top: '74%', size: 34, color: 'var(--orange-500)', opacity: 0.10 },
  { glyph: '♠', left: '50%', top: '40%', size: 22, color: 'var(--violet-300)', opacity: 0.06 },
]

export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {ITEMS.map((it, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: it.left,
            top: it.top,
            fontSize: it.size,
            color: it.color,
            opacity: it.opacity,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            userSelect: 'none',
          }}
        >
          {it.glyph}
        </span>
      ))}
    </div>
  )
}
