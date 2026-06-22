import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ref, onValue, update } from 'firebase/database'
import { Dices } from 'lucide-react'
import { db } from '../lib/firebase'
import { useGameStore } from '../store/game'
import { ruleFor, type Card } from '../data/deck'
import { Backdrop } from '../components/ui/Backdrop'
import { Header } from '../components/ui/Header'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { MuteButton } from '../components/ui/MuteButton'
import { Avatar } from '../components/ui/Avatar'
import { PlayingCard } from '../components/ui/PlayingCard'
import { unlockAudio, playSound } from '../audio/soundService'
import RevealedCard from './RevealedCard'
import FinDePartie from './FinDePartie'

interface FbPlayer { pseudo: string; isHost: boolean; joinedAt: number }
interface FbGame {
  hostId:           string
  status:           'lobby' | 'playing' | 'ended'
  deck:             Card[] | Record<string, Card>
  deckPosition:     number
  currentTurnIndex: number
  drawnCardIndex:   number | null
  round:            number
  players:          Record<string, FbPlayer>
}

export default function Game() {
  const { code }   = useParams<{ code: string }>()
  const myPlayerId = useGameStore((s) => s.myPlayerId)
  const navigate   = useNavigate()

  const [game, setGame]       = useState<FbGame | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    return onValue(ref(db, `games/${code}`), (snap) => {
      setGame(snap.exists() ? (snap.val() as FbGame) : null)
      setLoading(false)
    })
  }, [code])

  // ── Dériver l'état depuis Firebase ────────────────────────────────────────
  const rawDeck = game?.deck
  const deck: Card[] = rawDeck
    ? (Array.isArray(rawDeck) ? rawDeck : Object.values(rawDeck) as Card[])
    : []

  const deckPosition     = game?.deckPosition     ?? 0
  const currentTurnIndex = game?.currentTurnIndex ?? 0
  const drawnCardIndex   = game?.drawnCardIndex   ?? null

  const players = Object.entries(game?.players ?? {})
    .sort(([, a], [, b]) => a.joinedAt - b.joinedAt)
    .map(([pid, data]) => ({ id: pid, pseudo: data.pseudo, isHost: data.isHost }))

  const isHost        = game?.hostId === myPlayerId
  const round         = game?.round ?? 1
  const currentPlayer = players[currentTurnIndex % Math.max(players.length, 1)]
  const isMyTurn      = currentPlayer?.id === myPlayerId
  const drawnCard     = drawnCardIndex !== null ? (deck[drawnCardIndex] ?? null) : null
  const pileEmpty     = deck.length > 0 && deckPosition >= deck.length && drawnCard === null

  // ── Actions Firebase ──────────────────────────────────────────────────────

  const handleBack = async () => {
    if (code && players.length > 0) {
      const myIndex = players.findIndex((p) => p.id === myPlayerId)
      const updates: Record<string, unknown> = {
        [`players/${myPlayerId}`]: null,
      }
      if (players.length > 1) {
        let newTurnIndex = currentTurnIndex
        if (currentTurnIndex === myIndex) {
          // C'est mon tour : passer au suivant dans la liste réduite
          newTurnIndex = myIndex % (players.length - 1)
        } else if (currentTurnIndex > myIndex) {
          // Mon slot était avant le joueur courant : décaler d'un cran
          newTurnIndex = currentTurnIndex - 1
        }
        updates['currentTurnIndex'] = newTurnIndex
        updates['drawnCardIndex'] = null
      }
      await update(ref(db, `games/${code}`), updates)
    }
    navigate('/')
  }

  const handleDraw = async () => {
    if (!isMyTurn || drawnCardIndex !== null || deckPosition >= deck.length) return
    await update(ref(db, `games/${code}`), {
      drawnCardIndex: deckPosition,
      deckPosition:   deckPosition + 1,
    })
  }

  const handleNextTurn = async () => {
    if (!isMyTurn) return
    const isLastCard = deckPosition >= deck.length
    if (isLastCard) {
      await update(ref(db, `games/${code}`), {
        drawnCardIndex: null,
        status:         'ended',
      })
    } else {
      await update(ref(db, `games/${code}`), {
        drawnCardIndex:   null,
        currentTurnIndex: (currentTurnIndex + 1) % Math.max(players.length, 1),
      })
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────
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

  // ── Game ──────────────────────────────────────────────────────────────────
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
        {/* Header */}
        <Header
          title={`Manche ${round}`}
          onBack={handleBack}
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge tone="violet">
                {players.length} joueur{players.length > 1 ? 's' : ''}
              </Badge>
              <MuteButton />
            </div>
          }
        />

        {/* Centre */}
        <div
          style={{
            position: 'relative', flex: 1, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28,
          }}
        >
          {pileEmpty ? (
            /* ── Pile vide ───────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
              <span style={{ fontSize: 64, lineHeight: 1 }}>🎉</span>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
                Plus de cartes !
              </p>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
                Vous avez survécu au deck. Bravo 🍻
              </p>
            </div>
          ) : (
            <>
              {/* ── Joueur courant ────────────────────────────────────────── */}
              {currentPlayer && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <Avatar name={currentPlayer.pseudo} size={64} ring />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-xs)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                      C'est au tour de
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 'var(--text-3xl)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', lineHeight: 1.05 }}>
                      {currentPlayer.pseudo}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Pile de cartes ────────────────────────────────────────── */}
              <button
                onClick={isMyTurn ? handleDraw : undefined}
                aria-label="Piocher une carte"
                style={{
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: isMyTurn && drawnCardIndex === null ? 'pointer' : 'default',
                  position: 'relative', width: 180, height: 252,
                  WebkitTapHighlightColor: 'transparent',
                  opacity: isMyTurn ? 1 : 0.65,
                }}
                onPointerDown={(e) => {
                  if (isMyTurn && drawnCardIndex === null) {
                    e.currentTarget.style.transform = 'scale(0.97)'
                    unlockAudio()
                    playSound('click')
                  }
                }}
                onPointerUp={(e)    => { e.currentTarget.style.transform = '' }}
                onPointerLeave={(e) => { e.currentTarget.style.transform = '' }}
              >
                <div style={{ position: 'absolute', inset: 0, transform: 'translate(10px, 10px) rotate(6deg)' }}>
                  <PlayingCard faceDown width={180} />
                </div>
                <div style={{ position: 'absolute', inset: 0, transform: 'translate(5px, 5px) rotate(-3deg)' }}>
                  <PlayingCard faceDown width={180} />
                </div>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <PlayingCard faceDown width={180} />
                </div>
              </button>
            </>
          )}
        </div>

        {/* CTA bas */}
        <div style={{ position: 'relative', paddingTop: 8 }}>
          {!pileEmpty && (
            isMyTurn ? (
              <Button
                variant="accent"
                size="lg"
                block
                iconLeft={<Dices size={22} />}
                disabled={drawnCardIndex !== null}
                onClick={handleDraw}
              >
                Piocher une carte
              </Button>
            ) : (
              <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)', padding: '16px 0' }}>
                En attente que {currentPlayer?.pseudo} pioche…
              </p>
            )
          )}
        </div>
      </div>

      {/* Overlay carte révélée — visible pour TOUS les joueurs */}
      {drawnCard && (
        <RevealedCard
          card={drawnCard}
          rule={ruleFor(drawnCard)}
          onNext={handleNextTurn}
          canNext={isMyTurn}
          round={round}
        />
      )}

      {/* Fin de partie — déclenché par status Firebase */}
      {game.status === 'ended' && (
        <FinDePartie isHost={isHost} gameCode={code ?? ''} myPlayerId={myPlayerId} />
      )}
    </div>
  )
}
