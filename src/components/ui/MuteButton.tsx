import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../../audio/useSound'
import { IconButton } from './IconButton'

export function MuteButton() {
  const { muted, toggleMute } = useSound()
  return (
    <IconButton
      label={muted ? 'Activer le son' : 'Couper le son'}
      variant="soft"
      size="sm"
      onClick={toggleMute}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </IconButton>
  )
}
