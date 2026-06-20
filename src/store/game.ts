import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ref, set as dbSet, get as dbGet, update } from 'firebase/database'
import { auth, db } from '../lib/firebase'

export interface Player {
  id:     string
  pseudo: string
  isHost: boolean
}

// UUID stable par onglet (sessionStorage), distinct du UID Firebase auth.
// Firebase auth donne le même UID à tous les onglets du même navigateur.
function getOrCreatePlayerId(): string {
  const key = 'trinque-pid'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

const MY_PLAYER_ID = getOrCreatePlayerId()

interface GameState {
  gameCode:   string | null
  myPlayerId: string

  createGame: (pseudo: string) => Promise<string>
  joinGame:   (code: string, pseudo: string) => Promise<void>
  resetGame:  () => void
}

function generateCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      gameCode:   null,
      myPlayerId: MY_PLAYER_ID,

      createGame: async (pseudo) => {
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
        await update(ref(db, `games/${code}`), {
          [`players/${pid}`]: { pseudo, isHost: false, joinedAt: Date.now() },
        })
        set({ gameCode: code })
      },

      resetGame: () => set({ gameCode: null }),
    }),
    {
      name: 'trinque-game',
      partialize: (state) => ({ gameCode: state.gameCode }),
    },
  ),
)
