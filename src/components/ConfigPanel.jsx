import { useState } from 'react'
import { loadPrefs } from '../lib/preferences'

const clipDurations = [
  { value: 15, label: '15s', desc: 'Ultra corto' },
  { value: 30, label: '30s', desc: 'Corto' },
  { value: 60, label: '1 min', desc: 'Estándar' },
  { value: 90, label: '90s', desc: 'Largo' },
]

const languageFlags = {
  Spanish: '🇦🇷',
  English: '🇺🇸',
  Portuguese: '🇧🇷',
  French: '🇫🇷',
  German: '🇩🇪',
  Italian: '🇮🇹',
}

const promptIcons = {
  Controversia: '🔥',
  'High-Value': '💎',
  Humor: '😂',
  Productividad: '⚡',
  'Chaos Culture': '🌪️',
  Deportes: '⚽',
  Música: '🎵',
  Cocina: '🍳',
  Rutina: '📋',
  Moda: '👗',
  auto: '🤖',
  Entretenimiento: '🎬',
  Videojuegos: '🎮',
  Salud: '💪',
  'Dinero y Negocios': '💰',
  Podcast: '🎙️',
}

const formatIcons = {
  '9:16': { icon: '📱', desc: 'TikTok · Reels · Shorts' },
  '1:1': { icon: '⬛', desc: 'Instagram · Square' },
  '16:9': { icon: '🖥️', desc: 'YouTube · Landscape' },
  '16:6': { icon: '🖥️', desc: 'Panorámico' },
  '4:5': { icon: '📷', desc: 'Instagram · Portrait' },
}

const editFormatIcons = {
  Automatic: { icon: '🤖', desc: 'Corte automático' },
  Dual: { icon: '🎭', desc: 'Doble cámara' },
  Split: { icon: '🪞', desc: 'Pantalla dividida' },
  Focus: { icon: '🎯', desc: 'Foco en el rostro' },
}

// supportData: { Languages, Prompts, VideoFormats, EditFormats } — from /support/
export default function ConfigPanel({ videoSource, supportData, onProcess, onBack }) {
  const languages = supportData?.Languages ?? []
  const prompts = supportData?.Prompts ?? []
  const videoFormats = supportData?.VideoFormats ?? []
  const editFormats = supportData?.EditFormats ?? []

  const [config, setConfig] = useState(() => {
    const { defaults } = loadPrefs()
    const pickLang = defaults.language_id && languages.some(l => l.language_id === defaults.language_id)
      ? defaults.language_id
      : languages[0]?.language_id ?? 1
    const pickFormat = defaults.format && videoFormats.some(f => f.format_video === defaults.format)
      ? defaults.format
      : videoFormats[0]?.format_video ?? '9:16'
    const pickPrompt = defaults.prompt_id && prompts.some(p => p.prompt_id === defaults.prompt_id)
      ? defaults.prompt_id
      : prompts[0]?.prompt_id ?? 1
    const pickEditFormat = defaults.edit_format && editFormats.some(e => e.edit_format_id === defaults.edit_format)
      ? defaults.edit_format
      : editFormats[0]?.edit_format_id ?? 1
    return {
      language_id: pickLang,
      format: pickFormat,
      prompt_id: pickPrompt,
      edit_format: pickEditFormat,
      duration: 60,
      numClips: 5,
    }
  })

  function set(key, value) {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const selectedLang = languages.find(l => l.language_id === config.language_id)
  const selectedPrompt = prompts.find(p => p.prompt_id === config.prompt_id)
  const selectedFormat = videoFormats.find(f => f.format_video === config.format)
  const selectedEditFormat = editFormats.find(e => e.edit_format_id === config.edit_format)

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl border border-xborder flex items-center justify-center text-xmuted hover:text-white hover:border-xmuted transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="font-display font-bold text-xl text-white">Configurá tu clip</h2>
          <p className="text-xmuted text-xs mt-0.5 font-mono truncate">
            {videoSource.type === 'url' ? videoSource.value : `📁 ${videoSource.value}`}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-xgreen/10 border border-xgreen/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-xgreen animate-pulse" />
          <span className="text-xgreen text-xs font-mono">Video listo</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Idioma */}
        <Section title="Idioma del contenido" icon="🌐">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {languages.map(lang => (
              <button key={lang.language_id} onClick={() => set('language_id', lang.language_id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-medium transition-all duration-150
                  ${config.language_id === lang.language_id
                    ? 'border-xgreen bg-xgreen/10 text-xgreen'
                    : 'border-xborder text-xmuted hover:border-xmuted hover:text-white bg-surface2'}`}>
                <span className="text-lg">{languageFlags[lang.language] ?? '🌐'}</span>
                {lang.language}
              </button>
            ))}
          </div>
        </Section>

        {/* Formato */}
        <Section title="Formato de salida" icon="📐">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {videoFormats.map(fmt => {
              const meta = formatIcons[fmt.format_video] ?? { icon: '📐', desc: '' }
              return (
                <button key={fmt.format_id} onClick={() => set('format', fmt.format_video)}
                  className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-150
                    ${config.format === fmt.format_video
                      ? 'border-xgreen bg-xgreen/10'
                      : 'border-xborder bg-surface2 hover:border-xmuted'}`}>
                  <span className="text-2xl">{meta.icon}</span>
                  <span className={`text-sm font-bold font-mono ${config.format === fmt.format_video ? 'text-xgreen' : 'text-white'}`}>
                    {fmt.format_video}
                  </span>
                  <span className="text-xs text-xmuted text-center leading-tight">{meta.desc}</span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Formato de edición (EditFormats) */}
        {editFormats.length > 0 && (
          <Section title="Formato de edición" icon="✂️">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {editFormats.map(ef => {
                const meta = editFormatIcons[ef.format_name] ?? { icon: '🎛️', desc: '' }
                const active = config.edit_format === ef.edit_format_id
                return (
                  <button key={ef.edit_format_id} onClick={() => set('edit_format', ef.edit_format_id)}
                    className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-150
                      ${active
                        ? 'border-xpurple bg-xpurple/10'
                        : 'border-xborder bg-surface2 hover:border-xmuted'}`}>
                    <span className="text-2xl">{meta.icon}</span>
                    <span className={`text-sm font-bold ${active ? 'text-xpurple' : 'text-white'}`}>
                      {ef.format_name}
                    </span>
                    <span className="text-xs text-xmuted text-center leading-tight">{meta.desc}</span>
                  </button>
                )
              })}
            </div>
          </Section>
        )}

        {/* Tipo de contenido / Prompt */}
        <Section title="Tipo de contenido" icon="🎯">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {prompts.map(p => (
              <button key={p.prompt_id} onClick={() => set('prompt_id', p.prompt_id)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-150
                  ${config.prompt_id === p.prompt_id
                    ? 'border-xpurple bg-xpurple/10 text-xpurple'
                    : 'border-xborder bg-surface2 text-xmuted hover:border-xmuted hover:text-white'}`}>
                <span className="text-xl">{promptIcons[p.trend_name] ?? '🎬'}</span>
                <span className="text-center leading-tight">{p.trend_name}</span>
              </button>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Duración del clip */}
          <Section title="Duración por clip" icon="⏱️">
            <div className="grid grid-cols-2 gap-2">
              {clipDurations.map(d => (
                <button key={d.value} onClick={() => set('duration', d.value)}
                  className={`flex flex-col py-3 px-3 rounded-xl border text-left transition-all duration-150
                    ${config.duration === d.value
                      ? 'border-xgreen bg-xgreen/10'
                      : 'border-xborder bg-surface2 hover:border-xmuted'}`}>
                  <span className={`text-sm font-bold font-mono ${config.duration === d.value ? 'text-xgreen' : 'text-white'}`}>
                    {d.label}
                  </span>
                  <span className="text-xs text-xmuted">{d.desc}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* Número de clips */}
          <Section title={`Cantidad de clips: ${config.numClips}`} icon="🎞️">
            <div className="space-y-3">
              <input
                type="range" min={1} max={20} value={config.numClips}
                onChange={e => set('numClips', Number(e.target.value))}
                className="w-full accent-xgreen h-1.5 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-xmuted">
                <span>1 clip</span>
                <span className="font-mono text-xgreen font-bold">{config.numClips} clips</span>
                <span>20 clips</span>
              </div>
              <div className="flex justify-between text-xs text-xmuted/70">
                <span>Selecto</span>
                <span>Masivo</span>
              </div>
            </div>
          </Section>
        </div>

        {/* Summary + CTA */}
        <div className="rounded-2xl border border-xborder p-5 bg-surface2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Resumen</h3>
            <span className="text-xs text-xmuted font-mono">XLIP_CONFIG_READY</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-5">
            {[
              { label: 'Idioma', value: selectedLang?.language ?? '—' },
              { label: 'Formato', value: config.format },
              { label: 'Edición', value: selectedEditFormat?.format_name ?? '—' },
              { label: 'Clips', value: config.numClips },
              { label: 'Duración', value: config.duration < 60 ? config.duration + 's' : config.duration / 60 + ' min' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-xmuted mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-white font-mono">{item.value}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => onProcess(config)}
            className="w-full py-4 rounded-xl font-display font-bold text-sm text-bg hover:opacity-90 active:scale-[0.99] transition-all duration-200 glow-green"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            ⚡ Encender la máquina
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-xborder p-5" style={{ background: '#0D0D1F' }}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}
