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

let _ctx: AudioContext | null = null
const _buffers   = new Map<SfxName, AudioBuffer>()
const _rawBytes  = new Map<SfxName, ArrayBuffer>()

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext()
  return _ctx
}

// ── Phase 1 : fetch des bytes au chargement du module ────────────────────────
// Le fetch ne nécessite PAS de geste utilisateur — on commence tout de suite.
async function prefetch(name: SfxName): Promise<void> {
  try {
    const res = await fetch(SFX_URLS[name])
    if (!res.ok) {
      console.warn(`[TRINQUE sfx] ${name}: HTTP ${res.status} — fichier introuvable dans public/sfx/`)
      return
    }
    _rawBytes.set(name, await res.arrayBuffer())
    // Si le contexte est déjà prêt (geste précédent), décoder immédiatement
    if (_ctx && _ctx.state === 'running') void decode(name)
  } catch (err) {
    console.warn(`[TRINQUE sfx] ${name}: fetch échoué`, err)
  }
}

;(Object.keys(SFX_URLS) as SfxName[]).forEach((n) => void prefetch(n))

// ── Phase 2 : décodage (nécessite un AudioContext) ───────────────────────────
async function decode(name: SfxName): Promise<void> {
  if (_buffers.has(name)) return
  const raw = _rawBytes.get(name)
  if (!raw) return
  try {
    // .slice() évite le "detached ArrayBuffer" si decode est appelé plusieurs fois
    const buf = await getCtx().decodeAudioData(raw.slice(0))
    _buffers.set(name, buf)
  } catch (err) {
    console.warn(`[TRINQUE sfx] ${name}: decode échoué`, err)
  }
}

async function decodeAll(): Promise<void> {
  for (const name of Object.keys(SFX_URLS) as SfxName[]) {
    await decode(name)
  }
}

// ── Déverrouillage au premier geste utilisateur ───────────────────────────────
if (typeof document !== 'undefined') {
  const handler = () => {
    if (!_ctx) _ctx = new AudioContext()
    else if (_ctx.state === 'suspended') void _ctx.resume()
    void decodeAll()
    document.removeEventListener('pointerdown', handler, true)
  }
  document.addEventListener('pointerdown', handler, true)
}

export function unlockAudio(): void {
  if (!_ctx) {
    _ctx = new AudioContext()
    void decodeAll()
  } else if (_ctx.state === 'suspended') {
    void _ctx.resume()
  }
}

export function playSound(name: SfxName): void {
  if (isMuted()) return
  const buf = _buffers.get(name)
  if (!buf) return
  const c = getCtx()

  const doPlay = () => {
    try {
      const src = c.createBufferSource()
      src.buffer = buf
      const gain = c.createGain()
      gain.gain.value = VOLUMES[name]
      src.connect(gain)
      gain.connect(c.destination)
      src.start(0)
    } catch (err) {
      console.warn(`[TRINQUE sfx] ${name}: playback échoué`, err)
    }
  }

  if (c.state === 'running') {
    doPlay()
  } else {
    // Bug 2 fix : resume() est async, on joue APRÈS qu'il soit résolu
    c.resume().then(doPlay).catch(() => {})
  }
}

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_KEY) === 'true'
}

export function toggleMuted(): boolean {
  const next = !isMuted()
  localStorage.setItem(MUTE_KEY, String(next))
  return next
}
