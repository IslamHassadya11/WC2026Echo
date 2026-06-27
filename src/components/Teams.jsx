import { useState } from 'react'
import Flag from './Flag'
import { TEAMS, GROUP_TEAMS, CONF_META } from '../data/data'
import { calcStandings } from '../utils/standings'

export default function Teams({ groupMatches }) {
  const [conf, setConf]     = useState('all')
  const [group, setGroup]   = useState('all')
  const [sort, setSort]     = useState('group')
  const [search, setSearch] = useState('')

  // Build standings
  const stMap = {}, rankMap = {}
  Object.entries(GROUP_TEAMS).forEach(([g, ids]) => {
    calcStandings(ids, groupMatches[g]).forEach((s, i) => {
      stMap[s.id] = s; rankMap[s.id] = i
    })
  })

  let teams = Object.values(TEAMS)
  if (search) teams = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.short.toLowerCase().includes(search.toLowerCase()))
  if (conf  !== 'all') teams = teams.filter(t => t.conf  === conf)
  if (group !== 'all') teams = teams.filter(t => t.group === group)
  teams = [...teams].sort((a,b) => {
    if (sort==='group') { const gc=a.group.localeCompare(b.group); return gc||((rankMap[a.id]??9)-(rankMap[b.id]??9)) }
    if (sort==='pts')   return (stMap[b.id]?.pts??0)-(stMap[a.id]?.pts??0)
    if (sort==='rank')  return a.rank-b.rank
    return a.name.localeCompare(b.name)
  })

  const pillStyle = (c) => ({
    display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:7, fontSize:10, fontWeight:800,
    background: c.bg, border:`1px solid ${c.border}`, color: c.color,
  })

  const rankColors = [
    { bg:'rgba(124,34,232,0.15)', border:'rgba(124,34,232,0.35)', c:'#A855F7', label:'1st' },
    { bg:'rgba(59,130,246,0.12)', border:'rgba(59,130,246,0.3)',  c:'#60A5FA', label:'2nd' },
    { bg:'rgba(249,115,22,0.12)', border:'rgba(249,115,22,0.28)', c:'#FB923C', label:'3rd' },
    { bg:'rgba(255,255,255,0.05)',border:'rgba(255,255,255,0.1)', c:'rgba(255,255,255,0.3)',label:'4th' },
  ]

  const filterBtn = (key, label, active, onClick) => (
    <button key={key} onClick={onClick} style={{
      padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
      background: active ? 'linear-gradient(135deg,#7C22E8,#DB2777)' : 'rgba(255,255,255,0.05)',
      border: active ? 'none' : '1px solid #2D2A6E',
      color: active ? 'white' : 'rgba(255,255,255,0.4)',
    }}>{label}</button>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h2 style={{ fontWeight:900, fontSize:24, color:'white' }}>All 48 Teams</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:4 }}>6 confederations · 12 groups · FIFA World Cup 2026</p>
      </div>

      {/* Confederation filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {filterBtn('all','All Confederations', conf==='all', () => setConf('all'))}
        {Object.entries(CONF_META).map(([key, m]) => {
          const count = Object.values(TEAMS).filter(t=>t.conf===key).length
          return filterBtn(key, `${key} (${count})`, conf===key, () => setConf(conf===key?'all':key))
        })}
      </div>

      {/* Search + filters row */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <input
          type="text" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍  Search teams..."
          style={{ flex:1, minWidth:180, background:'#13113A', border:'1px solid #2D2A6E', borderRadius:10, padding:'10px 14px', fontSize:13, color:'white', outline:'none' }}
          onFocus={e=>e.target.style.borderColor='#7C22E8'}
          onBlur={e=>e.target.style.borderColor='#2D2A6E'}
        />
        <select value={group} onChange={e=>setGroup(e.target.value)}
          style={{ background:'#13113A', border:'1px solid #2D2A6E', borderRadius:10, padding:'10px 14px', fontSize:12, color:'rgba(255,255,255,0.7)', outline:'none', cursor:'pointer' }}>
          <option value="all">All Groups</option>
          {Object.keys(GROUP_TEAMS).map(g => <option key={g} value={g}>Group {g}</option>)}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{ background:'#13113A', border:'1px solid #2D2A6E', borderRadius:10, padding:'10px 14px', fontSize:12, color:'rgba(255,255,255,0.7)', outline:'none', cursor:'pointer' }}>
          <option value="group">Sort: Group</option>
          <option value="pts">Sort: Points</option>
          <option value="rank">Sort: FIFA Rank</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontWeight:600 }}>
        {teams.length} of 48 teams
      </div>

      {/* Team grid */}
      {teams.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <p style={{ fontSize:14 }}>No teams found</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
          {teams.map(t => {
            const s = stMap[t.id]
            const r = rankMap[t.id] ?? 3
            const rc = rankColors[r] || rankColors[3]
            const cm = CONF_META[t.conf]

            return (
              <div key={t.id} className="team-card">
                {/* Flag + name */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <Flag code={t.flagCode} name={t.name} size="md" />
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:800, color:'white', fontSize:14, lineHeight:1.2 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>FIFA #{t.rank}</div>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                  <span style={{ ...pillStyle(cm) }}>{t.conf}</span>
                  <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:7, fontSize:10, fontWeight:800, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)' }}>
                    Group {t.group}
                  </span>
                  {t.host && (
                    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:7, fontSize:10, fontWeight:800, background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', color:'#F97316' }}>
                      HOST
                    </span>
                  )}
                </div>

                {/* Position badge */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: s ? 10 : 0 }}>
                  <span style={{ display:'inline-flex', padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:900, background:rc.bg, border:`1px solid ${rc.border}`, color:rc.c }}>
                    {rc.label} in Group
                  </span>
                  {s && <span style={{ fontSize:20, fontWeight:900, color:'#A855F7' }}>{s.pts} pts</span>}
                </div>

                {/* Stats grid */}
                {s && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                    {[['W',s.w,'#4ADE80'],['D',s.d,'#FBBF24'],['L',s.l,'#F87171'],['GD',s.gd>=0?`+${s.gd}`:s.gd,s.gd>0?'#4ADE80':s.gd<0?'#F87171':'rgba(255,255,255,0.3)']].map(([lbl,val,clr])=>(
                      <div key={lbl} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'6px 4px', textAlign:'center' }}>
                        <div style={{ fontWeight:900, fontSize:14, color:clr }}>{val}</div>
                        <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginTop:1 }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
