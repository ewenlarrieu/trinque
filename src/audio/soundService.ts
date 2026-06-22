// Utilise des éléments <audio> natifs plutôt que Web Audio API.
// Le décodeur média du navigateur accepte tous les formats courants (MP3,
// WAV, OGG, AAC…) sans nécessiter decodeAudioData.
//
// Déverrouillage autoplay iOS : au premier pointerdown, on lance un
// play()+pause() immédiat sur chaque élément pour "débloquer" la politique
// autoplay — les play() ultérieurs (même depuis un setTimeout) fonctionnent.

export type SfxName = 'click' | 'flip' | 'special' | 'start'

const MUTE_KEY = 'trinque-mute'

const SFX_URLS: Record<SfxName, string> = {
  click:   '/sfx/click.mp3',
  flip:    '/sfx/flip.mp3',
  special: '/sfx/special.mp3',
  start:   '/sfx/start.mp3',
}

const VOLUMES: Record<SfxName, number> = {
  click:   0.35,
  flip:    0.55,
  special: 0.70,
  start:   0.60,
}

// Créer les éléments dès le chargement du module → preload en arrière-plan
const _els: Record<SfxName, HTMLAudioElement> = {} as Record<SfxName, HTMLAudioElement>

;(Object.keys(SFX_URLS) as SfxName[]).forEach((name) => {
  const el = new Audio(SFX_URLS[name])
  el.preload = 'auto'
  el.volume = VOLUMES[name]
  _els[name] = el
})

// ── Déverrouillage iOS / Android ─────────────────────────────────────────────
// Un play()+pause() dans un geste utilisateur "débloque" l'élément pour
// les play() futurs (y compris hors geste, ex. setTimeout).
let _unlocked = false

function unlockAll(): void {
  if (_unlocked) return
  _unlocked = true
  for (const name of Object.keys(_els) as SfxName[]) {
    const el = _els[name]
    el.play()
      .then(() => { el.pause(); el.currentTime = 0 })
      .catch(() => {})
  }
}

if (typeof document !== 'undefined') {
  const handler = () => {
    unlockAll()
    document.removeEventListener('pointerdown', handler, true)
  }
  document.addEventListener('pointerdown', handler, true)
}

export function unlockAudio(): void {
  unlockAll()
}

export function playSound(name: SfxName): void {
  if (isMuted()) return
  const el = _els[name]
  // Revenir au début pour permettre les rappels rapides (ex. clicks répétés)
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
