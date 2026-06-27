import { useState, useEffect } from 'react'
import { INITIAL_MATCHES, INITIAL_KNOCKOUT } from './data/data'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import GroupStage from './components/GroupStage'
import KnockoutBracket from './components/KnockoutBracket'
import Teams from './components/Teams'
import Summary from './components/Summary'

const STORAGE_KEY = 'wc2026-bracket-v1'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  const [view, setView] = useState('dashboard')

  const saved = loadSaved()
  const [groupMatches, setGroupMatches] = useState(saved?.groupMatches ?? INITIAL_MATCHES)
  const [knockout, setKnockout] = useState(saved?.knockout ?? INITIAL_KNOCKOUT)

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ groupMatches, knockout }))
    } catch {}
  }, [groupMatches, knockout])

  // ── Group match update ─────────────────────────────────────────────────────
  const updateGroupMatch = (group, matchId, homeScore, awayScore) => {
    setGroupMatches(prev => ({
      ...prev,
      [group]: prev[group].map(m =>
        m.id === matchId ? { ...m, homeScore, awayScore } : m
      ),
    }))
  }

  // ── Knockout match update ─────────────────────────────────────────────────
  const updateKoMatch = (round, matchId, field, value) => {
    setKnockout(prev => {
      const r = prev[round]
      if (Array.isArray(r)) {
        return { ...prev, [round]: r.map(m => m.id === matchId ? { ...m, [field]: value } : m) }
      }
      return { ...prev, [round]: { ...r, [field]: value } }
    })
  }

  const setWinner = (teamId) => {
    setKnockout(prev => ({ ...prev, winner: teamId }))
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (!confirm('Reset ALL data? This will clear all scores, results, and the bracket. This cannot be undone.')) return
    setGroupMatches(INITIAL_MATCHES)
    setKnockout(INITIAL_KNOCKOUT)
  }

  return (
    <div className="min-h-screen bg-wc-dark">
      <Header view={view} setView={setView} onReset={handleReset} />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {view === 'dashboard' && (
          <Dashboard groupMatches={groupMatches} knockout={knockout} setView={setView} />
        )}
        {view === 'groups' && (
          <GroupStage groupMatches={groupMatches} onUpdate={updateGroupMatch} />
        )}
        {view === 'bracket' && (
          <KnockoutBracket knockout={knockout} onUpdate={updateKoMatch} setWinner={setWinner} />
        )}
        {view === 'teams' && (
          <Teams groupMatches={groupMatches} />
        )}
        {view === 'summary' && (
          <Summary groupMatches={groupMatches} knockout={knockout} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-wc-border mt-12 py-6 text-center text-white/20 text-xs">
        <div className="flex items-center justify-center gap-2">
          <span>⚽</span>
          <span>WC 2026 Bracket Editor · USA · Canada · Mexico · Jun 11 – Jul 19, 2026</span>
          <span>🏆</span>
        </div>
        <div className="mt-1 text-white/10">All data saved locally in your browser</div>
      </footer>
    </div>
  )
}
