import { useState } from 'react'
import { TEAMS, GROUP_TEAMS, CONF_META } from '../data/data'
import { calcStandings } from '../utils/standings'

function TeamCard({ team, standing, rank }) {
  const conf = CONF_META[team.conf] || {}
  const statusColors = [
    'bg-green-500/20 border-green-500/30 text-green-400',
    'bg-blue-500/20 border-blue-500/30 text-blue-400',
    'bg-amber-500/20 border-amber-500/30 text-amber-400',
    'bg-red-500/20 border-red-500/30 text-red-400',
  ]
  const statusLabels = ['1st', '2nd', '3rd', '4th']

  const formColor = (f) => f === 'W' ? 'bg-green-500/25 text-green-400' : f === 'L' ? 'bg-red-500/25 text-red-400' : 'bg-yellow-500/25 text-yellow-400'

  return (
    <div className="card p-4 flex flex-col gap-3 hover:border-wc-accent/30 transition-all duration-200 hover:-translate-y-0.5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none">{team.flag}</span>
          <div>
            <div className="font-black text-white text-sm leading-tight">{team.name}</div>
            <div className={`text-[10px] font-bold conf-badge mt-1 ${conf.bg || ''} ${conf.border || ''} ${conf.color || ''}`}>
              {team.conf}
            </div>
          </div>
        </div>
        <div className={`text-[11px] font-black px-2 py-1 rounded-lg border ${statusColors[rank] || statusColors[3]}`}>
          {statusLabels[rank] || `${rank + 1}th`}
        </div>
      </div>

      {/* Group badge */}
      <div className="flex items-center gap-2">
        <div className="text-[10px] text-white/30 uppercase tracking-widest">Group</div>
        <div className="w-5 h-5 rounded-md bg-wc-accent/20 border border-wc-accent/30 flex items-center justify-center text-[10px] font-black text-wc-accent">
          {team.group}
        </div>
        <div className="text-[10px] text-white/20">FIFA Rank #{team.rank}</div>
      </div>

      {/* Stats */}
      {standing && (
        <>
          <div className="grid grid-cols-5 gap-1 text-center text-xs">
            {[
              { label: 'P', value: standing.p, color: 'text-white/60' },
              { label: 'W', value: standing.w, color: 'text-green-400' },
              { label: 'D', value: standing.d, color: 'text-yellow-400' },
              { label: 'L', value: standing.l, color: 'text-red-400' },
              { label: 'PTS', value: standing.pts, color: 'text-wc-accent font-black' },
            ].map(s => (
              <div key={s.label} className="bg-wc-navy rounded-lg py-1.5 border border-wc-border">
                <div className={`font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[9px] text-white/20 uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* GF / GA / GD */}
          <div className="flex gap-2 text-xs">
            <div className="flex-1 bg-wc-navy rounded-lg py-1 px-2 border border-wc-border text-center">
              <span className="text-white/30">GF </span>
              <span className="font-bold text-white/70">{standing.gf}</span>
            </div>
            <div className="flex-1 bg-wc-navy rounded-lg py-1 px-2 border border-wc-border text-center">
              <span className="text-white/30">GA </span>
              <span className="font-bold text-white/70">{standing.ga}</span>
            </div>
            <div className="flex-1 bg-wc-navy rounded-lg py-1 px-2 border border-wc-border text-center">
              <span className="text-white/30">GD </span>
              <span className={`font-bold ${standing.gd > 0 ? 'text-green-400' : standing.gd < 0 ? 'text-red-400' : 'text-white/30'}`}>
                {standing.gd > 0 ? '+' : ''}{standing.gd}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Teams({ groupMatches }) {
  const [conf, setConf] = useState('all')
  const [group, setGroup] = useState('all')
  const [sort, setSort] = useState('group')
  const [search, setSearch] = useState('')

  // Build standings map
  const standingsMap = {}
  const rankMap = {}
  Object.entries(GROUP_TEAMS).forEach(([g, tids]) => {
    const st = calcStandings(tids, groupMatches[g])
    st.forEach((s, i) => {
      standingsMap[s.id] = s
      rankMap[s.id] = i
    })
  })

  const confs = ['all', ...Object.keys(CONF_META)]
  const groups = ['all', ...Object.keys(GROUP_TEAMS)]

  let teams = Object.values(TEAMS)

  if (search) teams = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.short.toLowerCase().includes(search.toLowerCase())
  )
  if (conf !== 'all') teams = teams.filter(t => t.conf === conf)
  if (group !== 'all') teams = teams.filter(t => t.group === group)

  teams = [...teams].sort((a, b) => {
    if (sort === 'group') {
      const gCmp = a.group.localeCompare(b.group)
      if (gCmp !== 0) return gCmp
      return (rankMap[a.id] ?? 9) - (rankMap[b.id] ?? 9)
    }
    if (sort === 'pts') return (standingsMap[b.id]?.pts ?? 0) - (standingsMap[a.id]?.pts ?? 0)
    if (sort === 'rank') return a.rank - b.rank
    if (sort === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  // Confederation summary
  const confSummary = Object.entries(CONF_META).map(([key, meta]) => ({
    key, meta,
    count: Object.values(TEAMS).filter(t => t.conf === key).length,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white">All Teams</h2>
        <p className="text-white/40 text-sm mt-0.5">48 nations · 6 confederations · 12 groups</p>
      </div>

      {/* Confederation banner */}
      <div className="flex flex-wrap gap-2">
        {confSummary.map(({ key, meta, count }) => (
          <button
            key={key}
            onClick={() => setConf(conf === key ? 'all' : key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition-all
              ${conf === key ? `${meta.bg} ${meta.border} ${meta.color}` : 'bg-wc-card border-wc-border text-white/40 hover:text-white'}`}
          >
            <span className="font-black">{count}</span>
            <span className="text-xs">{key}</span>
          </button>
        ))}
        {conf !== 'all' && (
          <button onClick={() => setConf('all')} className="px-3 py-2 rounded-xl border border-wc-border text-white/30 text-sm hover:text-white transition-colors">
            ✕ Clear
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-wc-card border border-wc-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-wc-accent/50 transition-colors"
        />

        <div className="flex gap-2">
          <select
            value={group}
            onChange={e => setGroup(e.target.value)}
            className="bg-wc-card border border-wc-border rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-wc-accent/50 cursor-pointer"
          >
            {groups.map(g => (
              <option key={g} value={g}>{g === 'all' ? 'All Groups' : `Group ${g}`}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-wc-card border border-wc-border rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-wc-accent/50 cursor-pointer"
          >
            <option value="group">Sort: Group</option>
            <option value="pts">Sort: Points</option>
            <option value="rank">Sort: FIFA Rank</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="text-xs text-white/30 font-semibold">
        Showing {teams.length} of 48 teams
      </div>

      {/* Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-16 text-white/20">
          <div className="text-4xl mb-2">🔍</div>
          <p>No teams found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {teams.map(t => (
            <TeamCard
              key={t.id}
              team={t}
              standing={standingsMap[t.id]}
              rank={rankMap[t.id] ?? 3}
            />
          ))}
        </div>
      )}
    </div>
  )
}
