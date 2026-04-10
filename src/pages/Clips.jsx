import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ClipCard from '../components/ClipCard'
import ClipViewer from '../components/ClipViewer'
import { mockClips } from '../data/mockData'

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'completed', label: 'Listos' },
  { id: 'processing', label: 'Procesando' },
  { id: 'queued', label: 'En cola' },
]

const sorts = [
  { id: 'score', label: 'Mayor score' },
  { id: 'recent', label: 'Más recientes' },
  { id: 'duration', label: 'Duración' },
]

const platformFilter = [
  { id: 'all', label: 'Todas las plataformas' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'reels', label: 'Reels' },
  { id: 'shorts', label: 'Shorts' },
]

export default function Clips() {
  const [selectedClip, setSelectedClip] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('score')
  const [platform, setPlatform] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const clips = [...mockClips]

  const filtered = clips
    .filter(c => {
      if (filter !== 'all' && c.status !== filter) return false
      if (platform !== 'all' && !c.platforms?.includes(platform)) return false
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'score') return (b.engagementScore || 0) - (a.engagementScore || 0)
      if (sort === 'duration') return b.duration - a.duration
      return 0
    })

  const counts = {
    all: clips.length,
    completed: clips.filter(c => c.status === 'completed').length,
    processing: clips.filter(c => c.status === 'processing').length,
    queued: clips.filter(c => c.status === 'queued').length,
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Mis clips</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-bg hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo clip
          </button>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total clips', value: counts.all, color: '#ffffff' },
              { label: 'Listos', value: counts.completed, color: '#10B981' },
              { label: 'Procesando', value: counts.processing, color: '#F59E0B' },
              { label: 'En cola', value: counts.queued, color: '#64748B' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-xborder text-center" style={{ background: '#0D0D1F' }}>
                <p className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xmuted text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-xmuted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar clips..."
                className="w-full bg-surface border border-xborder rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-xmuted/50 focus:outline-none focus:border-xgreen transition-colors"
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center bg-surface2 rounded-xl p-1 border border-xborder">
              {filters.map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap
                    ${filter === f.id ? 'bg-surface text-white border border-xborder' : 'text-xmuted hover:text-white'}`}>
                  {f.label}
                  <span className={`ml-1 ${filter === f.id ? 'text-xgreen' : 'text-xmuted/60'}`}>
                    {counts[f.id]}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-surface border border-xborder rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-xgreen cursor-pointer">
              {sorts.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          {/* Platform filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {platformFilter.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                  ${platform === p.id
                    ? 'border-xgreen bg-xgreen/10 text-xgreen'
                    : 'border-xborder text-xmuted hover:border-xmuted hover:text-white'}`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-xborder rounded-2xl">
              <div className="text-4xl mb-4">🎬</div>
              <p className="text-white font-semibold text-sm mb-1">Sin resultados</p>
              <p className="text-xmuted text-xs">Probá cambiando los filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(clip => (
                <ClipCard key={clip.id} clip={clip} onClick={() => setSelectedClip(clip)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedClip && (
        <ClipViewer clip={selectedClip} onClose={() => setSelectedClip(null)} />
      )}
    </div>
  )
}
