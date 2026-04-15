import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getCurrentUser, getSupportData, logout } from '../api/client'
import { usePreferences } from '../lib/preferences'

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
      className="rounded-full flex items-center px-0.5 transition-all duration-200 flex-shrink-0 border"
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
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [prefs, updatePrefs] = usePreferences()
  const [support, setSupport] = useState(null)
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    let alive = true
    getSupportData()
      .then((data) => { if (alive) setSupport(data) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  function toggle(key) {
    updatePrefs({ toggles: { [key]: !prefs.toggles[key] } })
    flashSaved()
  }

  function setDefault(key, value) {
    updatePrefs({ defaults: { [key]: value } })
    flashSaved()
  }

  function flashSaved() {
    setSavedFlash(true)
    clearTimeout(flashSaved._t)
    flashSaved._t = setTimeout(() => setSavedFlash(false), 1500)
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const languages = support?.Languages ?? []
  const prompts = support?.Prompts ?? []
  const formats = support?.VideoFormats ?? []

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Configuración</h1>
          {savedFlash && (
            <span className="text-xs text-xgreen font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-xgreen animate-pulse" />
              Guardado
            </span>
          )}
        </div>

        <div className="p-6 lg:p-8 max-w-3xl">
          <div className="space-y-6">

            {/* Perfil (resumen) */}
            <Section title="Perfil" icon="👤">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-xborder bg-surface2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #10B981, #A855F7)' }}>
                  {(user?.email?.[0] || 'U').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user?.email || 'Sesión activa'}</p>
                  <p className="text-xmuted text-xs">
                    {user?.plan_id ? `Plan ${String(user.plan_id).toUpperCase()} · ` : ''}Activo
                  </p>
                </div>
                <button
                  onClick={() => navigate('/perfil')}
                  className="px-3 py-1.5 text-xs font-medium border border-xborder rounded-lg text-xmuted hover:text-white hover:border-xmuted transition-all">
                  Ver perfil
                </button>
              </div>
            </Section>

            {/* Valores por defecto */}
            <Section title="Valores por defecto" icon="🎛️">
              <p className="text-xs text-xmuted mb-4">
                Se aplican automáticamente cada vez que subís un video nuevo.
              </p>

              <div className="space-y-5">
                <PrefField label="Idioma">
                  <SelectGrid
                    items={languages}
                    valueKey="language_id"
                    labelKey="language"
                    selected={prefs.defaults.language_id}
                    onChange={(v) => setDefault('language_id', v)}
                    empty="Cargando idiomas..."
                  />
                </PrefField>

                <PrefField label="Formato">
                  <SelectGrid
                    items={formats}
                    valueKey="format_video"
                    labelKey="format_video"
                    selected={prefs.defaults.format}
                    onChange={(v) => setDefault('format', v)}
                    empty="Cargando formatos..."
                  />
                </PrefField>

                <PrefField label="Prompt / Trend">
                  <SelectGrid
                    items={prompts}
                    valueKey="prompt_id"
                    labelKey="trend_name"
                    selected={prefs.defaults.prompt_id}
                    onChange={(v) => setDefault('prompt_id', v)}
                    empty="Cargando prompts..."
                    wide
                  />
                </PrefField>
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
                <ToggleRow
                  label="Publicar clips automáticamente"
                  desc="Los clips aprobados se publican solos en todas las plataformas conectadas"
                  value={prefs.toggles.autoPublish}
                  onChange={() => toggle('autoPublish')}
                />
                {prefs.toggles.autoPublish && (
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
                  <ToggleRow key={item.key} {...item}
                    value={prefs.toggles[item.key]}
                    onChange={() => toggle(item.key)} />
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
                  <ToggleRow key={item.key} {...item}
                    value={prefs.toggles[item.key]}
                    onChange={() => toggle(item.key)} />
                ))}
              </div>
            </Section>

            {/* Sesión */}
            <Section title="Sesión" icon="⚠️" danger>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-red-400/20 bg-red-400/5">
                  <div>
                    <p className="text-sm font-medium text-white">Cerrar sesión</p>
                    <p className="text-xs text-xmuted">Vas a necesitar iniciar sesión de nuevo.</p>
                  </div>
                  <button onClick={handleLogout}
                    className="px-3 py-1.5 text-xs font-semibold border border-red-400/40 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    Logout
                  </button>
                </div>
              </div>
            </Section>
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

function PrefField({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-xmuted uppercase tracking-wider mb-2">{label}</p>
      {children}
    </div>
  )
}

function SelectGrid({ items, valueKey, labelKey, selected, onChange, empty, wide }) {
  if (!items || items.length === 0) {
    return <p className="text-xmuted text-xs">{empty}</p>
  }
  return (
    <div className={`grid gap-2 ${wide ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
      {items.map((item) => {
        const v = item[valueKey]
        const active = selected === v
        return (
          <button key={v} type="button" onClick={() => onChange(active ? null : v)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left truncate
              ${active
                ? 'border-xgreen/40 bg-xgreen/10 text-xgreen'
                : 'border-xborder bg-surface2 text-white hover:border-xmuted'}`}>
            {item[labelKey]}
          </button>
        )
      })}
    </div>
  )
}
