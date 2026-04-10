import { useEffect } from 'react'

const platformColors = {
  tiktok: { bg: '#000000', accent: '#69C9D0', label: 'TikTok' },
  reels: { bg: '#833AB4', accent: '#E1306C', label: 'Instagram Reels' },
  shorts: { bg: '#FF0000', accent: '#FF4444', label: 'YouTube Shorts' },
}

export default function ClipViewer({ clip, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!clip) return null

  function formatDuration(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl mx-4 rounded-2xl border border-xborder overflow-hidden animate-fade-up"
        style={{ background: '#0D0D1F', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Modal header */}
        <div className="flex items-center justify-between p-5 border-b border-xborder">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-xgreen animate-pulse" />
            <h3 className="font-display font-bold text-white text-sm truncate max-w-xs sm:max-w-md">
              {clip.title}
            </h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg border border-xborder flex items-center justify-center text-xmuted hover:text-white hover:border-xmuted transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-xborder">
          {/* Left: Video preview */}
          <div className="p-6">
            {/* Mock video player */}
            <div className="relative rounded-xl overflow-hidden aspect-[9/16] max-w-[200px] mx-auto"
              style={{ background: 'linear-gradient(135deg, #0D1F15 0%, #1A0D2E 100%)' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="absolute inset-0 opacity-20"
                  style={{ background: 'radial-gradient(circle at 30% 40%, #10B98133, transparent 60%), radial-gradient(circle at 70% 60%, #A855F733, transparent 60%)' }} />
                <div className="relative text-4xl">🎬</div>
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl border border-white/20 bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                  ▶
                </div>
                <div className="relative text-white/40 text-xs font-mono">
                  {clip.startTime} → {clip.endTime}
                </div>
              </div>

              {/* Fake subtitles overlay */}
              <div className="absolute bottom-6 left-2 right-2 text-center">
                <div className="inline-block bg-black/70 px-2 py-1 rounded text-white text-xs font-semibold">
                  Vista previa disponible
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs font-mono text-white">
                {formatDuration(clip.duration)}
              </div>
            </div>

            {/* Video controls mock */}
            <div className="mt-4 space-y-3">
              <div className="h-1 bg-xborder rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '0%', background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
              </div>
              <div className="flex items-center justify-between text-xs text-xmuted font-mono">
                <span>0:00</span>
                <div className="flex items-center gap-3">
                  <button className="hover:text-white transition-colors">⏮</button>
                  <button className="w-8 h-8 rounded-full bg-xgreen flex items-center justify-center text-bg hover:opacity-90 transition-opacity">
                    ▶
                  </button>
                  <button className="hover:text-white transition-colors">⏭</button>
                </div>
                <span>{formatDuration(clip.duration)}</span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-6 space-y-5">
            {/* Engagement score */}
            <div className="rounded-xl border border-xborder p-4 bg-surface2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-xmuted font-medium uppercase tracking-wider">Engagement score</span>
                <span className="text-2xl font-display font-black" style={{ color: '#10B981' }}>
                  {clip.engagementScore}
                </span>
              </div>
              <div className="w-full h-1.5 bg-xborder rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                  style={{ width: `${clip.engagementScore}%`, background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
              </div>
              <p className="text-xs text-xmuted mt-2">Top {100 - Math.floor(clip.engagementScore)}% de clips detectados</p>
            </div>

            {/* Detection reason */}
            {clip.detectedAt && (
              <div>
                <p className="text-xs text-xmuted uppercase tracking-wider mb-2 font-medium">¿Por qué este momento?</p>
                <div className="flex items-center gap-2 p-3 rounded-xl border border-xborder bg-surface2">
                  <span className="text-lg">🎯</span>
                  <span className="text-sm text-white">{clip.detectedAt}</span>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <p className="text-xs text-xmuted uppercase tracking-wider mb-2 font-medium">Timestamps</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Inicio', value: clip.startTime },
                  { label: 'Fin', value: clip.endTime },
                ].map(t => (
                  <div key={t.label} className="p-3 rounded-xl border border-xborder bg-surface2 text-center">
                    <p className="text-xs text-xmuted mb-1">{t.label}</p>
                    <p className="text-sm font-mono font-bold text-white">{t.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs text-xmuted uppercase tracking-wider mb-2 font-medium">Tags IA detectados</p>
              <div className="flex flex-wrap gap-1.5">
                {clip.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-xs text-xmuted uppercase tracking-wider mb-2 font-medium">Plataformas</p>
              <div className="flex flex-wrap gap-2">
                {clip.platforms.map(p => (
                  <div key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-xborder bg-surface2 text-xs font-medium text-xmuted">
                    {platformColors[p]?.label || p}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={clip.downloadUrl || undefined}
                target="_blank"
                rel="noreferrer"
                onClick={!clip.downloadUrl ? (e) => e.preventDefault() : undefined}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border border-xborder text-sm font-semibold transition-all duration-150 ${clip.downloadUrl ? 'text-white hover:border-xmuted hover:bg-surface cursor-pointer' : 'text-xmuted cursor-not-allowed opacity-50'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar
              </a>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-all duration-150"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
