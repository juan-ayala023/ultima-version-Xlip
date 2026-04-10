import { useEffect, useState } from 'react'
import ClipCard from './ClipCard'

const statusLabels = {
  queued: { label: 'En cola', color: 'text-xmuted', bg: 'bg-xborder/50' },
  processing: { label: 'Procesando', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  completed: { label: 'Completado', color: 'text-xgreen', bg: 'bg-xgreen/10' },
  error: { label: 'Error', color: 'text-red-400', bg: 'bg-red-400/10' },
}

export default function ClipsQueue({ clips, onClipClick, onNewJob }) {
  const [filter, setFilter] = useState('all')

  const counts = {
    all: clips.length,
    processing: clips.filter(c => c.status === 'processing' || c.status === 'queued').length,
    completed: clips.filter(c => c.status === 'completed').length,
  }

  const filtered = clips.filter(c => {
    if (filter === 'processing') return c.status === 'processing' || c.status === 'queued'
    if (filter === 'completed') return c.status === 'completed'
    return true
  })

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-lg text-white">Tus clips</h2>
          <p className="text-xmuted text-xs mt-0.5">
            {counts.processing > 0 && (
              <span className="text-yellow-400">{counts.processing} procesando · </span>
            )}
            {counts.completed} completados
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="flex items-center bg-surface2 rounded-xl p-1 border border-xborder">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'processing', label: 'Procesando' },
              { id: 'completed', label: 'Listos' },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                  ${filter === f.id
                    ? 'bg-surface text-white border border-xborder'
                    : 'text-xmuted hover:text-white'}`}>
                {f.label}
                <span className={`ml-1.5 text-xs ${filter === f.id ? 'text-xgreen' : 'text-xmuted'}`}>
                  {counts[f.id]}
                </span>
              </button>
            ))}
          </div>

          <button onClick={onNewJob}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-xgreen/30 text-xgreen hover:bg-xgreen/10 transition-all duration-150">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo
          </button>
        </div>
      </div>

      {/* Clips grid */}
      {filtered.length === 0 ? (
        <EmptyState filter={filter} onNewJob={onNewJob} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(clip => (
            <ClipCard key={clip.id} clip={clip} onClick={() => onClipClick(clip)} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ filter, onNewJob }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-xborder rounded-2xl">
      <div className="text-4xl mb-4">
        {filter === 'processing' ? '⚡' : filter === 'completed' ? '✅' : '🎬'}
      </div>
      <h3 className="font-semibold text-white text-sm mb-1">
        {filter === 'processing' ? 'No hay clips procesando' :
         filter === 'completed' ? 'No hay clips listos aún' :
         'No generaste clips todavía'}
      </h3>
      <p className="text-xmuted text-xs max-w-xs mb-5">
        {filter === 'all'
          ? 'Pegá un link o subí un video para que la máquina entre en acción'
          : 'Cuando proceses un video, los clips aparecerán aquí'}
      </p>
      {filter === 'all' && (
        <button onClick={onNewJob}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-bg hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
          Procesar primer video
        </button>
      )}
    </div>
  )
}
