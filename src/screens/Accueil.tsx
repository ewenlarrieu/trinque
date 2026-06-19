export default function Accueil() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh"
      style={{ background: 'var(--grad-night)', padding: 'var(--gutter)' }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-4xl)',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-tight)',
        }}
      >
        Accueil
      </h1>
    </div>
  )
}
