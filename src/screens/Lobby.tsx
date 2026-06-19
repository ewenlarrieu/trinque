import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useGameStore, type Player } from '../store/game'
import { Backdrop } from '../components/ui/Backdrop'
import { Header } from '../components/ui/Header'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { GameCode } from '../components/ui/GameCode'
import { PlayerChip } from '../components/ui/PlayerChip'

// ─── Démo : simuler des joueurs sans backend ──────────────────────────────────
// Passe à false pour n'afficher que les vrais joueurs du store.
const MOCK_PLAYERS = true

const MOCK: Player[] = [
  { id: 'mock-1', pseudo: 'Marion', isHost: false },
  { id: 'mock-2', pseudo: 'Léo',    isHost: false },
  { id: 'mock-3', pseudo: 'Sacha',  isHost: false },
  { id: 'mock-4', pseudo: 'Inès',   isHost: false },
]

export default function Lobby() {
  const gameCode    = useGameStore((s) => s.gameCode)
  const players     = useGameStore((s) => s.players)
  const myPlayerId  = useGameStore((s) => s.myPlayerId)
  const startGame   = useGameStore((s) => s.startGame)
  const navigate    = useNavigate()

  const isHost = players.some((p) => p.id === myPlayerId && p.isHost)

  // Displayed list: real players first, then mocks (if flag on)
  const allPlayers: Player[] = MOCK_PLAYERS
    ? [...players, ...MOCK]
    : players

  const handleStart = () => {
    startGame()
    navigate(`/game/${gameCode}`)
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        background: 'var(--grad-night)',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Backdrop />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 'var(--screen-max)',
          display: 'flex',
          flexDirection: 'column',
          padding: '54px var(--gutter) 24px',
          minHeight: '100dvh',
        }}
      >
        {/* Header */}
        <Header
          title="Le salon"
          onBack={() => navigate('/')}
          right={<Badge tone="success">En ligne</Badge>}
        />

        {/* Main content — flex:1, scrollable list inside */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Game code card — tappable, copies to clipboard */}
          <GameCode code={gameCode ?? '------'} />

          {/* Section title + player count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'var(--text-xl)',
                color: 'var(--text-primary)',
              }}
            >
              Dans la place
            </span>
            <Badge tone="violet">
              {allPlayers.length} joueur{allPlayers.length > 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Scrollable player list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {allPlayers.map((p) => (
              <PlayerChip
                key={p.id}
                name={p.pseudo}
                isHost={p.isHost}
                isYou={p.id === myPlayerId}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ position: 'relative', paddingTop: 12 }}>
          {isHost ? (
            <>
              <Button
                variant="party"
                size="lg"
                block
                iconLeft={<Play size={20} />}
                onClick={handleStart}
              >
                Lancer la fête
              </Button>
              <p
                style={{
                  textAlign: 'center',
                  margin: '8px 0 0',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Visible uniquement par l'hôte 👑
              </p>
            </>
          ) : (
            <p
              style={{
                textAlign: 'center',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-body)',
                padding: '16px 0',
              }}
            >
              En attente que l'hôte lance la partie…
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
