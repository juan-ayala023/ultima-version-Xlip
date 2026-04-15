const BASE_URL = '/api'
const TOKEN_KEY = 'xlip_token'

let _token = localStorage.getItem(TOKEN_KEY) || null
const _listeners = new Set()

function setToken(token) {
  _token = token || null
  if (_token) localStorage.setItem(TOKEN_KEY, _token)
  else localStorage.removeItem(TOKEN_KEY)
  _listeners.forEach((fn) => { try { fn(_token) } catch {} })
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
  } catch {
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

export async function login({ username, password }) {
  const body = new URLSearchParams()
  body.append('username', username)
  body.append('password', password)

  const res = await fetch(`${BASE_URL}/user/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
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
  if (!token) throw new Error('Token vacío en la respuesta')
  setToken(token)
  return token
}

export function logout() {
  setToken(null)
}

async function request(path, options = {}) {
  if (!_token) {
    const err = new Error('No autenticado')
    err.status = 401
    throw err
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${_token}`,
      ...options.headers,
    },
  })

  if (res.status === 401) {
    setToken(null)
  }

  return res
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function createUser({ email, password, plan_id }) {
  const res = await fetch(`${BASE_URL}/user/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, plan_id }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail?.[0]?.msg ?? err.detail ?? 'Error al crear el usuario')
  }
  // Devuelve string (mensaje de confirmación)
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text.replace(/^"|"$/g, '') }
}

// ── Support data ─────────────────────────────────────────────────────────────
export async function getSupportData() {
  const res = await request('/support/')
  if (!res.ok) throw new Error('No se pudo obtener datos de soporte')
  return res.json()
  // Returns: { Languages: [{language_id, language}], Prompts: [{prompt_id, trend_name}], VideoFormats: [{format_id, format_video}] }
}

// ── Process URL ───────────────────────────────────────────────────────────────
export async function processUrl({ url, prompt_id, language_id, format }) {
  const res = await request('/url/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, prompt_id, language_id, format }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Error al procesar la URL')
  }
  return res.json()
  // Returns: { video_id, status }
}

// ── Upload file flow ──────────────────────────────────────────────────────────
export async function getPresignedUrl(filename) {
  const res = await request(`/videos/presigned_url?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('No se pudo obtener URL de subida')
  return res.json()
  // Returns: { video_id, upload_url, file_name }
}

export async function uploadToPresignedUrl(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type || 'video/mp4')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(`Error al subir el archivo: ${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error('Error de red al subir el archivo'))
    xhr.send(file)
  })
}

export async function initProcess(video_id, { file_name, prompt_id, language_id }) {
  const res = await request(`/videos/ready/${video_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_name, prompt_id, language_id }),
  })
  if (!res.ok) throw new Error('Error al iniciar el procesamiento')
  return res.json()
  // Returns: { video_id, status }
}

// ── Polling ───────────────────────────────────────────────────────────────────
export async function getVideoStatus(video_id) {
  const res = await request(`/videos/status/${video_id}`)
  if (!res.ok) throw new Error('Error al obtener estado del video')
  return res.json()
  // Returns: { video_id, status }
}

export async function getVideoDone(video_id) {
  const res = await request(`/videos/done/${video_id}`)
  if (!res.ok) throw new Error('Error al obtener los clips')
  return res.json()
  // Returns: { video_id, clips_url: ["https://...mp4", ...] }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Normaliza la respuesta de /videos/done al formato de UI esperado por ClipCard
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
