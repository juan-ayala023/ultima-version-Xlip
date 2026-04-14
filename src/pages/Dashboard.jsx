import { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import VideoInput from '../components/VideoInput'
import ConfigPanel from '../components/ConfigPanel'
import ClipsQueue from '../components/ClipsQueue'
import ClipViewer from '../components/ClipViewer'
import {
  getSupportData,
  processUrl,
  getPresignedUrl,
  uploadToPresignedUrl,
  initProcess,
  getVideoStatus,
  getVideoDone,
  normalizeClips,
} from '../api/client'

const STEPS = {
  INPUT: 'input',
  CONFIG: 'config',
  PROCESSING: 'processing',
}

const POLL_INTERVAL_MS = 4000

function makePendingClip(videoId, numClips) {
  return Array.from({ length: numClips }, (_, i) => ({
    id: `pending_${videoId}_${i}`,
    _videoId: videoId,
    title: `Detectando momento viral #${i + 1}...`,
    duration: 0,
    engagementScore: 0,
    status: i === 0 ? 'processing' : 'queued',
    progress: i === 0 ? 5 : 0,
    thumbnail: null,
    platforms: ['tiktok', 'reels', 'shorts'],
    views: 0,
    tags: [],
    startTime: null,
    endTime: null,
    detectedAt: null,
    processingTime: null,
  }))
}

export default function Dashboard() {
  const [step, setStep] = useState(STEPS.INPUT)
  const [videoSource, setVideoSource] = useState(null)
  const [clips, setClips] = useState(() => {
    try {
      const saved = localStorage.getItem('xlip_clips')
      if (!saved) return []
      const parsed = JSON.parse(saved).filter(c => c.status === 'completed')
      // Dedup by id in case an older build persisted duplicates
      const seen = new Set()
      return parsed.filter(c => (seen.has(c.id) ? false : (seen.add(c.id), true)))
    } catch { return [] }
  })
  const [selectedClip, setSelectedClip] = useState(null)
  const [supportData, setSupportData] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Track active polling job: { videoId, pendingIds }
  const pollingRef = useRef(null)
  const pollTimerRef = useRef(null)

  // Simulate progress animation for pending clips while polling
  const progressTimerRef = useRef(null)

  // ── Load support data on mount ─────────────────────────────────────────────
  useEffect(() => {
    getSupportData()
      .then(setSupportData)
      .catch(() => setError('No se pudo conectar con el servidor. Verificá tu conexión.'))
  }, [])

  // ── Persist completed clips ────────────────────────────────────────────────
  useEffect(() => {
    const completed = clips.filter(c => c.status === 'completed')
    if (completed.length > 0) {
      localStorage.setItem('xlip_clips', JSON.stringify(completed))
    }
  }, [clips])

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(pollTimerRef.current)
      clearInterval(progressTimerRef.current)
    }
  }, [])

  // ── Animate progress of pending clips ─────────────────────────────────────
  function startProgressAnimation(pendingIds) {
    clearInterval(progressTimerRef.current)
    progressTimerRef.current = setInterval(() => {
      setClips(prev => prev.map(clip => {
        if (!pendingIds.includes(clip.id)) return clip
        if (clip.status === 'completed') return clip
        if (clip.status === 'processing' && clip.progress < 90) {
          return { ...clip, progress: Math.min(clip.progress + Math.random() * 3, 90) }
        }
        if (clip.status === 'queued') {
          const processingCount = prev.filter(c => pendingIds.includes(c.id) && c.status === 'processing').length
          if (processingCount < 2) {
            return { ...clip, status: 'processing', progress: 5 }
          }
        }
        return clip
      }))
    }, 800)
  }

  // ── Poll video status ──────────────────────────────────────────────────────
  const startPolling = useCallback((videoId, pendingIds) => {
    clearInterval(pollTimerRef.current)
    pollingRef.current = { videoId, pendingIds }

    // Guard against concurrent poll invocations racing past the Done branch
    let finished = false

    async function poll() {
      if (finished) return
      try {
        const { status } = await getVideoStatus(videoId)
        if (finished) return

        if (status === 'Done' || status === 'done' || status === 'completed') {
          finished = true
          clearInterval(pollTimerRef.current)
          clearInterval(progressTimerRef.current)

          const doneData = await getVideoDone(videoId)
          const realClips = normalizeClips(doneData, videoId)

          setClips(prev => {
            // Remove pending placeholders
            const rest = prev.filter(c => !pendingIds.includes(c.id))
            // Dedup: drop any real clip whose id already exists in the list
            const existingIds = new Set(rest.map(c => c.id))
            const fresh = realClips.filter(c => !existingIds.has(c.id))
            return [...fresh, ...rest]
          })
          return
        }

        if (status === 'Error' || status === 'error' || status === 'failed') {
          finished = true
          clearInterval(pollTimerRef.current)
          clearInterval(progressTimerRef.current)
          setClips(prev => prev.map(c =>
            pendingIds.includes(c.id) ? { ...c, status: 'error' } : c
          ))
          setError('El procesamiento del video falló. Intentá de nuevo.')
        }
        // else: still pending/processing → keep polling
      } catch {
        // Network error → keep polling silently
      }
    }

    pollTimerRef.current = setInterval(poll, POLL_INTERVAL_MS)
    poll() // fire immediately
  }, [])

  // ── Step: video URL submitted ──────────────────────────────────────────────
  function handleVideoSubmit(source) {
    setVideoSource(source)
    setStep(STEPS.CONFIG)
    setError('')
  }

  // ── Step: config confirmed → call API ─────────────────────────────────────
  async function handleProcess(config) {
    setError('')
    setStep(STEPS.PROCESSING)

    try {
      let videoId

      if (videoSource.type === 'url') {
        // ── URL flow ──────────────────────────────────────────────────────
        const result = await processUrl({
          url: videoSource.value,
          prompt_id: config.prompt_id,
          language_id: config.language_id,
          format: config.format,
        })
        videoId = result.video_id

      } else {
        // ── File upload flow ──────────────────────────────────────────────
        setUploading(true)
        setUploadProgress(0)

        const { video_id, upload_url, file_name } = await getPresignedUrl(videoSource.file.name)
        videoId = video_id

        const renamedFile = new File([videoSource.file], file_name, { type: videoSource.file.type })

        await uploadToPresignedUrl(upload_url, renamedFile, (pct) => {
          setUploadProgress(pct)
        })

        setUploading(false)

        await initProcess(videoId, {
          file_name,
          prompt_id: config.prompt_id,
          language_id: config.language_id,
        })
      }

      // Add placeholder clips to the queue
      const pending = makePendingClip(videoId, config.numClips)
      setClips(prev => [...pending, ...prev])

      const pendingIds = pending.map(c => c.id)
      startProgressAnimation(pendingIds)
      startPolling(videoId, pendingIds)

    } catch (err) {
      setUploading(false)
      setError(err.message ?? 'Ocurrió un error. Intentá de nuevo.')
      setStep(STEPS.CONFIG)
    }
  }

  function handleNewJob() {
    clearInterval(pollTimerRef.current)
    clearInterval(progressTimerRef.current)
    setStep(STEPS.INPUT)
    setVideoSource(null)
    setError('')
    setUploading(false)
    setUploadProgress(0)
  }

  const completedCount = clips.filter(c => c.status === 'completed').length
  const processingCount = clips.filter(c => c.status === 'processing' || c.status === 'queued').length

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-xborder glass">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-xmuted">
              <span className={`w-1.5 h-1.5 rounded-full ${processingCount > 0 ? 'bg-yellow-400 animate-pulse' : 'bg-xgreen'}`} />
              <span className="font-mono">
                {uploading
                  ? `Subiendo archivo... ${uploadProgress}%`
                  : processingCount > 0
                    ? `${processingCount} clips procesando`
                    : 'Sistema listo'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {[
                { label: 'Clips listos', value: completedCount, color: '#10B981' },
                { label: 'En proceso', value: processingCount, color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-xborder text-xs">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xmuted">{s.label}:</span>
                  <span className="font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            <button className="w-8 h-8 rounded-lg border border-xborder flex items-center justify-center text-xmuted hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Views totales', value: '4.7M', icon: '👁️', color: '#10B981', change: '+12%' },
              { label: 'Clips generados', value: clips.length.toString(), icon: '🎬', color: '#A855F7', change: `+${clips.length}` },
              { label: 'Cuentas activas', value: '37', icon: '📱', color: '#34D399', change: '+3' },
              { label: 'Revenue mes', value: '$8.4K', icon: '💰', color: '#F59E0B', change: '+34%' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl border border-xborder" style={{ background: '#0D0D1F' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ color: stat.color, background: stat.color + '15' }}>
                    {stat.change}
                  </span>
                </div>
                <p className="font-display font-bold text-xl text-white">{stat.value}</p>
                <p className="text-xmuted text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Error global */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-400 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
              <button onClick={() => setError('')} className="ml-auto hover:text-white transition-colors">✕</button>
            </div>
          )}

          {/* Upload progress bar */}
          {uploading && (
            <div className="mb-6 p-4 rounded-xl border border-xborder bg-surface2">
              <div className="flex items-center justify-between mb-2 text-xs text-xmuted">
                <span className="font-mono">Subiendo archivo...</span>
                <span className="font-bold font-mono text-white">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-xborder rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
              </div>
            </div>
          )}

          {/* Step: Input */}
          {step === STEPS.INPUT && (
            <VideoInput onSubmit={handleVideoSubmit} />
          )}

          {/* Step: Config */}
          {step === STEPS.CONFIG && videoSource && supportData && (
            <ConfigPanel
              videoSource={videoSource}
              supportData={supportData}
              onProcess={handleProcess}
              onBack={() => setStep(STEPS.INPUT)}
            />
          )}

          {/* Loading support data */}
          {step === STEPS.CONFIG && !supportData && !error && (
            <div className="flex items-center justify-center py-20 text-xmuted text-sm gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-xborder border-t-xgreen animate-spin" />
              Cargando configuración...
            </div>
          )}

          {/* Clips queue */}
          {clips.length > 0 && (
            <ClipsQueue
              clips={clips}
              onClipClick={setSelectedClip}
              onNewJob={handleNewJob}
            />
          )}

          {/* Empty state when processing but no clips yet */}
          {step === STEPS.PROCESSING && clips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-xborder border-t-xgreen animate-spin" />
              <p className="text-xmuted text-sm font-mono">Iniciando análisis de video...</p>
            </div>
          )}
        </div>
      </main>

      {selectedClip && (
        <ClipViewer
          clip={selectedClip}
          onClose={() => setSelectedClip(null)}
        />
      )}
    </div>
  )
}
