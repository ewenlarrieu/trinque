import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ref, set as dbSet, get as dbGet, update } from 'firebase/database'
import { auth, db } from '../lib/firebase'
import { type Card, freshDeck } from '../data/deck'

export interface Player {
  id: string
  pseudo: string
  isHost: boolean
}

// UUID stable par navigateur, indépendant du UID Firebase.
// Firebase auth donne le même UID à tous les onglets du même navigateur,
// ce qui ferait écraser les joueurs entre eux. On utilise un UUID propre.
function getOrCreatePlayerId(): string {
  const key = 'trinque-pid'
  // sessionStorage : isolé par onglet → deux onglets = deux joueurs distincts
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

const MY_PLAYER_ID = getOrCreatePlayerId()

interface GameState {
  gameCode:         string | null
  myPlayerId:       string
  players:          Player[]
  currentTurnIndex: number
  deck:             Card[]
  drawnCard:        Card | null
  drawnCount:       number
  drawCounts:       Record<string, number>

  createGame:     (pseudo: string) => Promise<string>
  joinGame:       (code: string, pseudo: string) => Promise<void>
  startLocalGame: (players: Player[]) => void
  drawCard:       () => void
  nextTurn:       () => void
  resetGame:      () => void
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gameCode:         null,
      myPlayerId:       MY_PLAYER_ID,
      players:          [],
      currentTurnIndex: 0,
      deck:             [],
      drawnCard:        null,
      drawnCount:       0,
      drawCounts:       {},

      createGame: async (pseudo) => {
        // Vérifie que Firebase auth est prête (connexion réseau ok)
        if (!auth.currentUser) throw new Error('Non authentifié')

        const pid  = MY_PLAYER_ID
        const code = generateCode()

        await dbSet(ref(db, `games/${code}`), {
          hostId:    pid,
          status:    'lobby',
          createdAt: Date.now(),
          players: {
            [pid]: { pseudo, isHost: true, joinedAt: Date.now() },
          },
        })
        set({ gameCode: code })
        return code
      },

      joinGame: async (code, pseudo) => {
        if (!auth.currentUser) throw new Error('Non authentifié')

        const snap = await dbGet(ref(db, `games/${code}`))
        if (!snap.exists()) throw new Error("Cette partie n'existe pas")

        const pid = MY_PLAYER_ID

        // update() au niveau du jeu avec un chemin-clé slash :
        // ajoute players/${pid} de façon atomique sans toucher aux autres joueurs
        await update(ref(db, `games/${code}`), {
          [`players/${pid}`]: {
            pseudo,
            isHost:   false,
            joinedAt: Date.now(),
          },
        })
        set({ gameCode: code })
      },

      startLocalGame: (players) => {
        set({
          players,
          deck:             freshDeck(),
          currentTurnIndex: 0,
          drawnCard:        null,
          drawnCount:       0,
          drawCounts:       {},
        })
      },

      drawCard: () => {
        const { deck, players, currentTurnIndex } = get()
        if (deck.length === 0) return
        const [drawnCard, ...remaining] = deck
        const pid = players[currentTurnIndex]?.id
        set((state) => ({
          drawnCard,
          deck: remaining,
          drawnCount: state.drawnCount + 1,
          drawCounts: pid
            ? { ...state.drawCounts, [pid]: (state.drawCounts[pid] ?? 0) + 1 }
            : state.drawCounts,
        }))
      },

      nextTurn: () => {
        set((state) => ({
          drawnCard:        null,
          currentTurnIndex: (state.currentTurnIndex + 1) % Math.max(state.players.length, 1),
        }))
      },

      resetGame: () => {
        set({
          gameCode:         null,
          players:          [],
          currentTurnIndex: 0,
          deck:             [],
          drawnCard:        null,
          drawnCount:       0,
          drawCounts:       {},
          // myPlayerId intentionnellement conservé — identité stable par navigateur
        })
      },
    }),
    {
      name: 'trinque-game',
      partialize: (state) => ({
        gameCode: state.gameCode,
        // myPlayerId vient de localStorage via getOrCreatePlayerId(), pas du store
      }),
    },
  ),
)
