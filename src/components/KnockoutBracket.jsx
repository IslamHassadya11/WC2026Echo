import { useState } from 'react'
import Flag from './Flag'
import { TEAMS } from '../data/data'
import { getKoWinner } from '../utils/standings'

const ALL_OPTS = [
  { value:'', label:'— Select Team —' },
  ...Object.values(TEAMS).sort((a,b) => a.name.localeCompare(b.name)).map(t => ({ value:t.id, label:t.name }))
]

function TeamSelect({ value, onChange, winner }) {
  const t = value ? TEAMS[value] : null
  const isWinner = value && value === winner
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
      {t
        ? <Flag code={t.flagCode} name={t.name} size="xs" />
        : <div style={{ width:20, height:14, borderRadius:3, background:'rgba(255,255,255,0.1)', flexShrink:0 }} />
      }
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        style={{
          flex:1, background:'transparent', border:'none', outline:'none', cursor:'pointer',
          fontSize:12, fontWeight: isWinner ? 800 : 600,
          color: isWinner ? '#A855F7' : value ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)',
          minWidth:0,
        }}
      >
        {ALL_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function ScoreIn({ value, onChange, small }) {
  const sz = small ? 26 : 36
  return (
    <input
      type="number" min="0" max="30"
      value={value ?? ''}
      placeholder="–"
      onChange={e => onChange(e.target.value===''?null:Math.max(0,Number(e.target.value)))}
      style={{
        width:sz, height:sz, textAlign:'center', fontSize: small?11:16, fontWeight:900,
        background:'#06041A', border:'2px solid #2D2A6E', borderRadius:8,
        color:'white', outline:'none', flexShrink:0,
      }}
      onFocus={e=>e.target.style.borderColor='#7C22E8'}
      onBlur={e=>e.target.style.borderColor='#2D2A6E'}
    />
  )
}

function KoMatchCard({ match, onUpdate, label, isFinal }) {
  const winner = getKoWinner(match)
  const showPens = match.homeScore !== null && match.awayScore !== null &&
    Number(match.homeScore) === Number(match.awayScore)

  return (
    <div style={{
      background:'#13113A', overflow:'hidden', borderRadius:14,
      border: isFinal ? '1px solid rgba(251,191,36,0.3)' : '1px solid #2D2A6E',
      boxShadow: isFinal ? '0 0 30px rgba(251,191,36,0.1)' : 'none',
      transition:'border-color 0.15s',
    }}>
      {label && (
        <div style={{
          padding:'7px 14px', fontSize:10, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase',
          background: isFinal ? 'rgba(251,191,36,0.08)' : 'rgba(124,34,232,0.08)',
          borderBottom:'1px solid #2D2A6E',
          color: isFinal ? '#FBBF24' : '#A855F7',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <span>{label}</span>
          {winner && <span style={{ color:'#4ADE80', fontSize:9, fontWeight:700 }}>✓ {TEAMS[winner]?.short} advances</span>}
        </div>
      )}

      {/* Home row */}
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
        background: winner && winner===match.home ? 'rgba(124,34,232,0.15)' : 'transparent',
      }}>
        <TeamSelect value={match.home} onChange={v => onUpdate('home',v)} winner={winner} />
        <ScoreIn value={match.homeScore} onChange={v => onUpdate('homeScore',v)} />
      </div>

      {/* Away row */}
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
        borderTop:'1px solid #2D2A6E',
        background: winner && winner===match.away ? 'rgba(124,34,232,0.15)' : 'transparent',
      }}>
        <TeamSelect value={match.away} onChange={v => onUpdate('away',v)} winner={winner} />
        <ScoreIn value={match.awayScore} onChange={v => onUpdate('awayScore',v)} />
      </div>

      {/* Penalties row */}
      {showPens && (
        <div style={{ padding:'8px 14px', background:'rgba(249,115,22,0.06)', borderTop:'1px solid rgba(249,115,22,0.15)', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:10, color:'rgba(249,115,22,0.7)', fontWeight:700, flexShrink:0 }}>PENS</span>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {match.home && <Flag code={TEAMS[match.home]?.flagCode} name="" size="xs" />}
            <ScoreIn value={match.homePens} onChange={v => onUpdate('homePens',v)} small />
            <span style={{ color:'rgba(255,255,255,0.2)', fontWeight:900, fontSize:12 }}>–</span>
            <ScoreIn value={match.awayPens} onChange={v => onUpdate('awayPens',v)} small />
            {match.away && <Flag code={TEAMS[match.away]?.flagCode} name="" size="xs" />}
          </div>
        </div>
      )}
    </div>
  )
}

function MiniCard({ match }) {
  const w = getKoWinner(match)
  const rows = [
    { t: match.home ? TEAMS[match.home] : null, s: match.homeScore, side:'home' },
    { t: match.away ? TEAMS[match.away] : null, s: match.awayScore, side:'away' },
  ]
  return (
    <div style={{ background:'#0E0C2C', border:'1px solid #2D2A6E', borderRadius:9, overflow:'hidden', fontSize:11 }}>
      {rows.map(({t,s,side},i) => (
        <div key={side} style={{
          display:'flex', alignItems:'center', gap:6, padding:'5px 8px',
          borderTop: i>0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          background: w && t && w===t.id ? 'rgba(124,34,232,0.15)' : 'transparent',
        }}>
          {t
            ? <Flag code={t.flagCode} name={t.name} size="xs" />
            : <div style={{width:18,height:12,background:'rgba(255,255,255,0.08)',borderRadius:2,flexShrink:0}} />
          }
          <span style={{ flex:1, fontWeight:700, color: w&&t&&w===t.id?'white':'rgba(255,255,255,0.45)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {t?.short || '?'}
          </span>
          <span style={{ fontWeight:900, color: w&&t&&w===t.id?'#A855F7':'rgba(255,255,255,0.3)', minWidth:14, textAlign:'right' }}>
            {s ?? '–'}
          </span>
        </div>
      ))}
    </div>
  )
}

const ROUND_META = {
  r32:'Round of 32', r16:'Round of 16', qf:'Quarter Finals', sf:'Semi Finals', final:'Final', '3rd':'3rd Place'
}

export default function KnockoutBracket({ knockout, onUpdate, setWinner }) {
  const [tab, setTab] = useState('r32')
  const champion = knockout.winner
  const finalWinner = getKoWinner(knockout.final)

  const update = (round, matchId, field, value) => onUpdate(round, matchId, field, value)

  const tabBtn = (id) => (
    <button key={id} onClick={() => setTab(id)} style={{
      padding:'8px 16px', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
      background: tab===id ? 'linear-gradient(135deg,#7C22E8,#DB2777)' : 'rgba(255,255,255,0.05)',
      border: tab===id ? 'none' : '1px solid #2D2A6E',
      color: tab===id ? 'white' : 'rgba(255,255,255,0.45)',
      flexShrink:0,
    }}>{ROUND_META[id]}</button>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ fontWeight:900, fontSize:24, color:'white' }}>Knockout Bracket</h2>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:4 }}>
            R32 → R16 → QF → SF → Final · Pick teams & enter scores. Draw = penalty tab appears.
          </p>
        </div>
        {champion && TEAMS[champion] && (
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderRadius:14, background:'linear-gradient(135deg,rgba(251,191,36,0.12),rgba(251,191,36,0.04))', border:'2px solid rgba(251,191,36,0.35)', boxShadow:'0 0 30px rgba(251,191,36,0.12)' }}>
            <Flag code={TEAMS[champion].flagCode} name={TEAMS[champion].name} size="md" />
            <div>
              <div style={{ fontSize:9, color:'rgba(251,191,36,0.6)', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase' }}>Champion 2026</div>
              <div style={{ fontWeight:900, fontSize:18, color:'#FBBF24' }}>{TEAMS[champion].name}</div>
            </div>
            <span style={{ fontSize:28 }}>👑</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:2 }}>
        {['r32','r16','qf','sf','final','3rd'].map(tabBtn)}
      </div>

      {/* Round of 32 */}
      {tab === 'r32' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
          {knockout.r32.map((m,i) => (
            <KoMatchCard key={m.id} match={m} label={`R32 · Match ${i+1}`} onUpdate={(f,v) => update('r32',m.id,f,v)} />
          ))}
        </div>
      )}

      {/* R16 */}
      {tab === 'r16' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
          {knockout.r16.map((m,i) => (
            <KoMatchCard key={m.id} match={m} label={`Round of 16 · Match ${i+1}`} onUpdate={(f,v) => update('r16',m.id,f,v)} />
          ))}
        </div>
      )}

      {/* QF */}
      {tab === 'qf' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14, maxWidth:900 }}>
          {knockout.qf.map((m,i) => (
            <KoMatchCard key={m.id} match={m} label={`Quarter Final ${i+1}`} onUpdate={(f,v) => update('qf',m.id,f,v)} />
          ))}
        </div>
      )}

      {/* SF */}
      {tab === 'sf' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14, maxWidth:700 }}>
          {knockout.sf.map((m,i) => (
            <KoMatchCard key={m.id} match={m} label={`Semi Final ${i+1}`} onUpdate={(f,v) => update('sf',m.id,f,v)} />
          ))}
        </div>
      )}

      {/* Final */}
      {tab === 'final' && (
        <div style={{ maxWidth:420, display:'flex', flexDirection:'column', gap:16 }}>
          <KoMatchCard match={knockout.final} label="🏆 FINAL — July 19, 2026 · MetLife Stadium" isFinal
            onUpdate={(f,v) => update('final','FINAL',f,v)} />
          <div className="card-gold" style={{ padding:20 }}>
            <div style={{ fontSize:10, fontWeight:800, color:'rgba(251,191,36,0.6)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>
              Declare World Champion 2026
            </div>
            <div style={{ display:'flex', gap:12 }}>
              {[knockout.final.home, knockout.final.away].filter(Boolean).map(tid => {
                const t = TEAMS[tid], isCh = champion===tid
                return (
                  <button key={tid} onClick={() => setWinner(isCh?null:tid)} style={{
                    flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'16px 12px',
                    borderRadius:14, cursor:'pointer', transition:'all 0.2s',
                    background: isCh ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${isCh ? 'rgba(251,191,36,0.5)' : '#2D2A6E'}`,
                    boxShadow: isCh ? '0 0 25px rgba(251,191,36,0.2)' : 'none',
                  }}>
                    <Flag code={t.flagCode} name={t.name} size="lg" />
                    <span style={{ fontWeight:800, fontSize:13, color: isCh?'#FBBF24':'rgba(255,255,255,0.7)' }}>{t.name}</span>
                    {isCh && <span style={{ fontSize:11, color:'#FBBF24', fontWeight:800 }}>👑 CHAMPION</span>}
                  </button>
                )
              })}
              {!knockout.final.home && !knockout.final.away && (
                <p style={{ color:'rgba(255,255,255,0.2)', fontSize:13, padding:20, textAlign:'center' }}>Select finalist teams above</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3rd Place */}
      {tab === '3rd' && (
        <div style={{ maxWidth:380 }}>
          <KoMatchCard match={knockout.thirdPlace} label="3rd Place Play-off" onUpdate={(f,v) => update('thirdPlace','TP',f,v)} />
        </div>
      )}

      {/* Mini overview */}
      <div className="card" style={{ padding:20, overflowX:'auto' }}>
        <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:16 }}>
          Full Bracket Overview
        </div>
        <div style={{ display:'flex', gap:12, minWidth:'max-content', alignItems:'flex-start' }}>
          {[
            { label:'R32', matches: knockout.r32.slice(0,8) },
            { label:'',    matches: knockout.r32.slice(8)   },
            { label:'R16', matches: knockout.r16             },
            { label:'QF',  matches: knockout.qf              },
            { label:'SF',  matches: knockout.sf              },
          ].map((col, ci) => (
            <div key={ci} style={{ width:155, flexShrink:0 }}>
              {col.label && (
                <div style={{ textAlign:'center', marginBottom:8, fontSize:10, fontWeight:800, color:'rgba(124,34,232,0.7)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
                  {col.label}
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap: ci>=3?18:ci>=2?10:5 }}>
                {col.matches.map(m => <MiniCard key={m.id} match={m} />)}
              </div>
            </div>
          ))}
          <div style={{ width:155, flexShrink:0 }}>
            <div style={{ textAlign:'center', marginBottom:8, fontSize:10, fontWeight:800, color:'rgba(251,191,36,0.7)', letterSpacing:'0.1em', textTransform:'uppercase' }}>FINAL</div>
            <MiniCard match={knockout.final} />
            {champion && TEAMS[champion] && (
              <div style={{ marginTop:10, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <Flag code={TEAMS[champion].flagCode} name={TEAMS[champion].name} size="sm" />
                <div style={{ fontSize:10, color:'#FBBF24', fontWeight:900 }}>{TEAMS[champion].name} 👑</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
