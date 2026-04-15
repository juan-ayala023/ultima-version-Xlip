import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getCurrentUser, logout } from '../api/client'
import { usePreferences } from '../lib/preferences'

function formatDate(ts) {
  if (!ts) return '—'
  try { return new Date(ts * 1000).toLocaleString() } catch { return '—' }
}

export default function Profile() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [prefs, updatePrefs] = usePreferences()

  const initial = (user?.email?.[0] || 'U').toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        <div className="sticky top-0 z-30 h-14 flex items-center px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Perfil</h1>
        </div>

        <div className="p-6 lg:p-8 max-w-3xl">
          <div className="space-y-6">
            {/* Card principal */}
            <div className="rounded-2xl border border-xborder overflow-hidden" style={{ background: '#0D0D1F' }}>
              <div className="p-6 flex items-center gap-5 border-b border-xborder">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #10B981, #A855F7)' }}>
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-lg truncate">
                    {prefs.profile.name || user?.email || 'Usuario'}
                  </p>
                  <p className="text-xmuted text-sm truncate">{user?.email || '—'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full border border-xgreen/30 bg-xgreen/5 text-xgreen">
                      <span className="w-1.5 h-1.5 rounded-full bg-xgreen animate-pulse" />
                      Sesión activa
                    </span>
                    {user?.plan_id && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-xpurple/30 bg-xpurple/5 text-xpurple">
                        Plan {String(user.plan_id).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Datos locales editables */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nombre', key: 'name', placeholder: 'Tu nombre' },
                  { label: 'Empresa', key: 'company', placeholder: 'Tu empresa (opcional)' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-xmuted font-medium block mb-1.5">{field.label}</label>
                    <input
                      type="text"
                      value={prefs.profile[field.key]}
                      onChange={(e) => updatePrefs({ profile: { [field.key]: e.target.value } })}
                      placeholder={field.placeholder}
                      className="w-full bg-surface2 border border-xborder rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-xmuted/40 focus:outline-none focus:border-xgreen transition-colors"
                    />
                  </div>
                ))}
                <p className="sm:col-span-2 text-xs text-xmuted">
                  Estos datos se guardan solo en este navegador.
                </p>
              </div>
            </div>

            {/* Detalles de sesión */}
            <div className="rounded-2xl border border-xborder overflow-hidden" style={{ background: '#0D0D1F' }}>
              <div className="px-5 py-4 border-b border-xborder">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span>🔐</span> Sesión
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <InfoRow label="Email" value={user?.email || '—'} />
                <InfoRow label="User ID" value={user?.user_id || '—'} mono />
                <InfoRow label="Plan" value={user?.plan_id ?? '—'} />
                <InfoRow label="Emitido" value={formatDate(user?.iat)} />
                <InfoRow label="Expira" value={formatDate(user?.exp)} />
              </div>
            </div>

            {/* Acciones */}
            <div className="rounded-2xl border border-red-400/20 overflow-hidden" style={{ background: '#0D0D1F' }}>
              <div className="px-5 py-4 border-b border-red-400/20">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span>⚠️</span> Acciones
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-red-400/20 bg-red-400/5">
                  <div>
                    <p className="text-sm font-medium text-white">Cerrar sesión</p>
                    <p className="text-xs text-xmuted">Vas a necesitar iniciar sesión de nuevo.</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs font-semibold border border-red-400/40 text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="p-3 rounded-xl border border-xborder bg-surface2">
      <p className="text-xs text-xmuted mb-1">{label}</p>
      <p className={`text-white text-sm break-all ${mono ? 'font-mono' : ''}`}>{String(value)}</p>
    </div>
  )
}
