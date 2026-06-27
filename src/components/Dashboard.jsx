import { TEAMS, GROUP_TEAMS, CONF_META } from '../data/data'
import { calcStandings } from '../utils/standings'

function StatCard({ icon, value, label, sub }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-wc-accent/10 flex items-center justify-center text-2xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black text-wc-accent leading-none">{value}</div>
        <div className="text-sm font-semibold text-white/70 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-white/30">{sub}</div>}
      </div>
    </div>
  )
}

function MiniStandings({ group, groupMatches }) {
  const teams = GROUP_TEAMS[group]
  const standings = calcStandings(teams, groupMatches[group])
  const played = groupMatches[group].filter(m => m.homeScore !== null).length

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-wc-accent/20 border border-wc-accent/30 flex items-center justify-center text-xs font-black text-wc-accent">
            {group}
          </div>
          <span className="text-xs font-semibold text-white/50">GROUP {group}</span>
        </div>
        <span className="text-xs text-white/25">{played}/6</span>
      </div>
      <div className="space-y-1">
        {standings.map((s, i) => {
          const t = TEAMS[s.id]
          const qualified = i < 2
          const maybeThird = i === 2
          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors
                ${qualified  ? 'bg-green-500/10 border border-green-500/20'
                : maybeThird ? 'bg-amber-500/5  border border-amber-500/10'
                : 'border border-transparent'}`}
            >
              <span className={`w-4 text-center text-xs font-bold ${qualified ? 'text-green-400' : 'text-white/25'}`}>
                {i + 1}
              </span>
              <span className="text-base leading-none">{t.flag}</span>
              <span className="flex-1 font-semibold text-white/80 truncate text-xs">{t.short}</span>
              <span className="font-black text-wc-accent text-sm">{s.pts}</span>
              <span className={`text-xs w-8 text-right ${s.gd > 0 ? 'text-green-400' : s.gd < 0 ? 'text-red-400' : 'text-white/30'}`}>
                {s.gd > 0 ? '+' : ''}{s.gd}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-white/25">
        <div className="w-2 h-2 rounded-sm bg-green-500/40 border border-green-500/40" />
        Qualify
        <div className="w-2 h-2 rounded-sm bg-amber-500/20 border border-amber-500/20 ml-1" />
        3rd (best 8)
      </div>
    </div>
  )
}

export default function Dashboard({ groupMatches, knockout, setView }) {
  const allMatches = Object.values(groupMatches).flat()
  const played = allMatches.filter(m => m.homeScore !== null)
  const totalGoals = played.reduce((s, m) => s + Number(m.homeScore) + Number(m.awayScore), 0)
  const avgGoals = played.length ? (totalGoals / played.length).toFixed(2) : '–'

  const recentResults = [...played].reverse().slice(0, 6)

  const champion = knockout.winner
  const finalist1 = knockout.final.home
  const finalist2 = knockout.final.away

  const koRounds = [
    { label: 'R32',        total: 16, played: knockout.r32.filter(m => m.homeScore !== null).length },
    { label: 'R16',        total: 8,  played: knockout.r16.filter(m => m.homeScore !== null).length },
    { label: 'QF',         total: 4,  played: knockout.qf.filter(m => m.homeScore !== null).length  },
    { label: 'SF',         total: 2,  played: knockout.sf.filter(m => m.homeScore !== null).length  },
    { label: '3rd Place',  total: 1,  played: knockout.thirdPlace.homeScore !== null ? 1 : 0         },
    { label: 'Final',      total: 1,  played: knockout.final.homeScore !== null ? 1 : 0              },
  ]

  return (
    <div className="space-y-8">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden card p-6 sm:p-8">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-wc-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-5xl">🏆</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight bg-gradient-to-r from-wc-lite via-wc-accent to-wc-gold bg-clip-text text-transparent">
                  FIFA World Cup 2026™
                </h1>
                <p className="text-white/40 text-sm font-medium">
                  United States · Canada · Mexico &nbsp;|&nbsp; Jun 11 – Jul 19, 2026
                </p>
              </div>
            </div>
            <p className="text-white/30 text-sm mt-3 max-w-lg">
              48 teams · 12 groups · 104 matches · First expanded WC format
            </p>
            {champion && (
              <div className="mt-4 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-wc-accent/15 border border-wc-accent/30 champion-glow">
                <span className="text-2xl">{TEAMS[champion]?.flag}</span>
                <div>
                  <div className="text-[10px] text-wc-accent/70 uppercase tracking-widest font-bold">World Champion</div>
                  <div className="font-black text-wc-accent">{TEAMS[champion]?.name}</div>
                </div>
                <span className="text-xl">👑</span>
              </div>
            )}
            {!champion && (finalist1 || finalist2) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {[finalist1, finalist2].filter(Boolean).map(tid => (
                  <div key={tid} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-wc-card border border-wc-border text-sm">
                    <span>{TEAMS[tid]?.flag}</span>
                    <span className="font-semibold text-white/70">{TEAMS[tid]?.name}</span>
                    <span className="text-wc-accent text-xs font-bold">FINALIST</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button onClick={() => setView('groups')} className="btn-gold text-sm flex items-center gap-2 justify-center">
              ▦ Edit Group Scores
            </button>
            <button onClick={() => setView('bracket')} className="btn-ghost text-sm flex items-center gap-2 justify-center">
              ⛨ Knockout Bracket
            </button>
            <button onClick={() => setView('teams')} className="btn-ghost text-sm flex items-center gap-2 justify-center">
              ◈ Browse All Teams
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="⚽" value={48} label="Teams" sub="12 groups of 4" />
        <StatCard icon="🥅" value={played.length} label="Matches Played" sub={`of ${allMatches.length + 40} total`} />
        <StatCard icon="🎯" value={totalGoals} label="Goals Scored" sub={`avg ${avgGoals}/match`} />
        <StatCard icon="🏟️" value={16} label="Host Cities" sub="USA · CAN · MEX" />
      </div>

      {/* ── Group Stage ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-wc-accent rounded-full" />
            Group Stage Standings
          </h2>
          <button onClick={() => setView('groups')} className="text-wc-accent text-sm hover:text-wc-lite transition-colors flex items-center gap-1 font-semibold">
            Edit scores →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.keys(GROUP_TEAMS).map(g => (
            <MiniStandings key={g} group={g} groupMatches={groupMatches} />
          ))}
        </div>
      </section>

      {/* ── Recent Results + Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Results */}
        <div className="card p-5">
          <h3 className="font-black text-white mb-4 flex items-center gap-2">
            <span className="text-wc-accent">⚡</span> Recent Results
          </h3>
          {recentResults.length === 0 ? (
            <div className="text-center py-8 text-white/20">
              <div className="text-4xl mb-2">⚽</div>
              <p className="text-sm">No matches played yet.</p>
              <p className="text-xs mt-1">Go to Group Stage to enter scores.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentResults.map(m => {
                const h = TEAMS[m.home], a = TEAMS[m.away]
                const hs = Number(m.homeScore), as_ = Number(m.awayScore)
                return (
                  <div key={m.id} className="flex items-center gap-2 bg-wc-navy rounded-xl px-3 py-2.5 border border-wc-border">
                    <span className="text-base">{h.flag}</span>
                    <span className={`flex-1 text-right text-sm font-semibold ${hs > as_ ? 'text-white' : 'text-white/40'}`}>
                      {h.short}
                    </span>
                    <div className="px-3 py-0.5 bg-wc-dark rounded-lg font-black text-wc-accent text-sm tracking-wider min-w-[72px] text-center border border-wc-border">
                      {m.homeScore} – {m.awayScore}
                    </div>
                    <span className={`flex-1 text-sm font-semibold ${as_ > hs ? 'text-white' : 'text-white/40'}`}>
                      {a.short}
                    </span>
                    <span className="text-base">{a.flag}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tournament Progress */}
        <div className="card p-5">
          <h3 className="font-black text-white mb-4 flex items-center gap-2">
            <span className="text-wc-accent">📊</span> Tournament Progress
          </h3>
          <div className="space-y-1 mb-6">
            {/* Group Stage */}
            <div className="flex items-center justify-between text-xs font-semibold text-white/50 mb-1 mt-2">
              <span className="uppercase tracking-widest">Group Stage</span>
              <span className="text-wc-accent">{played.length}/96</span>
            </div>
            <div className="h-2 bg-wc-navy rounded-full overflow-hidden border border-wc-border">
              <div
                className="h-full bg-gradient-to-r from-wc-gold to-wc-accent rounded-full transition-all duration-700"
                style={{ width: `${(played.length / 96) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">Knockout Rounds</div>
            {koRounds.map(r => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="text-xs font-bold text-white/40 w-16 flex-shrink-0">{r.label}</span>
                <div className="flex-1 h-1.5 bg-wc-navy rounded-full overflow-hidden border border-wc-border">
                  <div
                    className="h-full bg-gradient-to-r from-wc-gold to-wc-accent rounded-full transition-all duration-700"
                    style={{ width: `${r.total ? (r.played / r.total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-white/25 w-8 text-right">{r.played}/{r.total}</span>
              </div>
            ))}
          </div>

          {/* Confederation breakdown */}
          <div className="mt-6 pt-4 border-t border-wc-border">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Teams by Confederation</div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CONF_META).map(([conf, meta]) => {
                const count = Object.values(TEAMS).filter(t => t.conf === conf).length
                return (
                  <div key={conf} className={`rounded-lg px-2 py-1.5 border ${meta.bg} ${meta.border} text-center`}>
                    <div className={`text-lg font-black ${meta.color}`}>{count}</div>
                    <div className="text-[10px] text-white/40">{conf}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
