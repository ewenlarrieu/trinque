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

interface GameState {
  gameCode:         string | null
  myPlayerId:       string | null
  players:          Player[]
  currentTurnIndex: number
  deck:             Card[]
  drawnCard:        Card | null
  drawnCount:       number
  drawCounts:       Record<string, number>

  setMyPlayerId:  (uid: string) => void
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
      myPlayerId:       null,
      players:          [],
      currentTurnIndex: 0,
      deck:             [],
      drawnCard:        null,
      drawnCount:       0,
      drawCounts:       {},

      setMyPlayerId: (uid) => set({ myPlayerId: uid }),

      createGame: async (pseudo) => {
        const uid = auth.currentUser?.uid
        if (!uid) throw new Error('Non authentifié')

        const code = generateCode()
        await dbSet(ref(db, `games/${code}`), {
          hostId:    uid,
          status:    'lobby',
          createdAt: Date.now(),
          players: {
            [uid]: { pseudo, isHost: true, joinedAt: Date.now() },
          },
        })
        set({ gameCode: code })
        return code
      },

      joinGame: async (code, pseudo) => {
        const uid = auth.currentUser?.uid
        if (!uid) throw new Error('Non authentifié')

        const snap = await dbGet(ref(db, `games/${code}`))
        if (!snap.exists()) throw new Error("Cette partie n'existe pas")

        await update(ref(db, `games/${code}/players/${uid}`), {
          pseudo,
          isHost:   false,
          joinedAt: Date.now(),
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
          myPlayerId:       null,
          players:          [],
          currentTurnIndex: 0,
          deck:             [],
          drawnCard:        null,
          drawnCount:       0,
          drawCounts:       {},
        })
      },
    }),
    {
      name: 'trinque-game',
      partialize: (state) => ({
        gameCode:   state.gameCode,
        myPlayerId: state.myPlayerId,
      }),
    },
  ),
)
