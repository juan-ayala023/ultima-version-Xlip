import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', connected: true, accounts: 3 },
  { id: 'instagram', name: 'Instagram Reels', icon: '📸', connected: true, accounts: 2 },
  { id: 'youtube', name: 'YouTube Shorts', icon: '▶️', connected: false, accounts: 0 },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', connected: false, accounts: 0 },
]

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-5.5 rounded-full flex items-center px-0.5 transition-all duration-200 flex-shrink-0 border`}
      style={{
        width: '40px',
        height: '22px',
        background: value ? '#10B981' : '#1E1E3A',
        borderColor: value ? '#10B981' : '#1E1E3A',
      }}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </button>
  )
}

export default function Settings() {
  const [prefs, setPrefs] = useState({
    autoPublish: false,
    emailNotifications: true,
    processingNotifications: true,
    weeklyReport: true,
    autoSubtitles: true,
    faceTracking: true,
    watermark: false,
    highQuality: true,
  })

  const [profile, setProfile] = useState({
    name: '',
    email: 'usuario@xlip.io',
    company: '',
  })

  function toggle(key) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-14 flex items-center px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Configuración</h1>
        </div>

        <div className="p-6 lg:p-8 max-w-3xl">
          <div className="space-y-6">

            {/* Profile */}
            <Section title="Perfil" icon="👤">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-xborder bg-surface2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #10B981, #A855F7)' }}>
                    U
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{profile.email}</p>
                    <p className="text-xmuted text-xs">Plan Pro · Activo</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium border border-xborder rounded-lg text-xmuted hover:text-white hover:border-xmuted transition-all">
                    Editar
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Nombre', key: 'name', placeholder: 'Tu nombre' },
                    { label: 'Empresa', key: 'company', placeholder: 'Tu empresa (opcional)' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs text-xmuted font-medium block mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        value={profile[field.key]}
                        onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-surface2 border border-xborder rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-xmuted/40 focus:outline-none focus:border-xgreen transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Plataformas conectadas */}
            <Section title="Plataformas conectadas" icon="🔗">
              <div className="space-y-2">
                {platforms.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl border border-xborder bg-surface2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{p.name}</p>
                        <p className="text-xs text-xmuted">
                          {p.connected ? `${p.accounts} cuenta${p.accounts !== 1 ? 's' : ''} conectada${p.accounts !== 1 ? 's' : ''}` : 'No conectado'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.connected && (
                        <span className="flex items-center gap-1 text-xs text-xgreen">
                          <span className="w-1.5 h-1.5 rounded-full bg-xgreen" />
                          Activo
                        </span>
                      )}
                      <button className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150
                        ${p.connected
                          ? 'border border-red-400/30 text-red-400 hover:bg-red-400/10'
                          : 'text-bg hover:opacity-90'}`}
                        style={!p.connected ? { background: 'linear-gradient(135deg, #10B981, #059669)' } : undefined}>
                        {p.connected ? 'Desconectar' : 'Conectar'}
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full p-3 rounded-xl border border-dashed border-xborder text-xmuted text-sm hover:border-xmuted hover:text-white transition-all text-center">
                  + Agregar nueva plataforma
                </button>
              </div>
            </Section>

            {/* Publicación automática */}
            <Section title="Publicación automática" icon="🚀">
              <div className="space-y-2">
                {[
                  { key: 'autoPublish', label: 'Publicar clips automáticamente', desc: 'Los clips aprobados se publican solos en todas las plataformas conectadas' },
                ].map(item => (
                  <ToggleRow key={item.key} {...item} value={prefs[item.key]} onChange={() => toggle(item.key)} />
                ))}

                {prefs.autoPublish && (
                  <div className="mt-3 p-3 rounded-xl bg-xgreen/5 border border-xgreen/20 text-xs text-xgreen">
                    ⚡ La publicación automática está activa. Los clips con score ≥ 85 se publicarán sin revisión manual.
                  </div>
                )}
              </div>
            </Section>

            {/* Notificaciones */}
            <Section title="Notificaciones" icon="🔔">
              <div className="space-y-2">
                {[
                  { key: 'emailNotifications', label: 'Notificaciones por email', desc: 'Recibí un resumen de actividad diaria' },
                  { key: 'processingNotifications', label: 'Clips procesados', desc: 'Notificación cuando un clip está listo' },
                  { key: 'weeklyReport', label: 'Reporte semanal', desc: 'Resumen de performance cada lunes' },
                ].map(item => (
                  <ToggleRow key={item.key} {...item} value={prefs[item.key]} onChange={() => toggle(item.key)} />
                ))}
              </div>
            </Section>

            {/* Configuración de clips */}
            <Section title="Configuración de clips" icon="🎬">
              <div className="space-y-2">
                {[
                  { key: 'autoSubtitles', label: 'Subtítulos automáticos por defecto', desc: 'Activa subtítulos en todos los clips nuevos' },
                  { key: 'faceTracking', label: 'Face tracking por defecto', desc: 'Encuadre automático del rostro principal' },
                  { key: 'watermark', label: 'Marca de agua XLIP', desc: 'Añadir watermark en clips no verificados' },
                  { key: 'highQuality', label: 'Exportación en alta calidad', desc: '4K cuando esté disponible · consume más créditos' },
                ].map(item => (
                  <ToggleRow key={item.key} {...item} value={prefs[item.key]} onChange={() => toggle(item.key)} />
                ))}
              </div>
            </Section>

            {/* Danger zone */}
            <Section title="Zona de peligro" icon="⚠️" danger>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-red-400/20 bg-red-400/5">
                  <div>
                    <p className="text-sm font-medium text-white">Eliminar todos los clips</p>
                    <p className="text-xs text-xmuted">Esta acción no se puede deshacer</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold border border-red-400/40 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    Eliminar
                  </button>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-red-400/20 bg-red-400/5">
                  <div>
                    <p className="text-sm font-medium text-white">Cancelar suscripción</p>
                    <p className="text-xs text-xmuted">Tu plan se mantiene hasta fin del período actual</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold border border-red-400/40 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    Cancelar
                  </button>
                </div>
              </div>
            </Section>

            {/* Save button */}
            <div className="flex justify-end">
              <button className="px-6 py-3 rounded-xl font-semibold text-sm text-bg hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Section({ title, icon, children, danger }) {
  return (
    <div className={`rounded-2xl border overflow-hidden ${danger ? 'border-red-400/20' : 'border-xborder'}`}
      style={{ background: '#0D0D1F' }}>
      <div className={`px-5 py-4 border-b ${danger ? 'border-red-400/20' : 'border-xborder'}`}>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <span>{icon}</span>
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-xborder bg-surface2 hover:bg-surface transition-colors cursor-pointer"
      onClick={onChange}>
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-xmuted mt-0.5">{desc}</p>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}
