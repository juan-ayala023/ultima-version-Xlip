const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '')
const TOKEN_KEY = 'xlip_token'

const LOG_PREFIX = '[api]'
const isDev = import.meta.env.DEV

console.log(
  `${LOG_PREFIX} init`,
  {
    BASE_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  }
)

let _token = localStorage.getItem(TOKEN_KEY) || null
const _listeners = new Set()

function maskToken(t) {
  if (!t) return null
  if (t.length <= 12) return '***'
  return `${t.slice(0, 6)}…${t.slice(-4)}`
}

function setToken(token) {
  const prev = _token
  _token = token || null
  if (_token) localStorage.setItem(TOKEN_KEY, _token)
  else localStorage.removeItem(TOKEN_KEY)
  console.log(`${LOG_PREFIX} token change`, {
    had: Boolean(prev),
    now: Boolean(_token),
    token: maskToken(_token),
  })
  _listeners.forEach((fn) => { try { fn(_token) } catch (e) { console.warn(`${LOG_PREFIX} listener error`, e) } })
}

export function getStoredToken() {
  return _token
}

export function isAuthenticated() {
  return Boolean(_token)
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const decoded = decodeURIComponent(
      json.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(decoded)
  } catch (e) {
    console.warn(`${LOG_PREFIX} decodeJwt failed`, e)
    return null
  }
}

export function getCurrentUser() {
  if (!_token) return null
  const p = decodeJwt(_token)
  if (!p) return null
  return {
    email: p.email ?? p.sub ?? p.username ?? null,
    plan_id: p.plan_id ?? p.plan ?? null,
    user_id: p.user_id ?? p.uid ?? p.id ?? null,
    exp: p.exp ?? null,
    iat: p.iat ?? null,
    raw: p,
  }
}

export function onAuthChange(fn) {
  _listeners.add(fn)
  return () => _listeners.delete(fn)
}

function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

async function logResponse(tag, url, res, startedAt) {
  const ms = Math.round(performance.now() - startedAt)
  const level = res.ok ? 'log' : 'error'
  console[level](`${LOG_PREFIX} ← ${tag}`, {
    url,
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    elapsed_ms: ms,
  })
}

export async function login({ username, password }) {
  const url = buildUrl('/user/token')
  const body = new URLSearchParams()
  body.append('username', username)
  body.append('password', password)

  console.log(`${LOG_PREFIX} → login`, { url, username })
  const startedAt = performance.now()

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
  } catch (e) {
    console.error(`${LOG_PREFIX} ✖ login network error`, { url, error: e })
    throw e
  }
  await logResponse('login', url, res, startedAt)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error(`${LOG_PREFIX} ✖ login failed`, { url, status: res.status, err })
    throw new Error(err.detail?.[0]?.msg ?? err.detail ?? 'Credenciales inválidas')
  }
  const text = await res.text()
  let token
  try {
    const parsed = JSON.parse(text)
    token = typeof parsed === 'string' ? parsed : parsed.access_token ?? parsed.token
  } catch {
    token = text.trim()
  }
  if (!token) {
    console.error(`${LOG_PREFIX} ✖ login returned empty token`, { url, raw: text })
    throw new Error('Token vacío en la respuesta')
  }
  setToken(token)
  console.log(`${LOG_PREFIX} ✓ login ok`, { user: getCurrentUser() })
  return token
}

export function logout() {
  console.log(`${LOG_PREFIX} logout`)
  setToken(null)
}

async function request(path, options = {}) {
  if (!_token) {
    console.warn(`${LOG_PREFIX} ✖ request sin token`, { path })
    const err = new Error('No autenticado')
    err.status = 401
    throw err
  }
  const url = buildUrl(path)
  const method = (options.method ?? 'GET').toUpperCase()
  const tag = `${method} ${path}`

  if (isDev) {
    console.log(`${LOG_PREFIX} → ${tag}`, {
      url,
      token: maskToken(_token),
      headers: options.headers,
      body: options.body,
    })
  } else {
    console.log(`${LOG_PREFIX} → ${tag}`, { url })
  }

  const startedAt = performance.now()
  let res
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${_token}`,
        ...options.headers,
      },
    })
  } catch (e) {
    console.error(`${LOG_PREFIX} ✖ network error ${tag}`, { url, error: e })
    throw e
  }

  await logResponse(tag, url, res, startedAt)

  if (res.status === 401) {
    console.warn(`${LOG_PREFIX} 401 — limpiando token`, { url })
    setToken(null)
  }

  return res
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function createUser({ email, password, plan_id }) {
  const url = buildUrl('/user/')
  console.log(`${LOG_PREFIX} → createUser`, { url, email, plan_id })
  const startedAt = performance.now()

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, plan_id }),
    })
  } catch (e) {
    console.error(`${LOG_PREFIX} ✖ createUser network error`, { url, error: e })
    throw e
  }
  await logResponse('createUser', url, res, startedAt)

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error(`${LOG_PREFIX} ✖ createUser failed`, { url, status: res.status, err })
    throw new Error(err.detail?.[0]?.msg ?? err.detail ?? 'Error al crear el usuario')
  }
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text.replace(/^"|"$/g, '') }
}

// ── Support data ─────────────────────────────────────────────────────────────
export async function getSupportData() {
  const res = await request('/support/')
  if (!res.ok) throw new Error('No se pudo obtener datos de soporte')
  const data = await res.json()
  console.log(`${LOG_PREFIX} ✓ getSupportData`, {
    languages: data?.Languages?.length,
    prompts: data?.Prompts?.length,
    formats: data?.VideoFormats?.length,
    edit_formats: data?.EditFormats?.length,
  })
  return data
}

// ── Process URL ───────────────────────────────────────────────────────────────
export async function processUrl({ url, prompt_id, language_id, format, edit_format }) {
  const res = await request('/url/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, prompt_id, language_id, format, edit_format }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.error(`${LOG_PREFIX} ✖ processUrl failed`, { status: res.status, err })
    throw new Error(err.detail || 'Error al procesar la URL')
  }
  const data = await res.json()
  console.log(`${LOG_PREFIX} ✓ processUrl`, data)
  return data
}

// ── Upload file flow ──────────────────────────────────────────────────────────
export async function getPresignedUrl(filename) {
  const res = await request(`/videos/presigned_url?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('No se pudo obtener URL de subida')
  const data = await res.json()
  console.log(`${LOG_PREFIX} ✓ getPresignedUrl`, {
    filename,
    video_id: data?.video_id,
    file_name: data?.file_name,
    upload_url_host: (() => { try { return new URL(data?.upload_url).host } catch { return null } })(),
  })
  return data
}

export async function uploadToPresignedUrl(uploadUrl, file, onProgress) {
  const host = (() => { try { return new URL(uploadUrl).host } catch { return null } })()
  console.log(`${LOG_PREFIX} → uploadToPresignedUrl`, {
    host,
    name: file?.name,
    size: file?.size,
    type: file?.type,
  })
  const startedAt = performance.now()

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type || 'video/mp4')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = Math.round((e.loaded / e.total) * 100)
        onProgress(pct)
      }
    }
    xhr.onload = () => {
      const ms = Math.round(performance.now() - startedAt)
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log(`${LOG_PREFIX} ✓ upload ok`, { host, status: xhr.status, elapsed_ms: ms })
        resolve()
      } else {
        console.error(`${LOG_PREFIX} ✖ upload failed`, { host, status: xhr.status, elapsed_ms: ms })
        reject(new Error(`Error al subir el archivo: ${xhr.status}`))
      }
    }
    xhr.onerror = () => {
      console.error(`${LOG_PREFIX} ✖ upload network error`, { host })
      reject(new Error('Error de red al subir el archivo'))
    }
    xhr.send(file)
  })
}

export async function initProcess(video_id, { file_name, prompt_id, language_id, edit_format }) {
  const res = await request(`/videos/ready/${video_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_name, prompt_id, language_id, edit_format }),
  })
  if (!res.ok) throw new Error('Error al iniciar el procesamiento')
  const data = await res.json()
  console.log(`${LOG_PREFIX} ✓ initProcess`, data)
  return data
}

// ── Polling ───────────────────────────────────────────────────────────────────
export async function getVideoStatus(video_id) {
  const res = await request(`/status/${video_id}`)
  if (!res.ok) throw new Error('Error al obtener estado del video')
  const data = await res.json()
  console.log(`${LOG_PREFIX} ✓ getVideoStatus`, data)
  return data
}

export async function getVideoDone(video_id) {
  const res = await request(`/status/done/${video_id}`)
  if (!res.ok) throw new Error('Error al obtener los clips')
  const data = await res.json()
  console.log(`${LOG_PREFIX} ✓ getVideoDone`, {
    video_id: data?.video_id,
    clips: data?.clips_url?.length,
  })
  return data
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Normaliza la respuesta de /status/done/{id} al formato de UI esperado por ClipCard
export function normalizeClips(apiResponse, videoId) {
  if (!apiResponse) return []

  // El backend devuelve { video_id, clips_url: ["https://...mp4", ...] }
  if (apiResponse.clips_url && Array.isArray(apiResponse.clips_url)) {
    return apiResponse.clips_url.map((url, i) => ({
      id: `${videoId ?? apiResponse.video_id}_${i}`,
      title: `Clip #${i + 1}`,
      duration: 0,
      engagementScore: 0,
      status: 'completed',
      progress: 100,
      thumbnail: null,
      platforms: ['tiktok', 'reels', 'shorts'],
      views: 0,
      tags: [],
      startTime: null,
      endTime: null,
      detectedAt: null,
      processingTime: null,
      downloadUrl: url,
    }))
  }

  // Fallback: array directo de objetos
  const items = Array.isArray(apiResponse)
    ? apiResponse
    : apiResponse.clips ?? apiResponse.results ?? apiResponse.data ?? []

  return items.map((item, i) => ({
    id: item.id ?? item.clip_id ?? `clip_${i}`,
    title: item.title ?? item.name ?? `Clip #${i + 1}`,
    duration: item.duration ?? item.duration_seconds ?? 0,
    engagementScore: item.engagement_score ?? item.score ?? item.viral_score ?? 0,
    status: 'completed',
    progress: 100,
    thumbnail: item.thumbnail ?? item.thumbnail_url ?? null,
    platforms: item.platforms ?? ['tiktok', 'reels', 'shorts'],
    views: item.views ?? 0,
    tags: item.tags ?? item.keywords ?? [],
    startTime: item.start_time ?? item.startTime ?? null,
    endTime: item.end_time ?? item.endTime ?? null,
    detectedAt: item.detected_at ?? item.reason ?? item.detection_reason ?? null,
    processingTime: item.processing_time ?? null,
    downloadUrl: item.download_url ?? item.url ?? item.clip_url ?? null,
  }))
}
