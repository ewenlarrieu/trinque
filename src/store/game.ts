import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Card, freshDeck } from '../data/deck'

export interface Player {
  id: string
  pseudo: string
  isHost: boolean
}

interface GameState {
  gameCode: string | null
  hostId: string | null
  players: Player[]
  currentTurnIndex: number
  deck: Card[]
  drawnCard: Card | null

  createGame: (pseudo: string) => void
  joinGame: (code: string, pseudo: string) => void
  startGame: () => void
  drawCard: () => void
  nextTurn: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gameCode: null,
      hostId: null,
      players: [],
      currentTurnIndex: 0,
      deck: [],
      drawnCard: null,

      createGame: (pseudo) => {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase()
        const hostId = crypto.randomUUID()
        const host: Player = { id: hostId, pseudo, isHost: true }
        set({ gameCode: code, hostId, players: [host], deck: [], drawnCard: null, currentTurnIndex: 0 })
      },

      joinGame: (code, pseudo) => {
        const newPlayer: Player = { id: crypto.randomUUID(), pseudo, isHost: false }
        set((state) => ({
          gameCode: code,
          players: [...state.players, newPlayer],
        }))
      },

      startGame: () => {
        set({ deck: freshDeck(), currentTurnIndex: 0, drawnCard: null })
      },

      drawCard: () => {
        const { deck } = get()
        if (deck.length === 0) return
        const [drawnCard, ...remaining] = deck
        set({ drawnCard, deck: remaining })
      },

      nextTurn: () => {
        set((state) => ({
          drawnCard: null,
          currentTurnIndex:
            (state.currentTurnIndex + 1) % Math.max(state.players.length, 1),
        }))
      },

      resetGame: () => {
        set({ gameCode: null, hostId: null, players: [], currentTurnIndex: 0, deck: [], drawnCard: null })
      },
    }),
    {
      name: 'trinque-game',
      partialize: (state) => ({
        gameCode: state.gameCode,
        hostId: state.hostId,
        players: state.players,
        currentTurnIndex: state.currentTurnIndex,
        deck: state.deck,
        drawnCard: state.drawnCard,
      }),
    }
  )
)
