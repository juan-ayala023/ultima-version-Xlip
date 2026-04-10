import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const steps = [
  {
    num: '01',
    title: 'Captura de contenido',
    desc: 'Identificamos streamers, podcasts, marcas y empresas. Analizamos horas de contenido largo de forma automática.',
    icon: '📡',
    color: '#10B981',
  },
  {
    num: '02',
    title: 'Selección de momentos',
    desc: 'La IA detecta los fragmentos virales y de alto engagement. Prioriza momentos con máximo potencial de retención.',
    icon: '🎯',
    color: '#34D399',
  },
  {
    num: '03',
    title: 'Edición automática',
    desc: 'Genera clips optimizados para cada red social. Subtítulos animados, cortes dinámicos y formatos virales.',
    icon: '✂️',
    color: '#A855F7',
  },
  {
    num: '04',
    title: 'Distribución masiva',
    desc: 'Publica en TikTok, Reels, Shorts y más plataformas. Gestiona múltiples cuentas de forma completamente automática.',
    icon: '🚀',
    color: '#7C3AED',
  },
  {
    num: '05',
    title: 'Monetización',
    desc: 'Genera ingresos por views. Cierra contratos con creadores y marcas. Escala las cuentas exitosas a escala masiva.',
    icon: '💰',
    color: '#10B981',
  },
]

const stats = [
  { value: '4.7M+', label: 'Views generados' },
  { value: '1,284', label: 'Clips procesados' },
  { value: '37', label: 'Cuentas activas' },
  { value: '$8.4K', label: 'Revenue mensual' },
]

const features = [
  { icon: '🧠', title: 'IA entrenada en viralidad', desc: 'Modelos especializados en detectar los momentos que la gente comparte.' },
  { icon: '⚡', title: 'Procesamiento en minutos', desc: 'Una hora de contenido analizada y clippeada en menos de 5 minutos.' },
  { icon: '📱', title: 'Multi-plataforma nativo', desc: 'Optimizado para TikTok, Instagram Reels, YouTube Shorts y más.' },
  { icon: '🔄', title: 'Distribución automática', desc: 'Publica solo o en automático. La máquina trabaja mientras dormís.' },
  { icon: '📊', title: 'Analytics en tiempo real', desc: 'Ve el rendimiento de cada clip y optimiza tu estrategia de contenido.' },
  { icon: '💸', title: 'Monetización integrada', desc: 'Sistema de contratos y revenue tracking integrado en la plataforma.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg text-white overflow-x-hidden">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 grid-bg radial-glow pt-16">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #10B981, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, #A855F7, transparent)' }} />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-xgreen/30 bg-xgreen/5 text-xgreen text-xs font-mono mb-8 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-xgreen animate-pulse" />
            ⚡ IA-POWERED CLIPPING MACHINE
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white leading-none mb-4 animate-fade-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both', opacity: 0 }}>
            CONVIERTE
            <br />
            CONTENIDO
          </h1>
          <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-none mb-8 animate-fade-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both', opacity: 0 }}>
            <span className="gradient-text">EN DINERO LÍQUIDO.</span>
          </h2>

          {/* Description */}
          <p className="text-xmuted text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both', opacity: 0 }}>
            XLIP es la red automatizada de clipping viral. Extraemos el valor de tus videos largos,
            los transformamos con IA y monetizamos el engagement a escala masiva.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both', opacity: 0 }}>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold text-base text-bg hover:opacity-90 active:scale-95 transition-all duration-200 glow-green-strong"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              Encender la máquina
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white border border-xborder hover:border-xmuted transition-all duration-200">
              Ver demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mock terminal / dashboard preview */}
        <div className="relative max-w-4xl w-full mx-auto mt-16 animate-fade-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both', opacity: 0 }}>
          <div className="rounded-2xl border border-xborder overflow-hidden" style={{ background: '#08081A' }}>
            {/* Terminal bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-xborder">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-xgreen/80" />
              </div>
              <span className="text-xmuted text-xs font-mono ml-2">XLIP_OS_V4.2.0 // STATUS: RUNNING_OPTIMIZED</span>
              <div className="ml-auto flex items-center gap-1 text-xgreen text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-xgreen animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-xborder">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-3 rounded-xl border border-xborder bg-surface">
                  <p className="font-display font-bold text-xl gradient-text">{s.value}</p>
                  <p className="text-xmuted text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Mock clips list */}
            <div className="p-4 space-y-2">
              {[
                { title: 'clutch_imposible_sec14', score: 97.3, status: 'completed', width: '100%' },
                { title: 'momento_viral_sec32', score: 94.1, status: 'completed', width: '100%' },
                { title: 'explosion_live_sec62', score: 91.8, status: 'processing', width: '67%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-xborder bg-surface">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: item.status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.15)' }}>
                    {item.status === 'completed' ? '✅' : '⚡'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-white truncate">{item.title}</p>
                    {item.status === 'processing' && (
                      <div className="mt-1 h-0.5 w-full bg-xborder rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: item.width, background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: '#10B981' }}>⚡{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Glow under card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-2xl opacity-30 rounded-full"
            style={{ background: 'linear-gradient(90deg, #10B981, #A855F7)' }} />
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-xborder py-10 px-6" style={{ background: '#08081A' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="font-display font-black text-3xl gradient-text">{s.value}</p>
              <p className="text-xmuted text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full border border-xpurple/30 bg-xpurple/5 text-xpurple text-xs font-mono mb-4">
              PROCESO
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4">
              La máquina en acción
            </h2>
            <p className="text-xmuted max-w-md mx-auto">
              Cinco etapas completamente automatizadas. De contenido largo a dinero en el banco.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: 'linear-gradient(180deg, #10B981, #A855F7, transparent)' }} />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i}
                  className={`relative flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'} pl-14 sm:pl-0`}>
                    <div className={`inline-block p-5 rounded-2xl border border-xborder hover:border-xmuted transition-all duration-200`}
                      style={{ background: '#0D0D1F' }}>
                      <div className={`flex items-center gap-3 mb-2 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                        <span className="text-2xl">{step.icon}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: step.color }}>{step.num}</span>
                      </div>
                      <h3 className="font-display font-bold text-white text-base mb-1">{step.title}</h3>
                      <p className="text-xmuted text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-bg mt-5"
                    style={{ background: step.color, boxShadow: `0 0 12px ${step.color}66` }} />

                  {/* Empty side */}
                  <div className="hidden sm:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tecnología */}
      <section id="tecnologia" className="py-24 px-6 border-t border-xborder" style={{ background: '#08081A' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full border border-xgreen/30 bg-xgreen/5 text-xgreen text-xs font-mono mb-4">
              TECNOLOGÍA
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white mb-4">
              Agentes de IA especializados
            </h2>
            <p className="text-xmuted max-w-md mx-auto">
              Cada etapa del proceso tiene un agente dedicado. Trabajan en paralelo, aprenden y escalan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i}
                className="p-5 rounded-2xl border border-xborder hover:border-xgreen/30 transition-all duration-200 group"
                style={{ background: '#060610' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 bg-surface group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-xmuted text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monetización */}
      <section id="monetizacion" className="py-24 px-6 border-t border-xborder">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full border border-xpurple/30 bg-xpurple/5 text-xpurple text-xs font-mono mb-6">
                MONETIZACIÓN
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-white leading-tight mb-6">
                Dinero mientras
                <br />
                <span className="gradient-text">dormís.</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: '👁️', title: 'Ingresos por views', desc: 'Cada vista genera revenue directo. Sin intermediarios, sin esperas.' },
                  { icon: '🤝', title: 'Contratos con creadores', desc: 'Conectamos con streamers y marcas que necesitan distribución.' },
                  { icon: '📈', title: 'Escalamiento automático', desc: 'Las cuentas exitosas se escalan solas. La máquina decide cuándo y cómo.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-xborder hover:border-xmuted transition-all"
                    style={{ background: '#0D0D1F' }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-xmuted text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue mock */}
            <div className="rounded-2xl border border-xborder overflow-hidden" style={{ background: '#0D0D1F' }}>
              <div className="p-5 border-b border-xborder">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Revenue del mes</span>
                  <span className="text-xs font-mono text-xgreen bg-xgreen/10 px-2 py-0.5 rounded-full">+34% vs anterior</span>
                </div>
                <p className="font-display font-black text-4xl gradient-text mt-2">$8,420</p>
                <p className="text-xmuted text-xs mt-1">USD · Abril 2026</p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { source: 'TikTok views', amount: '$3,840', pct: 46 },
                  { source: 'Contratos creadores', amount: '$2,920', pct: 35 },
                  { source: 'YouTube Shorts', amount: '$1,660', pct: 19 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-xmuted">{item.source}</span>
                      <span className="text-white font-semibold">{item.amount}</span>
                    </div>
                    <div className="h-1.5 bg-xborder rounded-full overflow-hidden">
                      <div className="h-full rounded-full progress-fill" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-xborder" style={{ background: '#08081A' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-black text-4xl sm:text-6xl text-white mb-6">
            La máquina
            <br />
            <span className="gradient-text">te espera.</span>
          </h2>
          <p className="text-xmuted mb-10 max-w-md mx-auto">
            Cada hora que pasa sin XLIP es contenido viral que se pierde. Empezá ahora.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-10 py-5 rounded-2xl font-display font-bold text-lg text-bg hover:opacity-90 active:scale-95 transition-all duration-200 glow-green-strong"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            Comenzar gratis →
          </button>
          <p className="text-xmuted text-xs mt-4">Sin tarjeta de crédito · Setup en 2 minutos</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-xborder py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center font-display font-black text-xs text-bg"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              X
            </div>
            <span className="font-display font-bold text-white text-sm">XLIP</span>
          </div>
          <p className="text-xmuted text-xs">© 2026 XLIP · IA-Powered Clipping Machine</p>
          <div className="flex gap-5">
            {['Privacidad', 'Términos', 'Contacto'].map(l => (
              <a key={l} href="#" className="text-xmuted text-xs hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
