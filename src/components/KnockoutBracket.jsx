import { useState } from 'react'
import { TEAMS } from '../data/data'
import { getKoWinner } from '../utils/standings'

const ALL_TEAM_OPTIONS = [{ value: '', label: '— Select Team —' }, ...Object.values(TEAMS).map(t => ({ value: t.id, label: `${t.flag} ${t.name}` }))]

function TeamPicker({ value, onChange, highlight }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value || null)}
      className={`w-full bg-wc-dark border rounded-lg px-2 py-1 text-xs font-semibold transition-colors focus:outline-none focus:border-wc-gold cursor-pointer
        ${highlight ? 'border-wc-accent/50 text-wc-accent' : 'border-wc-border text-white/70 hover:border-wc-border/80'}`}
    >
      {ALL_TEAM_OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

function KoScoreInput({ value, onChange }) {
  return (
    <input
      type="number"
      min="0"
      max="30"
      value={value ?? ''}
      placeholder="–"
      onChange={e => onChange(e.target.value === '' ? null : Math.max(0, Number(e.target.value)))}
      className="w-8 h-7 text-center text-sm font-black bg-wc-dark border border-wc-border rounded focus:outline-none focus:border-wc-gold text-white transition-colors"
    />
  )
}

function KoMatch({ match, onUpdate, label, size = 'normal' }) {
  const winner = getKoWinner(match)
  const homeTeam = match.home ? TEAMS[match.home] : null
  const awayTeam = match.away ? TEAMS[match.away] : null
  const showPens = match.homeScore !== null && match.awayScore !== null &&
    Number(match.homeScore) === Number(match.awayScore)

  const isLarge = size === 'large'

  return (
    <div className={`card overflow-hidden ${isLarge ? 'gold-glow border-wc-accent/30' : ''}`}>
      {label && (
        <div className={`px-3 py-1.5 border-b border-wc-border flex items-center justify-between ${isLarge ? 'bg-wc-accent/10' : 'bg-wc-navy/50'}`}>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isLarge ? 'text-wc-accent' : 'text-white/40'}`}>
            {label}
          </span>
          {winner && (
            <span className="text-[10px] text-green-400 font-bold">
              {TEAMS[winner]?.flag} {TEAMS[winner]?.short} advances
            </span>
          )}
        </div>
      )}

      {/* Home row */}
      <div className={`px-3 py-2 border-b border-wc-border/50 ${winner === match.home ? 'bg-green-500/8' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <TeamPicker
              value={match.home}
              onChange={v => onUpdate('home', v)}
              highlight={winner === match.home}
            />
          </div>
          <KoScoreInput value={match.homeScore} onChange={v => onUpdate('homeScore', v)} />
        </div>
        {showPens && (
          <div className="flex items-center gap-1 mt-1 justify-end">
            <span className="text-[10px] text-white/30">pens:</span>
            <input
              type="number" min="0" max="30"
              value={match.homePens ?? ''}
              placeholder="?"
              onChange={e => onUpdate('homePens', e.target.value === '' ? null : Number(e.target.value))}
              className="w-7 h-5 text-center text-[11px] font-bold bg-wc-dark border border-amber-500/30 rounded text-wc-accent focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Away row */}
      <div className={`px-3 py-2 ${winner === match.away ? 'bg-green-500/8' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <TeamPicker
              value={match.away}
              onChange={v => onUpdate('away', v)}
              highlight={winner === match.away}
            />
          </div>
          <KoScoreInput value={match.awayScore} onChange={v => onUpdate('awayScore', v)} />
        </div>
        {showPens && (
          <div className="flex items-center gap-1 mt-1 justify-end">
            <span className="text-[10px] text-white/30">pens:</span>
            <input
              type="number" min="0" max="30"
              value={match.awayPens ?? ''}
              placeholder="?"
              onChange={e => onUpdate('awayPens', e.target.value === '' ? null : Number(e.target.value))}
              className="w-7 h-5 text-center text-[11px] font-bold bg-wc-dark border border-amber-500/30 rounded text-wc-accent focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function RoundColumn({ title, matches, roundKey, onUpdate, matchLabels = {}, matchSize = {} }) {
  return (
    <div className="flex-shrink-0 w-56 xl:w-64">
      <div className="text-center mb-3">
        <div className="inline-block px-4 py-1 rounded-full bg-wc-accent/10 border border-wc-accent/20 text-wc-accent text-xs font-black uppercase tracking-widest">
          {title}
        </div>
        <div className="text-[10px] text-white/20 mt-1">{matches.length} match{matches.length !== 1 ? 'es' : ''}</div>
      </div>
      <div className="space-y-2">
        {matches.map((m, i) => (
          <KoMatch
            key={m.id}
            match={m}
            label={matchLabels[m.id] || `Match ${i + 1}`}
            size={matchSize[m.id] || 'normal'}
            onUpdate={(field, value) => onUpdate(roundKey, m.id, field, value)}
          />
        ))}
      </div>
    </div>
  )
}

export default function KnockoutBracket({ knockout, onUpdate, setWinner }) {
  const [activeRound, setActiveRound] = useState('r32')
  const champion = knockout.winner
  const finalWinner = getKoWinner(knockout.final)

  const rounds = [
    { key: 'r32',  label: 'Round of 32' },
    { key: 'r16',  label: 'Round of 16' },
    { key: 'qf',   label: 'Quarter Finals' },
    { key: 'sf',   label: 'Semi Finals' },
    { key: 'final',label: 'Final' },
  ]

  const r32Labels = Object.fromEntries(
    knockout.r32.map((m, i) => [m.id, `Match ${i + 1}`])
  )
  const r16Labels = Object.fromEntries(
    knockout.r16.map((m, i) => [m.id, `R16 Match ${i + 1}`])
  )
  const qfLabels  = { QF_1: 'QF 1', QF_2: 'QF 2', QF_3: 'QF 3', QF_4: 'QF 4' }
  const sfLabels  = { SF_1: 'Semi Final 1', SF_2: 'Semi Final 2' }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Knockout Bracket</h2>
          <p className="text-white/40 text-sm mt-0.5">
            R32 → R16 → QF → SF → Final · Select teams & enter scores
          </p>
        </div>

        {/* Champion display */}
        {champion && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-wc-accent/15 border border-wc-accent/30 champion-glow">
            <span className="text-xl">{TEAMS[champion]?.flag}</span>
            <div>
              <div className="text-[10px] text-wc-accent/60 uppercase tracking-widest">World Champion 2026</div>
              <div className="font-black text-wc-accent">{TEAMS[champion]?.name}</div>
            </div>
            <span>👑</span>
          </div>
        )}
      </div>

      {/* Round tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {rounds.map(r => (
          <button
            key={r.key}
            onClick={() => setActiveRound(r.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-shrink-0
              ${activeRound === r.key ? 'bg-wc-accent/20 text-wc-accent border border-wc-accent/30' : 'bg-wc-card border border-wc-border text-white/50 hover:text-white'}`}
          >
            {r.label}
          </button>
        ))}
        <button
          onClick={() => setActiveRound('3rd')}
          className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex-shrink-0
            ${activeRound === '3rd' ? 'bg-wc-accent/20 text-wc-accent border border-wc-accent/30' : 'bg-wc-card border border-wc-border text-white/50 hover:text-white'}`}
        >
          3rd Place
        </button>
      </div>

      {/* Round content */}
      {activeRound === 'r32' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {knockout.r32.map((m, i) => (
            <KoMatch
              key={m.id}
              match={m}
              label={`R32 · Match ${i + 1}`}
              onUpdate={(field, value) => onUpdate('r32', m.id, field, value)}
            />
          ))}
        </div>
      )}

      {activeRound === 'r16' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {knockout.r16.map((m, i) => (
            <KoMatch
              key={m.id}
              match={m}
              label={`R16 · Match ${i + 1}`}
              onUpdate={(field, value) => onUpdate('r16', m.id, field, value)}
            />
          ))}
        </div>
      )}

      {activeRound === 'qf' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {knockout.qf.map((m, i) => (
            <KoMatch
              key={m.id}
              match={m}
              label={`Quarter Final ${i + 1}`}
              onUpdate={(field, value) => onUpdate('qf', m.id, field, value)}
            />
          ))}
        </div>
      )}

      {activeRound === 'sf' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {knockout.sf.map((m, i) => (
            <KoMatch
              key={m.id}
              match={m}
              label={`Semi Final ${i + 1}`}
              onUpdate={(field, value) => onUpdate('sf', m.id, field, value)}
            />
          ))}
        </div>
      )}

      {activeRound === '3rd' && (
        <div className="max-w-sm">
          <KoMatch
            match={knockout.thirdPlace}
            label="3rd Place Play-off"
            onUpdate={(field, value) => onUpdate('thirdPlace', 'TP', field, value)}
          />
        </div>
      )}

      {activeRound === 'final' && (
        <div className="max-w-lg space-y-4">
          <KoMatch
            match={knockout.final}
            label="🏆 FINAL — Jul 19, 2026"
            size="large"
            onUpdate={(field, value) => onUpdate('final', 'FINAL', field, value)}
          />

          {/* Champion picker */}
          <div className="card p-5">
            <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-3">
              Declare World Champion
            </div>
            <div className="flex gap-2">
              {[knockout.final.home, knockout.final.away].filter(Boolean).map(tid => {
                const t = TEAMS[tid]
                return (
                  <button
                    key={tid}
                    onClick={() => setWinner(champion === tid ? null : tid)}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${champion === tid
                        ? 'bg-wc-accent/20 border-wc-accent champion-glow'
                        : 'bg-wc-navy border-wc-border hover:border-wc-accent/40'}`}
                  >
                    <span className="text-3xl">{t.flag}</span>
                    <span className="font-black text-sm text-white">{t.name}</span>
                    {champion === tid && <span className="text-wc-accent text-xs font-black">👑 CHAMPION</span>}
                  </button>
                )
              })}
              {!knockout.final.home && !knockout.final.away && (
                <div className="flex-1 text-center py-6 text-white/20 text-sm">
                  Set finalist teams above to declare champion
                </div>
              )}
            </div>
            {champion && (
              <button
                onClick={() => setWinner(null)}
                className="mt-3 w-full text-xs text-white/20 hover:text-red-400 transition-colors"
              >
                Clear champion
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full bracket overview */}
      <div className="card p-5 overflow-x-auto">
        <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">Full Bracket Overview</div>
        <div className="flex gap-4 min-w-max pb-2">
          {/* R32 - split into two columns */}
          <div className="w-44">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center mb-2">R32</div>
            <div className="space-y-1">
              {knockout.r32.slice(0, 8).map(m => (
                <MicroMatch key={m.id} match={m} />
              ))}
            </div>
          </div>
          <div className="w-44 mt-6">
            <div className="space-y-1">
              {knockout.r32.slice(8).map(m => (
                <MicroMatch key={m.id} match={m} />
              ))}
            </div>
          </div>
          {/* R16 */}
          <div className="w-44 mt-3">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center mb-2">R16</div>
            <div className="space-y-1">
              {knockout.r16.map(m => (
                <MicroMatch key={m.id} match={m} />
              ))}
            </div>
          </div>
          {/* QF */}
          <div className="w-44 mt-8">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center mb-2">QF</div>
            <div className="space-y-2">
              {knockout.qf.map(m => (
                <MicroMatch key={m.id} match={m} />
              ))}
            </div>
          </div>
          {/* SF */}
          <div className="w-44 mt-14">
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center mb-2">SF</div>
            <div className="space-y-4">
              {knockout.sf.map(m => (
                <MicroMatch key={m.id} match={m} />
              ))}
            </div>
          </div>
          {/* Final */}
          <div className="w-44 mt-20">
            <div className="text-[10px] font-bold text-wc-accent/60 uppercase tracking-widest text-center mb-2">FINAL</div>
            <MicroMatch match={knockout.final} highlight />
            {champion && (
              <div className="mt-2 text-center">
                <span className="text-xs text-wc-accent font-black">
                  {TEAMS[champion]?.flag} {TEAMS[champion]?.short} 👑
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MicroMatch({ match, highlight }) {
  const winner = getKoWinner(match)
  const h = match.home ? TEAMS[match.home] : null
  const a = match.away ? TEAMS[match.away] : null

  return (
    <div className={`text-[11px] rounded-lg overflow-hidden border ${highlight ? 'border-wc-accent/40 bg-wc-accent/5' : 'border-wc-border bg-wc-navy'}`}>
      <div className={`flex items-center gap-1.5 px-2 py-1 ${winner === match.home ? 'bg-green-500/10' : ''}`}>
        <span className="leading-none">{h?.flag || '–'}</span>
        <span className={`flex-1 truncate font-semibold ${winner === match.home ? 'text-white' : 'text-white/50'}`}>
          {h?.short || '?'}
        </span>
        <span className={`font-black ${winner === match.home ? 'text-wc-accent' : 'text-white/30'}`}>
          {match.homeScore ?? '–'}
        </span>
      </div>
      <div className={`flex items-center gap-1.5 px-2 py-1 border-t border-wc-border/50 ${winner === match.away ? 'bg-green-500/10' : ''}`}>
        <span className="leading-none">{a?.flag || '–'}</span>
        <span className={`flex-1 truncate font-semibold ${winner === match.away ? 'text-white' : 'text-white/50'}`}>
          {a?.short || '?'}
        </span>
        <span className={`font-black ${winner === match.away ? 'text-wc-accent' : 'text-white/30'}`}>
          {match.awayScore ?? '–'}
        </span>
      </div>
    </div>
  )
}
