import Flag from './Flag'
import { TEAMS, GROUP_TEAMS, CONF_META } from '../data/data'
import { calcStandings } from '../utils/standings'

function StatTile({ label, value, sub }) {
  return (
    <div className="card" style={{ padding:'20px 24px' }}>
      <div style={{ fontSize:32, fontWeight:900, background:'linear-gradient(135deg,#A855F7,#F97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>
        {value}
      </div>
      <div style={{ fontWeight:700, color:'rgba(255,255,255,0.8)', marginTop:6, fontSize:14 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{sub}</div>}
    </div>
  )
}

function GroupMini({ group, groupMatches }) {
  const teams = GROUP_TEAMS[group]
  const st = calcStandings(teams, groupMatches[group])
  const played = groupMatches[group].filter(m => m.homeScore !== null).length

  const pillCls = ['pill-1st','pill-2nd','pill-3rd','pill-4th']

  return (
    <div className="card" style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
      {/* Group header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width:28, height:28, borderRadius:8,
            background:'linear-gradient(135deg,rgba(124,34,232,0.3),rgba(219,39,119,0.2))',
            border:'1px solid rgba(124,34,232,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:900, fontSize:13, color:'#A855F7'
          }}>{group}</div>
          <span style={{ fontWeight:800, fontSize:12, color:'rgba(255,255,255,0.6)', letterSpacing:'0.08em', textTransform:'uppercase' }}>Group {group}</span>
        </div>
        <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>{played}/6</span>
      </div>

      {/* Standings rows */}
      {st.map((s, i) => {
        const t = TEAMS[s.id]
        const isQual = i < 2
        return (
          <div key={s.id} style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'7px 10px', borderRadius:9,
            background: isQual ? 'rgba(124,34,232,0.10)' : i===2 ? 'rgba(249,115,22,0.06)' : 'transparent',
            border: isQual ? '1px solid rgba(124,34,232,0.2)' : '1px solid transparent',
          }}>
            <span style={{ fontSize:10, fontWeight:900, color: isQual ? '#A855F7' : 'rgba(255,255,255,0.2)', width:14, textAlign:'center' }}>{i+1}</span>
            <Flag code={t.flagCode} name={t.name} size="xs" />
            <span style={{ flex:1, fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.85)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.short}</span>
            <span style={{ fontWeight:900, fontSize:13, color: isQual ? '#A855F7' : 'rgba(255,255,255,0.4)' }}>{s.pts}</span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', width:24, textAlign:'right' }}>
              {s.gd > 0 ? '+' : ''}{s.gd}
            </span>
          </div>
        )
      })}

      {/* Legend */}
      <div style={{ display:'flex', gap:10, fontSize:9, color:'rgba(255,255,255,0.2)', paddingTop:2, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:8, height:8, borderRadius:2, background:'rgba(124,34,232,0.3)', border:'1px solid rgba(124,34,232,0.4)' }} />
          Qualify
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{ width:8, height:8, borderRadius:2, background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)' }} />
          Best 3rd
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ groupMatches, knockout, setView }) {
  const allMatches = Object.values(groupMatches).flat()
  const played = allMatches.filter(m => m.homeScore !== null)
  const totalGoals = played.reduce((s,m) => s + Number(m.homeScore) + Number(m.awayScore), 0)
  const champion = knockout.winner
  const recent = [...played].reverse().slice(0, 5)

  const koRounds = [
    { l:'R32',       total:16, p: knockout.r32.filter(m=>m.homeScore!==null).length },
    { l:'R16',       total:8,  p: knockout.r16.filter(m=>m.homeScore!==null).length },
    { l:'QF',        total:4,  p: knockout.qf.filter(m=>m.homeScore!==null).length  },
    { l:'SF',        total:2,  p: knockout.sf.filter(m=>m.homeScore!==null).length  },
    { l:'3rd',       total:1,  p: knockout.thirdPlace.homeScore!==null ? 1 : 0       },
    { l:'Final',     total:1,  p: knockout.final.homeScore!==null ? 1 : 0            },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>

      {/* ── Hero ── */}
      <div style={{
        borderRadius:20,
        background:'linear-gradient(135deg, rgba(124,34,232,0.2) 0%, rgba(219,39,119,0.12) 40%, rgba(249,115,22,0.08) 80%, rgba(6,4,26,0) 100%)',
        border:'1px solid rgba(124,34,232,0.3)',
        padding:'32px 36px',
        position:'relative',
        overflow:'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,34,232,0.12),transparent)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(219,39,119,0.08),transparent)', pointerEvents:'none' }} />

        <div style={{ position:'relative', display:'flex', flexDirection:'column', gap:20 }}>
          {/* Title */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              {/* WC Trophy / Logo Badge */}
              <div style={{
                background:'linear-gradient(135deg,#7C22E8,#DB2777,#E8222E,#F97316)',
                borderRadius:16, padding:'12px 18px',
                display:'flex', alignItems:'center', gap:10, flexShrink:0,
              }}>
                <span style={{ fontSize:32 }}>🏆</span>
                <div style={{ lineHeight:1.1 }}>
                  <div style={{ fontWeight:900, fontSize:22, color:'white', letterSpacing:'-0.01em' }}>FIFA</div>
                  <div style={{ fontWeight:900, fontSize:18, color:'rgba(255,255,255,0.9)', letterSpacing:'0.05em' }}>WORLD CUP</div>
                  <div style={{ fontWeight:900, fontSize:28, color:'white', letterSpacing:'-0.02em', lineHeight:1 }}>2026™</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>
                  United States · Canada · Mexico
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', fontWeight:500 }}>
                  June 11 – July 19, 2026 · 48 Teams · 104 Matches
                </div>
                <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                  {[['🇺🇸','United States'],['🇨🇦','Canada'],['🇲🇽','Mexico']].map(([f,n]) => (
                    <span key={n} style={{ fontSize:12, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'3px 10px', color:'rgba(255,255,255,0.6)' }}>
                      {f} {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Champion or actions */}
          {champion ? (
            <div style={{
              display:'inline-flex', alignItems:'center', gap:16,
              background:'linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,191,36,0.05))',
              border:'2px solid rgba(251,191,36,0.4)',
              borderRadius:16, padding:'16px 24px',
              boxShadow:'0 0 40px rgba(251,191,36,0.15)',
              alignSelf:'flex-start',
            }}>
              <Flag code={TEAMS[champion].flagCode} name={TEAMS[champion].name} size="lg" />
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:'rgba(251,191,36,0.7)', letterSpacing:'0.15em', textTransform:'uppercase' }}>World Champion 2026</div>
                <div style={{ fontSize:24, fontWeight:900, color:'#FBBF24', marginTop:2 }}>{TEAMS[champion].name}</div>
              </div>
              <span style={{ fontSize:40 }}>👑</span>
            </div>
          ) : (
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={() => setView('groups')} className="btn-primary" style={{ fontSize:13 }}>
                ⚽ Edit Group Stage
              </button>
              <button onClick={() => setView('bracket')} className="btn-ghost" style={{ fontSize:13 }}>
                ⛨ Knockout Bracket
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16 }}>
        <StatTile label="Teams" value={48} sub="12 groups of 4" />
        <StatTile label="Matches Played" value={played.length} sub={`of 96 group stage`} />
        <StatTile label="Goals Scored" value={totalGoals} sub={played.length ? `avg ${(totalGoals/played.length).toFixed(1)}/match` : '–'} />
        <StatTile label="Host Cities" value={16} sub="USA · Canada · Mexico" />
      </div>

      {/* ── Groups + Sidebar ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24, alignItems:'start' }} className="lg:grid-cols-[1fr_320px] flex flex-col-reverse lg:flex-row">

        {/* Groups grid */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h2 style={{ fontWeight:900, fontSize:18, color:'white' }}>Group Stage Standings</h2>
            <button onClick={() => setView('groups')} style={{ fontSize:12, color:'#A855F7', fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
              Edit scores →
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12 }}>
            {Object.keys(GROUP_TEAMS).map(g => (
              <GroupMini key={g} group={g} groupMatches={groupMatches} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Recent results */}
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontWeight:800, fontSize:14, color:'white', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ background:'linear-gradient(135deg,#7C22E8,#F97316)', borderRadius:6, width:20, height:20, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>⚡</span>
              Recent Results
            </div>
            {recent.length === 0 ? (
              <div style={{ textAlign:'center', padding:'20px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>
                No results yet.<br />Enter scores in Group Stage.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {recent.map(m => {
                  const h = TEAMS[m.home], a = TEAMS[m.away]
                  const hs = Number(m.homeScore), as_ = Number(m.awayScore)
                  return (
                    <div key={m.id} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'8px 12px', border:'1px solid rgba(255,255,255,0.06)' }}>
                      <Flag code={h.flagCode} name={h.name} size="xs" />
                      <span style={{ flex:1, textAlign:'right', fontSize:12, fontWeight:700, color: hs>as_?'white':'rgba(255,255,255,0.35)' }}>{h.short}</span>
                      <div style={{ fontWeight:900, fontSize:13, color:'#A855F7', padding:'2px 8px', background:'rgba(124,34,232,0.15)', borderRadius:6, border:'1px solid rgba(124,34,232,0.3)', minWidth:48, textAlign:'center' }}>
                        {m.homeScore}–{m.awayScore}
                      </div>
                      <span style={{ flex:1, fontSize:12, fontWeight:700, color: as_>hs?'white':'rgba(255,255,255,0.35)' }}>{a.short}</span>
                      <Flag code={a.flagCode} name={a.name} size="xs" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* KO progress */}
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontWeight:800, fontSize:14, color:'white', marginBottom:14 }}>
              Tournament Progress
            </div>
            {/* Group stage bar */}
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
                <span style={{ fontWeight:700 }}>GROUP STAGE</span>
                <span style={{ color:'#A855F7', fontWeight:700 }}>{played.length}/96</span>
              </div>
              <div className="prog-bar">
                <div className="prog-fill" style={{ width:`${(played.length/96)*100}%` }} />
              </div>
            </div>

            <div style={{ borderTop:'1px solid #2D2A6E', paddingTop:14, display:'flex', flexDirection:'column', gap:10 }}>
              {koRounds.map(r => (
                <div key={r.l}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:5 }}>
                    <span style={{ fontWeight:700 }}>{r.l}</span>
                    <span>{r.p}/{r.total}</span>
                  </div>
                  <div className="prog-bar" style={{ height:4 }}>
                    <div className="prog-fill" style={{ width:`${r.total?(r.p/r.total)*100:0}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Confederation */}
            <div style={{ borderTop:'1px solid #2D2A6E', paddingTop:14, marginTop:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Teams by Confederation</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {Object.entries(CONF_META).map(([key, m]) => {
                  const count = Object.values(TEAMS).filter(t => t.conf === key).length
                  return (
                    <div key={key} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:m.color, width:68 }}>{key}</span>
                      <div style={{ flex:1, height:4, background:'rgba(255,255,255,0.06)', borderRadius:99 }}>
                        <div style={{ height:'100%', borderRadius:99, background:m.color, width:`${(count/48)*100}%`, opacity:0.8 }} />
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', width:16, textAlign:'right' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
