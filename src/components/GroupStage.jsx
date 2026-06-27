import { useState } from 'react'
import { TEAMS, GROUP_TEAMS } from '../data/data'
import { calcStandings } from '../utils/standings'

function ScoreInput({ value, onChange, placeholder = '0' }) {
  return (
    <input
      type="number"
      min="0"
      max="99"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={e => {
        const v = e.target.value
        onChange(v === '' ? null : Math.max(0, Number(v)))
      }}
      className="score-input"
    />
  )
}

function MatchRow({ match, onUpdate }) {
  const home = TEAMS[match.home]
  const away = TEAMS[match.away]
  const played = match.homeScore !== null && match.awayScore !== null
  const hs = Number(match.homeScore)
  const as_ = Number(match.awayScore)

  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all
      ${played
        ? 'bg-wc-navy border-wc-border'
        : 'bg-wc-dark border-wc-border/50 hover:border-wc-border'}`}
    >
      <span className="text-[10px] text-white/20 font-mono w-6 flex-shrink-0">{match.date?.slice(4) || ''}</span>

      {/* Home team */}
      <div className={`flex items-center gap-1.5 flex-1 justify-end min-w-0 ${played && hs < as_ ? 'opacity-40' : ''}`}>
        <span className={`text-xs font-bold truncate text-right hidden sm:block ${played && hs > as_ ? 'text-white' : 'text-white/60'}`}>
          {home.name}
        </span>
        <span className={`text-xs font-bold truncate text-right sm:hidden ${played && hs > as_ ? 'text-white' : 'text-white/60'}`}>
          {home.short}
        </span>
        <span className="text-xl leading-none flex-shrink-0">{home.flag}</span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <ScoreInput value={match.homeScore} onChange={v => onUpdate(match.id, v, match.awayScore)} />
        <span className="text-white/20 font-black text-lg">:</span>
        <ScoreInput value={match.awayScore} onChange={v => onUpdate(match.id, match.homeScore, v)} />
      </div>

      {/* Away team */}
      <div className={`flex items-center gap-1.5 flex-1 min-w-0 ${played && as_ < hs ? 'opacity-40' : ''}`}>
        <span className="text-xl leading-none flex-shrink-0">{away.flag}</span>
        <span className={`text-xs font-bold truncate hidden sm:block ${played && as_ > hs ? 'text-white' : 'text-white/60'}`}>
          {away.name}
        </span>
        <span className={`text-xs font-bold truncate sm:hidden ${played && as_ > hs ? 'text-white' : 'text-white/60'}`}>
          {away.short}
        </span>
      </div>

      {/* Clear */}
      {played && (
        <button
          onClick={() => onUpdate(match.id, null, null)}
          className="text-white/15 hover:text-red-400 transition-colors text-xs flex-shrink-0"
          title="Clear result"
        >✕</button>
      )}
    </div>
  )
}

function StandingsTable({ group, groupMatches }) {
  const teams = GROUP_TEAMS[group]
  const standings = calcStandings(teams, groupMatches[group])

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-white/30 uppercase tracking-wider">
            <th className="text-left px-2 py-1.5">#</th>
            <th className="text-left px-2 py-1.5">Team</th>
            <th className="px-2 py-1.5">P</th>
            <th className="px-2 py-1.5">W</th>
            <th className="px-2 py-1.5">D</th>
            <th className="px-2 py-1.5">L</th>
            <th className="px-2 py-1.5">GF</th>
            <th className="px-2 py-1.5">GA</th>
            <th className="px-2 py-1.5">GD</th>
            <th className="px-2 py-1.5 font-black text-wc-accent/60">PTS</th>
            <th className="px-2 py-1.5">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const t = TEAMS[s.id]
            const qualified = i < 2
            const maybeThird = i === 2

            // Calculate form from matches
            const teamMatches = groupMatches[group].filter(m =>
              (m.home === s.id || m.away === s.id) && m.homeScore !== null
            )
            const form = teamMatches.slice(-3).map(m => {
              const isHome = m.home === s.id
              const ts = isHome ? Number(m.homeScore) : Number(m.awayScore)
              const os = isHome ? Number(m.awayScore) : Number(m.homeScore)
              if (ts > os) return 'W'
              if (os > ts) return 'L'
              return 'D'
            })

            return (
              <tr
                key={s.id}
                className={`border-t border-wc-border/50 transition-colors
                  ${qualified  ? 'bg-green-500/5'
                  : maybeThird ? 'bg-amber-500/3'
                  : ''}`}
              >
                <td className="px-2 py-2">
                  <span className={`text-xs font-black ${qualified ? 'text-green-400' : 'text-white/25'}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{t.flag}</span>
                    <span className="font-bold text-white/80 truncate">{t.name}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-center text-white/60">{s.p}</td>
                <td className="px-2 py-2 text-center text-green-400/80">{s.w}</td>
                <td className="px-2 py-2 text-center text-yellow-400/80">{s.d}</td>
                <td className="px-2 py-2 text-center text-red-400/80">{s.l}</td>
                <td className="px-2 py-2 text-center text-white/50">{s.gf}</td>
                <td className="px-2 py-2 text-center text-white/50">{s.ga}</td>
                <td className={`px-2 py-2 text-center font-semibold ${s.gd > 0 ? 'text-green-400' : s.gd < 0 ? 'text-red-400' : 'text-white/30'}`}>
                  {s.gd > 0 ? '+' : ''}{s.gd}
                </td>
                <td className="px-2 py-2 text-center font-black text-wc-accent">{s.pts}</td>
                <td className="px-2 py-2">
                  <div className="flex gap-0.5">
                    {form.map((f, fi) => (
                      <span
                        key={fi}
                        className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center
                          ${f === 'W' ? 'bg-green-500/30 text-green-400'
                          : f === 'L' ? 'bg-red-500/30 text-red-400'
                          : 'bg-yellow-500/30 text-yellow-400'}`}
                      >{f}</span>
                    ))}
                    {Array.from({ length: 3 - form.length }).map((_, fi) => (
                      <span key={`e${fi}`} className="w-4 h-4 rounded bg-white/5" />
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex gap-3 mt-2 text-[10px] text-white/20 px-2">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500/30" /> Qualify (top 2)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-500/10" /> Best 3rd (8 spots)</div>
      </div>
    </div>
  )
}

function GroupCard({ group, groupMatches, onUpdate }) {
  const [tab, setTab] = useState('standings')
  const teams = GROUP_TEAMS[group]
  const matches = groupMatches[group]
  const played = matches.filter(m => m.homeScore !== null).length

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-wc-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-wc-accent/30 to-wc-gold/20 border border-wc-accent/30 flex items-center justify-center font-black text-wc-accent">
            {group}
          </div>
          <div>
            <div className="font-black text-white text-sm">Group {group}</div>
            <div className="text-[10px] text-white/30">{played}/6 matches played</div>
          </div>
        </div>
        <div className="flex rounded-lg overflow-hidden border border-wc-border text-xs">
          <button
            onClick={() => setTab('standings')}
            className={`px-3 py-1 font-semibold transition-colors ${tab === 'standings' ? 'bg-wc-accent/20 text-wc-accent' : 'text-white/40 hover:text-white'}`}
          >Standings</button>
          <button
            onClick={() => setTab('matches')}
            className={`px-3 py-1 font-semibold transition-colors border-l border-wc-border ${tab === 'matches' ? 'bg-wc-accent/20 text-wc-accent' : 'text-white/40 hover:text-white'}`}
          >Matches</button>
        </div>
      </div>

      <div className="p-3">
        {tab === 'standings' ? (
          <StandingsTable group={group} groupMatches={groupMatches} />
        ) : (
          <div className="space-y-1.5">
            {matches.map(m => (
              <MatchRow
                key={m.id}
                match={m}
                onUpdate={(id, hs, as_) => onUpdate(group, id, hs, as_)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function GroupStage({ groupMatches, onUpdate }) {
  const [filter, setFilter] = useState('all')
  const groups = Object.keys(GROUP_TEAMS)
  const allMatches = Object.values(groupMatches).flat()
  const played = allMatches.filter(m => m.homeScore !== null).length

  const handleQuickFill = () => {
    if (!confirm('Auto-fill all missing group scores with sample results? (for demo)')) return
    Object.entries(GROUP_TEAMS).forEach(([group, teams]) => {
      groupMatches[group].forEach(m => {
        if (m.homeScore === null) {
          const hs = Math.floor(Math.random() * 4)
          const as_ = Math.floor(Math.random() * 4)
          onUpdate(group, m.id, hs, as_)
        }
      })
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Group Stage</h2>
          <p className="text-white/40 text-sm mt-0.5">{played} of 96 matches played · Click Matches tab to enter scores</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleQuickFill} className="btn-ghost text-xs">
            ⚡ Demo Fill
          </button>
        </div>
      </div>

      {/* Group filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-wc-accent text-black' : 'bg-wc-card border border-wc-border text-white/50 hover:text-white'}`}
        >All Groups</button>
        {groups.map(g => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === g ? 'bg-wc-accent text-black' : 'bg-wc-card border border-wc-border text-white/50 hover:text-white'}`}
          >Group {g}</button>
        ))}
      </div>

      {/* Group cards grid */}
      <div className={`grid gap-4 ${filter === 'all' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-2xl'}`}>
        {groups
          .filter(g => filter === 'all' || filter === g)
          .map(g => (
            <GroupCard
              key={g}
              group={g}
              groupMatches={groupMatches}
              onUpdate={onUpdate}
            />
          ))}
      </div>
    </div>
  )
}
