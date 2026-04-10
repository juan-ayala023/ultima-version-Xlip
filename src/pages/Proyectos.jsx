import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const mockProyectos = [
  {
    id: 'p1',
    name: 'Stream de xQc — Semana 14',
    source: 'https://twitch.tv/xqc',
    platform: 'twitch',
    status: 'completed',
    clips: 8,
    totalDuration: '3h 42min',
    processedAt: 'Hace 2 días',
    engagementAvg: 91.2,
    views: 142000,
  },
  {
    id: 'p2',
    name: 'Podcast MrBeast — EP 47',
    source: 'https://youtube.com/watch?v=abc',
    platform: 'youtube',
    status: 'completed',
    clips: 5,
    totalDuration: '1h 18min',
    processedAt: 'Hace 4 días',
    engagementAvg: 87.4,
    views: 89000,
  },
  {
    id: 'p3',
    name: 'Kick — AuronPlay Directo',
    source: 'https://kick.com/auronplay',
    platform: 'kick',
    status: 'processing',
    clips: 0,
    totalDuration: '5h 01min',
    processedAt: 'En progreso',
    engagementAvg: 0,
    views: 0,
    progress: 43,
  },
  {
    id: 'p4',
    name: 'Tutorial React 2026 — FreeCodeCamp',
    source: 'https://youtube.com/watch?v=xyz',
    platform: 'youtube',
    status: 'completed',
    clips: 12,
    totalDuration: '6h 20min',
    processedAt: 'Hace 1 semana',
    engagementAvg: 83.1,
    views: 210000,
  },
]

const platformMeta = {
  youtube: { label: 'YouTube', color: '#FF0000', icon: '▶️' },
  twitch: { label: 'Twitch', color: '#9146FF', icon: '🎮' },
  kick: { label: 'Kick', color: '#53FC18', icon: '🟢' },
  tiktok: { label: 'TikTok', color: '#ffffff', icon: '🎵' },
}

function formatViews(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

export default function Proyectos() {
  const [view, setView] = useState('grid')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Proyectos</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-bg hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo proyecto
          </button>
        </div>

        <div className="p-6 lg:p-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xmuted text-sm">{mockProyectos.length} proyectos</p>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center bg-surface2 rounded-xl p-1 border border-xborder">
                {[
                  { id: 'grid', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> },
                  { id: 'list', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
                ].map(v => (
                  <button key={v.id} onClick={() => setView(v.id)}
                    className={`p-1.5 rounded-lg transition-all ${view === v.id ? 'bg-surface text-white border border-xborder' : 'text-xmuted hover:text-white'}`}>
                    {v.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid view */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockProyectos.map(p => {
                const meta = platformMeta[p.platform]
                return (
                  <div key={p.id}
                    className="rounded-2xl border border-xborder hover:border-xgreen/30 transition-all duration-200 cursor-pointer group overflow-hidden"
                    style={{ background: '#0D0D1F' }}>
                    {/* Header */}
                    <div className="p-5 border-b border-xborder">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{meta.icon}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                            style={{ background: meta.color + '15', color: meta.color }}>
                            {meta.label}
                          </span>
                        </div>
                        <StatusPill status={p.status} />
                      </div>
                      <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-xgreen transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-xmuted text-xs mt-1 font-mono truncate">{p.source}</p>
                    </div>

                    {/* Stats */}
                    <div className="p-5">
                      {p.status === 'processing' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-xmuted">Procesando</span>
                            <span className="text-yellow-400 font-mono">{p.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-xborder rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${p.progress}%`, background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
                          </div>
                          <p className="text-xmuted text-xs">{p.totalDuration} de contenido</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3 text-center">
                          {[
                            { label: 'Clips', value: p.clips },
                            { label: 'Duración', value: p.totalDuration.split(' ')[0] },
                            { label: 'Views', value: formatViews(p.views) },
                          ].map(s => (
                            <div key={s.label}>
                              <p className="font-bold text-white text-sm">{s.value}</p>
                              <p className="text-xmuted text-xs">{s.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-xborder">
                        <span className="text-xmuted text-xs">{p.processedAt}</span>
                        {p.status === 'completed' && (
                          <span className="text-xs font-mono font-bold" style={{ color: '#10B981' }}>
                            ⚡ {p.engagementAvg}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* New project card */}
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-2xl border-2 border-dashed border-xborder hover:border-xgreen/40 transition-all duration-200 p-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center text-xmuted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Nuevo proyecto</p>
                  <p className="text-xmuted text-xs">Subí un video o pegá un link</p>
                </div>
              </button>
            </div>
          )}

          {/* List view */}
          {view === 'list' && (
            <div className="rounded-2xl border border-xborder overflow-hidden" style={{ background: '#0D0D1F' }}>
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] text-xs text-xmuted font-medium px-5 py-3 border-b border-xborder bg-surface2">
                <span>Proyecto</span>
                <span>Clips</span>
                <span>Duración</span>
                <span>Views</span>
                <span>Score</span>
                <span>Estado</span>
              </div>
              {mockProyectos.map((p, i) => {
                const meta = platformMeta[p.platform]
                return (
                  <div key={p.id}
                    className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px] items-center px-5 py-4 hover:bg-surface cursor-pointer transition-colors
                      ${i !== mockProyectos.length - 1 ? 'border-b border-xborder' : ''}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base flex-shrink-0">{meta.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{p.name}</p>
                        <p className="text-xs text-xmuted font-mono truncate">{p.processedAt}</p>
                      </div>
                    </div>
                    <span className="text-sm text-white font-mono">{p.clips || '—'}</span>
                    <span className="text-sm text-xmuted">{p.totalDuration}</span>
                    <span className="text-sm text-white">{p.views ? formatViews(p.views) : '—'}</span>
                    <span className="text-sm font-mono font-bold" style={{ color: p.engagementAvg ? '#10B981' : '#64748B' }}>
                      {p.engagementAvg || '—'}
                    </span>
                    <StatusPill status={p.status} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatusPill({ status }) {
  const config = {
    completed: { label: 'Listo', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    processing: { label: 'Procesando', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    queued: { label: 'En cola', color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
  }[status] || {}

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: config.color, background: config.bg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
      {config.label}
    </span>
  )
}
