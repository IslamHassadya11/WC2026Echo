import { useState } from 'react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard',    icon: '◉' },
  { id: 'groups',    label: 'Group Stage',  icon: '▦' },
  { id: 'bracket',   label: 'Knockout',     icon: '⛨' },
  { id: 'teams',     label: 'All Teams',    icon: '◈' },
  { id: 'summary',   label: 'Summary',      icon: '◎' },
]

export default function Header({ view, setView, onReset }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-wc-dark/95 backdrop-blur-xl border-b border-wc-border">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button onClick={() => setView('dashboard')} className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-wc-accent to-wc-gold" />
              <div className="relative flex items-center justify-center h-full text-black font-black text-lg">⚽</div>
            </div>
            <div className="leading-none">
              <div className="font-black text-base tracking-tight bg-gradient-to-r from-wc-lite via-wc-accent to-wc-gold bg-clip-text text-transparent">
                WC 2026
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest">Bracket Editor</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`nav-item ${view === item.id ? 'nav-active' : 'nav-inactive'}`}
              >
                <span className="opacity-70">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              title="Reset all data"
              className="hidden sm:flex items-center gap-1.5 text-white/30 hover:text-red-400 transition-colors text-xs px-3 py-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            >
              ↺ Reset
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-white/60"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1 border-t border-wc-border mt-0 pt-3">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setMenuOpen(false) }}
                className={`nav-item justify-start ${view === item.id ? 'nav-active' : 'nav-inactive'}`}
              >
                <span className="opacity-70">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onReset(); setMenuOpen(false) }}
              className="nav-item text-red-400/60 hover:text-red-400 hover:bg-red-500/10 justify-start"
            >
              ↺ Reset All Data
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
