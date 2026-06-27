import { useState } from 'react'
import Flag from './Flag'
import { TEAMS, GROUP_TEAMS } from '../data/data'
import { calcStandings } from '../utils/standings'

function ScoreBox({ value, onChange }) {
  return (
    <input
      type="number" min="0" max="99"
      value={value ?? ''}
      placeholder="–"
      onChange={e => onChange(e.target.value === '' ? null : Math.max(0, Number(e.target.value)))}
      className="score-box"
    />
  )
}

function MatchRow({ match, onUpdate }) {
  const h = TEAMS[match.home], a = TEAMS[match.away]
  const played = match.homeScore !== null
  const hs = Number(match.homeScore), as_ = Number(match.awayScore)

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'10px 12px', borderRadius:12,
      background: played ? 'rgba(255,255,255,0.04)' : 'transparent',
      border: `1px solid ${played ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
      transition:'all 0.15s',
    }}>
      <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', minWidth:28, fontFamily:'monospace' }}>{match.date?.slice(4)}</span>

      {/* Home */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, justifyContent:'flex-end', minWidth:0, opacity: played && hs<as_ ? 0.35 : 1 }}>
        <span style={{ fontWeight:700, fontSize:12, color: played&&hs>as_?'white':'rgba(255,255,255,0.6)', textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}
          className="hidden sm:block">{h.name}</span>
        <span style={{ fontWeight:700, fontSize:12, color: played&&hs>as_?'white':'rgba(255,255,255,0.6)', textAlign:'right' }}
          className="sm:hidden">{h.short}</span>
        <Flag code={h.flagCode} name={h.name} size="sm" />
      </div>

      {/* Score */}
      <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
        <ScoreBox value={match.homeScore} onChange={v => onUpdate(match.id, v, match.awayScore)} />
        <span style={{ color:'rgba(255,255,255,0.2)', fontWeight:900, fontSize:16 }}>:</span>
        <ScoreBox value={match.awayScore} onChange={v => onUpdate(match.id, match.homeScore, v)} />
      </div>

      {/* Away */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0, opacity: played && as_<hs ? 0.35 : 1 }}>
        <Flag code={a.flagCode} name={a.name} size="sm" />
        <span style={{ fontWeight:700, fontSize:12, color: played&&as_>hs?'white':'rgba(255,255,255,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}
          className="hidden sm:block">{a.name}</span>
        <span style={{ fontWeight:700, fontSize:12, color: played&&as_>hs?'white':'rgba(255,255,255,0.6)' }}
          className="sm:hidden">{a.short}</span>
      </div>

      {/* Clear */}
      {played && (
        <button onClick={() => onUpdate(match.id, null, null)} style={{ color:'rgba(255,255,255,0.15)', background:'none', border:'none', cursor:'pointer', fontSize:13, lineHeight:1, flexShrink:0 }}
          title="Clear">✕</button>
      )}
    </div>
  )
}

function StandingsTable({ group, groupMatches }) {
  const st = calcStandings(GROUP_TEAMS[group], groupMatches[group])

  return (
    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
      <thead>
        <tr style={{ color:'rgba(255,255,255,0.3)', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase' }}>
          {['','Team','P','W','D','L','GF','GA','GD','PTS','Form'].map((h,i) => (
            <th key={i} style={{ padding:'6px 8px', textAlign: i<=1?'left':'center', fontWeight:700, whiteSpace:'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {st.map((s, i) => {
          const t = TEAMS[s.id]
          const isQ = i < 2
          const is3 = i === 2
          const matches = groupMatches[group].filter(m => (m.home===s.id||m.away===s.id) && m.homeScore!==null)
          const form = matches.slice(-3).map(m => {
            const mine = m.home===s.id ? Number(m.homeScore) : Number(m.awayScore)
            const opp  = m.home===s.id ? Number(m.awayScore) : Number(m.homeScore)
            return mine>opp?'W':opp>mine?'L':'D'
          })

          return (
            <tr key={s.id} style={{
              borderTop:'1px solid rgba(255,255,255,0.05)',
              background: isQ ? 'rgba(124,34,232,0.07)' : is3 ? 'rgba(249,115,22,0.04)' : 'transparent'
            }}>
              <td style={{ padding:'9px 8px', textAlign:'center' }}>
                <span style={{ fontSize:10, fontWeight:900, color: isQ?'#A855F7':'rgba(255,255,255,0.2)' }}>{i+1}</span>
              </td>
              <td style={{ padding:'9px 8px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Flag code={t.flagCode} name={t.name} size="sm" />
                  <div>
                    <div style={{ fontWeight:700, color:'rgba(255,255,255,0.9)', whiteSpace:'nowrap' }}>{t.name}</div>
                    {t.host && <div style={{ fontSize:9, color:'#F97316', fontWeight:800, letterSpacing:'0.06em' }}>HOST</div>}
                  </div>
                </div>
              </td>
              {[s.p, s.w, s.d, s.l, s.gf, s.ga].map((v, vi) => (
                <td key={vi} style={{ padding:'9px 8px', textAlign:'center', color:'rgba(255,255,255,0.5)', fontWeight:600 }}>{v}</td>
              ))}
              <td style={{ padding:'9px 8px', textAlign:'center', fontWeight:700, color: s.gd>0?'#4ADE80':s.gd<0?'#F87171':'rgba(255,255,255,0.3)' }}>
                {s.gd>0?'+':''}{s.gd}
              </td>
              <td style={{ padding:'9px 8px', textAlign:'center' }}>
                <span style={{ fontWeight:900, fontSize:14, color: isQ?'#A855F7':'rgba(255,255,255,0.7)' }}>{s.pts}</span>
              </td>
              <td style={{ padding:'9px 8px' }}>
                <div style={{ display:'flex', gap:3 }}>
                  {Array.from({length:3}, (_,fi) => {
                    const f = form[fi]
                    return (
                      <div key={fi} style={{
                        width:16, height:16, borderRadius:4, fontSize:8, fontWeight:900,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        background: f==='W'?'rgba(74,222,128,0.25)':f==='L'?'rgba(248,113,113,0.25)':f?'rgba(251,191,36,0.2)':'rgba(255,255,255,0.05)',
                        color: f==='W'?'#4ADE80':f==='L'?'#F87171':f?'#FBBF24':'rgba(255,255,255,0.1)'
                      }}>{f||''}</div>
                    )
                  })}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function GroupCard({ group, groupMatches, onUpdate }) {
  const [tab, setTab] = useState('standings')
  const played = groupMatches[group].filter(m => m.homeScore !== null).length

  const tabStyle = (active) => ({
    padding:'5px 14px', fontSize:11, fontWeight:700, cursor:'pointer', border:'none',
    borderRadius:7, transition:'all 0.15s',
    background: active ? 'rgba(124,34,232,0.25)' : 'transparent',
    color: active ? '#A855F7' : 'rgba(255,255,255,0.35)',
  })

  return (
    <div className="card" style={{ overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:'1px solid #2D2A6E', background:'rgba(124,34,232,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:32, height:32, borderRadius:10,
            background:'linear-gradient(135deg,rgba(124,34,232,0.4),rgba(219,39,119,0.3))',
            border:'1px solid rgba(124,34,232,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:900, fontSize:16, color:'white'
          }}>{group}</div>
          <div>
            <div style={{ fontWeight:800, color:'white', fontSize:14 }}>Group {group}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{played}/6 played</div>
          </div>
        </div>

        <div style={{ display:'flex', gap:2, background:'rgba(0,0,0,0.2)', borderRadius:9, padding:3, border:'1px solid #2D2A6E' }}>
          <button style={tabStyle(tab==='standings')} onClick={() => setTab('standings')}>Standings</button>
          <button style={tabStyle(tab==='matches')}   onClick={() => setTab('matches')}>Matches</button>
        </div>
      </div>

      <div style={{ padding:12 }}>
        {tab === 'standings' ? (
          <StandingsTable group={group} groupMatches={groupMatches} />
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {groupMatches[group].map(m => (
              <MatchRow key={m.id} match={m} onUpdate={(id, hs, as_) => onUpdate(group, id, hs, as_)} />
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

  const demoFill = () => {
    if (!confirm('Fill all missing scores with demo data?')) return
    Object.entries(GROUP_TEAMS).forEach(([group]) => {
      groupMatches[group].forEach(m => {
        if (m.homeScore === null) onUpdate(group, m.id, Math.floor(Math.random()*4), Math.floor(Math.random()*4))
      })
    })
  }

  const filterBtn = (id, label) => (
    <button
      key={id}
      onClick={() => setFilter(id)}
      style={{
        padding:'7px 14px', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer',
        background: filter===id ? 'linear-gradient(135deg,#7C22E8,#DB2777)' : 'rgba(255,255,255,0.05)',
        border: filter===id ? 'none' : '1px solid #2D2A6E',
        color: filter===id ? 'white' : 'rgba(255,255,255,0.45)',
        transition:'all 0.15s',
      }}
    >{label}</button>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div>
          <h2 style={{ fontWeight:900, fontSize:24, color:'white' }}>Group Stage</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:4 }}>
            {played} of 96 matches played · Click <strong style={{color:'rgba(255,255,255,0.6)'}}>Matches</strong> tab to enter scores
          </p>
        </div>
        <button onClick={demoFill} className="btn-ghost" style={{ fontSize:12, flexShrink:0 }}>⚡ Demo Fill</button>
      </div>

      {/* Filter bar */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {filterBtn('all', 'All Groups')}
        {groups.map(g => filterBtn(g, `Group ${g}`))}
      </div>

      {/* Cards */}
      <div style={{ display:'grid', gridTemplateColumns: filter==='all' ? 'repeat(auto-fill,minmax(480px,1fr))' : '1fr', gap:16, maxWidth: filter!=='all' ? 720 : undefined }}>
        {groups.filter(g => filter==='all' || filter===g).map(g => (
          <GroupCard key={g} group={g} groupMatches={groupMatches} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  )
}
