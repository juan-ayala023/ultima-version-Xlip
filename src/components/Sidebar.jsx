import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../api/client'
import { usePreferences } from '../lib/preferences'

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Mis clips',
    path: '/clips',
    badge: '5',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    label: 'Proyectos',
    path: '/proyectos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Cuentas',
    path: '/cuentas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

const bottomItems = [
  {
    label: 'Planes',
    path: '/planes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: 'Configuración',
    path: '/configuracion',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [prefs] = usePreferences()

  const displayName = prefs.profile.name || user?.email || 'Sesión activa'
  const planLabel = user?.plan_id ? String(user.plan_id).toUpperCase() : 'Pro'
  const initial = (user?.email?.[0] || 'U').toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 border-r border-xborder flex flex-col"
      style={{ background: '#08081A' }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-xborder">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-sm text-bg glow-green"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            X
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">XLIP</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard')
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-xgreen/10 text-xgreen border border-xgreen/20'
                  : 'text-xmuted hover:text-white hover:bg-surface'}`}>
              <span className={isActive ? 'text-xgreen' : ''}>{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="ml-auto text-xs bg-xgreen/20 text-xgreen px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Plan badge */}
      <div className="mx-3 mb-3 p-3 rounded-xl border border-xborder bg-surface">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-xmuted uppercase tracking-wider">Plan actual</span>
          <span className="text-xs font-bold text-xpurple">PRO</span>
        </div>
        <div className="w-full h-1 bg-xborder rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full" style={{ width: '62%', background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
        </div>
        <p className="text-xs text-xmuted">124 / 200 clips usados</p>
      </div>

      {/* Bottom items */}
      <div className="px-3 pb-4 flex flex-col gap-0.5 border-t border-xborder pt-3">
        {bottomItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-xgreen/10 text-xgreen'
                  : 'text-xmuted hover:text-white hover:bg-surface'}`}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}

        {/* User */}
        <Link to="/perfil"
          className={`flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl transition-colors
            ${location.pathname === '/perfil' ? 'bg-xgreen/10' : 'hover:bg-surface'}`}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #10B981, #A855F7)' }}>
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-xmuted">{planLabel}</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLogout() }}
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-xmuted hover:text-white hover:bg-surface transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </Link>
      </div>
    </aside>
  )
}
