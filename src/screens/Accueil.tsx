import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, User } from 'lucide-react'
import { useGameStore } from '../store/game'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Backdrop } from '../components/ui/Backdrop'
import logoMark from '../assets/logo-mark.svg'

export default function Accueil() {
  const [pseudo, setPseudo]         = useState('')
  const [code, setCode]             = useState('')
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [loadingJoin, setLoadingJoin]     = useState(false)
  const [joinError, setJoinError]   = useState<string | null>(null)

  const createGame = useGameStore((s) => s.createGame)
  const joinGame   = useGameStore((s) => s.joinGame)
  const navigate   = useNavigate()

  const trimmedPseudo = pseudo.trim()
  const busy      = loadingCreate || loadingJoin
  const canCreate = trimmedPseudo.length >= 2 && !busy
  const canJoin   = code.length >= 3 && trimmedPseudo.length >= 2 && !busy

  const handleCreate = async () => {
    if (!canCreate) return
    setLoadingCreate(true)
    try {
      const gameCode = await createGame(trimmedPseudo)
      navigate(`/lobby/${gameCode}`)
    } catch {
      setLoadingCreate(false)
    }
  }

  const handleJoin = async () => {
    if (!canJoin) return
    const upperCode = code.toUpperCase()
    setJoinError(null)
    setLoadingJoin(true)
    try {
      await joinGame(upperCode, trimmedPseudo)
      navigate(`/lobby/${upperCode}`)
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : 'Erreur réseau')
      setLoadingJoin(false)
    }
  }

  return (
    <div
      style={{
        minHeight:  '100dvh',
        width:      '100%',
        overflowX:  'hidden',
        background: 'var(--grad-night)',
        position:   'relative',
        display:    'flex',
        justifyContent: 'center',
      }}
    >
      <Backdrop />

      <div
        style={{
          position:      'relative',
          width:         '100%',
          maxWidth:      'var(--screen-max)',
          display:       'flex',
          flexDirection: 'column',
          padding:       '54px var(--gutter) 24px',
          minHeight:     '100dvh',
        }}
      >
        {/* Logo + titre */}
        <div
          style={{
            flex:           1,
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
            alignItems:     'center',
            gap:            8,
          }}
        >
          <img
            src={logoMark}
            alt="TRINQUE"
            width={96}
            height={96}
            style={{
              marginBottom: 8,
              filter: 'drop-shadow(0 12px 28px rgba(255, 77, 157, 0.40))',
            }}
          />

          <h1
            style={{
              fontFamily:          'var(--font-display)',
              fontWeight:          700,
              fontSize:            'var(--text-6xl)',
              lineHeight:          0.95,
              textAlign:           'center',
              background:          'var(--grad-party)',
              WebkitBackgroundClip:'text',
              backgroundClip:      'text',
              color:               'transparent',
              margin:              0,
            }}
          >
            TRINQUE
          </h1>

          <p
            style={{
              margin:        '4px 0 0',
              color:         'var(--text-secondary)',
              fontFamily:    'var(--font-display)',
              fontWeight:    600,
              letterSpacing: '0.14em',
              fontSize:      13,
              textTransform: 'uppercase',
            }}
          >
            Pioche · Bois · Recommence
          </p>
        </div>

        {/* CTA section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
          <Input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="Ton prénom"
            maxLength={20}
            iconLeft={<User size={18} />}
            autoComplete="given-name"
          />

          <Button
            variant="party"
            size="lg"
            block
            disabled={!canCreate}
            iconLeft={<Plus size={22} />}
            onClick={handleCreate}
          >
            {loadingCreate ? 'Création…' : 'Créer une partie'}
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 10, minWidth: 0 }}>
              <Input
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setJoinError(null) }}
                variant="code"
                placeholder="CODE"
                maxLength={6}
                containerStyle={{ flex: 1, minWidth: 0 }}
              />
              <Button
                variant="secondary"
                size="md"
                disabled={!canJoin}
                onClick={handleJoin}
              >
                {loadingJoin ? 'Vérif…' : 'Rejoindre'}
              </Button>
            </div>

            {joinError && (
              <p
                style={{
                  margin:     0,
                  fontSize:   'var(--text-sm)',
                  fontFamily: 'var(--font-body)',
                  color:      'var(--rose-400, #fb7185)',
                  paddingLeft: 4,
                }}
              >
                {joinError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
