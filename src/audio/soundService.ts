export type SfxName = 'click'

const MUTE_KEY = 'trinque-mute'

const el = typeof window !== 'undefined' ? new Audio('/sfx/click.mp3') : null
if (el) {
  el.preload = 'auto'
  el.volume  = 0.35
}

let _unlocked = false

function unlockAll(): void {
  if (_unlocked || !el) return
  _unlocked = true
  el.play().then(() => { el.pause(); el.currentTime = 0 }).catch(() => {})
}

if (typeof document !== 'undefined') {
  const handler = () => {
    unlockAll()
    document.removeEventListener('pointerdown', handler, true)
  }
  document.addEventListener('pointerdown', handler, true)
}

export function unlockAudio(): void { unlockAll() }

export function playSound(_name: SfxName): void {
  if (isMuted() || !el) return
  el.currentTime = 0
  el.play().catch(() => {})
}

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_KEY) === 'true'
}

export function toggleMuted(): boolean {
  const next = !isMuted()
  localStorage.setItem(MUTE_KEY, String(next))
  return next
}
