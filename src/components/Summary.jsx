import Flag from './Flag'
import { TEAMS, GROUP_TEAMS, CONF_META } from '../data/data'
import { calcStandings, getKoWinner } from '../utils/standings'

export default function Summary({ groupMatches, knockout }) {
  const allMatches = Object.values(groupMatches).flat()
  const played = allMatches.filter(m => m.homeScore !== null)
  const totalGoals = played.reduce((s,m) => s+Number(m.homeScore)+Number(m.awayScore), 0)

  const champion = knockout.winner
  const finalWinner = getKoWinner(knockout.final)
  const thirdW = getKoWinner(knockout.thirdPlace)
  const finalist1 = knockout.final.home
  const finalist2 = knockout.final.away
  const runnerUp = finalWinner ? (finalWinner===finalist1?finalist2:finalist1) : null

  // Group standings
  const allSt = {}, allRank = {}
  const qualified = [], thirdPlace = []
  Object.entries(GROUP_TEAMS).forEach(([g, ids]) => {
    const st = calcStandings(ids, groupMatches[g])
    st.forEach((s,i) => { allSt[s.id]=s; allRank[s.id]=i })
    qualified.push({ t:TEAMS[st[0].id], pos:1, g, pts:st[0].pts, gd:st[0].gd })
    qualified.push({ t:TEAMS[st[1].id], pos:2, g, pts:st[1].pts, gd:st[1].gd })
    thirdPlace.push({ t:TEAMS[st[2].id], pos:3, g, pts:st[2].pts, gd:st[2].gd })
  })
  const best3rd = [...thirdPlace].sort((a,b) => b.pts-a.pts||b.gd-a.gd).slice(0,8)

  const card = (title, children) => (
    <div className="card" style={{ padding:24 }}>
      <h3 style={{ fontWeight:900, fontSize:16, color:'white', marginBottom:18, display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid #2D2A6E', paddingBottom:14 }}>
        {title}
      </h3>
      {children}
    </div>
  )

  const statRow = (label, value, highlight) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>{label}</span>
      <span style={{ fontWeight:900, fontSize:14, color: highlight ? '#A855F7' : 'white' }}>{value}</span>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div>
        <h2 style={{ fontWeight:900, fontSize:24, color:'white' }}>Tournament Summary</h2>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:4 }}>Complete overview of all standings, qualifiers & results</p>
      </div>

      {/* Podium */}
      {(champion || thirdW || finalWinner) && (
        <div className="card-gold" style={{ padding:32 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(251,191,36,0.6)', letterSpacing:'0.12em', textTransform:'uppercase', textAlign:'center', marginBottom:28 }}>
            🏆 FIFA World Cup 2026 Final Standings
          </div>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-end', gap:20, flexWrap:'wrap' }}>

            {/* 2nd place */}
            {runnerUp && TEAMS[runnerUp] && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:'rgba(59,130,246,0.15)', border:'2px solid rgba(59,130,246,0.35)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <Flag code={TEAMS[runnerUp].flagCode} name={TEAMS[runnerUp].name} size="md" />
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:11, color:'#60A5FA', fontWeight:800 }}>🥈 Runner-up</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontWeight:700 }}>{TEAMS[runnerUp].name}</div>
                </div>
                <div style={{ width:2, height:40, background:'rgba(59,130,246,0.3)' }} />
              </div>
            )}

            {/* Champion */}
            {champion && TEAMS[champion] && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <div style={{ position:'relative' }}>
                  <div style={{ width:96, height:96, borderRadius:24, background:'rgba(251,191,36,0.15)', border:'3px solid rgba(251,191,36,0.5)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 0 40px rgba(251,191,36,0.25)' }}>
                    <Flag code={TEAMS[champion].flagCode} name={TEAMS[champion].name} size="xl" />
                  </div>
                  <div style={{ position:'absolute', top:-12, right:-12, fontSize:28 }}>👑</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:12, color:'rgba(251,191,36,0.7)', fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase' }}>World Champion</div>
                  <div style={{ fontSize:20, color:'#FBBF24', fontWeight:900 }}>{TEAMS[champion].name}</div>
                  <div style={{ fontSize:11, color:'rgba(251,191,36,0.4)' }}>FIFA World Cup 2026™</div>
                </div>
                <div style={{ width:2, height:56, background:'rgba(251,191,36,0.3)' }} />
              </div>
            )}

            {/* 3rd place */}
            {thirdW && TEAMS[thirdW] && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:'rgba(249,115,22,0.15)', border:'2px solid rgba(249,115,22,0.3)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <Flag code={TEAMS[thirdW].flagCode} name={TEAMS[thirdW].name} size="md" />
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:11, color:'#FB923C', fontWeight:800 }}>🥉 Third Place</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontWeight:700 }}>{TEAMS[thirdW].name}</div>
                </div>
                <div style={{ width:2, height:24, background:'rgba(249,115,22,0.3)' }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
        {card(<><span>📊</span> Group Stage Stats</>,
          <div>
            {statRow('Matches Played', `${played.length} / 96`)}
            {statRow('Total Goals', totalGoals)}
            {statRow('Avg Goals/Match', played.length ? (totalGoals/played.length).toFixed(2) : '–')}
            {statRow('Groups Complete', `${Object.entries(groupMatches).filter(([,m]) => m.every(x=>x.homeScore!==null)).length} / 12`)}
          </div>
        )}
        {card(<><span>⛨</span> Knockout Stats</>,
          <div>
            {[['R32', knockout.r32, 16],['R16', knockout.r16, 8],['QF', knockout.qf, 4],['SF', knockout.sf, 2]].map(([l, ms, t]) =>
              statRow(l, `${ms.filter(m=>m.homeScore!==null).length} / ${t}`)
            )}
            {statRow('Final played', knockout.final.homeScore!==null ? 'Yes ✓' : 'No', knockout.final.homeScore!==null)}
          </div>
        )}
        {card(<><span>🌍</span> Confederation Breakdown</>,
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {Object.entries(CONF_META).map(([key, m]) => {
              const total = Object.values(TEAMS).filter(t=>t.conf===key).length
              return (
                <div key={key}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                    <span style={{ fontWeight:700, color:m.color }}>{key}</span>
                    <span style={{ color:'rgba(255,255,255,0.35)' }}>{total} teams</span>
                  </div>
                  <div style={{ height:5, background:'rgba(255,255,255,0.07)', borderRadius:99 }}>
                    <div style={{ height:'100%', borderRadius:99, background:m.color, width:`${(total/48)*100}%`, opacity:0.7 }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Qualified teams */}
      {card(<><span>✅</span> Teams Advanced to Round of 32</>,
        <div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:16 }}>
            Top 2 from each group (24) + Best 8 third-place teams = 32
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:8 }}>
            {qualified.map(({ t, pos, g, pts }) => (
              <div key={t.id} style={{
                display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:10,
                background: pos===1 ? 'rgba(124,34,232,0.1)' : 'rgba(59,130,246,0.07)',
                border: pos===1 ? '1px solid rgba(124,34,232,0.25)' : '1px solid rgba(59,130,246,0.2)',
              }}>
                <Flag code={t.flagCode} name={t.name} size="sm" />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.85)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</div>
                  <div style={{ fontSize:9, color: pos===1?'#A855F7':'#60A5FA', fontWeight:800 }}>{pos===1?'1st':'2nd'} · Group {g} · {pts}pts</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid #2D2A6E' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(249,115,22,0.7)', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:12 }}>
              Best 8 Third-Place Teams (of 12)
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:8 }}>
              {best3rd.map(({ t, g, pts, gd }) => (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:10, background:'rgba(249,115,22,0.07)', border:'1px solid rgba(249,115,22,0.2)' }}>
                  <Flag code={t.flagCode} name={t.name} size="sm" />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:12, color:'rgba(255,255,255,0.8)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</div>
                    <div style={{ fontSize:9, color:'#FB923C', fontWeight:800 }}>3rd · Group {g} · {pts}pts · GD {gd>0?'+':''}{gd}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full group standings */}
      {card(<><span>📋</span> Full Group Stage Standings</>,
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(380px,1fr))', gap:24 }}>
          {Object.entries(GROUP_TEAMS).map(([g, ids]) => {
            const st = calcStandings(ids, groupMatches[g])
            return (
              <div key={g}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <div style={{ width:24, height:24, borderRadius:7, background:'linear-gradient(135deg,rgba(124,34,232,0.3),rgba(219,39,119,0.2))', border:'1px solid rgba(124,34,232,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:12, color:'#A855F7' }}>{g}</div>
                  <span style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Group {g}</span>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
                  <thead>
                    <tr style={{ color:'rgba(255,255,255,0.25)', textTransform:'uppercase', fontSize:9, letterSpacing:'0.06em' }}>
                      {['','Team','P','W','D','L','GF','GA','GD','PTS'].map((h,i) => (
                        <th key={i} style={{ padding:'4px 6px', textAlign:i<=1?'left':'center', fontWeight:700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {st.map((s,i) => {
                      const t = TEAMS[s.id]
                      const isQ = i<2
                      return (
                        <tr key={s.id} style={{ borderTop:'1px solid rgba(255,255,255,0.05)', background: isQ?'rgba(124,34,232,0.06)':i===2?'rgba(249,115,22,0.03)':'transparent' }}>
                          <td style={{ padding:'7px 6px', textAlign:'center' }}>
                            <span style={{ fontSize:9, fontWeight:900, color: isQ?'#A855F7':'rgba(255,255,255,0.2)' }}>{i+1}</span>
                          </td>
                          <td style={{ padding:'7px 6px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <Flag code={t.flagCode} name={t.name} size="xs" />
                              <span style={{ fontWeight:700, color:'rgba(255,255,255,0.8)' }}>{t.name}</span>
                            </div>
                          </td>
                          {[s.p,s.w,s.d,s.l,s.gf,s.ga].map((v,vi)=>(
                            <td key={vi} style={{ padding:'7px 6px', textAlign:'center', color:'rgba(255,255,255,0.45)', fontWeight:600 }}>{v}</td>
                          ))}
                          <td style={{ padding:'7px 6px', textAlign:'center', fontWeight:700, color: s.gd>0?'#4ADE80':s.gd<0?'#F87171':'rgba(255,255,255,0.25)' }}>
                            {s.gd>0?'+':''}{s.gd}
                          </td>
                          <td style={{ padding:'7px 6px', textAlign:'center' }}>
                            <span style={{ fontWeight:900, color: isQ?'#A855F7':'rgba(255,255,255,0.6)' }}>{s.pts}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
