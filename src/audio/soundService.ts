// Singleton Web Audio service — no React, importable anywhere.
// Audio files live in public/sfx/ and are loaded lazily after the first
// user gesture (required by iOS / Android autoplay policy).

export type SfxName = 'click' | 'flip' | 'special' | 'start'

const MUTE_KEY = 'trinque-mute'

// Served from public/sfx/ at the app root — no bundler processing needed
const SFX_URLS: Record<SfxName, string> = {
  click:   '/sfx/click.mp3',
  flip:    '/sfx/flip.mp3',
  special: '/sfx/special.mp3',
  start:   '/sfx/start.mp3',
}

// Per-sound gain (0–1) — kept modest so nothing blasts at full volume
const VOLUMES: Record<SfxName, number> = {
  click:   0.35,
  flip:    0.55,
  special: 0.70,
  start:   0.60,
}

let _ctx: AudioContext | null = null
const _buffers = new Map<SfxName, AudioBuffer>()
let _preloaded = false

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext()
  return _ctx
}

function preload(): void {
  if (_preloaded) return
  _preloaded = true
  for (const name of Object.keys(SFX_URLS) as SfxName[]) {
    void loadBuffer(name)
  }
}

async function loadBuffer(name: SfxName): Promise<void> {
  if (_buffers.has(name)) return
  try {
    const res = await fetch(SFX_URLS[name])
    if (!res.ok) return                          // file not provided yet — silent skip
    const ab = await res.arrayBuffer()
    const buf = await getCtx().decodeAudioData(ab)
    _buffers.set(name, buf)
  } catch {
    // decode error or network error — ignore
  }
}

// Unlock AudioContext on the first pointer interaction (iOS / Android gate)
if (typeof document !== 'undefined') {
  const handler = () => {
    if (!_ctx) {
      _ctx = new AudioContext()             // created inside gesture → starts 'running' on iOS
    } else if (_ctx.state === 'suspended') {
      void _ctx.resume()
    }
    preload()
    document.removeEventListener('pointerdown', handler, true)
  }
  document.addEventListener('pointerdown', handler, true)
}

/**
 * Call inside a user-gesture handler to ensure AudioContext is running.
 * Safe to call multiple times.
 */
export function unlockAudio(): void {
  if (!_ctx) {
    _ctx = new AudioContext()
    preload()
  } else if (_ctx.state === 'suspended') {
    void _ctx.resume()
  }
}

/** Play a sound if not muted and the buffer is loaded. */
export function playSound(name: SfxName): void {
  if (isMuted()) return
  const buf = _buffers.get(name)
  if (!buf) return
  const c = getCtx()
  if (c.state !== 'running') return
  const src = c.createBufferSource()
  src.buffer = buf
  const gain = c.createGain()
  gain.gain.value = VOLUMES[name]
  src.connect(gain)
  gain.connect(c.destination)
  src.start(0)
}

export function isMuted(): boolean {
  return localStorage.getItem(MUTE_KEY) === 'true'
}

/** Toggle mute, persist to localStorage, return the new value. */
export function toggleMuted(): boolean {
  const next = !isMuted()
  localStorage.setItem(MUTE_KEY, String(next))
  return next
}
