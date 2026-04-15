import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar({ transparent = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${transparent ? '' : 'border-b border-xborder'}`}
      style={{ background: transparent ? 'transparent' : 'rgba(6,6,16,0.9)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-sm text-bg glow-green"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            X
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">XLIP</span>
        </Link>

        {/* Desktop nav */}
        {isLanding && (
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Proceso', href: '#proceso' },
              { label: 'Tecnología', href: '#tecnologia' },
              { label: 'Monetización', href: '#monetizacion' },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="text-sm text-xmuted hover:text-white transition-colors duration-200 font-medium">
                {item.label}
              </a>
            ))}
          </div>
        )}

        {!isLanding && (
          <div className="hidden md:flex items-center gap-2">
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Planes', path: '/planes' },
              { label: 'Configuración', path: '/configuracion' },
            ].map(item => (
              <Link key={item.path} to={item.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === item.path
                    ? 'bg-xborder text-white'
                    : 'text-xmuted hover:text-white hover:bg-surface'}`}>
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden md:block text-sm text-xmuted hover:text-white transition-colors font-medium">
            Login
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-bg transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            Comenzar
          </button>

          {/* Mobile menu button */}
          <button className="md:hidden p-1.5 rounded-lg text-xmuted hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <path d="M18 6L6 18M6 6l12 12" />
                : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-xborder bg-surface px-6 py-4 flex flex-col gap-3">
          {isLanding
            ? [
                { label: 'Proceso', href: '#proceso' },
                { label: 'Tecnología', href: '#tecnologia' },
                { label: 'Monetización', href: '#monetizacion' },
              ].map(item => (
                <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                  className="text-sm text-xmuted hover:text-white py-2 border-b border-xborder last:border-0">
                  {item.label}
                </a>
              ))
            : [
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Planes', path: '/planes' },
                { label: 'Configuración', path: '/configuracion' },
              ].map(item => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                  className="text-sm text-xmuted hover:text-white py-2 border-b border-xborder last:border-0">
                  {item.label}
                </Link>
              ))}
        </div>
      )}
    </nav>
  )
}
