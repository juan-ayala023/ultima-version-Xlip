import { useState, useRef } from 'react'

const platformIcons = {
  youtube: { color: '#FF0000', label: 'YouTube' },
  twitch: { color: '#9146FF', label: 'Twitch' },
  kick: { color: '#53FC18', label: 'Kick' },
  tiktok: { color: '#ffffff', label: 'TikTok' },
}

function detectPlatform(url) {
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('twitch')) return 'twitch'
  if (url.includes('kick')) return 'kick'
  if (url.includes('tiktok')) return 'tiktok'
  return null
}

export default function VideoInput({ onSubmit }) {
  const [tab, setTab] = useState('url')
  const [url, setUrl] = useState('')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const platform = detectPlatform(url)

  function handleUrlSubmit() {
    if (!url.trim()) { setError('Pegá un link válido'); return }
    if (!url.startsWith('http')) { setError('El link debe comenzar con http://'); return }
    setError('')
    onSubmit({ type: 'url', value: url, platform })
  }

  function handleFileSelect(f) {
    if (!f) return
    const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/mkv']
    const ext = f.name.split('.').pop().toLowerCase()
    const validExts = ['mp4', 'mov', 'avi', 'webm', 'mkv']
    if (!validTypes.includes(f.type) && !validExts.includes(ext)) {
      setError('Formato no soportado. Usá MP4, MOV, AVI, WebM o MKV.')
      return
    }
    setError('')
    setFile(f)
  }

  function handleFileDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFileSelect(f)
  }

  function handleFileSubmit() {
    if (!file) { setError('Seleccioná un video primero'); return }
    onSubmit({ type: 'file', value: file.name, file })
  }

  function formatBytes(b) {
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
    return `${(b / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-xgreen/30 bg-xgreen/5 text-xgreen text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-xgreen animate-pulse" />
          XLIP_OS_V4.2.0 // SISTEMA LISTO
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-white mb-3">
          Subí tu contenido
        </h1>
        <p className="text-xmuted text-sm max-w-md mx-auto">
          Pegá un link o subí tu video. La IA detecta los momentos virales y genera tus clips en minutos.
        </p>
      </div>

      {/* Input card */}
      <div className="rounded-2xl border border-xborder overflow-hidden" style={{ background: '#0D0D1F' }}>
        {/* Tabs */}
        <div className="flex border-b border-xborder">
          {[
            { id: 'url', label: 'Link de video', icon: '🔗' },
            { id: 'file', label: 'Subir archivo', icon: '📁' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setError('') }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all duration-200
                ${tab === t.id
                  ? 'text-white border-b-2 border-xgreen bg-xgreen/5'
                  : 'text-xmuted hover:text-white'}`}>
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'url' ? (
            <div className="space-y-4">
              {/* URL platforms hint */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-xmuted">Compatible con:</span>
                {Object.entries(platformIcons).map(([key, val]) => (
                  <span key={key} className="text-xs px-2 py-0.5 rounded-md border border-xborder text-xmuted"
                    style={{ borderColor: platform === key ? val.color + '44' : undefined, color: platform === key ? val.color : undefined }}>
                    {val.label}
                  </span>
                ))}
              </div>

              {/* URL input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xmuted">
                  {platform ? (
                    <span style={{ color: platformIcons[platform]?.color }} className="text-sm font-mono">
                      {platform.toUpperCase()}
                    </span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={e => { setUrl(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                  placeholder="https://youtube.com/watch?v=... o twitch.tv/..."
                  className={`w-full bg-surface2 border border-xborder rounded-xl pr-4 py-4 text-sm text-white placeholder:text-xmuted/50 focus:outline-none focus:border-xgreen transition-colors duration-200 ${platform ? 'pl-20' : 'pl-12'}`}
                />
                {url && (
                  <button onClick={() => { setUrl(''); setError('') }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xmuted hover:text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleUrlSubmit}
                disabled={!url.trim()}
                className="w-full py-4 rounded-xl font-semibold text-sm text-bg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
                style={{ background: !url.trim() ? '#1E1E3A' : 'linear-gradient(135deg, #10B981, #059669)', color: !url.trim() ? '#64748B' : '#060610' }}>
                Analizar video →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
                  ${dragging ? 'border-xgreen bg-xgreen/5' : 'border-xborder hover:border-xmuted/50 hover:bg-surface2/50'}
                  ${file ? 'border-xgreen/40' : ''}`}>
                <input ref={fileRef} type="file" accept="video/*" className="hidden"
                  onChange={e => handleFileSelect(e.target.files[0])} />

                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-xgreen/10">
                      🎬
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{file.name}</p>
                      <p className="text-xmuted text-xs mt-1">{formatBytes(file.size)}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setFile(null) }}
                      className="text-xs text-xmuted hover:text-red-400 transition-colors">
                      Cambiar archivo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200
                      ${dragging ? 'bg-xgreen/20' : 'bg-surface2'}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#10B981' : '#64748B'} strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {dragging ? 'Soltá el video aquí' : 'Arrastrá o hacé click para subir'}
                      </p>
                      <p className="text-xmuted text-xs mt-1">MP4, MOV, AVI, WebM, MKV · hasta 10GB</p>
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleFileSubmit}
                disabled={!file}
                className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
                style={{ background: file ? 'linear-gradient(135deg, #10B981, #059669)' : '#1E1E3A', color: file ? '#060610' : '#64748B' }}>
                Procesar video →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <p className="text-center text-xs text-xmuted mt-4">
        Tiempo estimado de procesamiento: <span className="text-white font-mono">~2-5 min</span> por hora de contenido
      </p>
    </div>
  )
}
