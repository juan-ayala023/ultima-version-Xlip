import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { plans } from '../data/mockData'

export default function Subscriptions() {
  const [billing, setBilling] = useState('monthly')
  const navigate = useNavigate()

  const prices = {
    starter: { monthly: 29, annual: 23 },
    pro: { monthly: 79, annual: 63 },
    agency: { monthly: 249, annual: 199 },
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />

      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-14 flex items-center px-6 border-b border-xborder glass">
          <h1 className="font-display font-bold text-base text-white">Planes</h1>
        </div>

        <div className="p-6 lg:p-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">
              Elegí tu plan
            </h2>
            <p className="text-xmuted max-w-md mx-auto text-sm mb-6">
              Sin contratos. Cancelá cuando quieras. Escala cuando lo necesites.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center bg-surface2 rounded-xl p-1 border border-xborder">
              {[
                { id: 'monthly', label: 'Mensual' },
                { id: 'annual', label: 'Anual · -20%' },
              ].map(b => (
                <button key={b.id} onClick={() => setBilling(b.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
                    ${billing === b.id
                      ? 'bg-surface text-white border border-xborder'
                      : 'text-xmuted hover:text-white'}`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => {
              const price = prices[plan.id][billing]
              const isPopular = plan.popular

              return (
                <div key={plan.id}
                  className={`relative rounded-2xl border overflow-hidden transition-all duration-200 hover:scale-[1.02]
                    ${isPopular ? 'border-xpurple/50' : 'border-xborder'}`}
                  style={{ background: isPopular ? 'linear-gradient(180deg, #1A0D2E 0%, #0D0D1F 100%)' : '#0D0D1F' }}>

                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: 'linear-gradient(90deg, #A855F7, #10B981)' }} />
                  )}
                  {isPopular && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)', color: 'white' }}>
                      Más popular
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan header */}
                    <div className="mb-6">
                      <h3 className="font-display font-bold text-white text-lg mb-1">{plan.name}</h3>
                      <p className="text-xmuted text-xs">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span className="font-display font-black text-4xl text-white">${price}</span>
                        <span className="text-xmuted text-sm mb-1">/{plan.period}</span>
                      </div>
                      {billing === 'annual' && (
                        <p className="text-xgreen text-xs mt-1">
                          Ahorrás ${(prices[plan.id].monthly - price) * 12}/año
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => navigate('/dashboard')}
                      className={`w-full py-3 rounded-xl font-semibold text-sm mb-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98]
                        ${isPopular
                          ? 'text-white glow-purple'
                          : 'border border-xborder text-white hover:border-xmuted'}`}
                      style={isPopular ? { background: 'linear-gradient(135deg, #A855F7, #7C3AED)' } : undefined}>
                      {isPopular ? '⚡ Comenzar con Pro' : 'Seleccionar'}
                    </button>

                    {/* Features */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-xmuted uppercase tracking-wider mb-3">Incluye</p>
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-sm text-white">{f}</span>
                        </div>
                      ))}
                      {plan.limits.map((l, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                          <span className="text-sm text-xmuted">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h3 className="font-display font-bold text-xl text-white text-center mb-8">Preguntas frecuentes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {[
                { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí. El cambio se aplica inmediatamente y se proratea el costo.' },
                { q: '¿Qué plataformas son compatibles?', a: 'TikTok, Instagram Reels, YouTube Shorts, Twitter/X, LinkedIn y más.' },
                { q: '¿Cómo funciona el período de prueba?', a: 'Tenés 7 días gratis en cualquier plan. Sin tarjeta requerida.' },
                { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. Sin cargos ocultos ni períodos de permanencia mínima.' },
              ].map((faq, i) => (
                <div key={i} className="p-5 rounded-xl border border-xborder" style={{ background: '#0D0D1F' }}>
                  <h4 className="font-semibold text-white text-sm mb-2">{faq.q}</h4>
                  <p className="text-xmuted text-xs leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
