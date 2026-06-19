import { useState, useCallback } from 'react'
import {
  playSound,
  isMuted,
  toggleMuted,
  unlockAudio,
  type SfxName,
} from './soundService'

export type { SfxName }

export function useSound() {
  const [muted, setMutedState] = useState(isMuted)

  const play = useCallback((name: SfxName) => {
    unlockAudio()
    playSound(name)
  }, [])

  const toggleMute = useCallback(() => {
    const next = toggleMuted()
    setMutedState(next)
  }, [])

  return { play, muted, toggleMute }
}
