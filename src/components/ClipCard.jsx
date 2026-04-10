const platformColors = {
  tiktok: '#000000',
  reels: '#E1306C',
  shorts: '#FF0000',
}

const platformLabels = {
  tiktok: 'TikTok',
  reels: 'Reels',
  shorts: 'Shorts',
}

function ScoreBadge({ score }) {
  const color = score >= 90 ? '#10B981' : score >= 75 ? '#F59E0B' : '#EF4444'
  const bg = score >= 90 ? 'rgba(16,185,129,0.12)' : score >= 75 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold font-mono"
      style={{ color, background: bg, border: `1px solid ${color}33` }}>
      ⚡ {score}
    </div>
  )
}

function StatusBadge({ status, progress }) {
  if (status === 'completed') {
    return (
      <span className="flex items-center gap-1 text-xgreen text-xs font-medium">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Listo
      </span>
    )
  }
  if (status === 'processing') {
    return (
      <span className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
        {progress}%
      </span>
    )
  }
  if (status === 'queued') {
    return <span className="text-xmuted text-xs font-medium">En cola</span>
  }
  return null
}

export default function ClipCard({ clip, onClick }) {
  const isProcessing = clip.status === 'processing'
  const isQueued = clip.status === 'queued'
  const isCompleted = clip.status === 'completed'

  function formatDuration(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`
  }

  return (
    <div
      onClick={isCompleted ? onClick : undefined}
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-200
        ${isCompleted
          ? 'border-xborder hover:border-xgreen/40 cursor-pointer hover:shadow-lg'
          : 'border-xborder/50 opacity-80'}
        ${isProcessing ? 'border-yellow-400/20' : ''}`}
      style={{ background: '#0D0D1F' }}>

      {/* Thumbnail area */}
      <div className="relative aspect-video bg-surface2 overflow-hidden">
        {/* Mock thumbnail gradient */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{
            background: isCompleted
              ? 'linear-gradient(135deg, #0D1F15 0%, #1A0D2E 100%)'
              : 'linear-gradient(135deg, #0D0D1F 0%, #12122A 100%)'
          }}>
          {isCompleted && (
            <>
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(circle at 30% 50%, #10B98133, transparent 60%), radial-gradient(circle at 70% 50%, #A855F733, transparent 60%)' }} />
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-white/5 border border-white/10
                group-hover:scale-110 transition-transform duration-200">
                ▶
              </div>
            </>
          )}
          {isProcessing && (
            <div className="flex flex-col items-center gap-3 w-full px-6">
              <span className="text-yellow-400 text-xs font-mono animate-pulse">PROCESANDO...</span>
              <div className="w-full h-1 bg-xborder rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${clip.progress}%`, background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
              </div>
              <span className="text-xmuted text-xs font-mono">{clip.progress}% completado</span>
            </div>
          )}
          {isQueued && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-xborder border-t-xmuted animate-spin" />
              <span className="text-xmuted text-xs font-mono">En cola...</span>
            </div>
          )}
        </div>

        {/* Duration badge */}
        {isCompleted && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-mono">
            {formatDuration(clip.duration)}
          </div>
        )}

        {/* Start time */}
        {isCompleted && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-xmuted text-xs font-mono">
            {clip.startTime}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 flex-1">
            {clip.title}
          </h4>
          {isCompleted && <ScoreBadge score={clip.engagementScore} />}
        </div>

        {isCompleted && clip.detectedAt && (
          <p className="text-xs text-xmuted mb-3 flex items-center gap-1">
            <span>🎯</span>
            {clip.detectedAt}
          </p>
        )}

        {/* Tags */}
        {isCompleted && (
          <div className="flex flex-wrap gap-1 mb-3">
            {clip.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {isCompleted && clip.platforms.map(p => (
              <span key={p} className="text-xs px-1.5 py-0.5 rounded-md font-medium border border-xborder/50 text-xmuted">
                {platformLabels[p]}
              </span>
            ))}
          </div>
          <StatusBadge status={clip.status} progress={clip.progress} />
        </div>
      </div>

      {/* Hover overlay for completed */}
      {isCompleted && (
        <div className="absolute inset-0 bg-xgreen/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      )}
    </div>
  )
}
