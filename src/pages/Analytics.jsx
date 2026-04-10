import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const ranges = [
  { id: '7d', label: '7 días' },
  { id: '30d', label: '30 días' },
  { id: '90d', label: '90 días' },
]

// Mock bar chart data
const viewsData = [420, 680, 520, 940, 1100, 780, 1340, 890, 1560, 1240, 1800, 2100, 1700, 2400]
const revenueData = [120, 210, 160, 290, 340, 240, 410, 270, 480, 380, 550, 640, 520, 730]

function BarChart({ data, color, height = 80 }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
          style={{
            height: `${(v / max) * height}px`,
            background: `linear-gradient(180deg, ${color}, ${color}66)`,
            minHeight: '3px',
          }}
          title={v.toLocaleString()} />
      ))}
    </div>
  )
}

const topClips = [
  { title: 'Reacción épica al clutch imposible', views: 342000, platform: 'tiktok', score: 97.3, revenue: '$284' },
  { title: 'Momento de quiebre emocional brutal', views: 218000, platform: 'reels', score: 94.1, revenue: '$181' },
  { title: 'Tutorial que nadie esperaba', views: 187000, platform: 'shorts', score: 88.5, revenue: '$155' },
  { title: 'Discusión en vivo que explota', views: 143000, platform: 'tiktok', score: 91.8, revenue: '$119' },
  { title: 'El momento que todos van a compartir', views: 98000, platform: 'reels', score: 86.2, revenue: '$81' },
]

const platformStats = [
  { name: 'TikTok', views: 2100000, clips: 47, revenue: 3840, color: '#69C9D0', pct: 45 },
  { name: 'Instagram Reels', views: 1350000, clips: 28, revenue: 2920, color: '#E1306C', pct: 29 },
  { name: 'YouTube Shorts', views: 890000, clips: 31, revenue: 1660, color: '#FF0000', pct: 19 },
  { name: 'Twitter/X', views: 360000, clips: 12, revenue: 0, color: '#ffffff', pct: 7 },
]

export default function Analytics() {
  const [range, setRange] = useState('30d')

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Analytics</h1>
          <div className="flex items-center bg-surface2 rounded-xl p-1 border border-xborder">
            {ranges.map(r => (
              <button key={r.id} onClick={() => setRange(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                  ${range === r.id ? 'bg-surface text-white border border-xborder' : 'text-xmuted hover:text-white'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Views totales', value: '4.7M', change: '+18%', icon: '👁️', color: '#10B981' },
              { label: 'Clips publicados', value: '118', change: '+12', icon: '🎬', color: '#A855F7' },
              { label: 'Revenue generado', value: '$8,420', change: '+34%', icon: '💰', color: '#F59E0B' },
              { label: 'Engagement promedio', value: '91.2', change: '+2.4', icon: '⚡', color: '#34D399' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-xborder" style={{ background: '#0D0D1F' }}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ color: s.color, background: s.color + '15' }}>
                    {s.change}
                  </span>
                </div>
                <p className="font-display font-bold text-2xl text-white">{s.value}</p>
                <p className="text-xmuted text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Views chart */}
            <div className="rounded-2xl border border-xborder p-5" style={{ background: '#0D0D1F' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Views por día</h3>
                  <p className="text-xmuted text-xs mt-0.5">Últimos {range === '7d' ? 7 : range === '30d' ? 30 : 90} días</p>
                </div>
                <span className="font-display font-bold text-xl text-xgreen">4.7M</span>
              </div>
              <BarChart data={viewsData} color="#10B981" />
              <div className="flex justify-between text-xs text-xmuted mt-2">
                <span>Hace {range === '7d' ? '7d' : range === '30d' ? '30d' : '90d'}</span>
                <span>Hoy</span>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="rounded-2xl border border-xborder p-5" style={{ background: '#0D0D1F' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Revenue por día</h3>
                  <p className="text-xmuted text-xs mt-0.5">USD · estimado</p>
                </div>
                <span className="font-display font-bold text-xl text-xpurple">$8,420</span>
              </div>
              <BarChart data={revenueData} color="#A855F7" />
              <div className="flex justify-between text-xs text-xmuted mt-2">
                <span>Hace {range === '7d' ? '7d' : range === '30d' ? '30d' : '90d'}</span>
                <span>Hoy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
            {/* Top clips */}
            <div className="rounded-2xl border border-xborder overflow-hidden" style={{ background: '#0D0D1F' }}>
              <div className="px-5 py-4 border-b border-xborder">
                <h3 className="text-sm font-semibold text-white">Top clips del período</h3>
              </div>
              <div className="divide-y divide-xborder">
                {topClips.map((clip, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors cursor-pointer">
                    <span className="text-xmuted text-xs font-mono w-4 flex-shrink-0">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{clip.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-xmuted capitalize">{clip.platform}</span>
                        <span className="text-xs text-xmuted">·</span>
                        <span className="text-xs font-mono font-bold" style={{ color: '#10B981' }}>⚡{clip.score}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-white">{(clip.views / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-xmuted">{clip.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform breakdown */}
            <div className="rounded-2xl border border-xborder p-5" style={{ background: '#0D0D1F' }}>
              <h3 className="text-sm font-semibold text-white mb-5">Por plataforma</h3>
              <div className="space-y-4">
                {platformStats.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-white">{p.name}</span>
                      <span className="text-xmuted">{p.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-xborder rounded-full overflow-hidden mb-1.5">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-xmuted">
                      <span>{(p.views / 1000000).toFixed(1)}M views</span>
                      <span>{p.clips} clips</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue breakdown */}
              <div className="mt-6 pt-5 border-t border-xborder">
                <h4 className="text-xs font-semibold text-xmuted uppercase tracking-wider mb-4">Revenue por plataforma</h4>
                <div className="space-y-3">
                  {platformStats.filter(p => p.revenue > 0).map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-white">{p.name}</span>
                      <span className="font-mono font-bold text-sm text-white">${p.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-xborder">
                    <span className="text-sm font-semibold text-white">Total</span>
                    <span className="font-display font-bold text-base gradient-text">
                      ${platformStats.reduce((a, p) => a + p.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
