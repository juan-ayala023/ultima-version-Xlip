import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login, createUser } from '../api/client'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [planId, setPlanId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'register') {
        await createUser({ email, password, plan_id: planId || undefined })
      }
      await login({ username: email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-white flex items-center justify-center px-6 grid-bg radial-glow">
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A855F7, transparent)' }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-base text-bg glow-green"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            X
          </div>
          <span className="font-display font-bold text-white text-2xl tracking-tight">XLIP</span>
        </Link>

        <div className="rounded-2xl border border-xborder p-8" style={{ background: '#0D0D1F' }}>
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 mb-6 rounded-xl border border-xborder bg-surface">
            <button type="button"
              onClick={() => { setMode('login'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-xgreen/10 text-xgreen border border-xgreen/20' : 'text-xmuted hover:text-white'
              }`}>
              Iniciar sesión
            </button>
            <button type="button"
              onClick={() => { setMode('register'); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-xgreen/10 text-xgreen border border-xgreen/20' : 'text-xmuted hover:text-white'
              }`}>
              Registrarse
            </button>
          </div>

          <h1 className="font-display font-black text-2xl text-white mb-1">
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h1>
          <p className="text-xmuted text-sm mb-6">
            {mode === 'login'
              ? 'Ingresá para encender la máquina.'
              : 'Unite a XLIP y empezá a clipear.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-xmuted uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-xborder focus:border-xgreen/50 focus:outline-none text-white text-sm placeholder:text-xmuted transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-xmuted uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-xborder focus:border-xgreen/50 focus:outline-none text-white text-sm placeholder:text-xmuted transition-colors"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-xmuted uppercase tracking-wider mb-1.5">
                  Plan ID <span className="text-xmuted/60 normal-case">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  placeholder="free / pro / ..."
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-xborder focus:border-xgreen/50 focus:outline-none text-white text-sm placeholder:text-xmuted transition-colors"
                />
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-6 py-3 rounded-xl font-display font-bold text-sm text-bg hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed glow-green"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              {loading
                ? 'Procesando...'
                : mode === 'login' ? 'Entrar' : 'Crear cuenta e iniciar sesión'}
            </button>
          </form>

          <p className="text-xmuted text-xs text-center mt-6">
            {mode === 'login' ? '¿Todavía no tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
              className="text-xgreen hover:underline font-semibold">
              {mode === 'login' ? 'Registrate' : 'Iniciá sesión'}
            </button>
          </p>
        </div>

        <p className="text-center text-xmuted text-xs mt-6">
          © 2026 XLIP · IA-Powered Clipping Machine
        </p>
      </div>
    </div>
  )
}
