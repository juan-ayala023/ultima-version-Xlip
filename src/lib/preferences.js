import { useEffect, useState } from 'react'

const KEY = 'xlip_prefs'

export const defaultPrefs = {
  profile: {
    name: '',
    company: '',
  },
  toggles: {
    autoPublish: false,
    emailNotifications: true,
    processingNotifications: true,
    weeklyReport: true,
    autoSubtitles: true,
    faceTracking: true,
    watermark: false,
    highQuality: true,
  },
  defaults: {
    language_id: null,
    prompt_id: null,
    format: null,
  },
}

function deepMerge(base, override) {
  if (!override || typeof override !== 'object') return base
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const k of Object.keys(override)) {
    const v = override[k]
    if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object') {
      out[k] = deepMerge(base[k], v)
    } else {
      out[k] = v
    }
  }
  return out
}

export function loadPrefs() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultPrefs
    return deepMerge(defaultPrefs, JSON.parse(raw))
  } catch {
    return defaultPrefs
  }
}

export function savePrefs(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs))
  window.dispatchEvent(new CustomEvent('xlip:prefs', { detail: prefs }))
}

export function usePreferences() {
  const [prefs, setPrefs] = useState(loadPrefs)

  useEffect(() => {
    function onChange(e) {
      if (e.detail) setPrefs(e.detail)
      else setPrefs(loadPrefs())
    }
    function onStorage(e) {
      if (e.key === KEY) setPrefs(loadPrefs())
    }
    window.addEventListener('xlip:prefs', onChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('xlip:prefs', onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  function update(patch) {
    setPrefs((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : deepMerge(prev, patch)
      savePrefs(next)
      return next
    })
  }

  return [prefs, update]
}
