import { TEAMS, GROUP_TEAMS, CONF_META } from '../data/data'
import { calcStandings, getKoWinner } from '../utils/standings'

function Section({ title, icon, children }) {
  return (
    <div className="card p-5 space-y-4">
      <h3 className="font-black text-white flex items-center gap-2">
        <span className="text-wc-accent">{icon}</span> {title}
      </h3>
      {children}
    </div>
  )
}

function StatRow({ label, value, sub, highlight }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-wc-border/50 last:border-0 ${highlight ? 'text-wc-accent' : ''}`}>
      <span className="text-sm text-white/60">{label}</span>
      <div className="text-right">
        <div className={`font-black ${highlight ? 'text-wc-accent' : 'text-white'}`}>{value}</div>
        {sub && <div className="text-[10px] text-white/25">{sub}</div>}
      </div>
    </div>
  )
}

export default function Summary({ groupMatches, knockout }) {
  const allGroupMatches = Object.values(groupMatches).flat()
  const played = allGroupMatches.filter(m => m.homeScore !== null)
  const totalGoals = played.reduce((s, m) => s + Number(m.homeScore) + Number(m.awayScore), 0)
  const avgGoals = played.length ? (totalGoals / played.length).toFixed(2) : '–'

  // Top-scoring groups
  const groupGoals = Object.entries(groupMatches).map(([g, matches]) => {
    const goals = matches.filter(m => m.homeScore !== null)
      .reduce((s, m) => s + Number(m.homeScore) + Number(m.awayScore), 0)
    return { group: g, goals }
  }).sort((a, b) => b.goals - a.goals)

  // Qualified teams (top 2 per group)
  const qualified = []
  const thirdPlace = []
  Object.entries(GROUP_TEAMS).forEach(([g, teams]) => {
    const st = calcStandings(teams, groupMatches[g])
    qualified.push({ team: TEAMS[st[0].id], pos: 1, group: g, pts: st[0].pts, gd: st[0].gd })
    qualified.push({ team: TEAMS[st[1].id], pos: 2, group: g, pts: st[1].pts, gd: st[1].gd })
    thirdPlace.push({ team: TEAMS[st[2].id], pos: 3, group: g, pts: st[2].pts, gd: st[2].gd })
  })

  // Best 3rd place (8 of 12 advance)
  const best3rd = [...thirdPlace].sort((a, b) => b.pts - a.pts || b.gd - a.gd).slice(0, 8)
  const best3rdIds = new Set(best3rd.map(x => x.team.id))

  // Knockout results
  const champion = knockout.winner
  const finalWinner = getKoWinner(knockout.final)
  const finalist1 = knockout.final.home
  const finalist2 = knockout.final.away
  const sf1winner = getKoWinner(knockout.sf[0])
  const sf2winner = getKoWinner(knockout.sf[1])
  const thirdPlaceWinner = getKoWinner(knockout.thirdPlace)

  // Overall KO stats
  const koAllMatches = [
    ...knockout.r32, ...knockout.r16, ...knockout.qf, ...knockout.sf,
    knockout.thirdPlace, knockout.final,
  ]
  const koPlayed = koAllMatches.filter(m => m.homeScore !== null)
  const koGoals = koPlayed.reduce((s, m) => s + Number(m.homeScore) + Number(m.awayScore), 0)

  const confAdvanced = {}
  qualified.forEach(q => {
    confAdvanced[q.team.conf] = (confAdvanced[q.team.conf] || 0) + 1
  })
  best3rd.forEach(q => {
    confAdvanced[q.team.conf] = (confAdvanced[q.team.conf] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Tournament Summary</h2>
        <p className="text-white/40 text-sm mt-0.5">Full overview of standings, qualifiers & knockout results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Group Stage Stats */}
        <Section title="Group Stage Stats" icon="📊">
          <StatRow label="Matches Played" value={`${played.length} / 96`} />
          <StatRow label="Total Goals" value={totalGoals} />
          <StatRow label="Avg Goals / Match" value={avgGoals} />
          <StatRow label="Top Scoring Group" value={groupGoals[0] ? `Group ${groupGoals[0].group}` : '–'} sub={groupGoals[0] ? `${groupGoals[0].goals} goals` : ''} />
          <StatRow label="Groups Completed" value={`${Object.entries(groupMatches).filter(([,m]) => m.every(x => x.homeScore !== null)).length} / 12`} />
        </Section>

        {/* Knockout Stats */}
        <Section title="Knockout Stats" icon="⛨">
          <StatRow label="KO Matches Played" value={`${koPlayed.length} / 57`} />
          <StatRow label="KO Total Goals" value={koGoals} />
          <StatRow label="3rd Place" value={thirdPlaceWinner ? `${TEAMS[thirdPlaceWinner].flag} ${TEAMS[thirdPlaceWinner].name}` : '–'} />
          <StatRow label="Runner-up" value={finalist1 && finalist2 ? (finalWinner ? `${TEAMS[finalWinner === finalist1 ? finalist2 : finalist1]?.flag} ${TEAMS[finalWinner === finalist1 ? finalist2 : finalist1]?.name}` : '–') : '–'} />
          <StatRow label="🏆 Champion" value={champion ? `${TEAMS[champion].flag} ${TEAMS[champion].name}` : '–'} highlight />
        </Section>

        {/* Confederation Breakdown */}
        <Section title="Qualified by Confederation" icon="🌍">
          {Object.entries(CONF_META).map(([key, meta]) => {
            const total = Object.values(TEAMS).filter(t => t.conf === key).length
            const adv = confAdvanced[key] || 0
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${meta.color}`}>{key}</span>
                  <span className="text-white/40">{adv}/{total} qualified</span>
                </div>
                <div className="h-1.5 bg-wc-navy rounded-full overflow-hidden border border-wc-border">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${meta.bg.replace('bg-', 'bg-').replace('/15', '/60')}`}
                    style={{ width: `${total ? (adv / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )
          })}
        </Section>
      </div>

      {/* Qualified Teams */}
      <Section title="Teams Advanced to Round of 32" icon="✅">
        <div className="text-xs text-white/30 mb-2">Top 2 from each group (24) + Best 8 third-place teams = 32</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {qualified.map(({ team, pos, group, pts }) => (
            <div key={team.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
              ${pos === 1 ? 'bg-wc-accent/10 border-wc-accent/25' : 'bg-green-500/8 border-green-500/20'}`}>
              <span className="text-base">{team.flag}</span>
              <span className="font-semibold text-white/80 flex-1 truncate">{team.name}</span>
              <div className="text-right flex-shrink-0">
                <div className={`text-[10px] font-black ${pos === 1 ? 'text-wc-accent' : 'text-green-400'}`}>
                  {pos === 1 ? '1st' : '2nd'} · G{group}
                </div>
                <div className="text-[10px] text-white/25">{pts} pts</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-wc-border">
          <div className="text-xs font-bold text-white/40 mb-2">Best 8 Third-Place Teams</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {best3rd.map(({ team, group, pts, gd }, i) => (
              <div key={team.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
                ${i < 8 ? 'bg-amber-500/8 border-amber-500/20' : 'bg-wc-navy border-wc-border opacity-40'}`}>
                <span className="text-base">{team.flag}</span>
                <span className="font-semibold text-white/70 flex-1 truncate">{team.short}</span>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-black text-amber-400">3rd · G{group}</div>
                  <div className="text-[10px] text-white/25">{pts}pts {gd > 0 ? '+' : ''}{gd}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Tournament Podium */}
      {(champion || thirdPlaceWinner || finalist1) && (
        <Section title="🏆 Final Standings" icon="🥇">
          <div className="flex flex-wrap gap-4 justify-center py-4">
            {thirdPlaceWinner && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center text-3xl">
                  {TEAMS[thirdPlaceWinner]?.flag}
                </div>
                <div className="text-center">
                  <div className="font-black text-orange-400 text-xs">🥉 3rd Place</div>
                  <div className="text-sm font-semibold text-white/70">{TEAMS[thirdPlaceWinner]?.name}</div>
                </div>
              </div>
            )}
            {finalist1 && finalist2 && finalWinner && (
              <div className="flex flex-col items-center gap-2 order-first">
                <div className="text-xs text-wc-accent/60 font-bold uppercase tracking-widest mb-1">Runner-up</div>
                <div className="text-2xl">{TEAMS[finalWinner === finalist1 ? finalist2 : finalist1]?.flag}</div>
                <div className="text-xs text-white/50 font-semibold">{TEAMS[finalWinner === finalist1 ? finalist2 : finalist1]?.name}</div>
                <div className="text-xs text-wc-accent/40">🥈</div>
              </div>
            )}
            {champion && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-2xl bg-wc-accent/20 border-2 border-wc-accent/50 flex items-center justify-center text-5xl champion-glow">
                  {TEAMS[champion]?.flag}
                </div>
                <div className="text-center">
                  <div className="font-black text-wc-accent">👑 World Champion</div>
                  <div className="font-black text-white text-lg">{TEAMS[champion]?.name}</div>
                  <div className="text-xs text-wc-accent/50">FIFA World Cup 2026</div>
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* All Group Standings Table */}
      <Section title="Full Group Stage Standings" icon="📋">
        <div className="space-y-6">
          {Object.entries(GROUP_TEAMS).map(([g, teams]) => {
            const st = calcStandings(teams, groupMatches[g])
            return (
              <div key={g}>
                <div className="text-xs font-black text-wc-accent/70 uppercase tracking-widest mb-2">Group {g}</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-white/20 uppercase">
                        {['#','Team','P','W','D','L','GF','GA','GD','PTS'].map(h => (
                          <th key={h} className={`px-2 py-1 ${h === 'Team' ? 'text-left' : 'text-center'} font-semibold`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {st.map((s, i) => {
                        const t = TEAMS[s.id]
                        return (
                          <tr key={s.id} className={`border-t border-wc-border/30 ${i < 2 ? 'bg-green-500/4' : ''}`}>
                            <td className="px-2 py-1.5 text-center">
                              <span className={`text-xs font-bold ${i < 2 ? 'text-green-400' : 'text-white/20'}`}>{i+1}</span>
                            </td>
                            <td className="px-2 py-1.5">
                              <div className="flex items-center gap-1.5">
                                <span>{t.flag}</span>
                                <span className="font-semibold text-white/70">{t.name}</span>
                              </div>
                            </td>
                            <td className="px-2 py-1.5 text-center text-white/50">{s.p}</td>
                            <td className="px-2 py-1.5 text-center text-green-400/70">{s.w}</td>
                            <td className="px-2 py-1.5 text-center text-yellow-400/70">{s.d}</td>
                            <td className="px-2 py-1.5 text-center text-red-400/70">{s.l}</td>
                            <td className="px-2 py-1.5 text-center text-white/40">{s.gf}</td>
                            <td className="px-2 py-1.5 text-center text-white/40">{s.ga}</td>
                            <td className={`px-2 py-1.5 text-center font-semibold ${s.gd > 0 ? 'text-green-400' : s.gd < 0 ? 'text-red-400' : 'text-white/20'}`}>
                              {s.gd > 0 ? '+' : ''}{s.gd}
                            </td>
                            <td className="px-2 py-1.5 text-center font-black text-wc-accent">{s.pts}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
