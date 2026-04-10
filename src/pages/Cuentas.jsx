import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const mockCuentas = [
  {
    id: 'c1', platform: 'tiktok', username: '@xlip.gaming', followers: 84200,
    status: 'active', clipsPosted: 47, totalViews: 2100000, monthlyRevenue: 1840,
    lastPost: 'Hace 2h', growth: '+12.4%',
  },
  {
    id: 'c2', platform: 'tiktok', username: '@xlip.viral', followers: 31500,
    status: 'active', clipsPosted: 28, totalViews: 890000, monthlyRevenue: 720,
    lastPost: 'Hace 5h', growth: '+8.1%',
  },
  {
    id: 'c3', platform: 'instagram', username: '@xlip.clips', followers: 22800,
    status: 'active', clipsPosted: 19, totalViews: 560000, monthlyRevenue: 480,
    lastPost: 'Hace 1d', growth: '+5.3%',
  },
  {
    id: 'c4', platform: 'youtube', username: 'XLIP Highlights', followers: 9400,
    status: 'active', clipsPosted: 31, totalViews: 740000, monthlyRevenue: 1120,
    lastPost: 'Hace 6h', growth: '+19.2%',
  },
  {
    id: 'c5', platform: 'instagram', username: '@xlip.sports', followers: 5200,
    status: 'paused', clipsPosted: 8, totalViews: 95000, monthlyRevenue: 60,
    lastPost: 'Hace 3d', growth: '-0.2%',
  },
  {
    id: 'c6', platform: 'tiktok', username: '@xlip.comedy', followers: 1100,
    status: 'warming', clipsPosted: 4, totalViews: 28000, monthlyRevenue: 0,
    lastPost: 'Hace 12h', growth: '+31%',
  },
]

const platformMeta = {
  tiktok: { label: 'TikTok', color: '#69C9D0', bg: 'rgba(105,201,208,0.1)', icon: '🎵' },
  instagram: { label: 'Instagram', color: '#E1306C', bg: 'rgba(225,48,108,0.1)', icon: '📸' },
  youtube: { label: 'YouTube', color: '#FF0000', bg: 'rgba(255,0,0,0.1)', icon: '▶️' },
}

const statusMeta = {
  active: { label: 'Activa', color: '#10B981', dot: '#10B981' },
  paused: { label: 'Pausada', color: '#64748B', dot: '#64748B' },
  warming: { label: 'Calentando', color: '#F59E0B', dot: '#F59E0B' },
}

function formatNum(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

export default function Cuentas() {
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = mockCuentas.filter(c => {
    if (filterPlatform !== 'all' && c.platform !== filterPlatform) return false
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    return true
  })

  const totalFollowers = mockCuentas.reduce((a, c) => a + c.followers, 0)
  const totalViews = mockCuentas.reduce((a, c) => a + c.totalViews, 0)
  const totalRevenue = mockCuentas.reduce((a, c) => a + c.monthlyRevenue, 0)
  const activeCount = mockCuentas.filter(c => c.status === 'active').length

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Cuentas</h1>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-bg hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Conectar cuenta
          </button>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Cuentas activas', value: `${activeCount}/${mockCuentas.length}`, icon: '📱', color: '#10B981' },
              { label: 'Seguidores totales', value: formatNum(totalFollowers), icon: '👥', color: '#A855F7' },
              { label: 'Views totales', value: formatNum(totalViews), icon: '👁️', color: '#34D399' },
              { label: 'Revenue mensual', value: `$${totalRevenue.toLocaleString()}`, icon: '💰', color: '#F59E0B' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-xborder" style={{ background: '#0D0D1F' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                </div>
                <p className="font-display font-bold text-xl text-white">{s.value}</p>
                <p className="text-xmuted text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex items-center bg-surface2 rounded-xl p-1 border border-xborder">
              {[{ id: 'all', label: 'Todas' }, { id: 'tiktok', label: 'TikTok' }, { id: 'instagram', label: 'Instagram' }, { id: 'youtube', label: 'YouTube' }].map(f => (
                <button key={f.id} onClick={() => setFilterPlatform(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                    ${filterPlatform === f.id ? 'bg-surface text-white border border-xborder' : 'text-xmuted hover:text-white'}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-surface2 rounded-xl p-1 border border-xborder">
              {[{ id: 'all', label: 'Todos los estados' }, { id: 'active', label: 'Activas' }, { id: 'paused', label: 'Pausadas' }, { id: 'warming', label: 'Calentando' }].map(f => (
                <button key={f.id} onClick={() => setFilterStatus(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                    ${filterStatus === f.id ? 'bg-surface text-white border border-xborder' : 'text-xmuted hover:text-white'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accounts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(cuenta => {
              const pm = platformMeta[cuenta.platform]
              const sm = statusMeta[cuenta.status]
              const isPositive = cuenta.growth.startsWith('+')

              return (
                <div key={cuenta.id}
                  className="rounded-2xl border border-xborder hover:border-xgreen/30 transition-all duration-200 overflow-hidden group"
                  style={{ background: '#0D0D1F' }}>
                  {/* Header */}
                  <div className="p-5 border-b border-xborder">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: pm.bg }}>
                          {pm.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{cuenta.username}</p>
                          <p className="text-xs" style={{ color: pm.color }}>{pm.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
                        style={{ color: sm.color, background: sm.color + '15' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sm.dot }} />
                        {sm.label}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display font-bold text-2xl text-white">{formatNum(cuenta.followers)}</p>
                        <p className="text-xmuted text-xs">seguidores</p>
                      </div>
                      <span className={`text-sm font-bold ${isPositive ? 'text-xgreen' : 'text-red-400'}`}>
                        {cuenta.growth}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 divide-x divide-xborder border-b border-xborder">
                    {[
                      { label: 'Clips', value: cuenta.clipsPosted },
                      { label: 'Views', value: formatNum(cuenta.totalViews) },
                      { label: 'Revenue', value: `$${cuenta.monthlyRevenue}` },
                    ].map(s => (
                      <div key={s.label} className="p-3 text-center">
                        <p className="font-bold text-white text-sm">{s.value}</p>
                        <p className="text-xmuted text-xs">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-xmuted text-xs">Último post: {cuenta.lastPost}</span>
                    <div className="flex gap-2">
                      <button className="px-2.5 py-1 text-xs border border-xborder rounded-lg text-xmuted hover:text-white hover:border-xmuted transition-all">
                        {cuenta.status === 'paused' ? 'Activar' : 'Pausar'}
                      </button>
                      <button className="px-2.5 py-1 text-xs border border-xborder rounded-lg text-xmuted hover:text-white hover:border-xmuted transition-all">
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add account */}
            <button className="rounded-2xl border-2 border-dashed border-xborder hover:border-xgreen/40 transition-all duration-200 p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
              <div className="w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center text-xmuted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Conectar nueva cuenta</p>
                <p className="text-xmuted text-xs">TikTok, Instagram, YouTube y más</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
