import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import { ref, onValue, update, remove } from 'firebase/database'
import { db } from '../lib/firebase'
import { useGameStore, type Player } from '../store/game'
import { freshDeck } from '../data/deck'
import { Backdrop } from '../components/ui/Backdrop'
import { Header } from '../components/ui/Header'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { MuteButton } from '../components/ui/MuteButton'
import { GameCode } from '../components/ui/GameCode'
import { PlayerChip } from '../components/ui/PlayerChip'
import { useSound } from '../audio/useSound'

interface FirebasePlayer {
  pseudo:   string
  isHost:   boolean
  joinedAt: number
}

interface FirebaseGame {
  hostId:    string
  status:    'lobby' | 'playing' | 'ended'
  createdAt: number
  players:   Record<string, FirebasePlayer>
}

export default function Lobby() {
  const { code }       = useParams<{ code: string }>()
  const myPlayerId     = useGameStore((s) => s.myPlayerId)
  const navigate       = useNavigate()
  const { play }       = useSound()

  const [game, setGame]       = useState<FirebaseGame | null>(null)
  const [loading, setLoading] = useState(true)
  const navigatedRef          = useRef(false)

  // Abonnement temps réel
  useEffect(() => {
    if (!code) return
    return onValue(ref(db, `games/${code}`), (snap) => {
      setGame(snap.exists() ? (snap.val() as FirebaseGame) : null)
      setLoading(false)
    })
  }, [code])

  // Navigation automatique quand la partie démarre
  useEffect(() => {
    if (!game || game.status !== 'playing' || navigatedRef.current) return
    navigatedRef.current = true
    navigate(`/game/${code}`, { replace: true })
  }, [game])

  const players: Player[] = Object.entries(game?.players ?? {})
    .sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
    .map(([pid, data]) => ({ id: pid, pseudo: data.pseudo, isHost: data.isHost }))

  const isHost = !!game && game.hostId === myPlayerId

  const handleBack = async () => {
    if (code) {
      if (isHost) {
        // L'hôte quitte → supprime toute la partie
        await remove(ref(db, `games/${code}`))
      } else {
        // Joueur normal → supprime seulement son entrée
        await remove(ref(db, `games/${code}/players/${myPlayerId}`))
      }
    }
    navigate('/')
  }

  const handleStart = async () => {
    if (!code) return
    play('start')
    await update(ref(db, `games/${code}`), {
      status:           'playing',
      deck:             freshDeck(),
      deckPosition:     0,
      currentTurnIndex: 0,
      drawnCardIndex:   null,
    })
  }

  // ── Chargement ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'var(--grad-night)', position: 'relative',
        }}
      >
        <Backdrop />
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
          Chargement…
        </p>
      </div>
    )
  }

  // ── Introuvable ───────────────────────────────────────────────────────────
  if (!game) {
    return (
      <div
        style={{
          minHeight: '100dvh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          background: 'var(--grad-night)', position: 'relative',
        }}
      >
        <Backdrop />
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
          Partie introuvable
        </p>
        <Button variant="ghost" size="md" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  // ── Lobby ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100dvh', width: '100%', overflowX: 'hidden',
        background: 'var(--grad-night)', position: 'relative',
        display: 'flex', justifyContent: 'center',
      }}
    >
      <Backdrop />

      <div
        style={{
          position: 'relative', width: '100%', maxWidth: 'var(--screen-max)',
          display: 'flex', flexDirection: 'column',
          padding: '54px var(--gutter) 24px', minHeight: '100dvh',
        }}
      >
        <Header
          title="Le salon"
          onBack={handleBack}
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge tone="success">En ligne</Badge>
              <MuteButton />
            </div>
          }
        />

        <div
          style={{
            position: 'relative', display: 'flex', flexDirection: 'column',
            gap: 16, flex: 1, overflow: 'hidden',
          }}
        >
          <GameCode code={code ?? '------'} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
              Dans la place
            </span>
            <Badge tone="violet">
              {players.length} joueur{players.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}>
            {players.map((p) => (
              <PlayerChip
                key={p.id}
                name={p.pseudo}
                isHost={p.isHost}
                isYou={p.id === myPlayerId}
              />
            ))}
          </div>
        </div>

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
              <p style={{ textAlign: 'center', margin: '8px 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
                Visible uniquement par l'hôte 👑
              </p>
            </>
          ) : (
            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', padding: '16px 0' }}>
              En attente que l'hôte lance la partie…
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
