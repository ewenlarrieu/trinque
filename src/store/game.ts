import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Card, freshDeck } from '../data/deck'

export interface Player {
  id: string
  pseudo: string
  isHost: boolean
}

// Passe à false pour jouer sans joueurs fictifs
export const MOCK_PLAYERS = true

const MOCK: Player[] = [
  { id: 'mock-1', pseudo: 'Marion', isHost: false },
  { id: 'mock-2', pseudo: 'Léo',    isHost: false },
  { id: 'mock-3', pseudo: 'Sacha',  isHost: false },
  { id: 'mock-4', pseudo: 'Inès',   isHost: false },
]

interface GameState {
  gameCode: string | null
  hostId: string | null
  myPlayerId: string | null
  players: Player[]
  currentTurnIndex: number
  deck: Card[]
  drawnCard: Card | null
  drawnCount: number                  // total cartes piochées dans la partie
  drawCounts: Record<string, number>  // nb cartes par playerId

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
      myPlayerId: null,
      players: [],
      currentTurnIndex: 0,
      deck: [],
      drawnCard: null,
      drawnCount: 0,
      drawCounts: {},

      createGame: (pseudo) => {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase()
        const hostId = crypto.randomUUID()
        const host: Player = { id: hostId, pseudo, isHost: true }
        set({
          gameCode: code,
          hostId,
          myPlayerId: hostId,
          players: MOCK_PLAYERS ? [host, ...MOCK] : [host],
          deck: [],
          drawnCard: null,
          currentTurnIndex: 0,
        })
      },

      joinGame: (code, pseudo) => {
        const id = crypto.randomUUID()
        const newPlayer: Player = { id, pseudo, isHost: false }
        set((state) => ({
          gameCode: code,
          myPlayerId: id,
          players: [...state.players, newPlayer],
        }))
      },

      startGame: () => {
        set({ deck: freshDeck(), currentTurnIndex: 0, drawnCard: null, drawnCount: 0, drawCounts: {} })
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
          drawnCard: null,
          currentTurnIndex:
            (state.currentTurnIndex + 1) % Math.max(state.players.length, 1),
        }))
      },

      resetGame: () => {
        set({
          gameCode: null,
          hostId: null,
          myPlayerId: null,
          players: [],
          currentTurnIndex: 0,
          deck: [],
          drawnCard: null,
          drawnCount: 0,
          drawCounts: {},
        })
      },
    }),
    {
      name: 'trinque-game',
      partialize: (state) => ({
        gameCode: state.gameCode,
        hostId: state.hostId,
        myPlayerId: state.myPlayerId,
        players: state.players,
        currentTurnIndex: state.currentTurnIndex,
        deck: state.deck,
        drawnCard: state.drawnCard,
        drawnCount: state.drawnCount,
        drawCounts: state.drawCounts,
      }),
    }
  )
)
