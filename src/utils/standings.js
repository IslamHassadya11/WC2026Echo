export function calcStandings(teamIds, matches) {
  const s = Object.fromEntries(
    teamIds.map(id => [id, { id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }])
  )

  for (const m of matches) {
    if (m.homeScore === null || m.awayScore === null) continue
    const h = s[m.home]
    const a = s[m.away]
    const hs = Number(m.homeScore)
    const as_ = Number(m.awayScore)

    h.p++; a.p++
    h.gf += hs; h.ga += as_; h.gd = h.gf - h.ga
    a.gf += as_; a.ga += hs; a.gd = a.gf - a.ga

    if (hs > as_)       { h.w++; h.pts += 3; a.l++ }
    else if (as_ > hs)  { a.w++; a.pts += 3; h.l++ }
    else                { h.d++; h.pts++;     a.d++; a.pts++ }
  }

  return Object.values(s).sort((a, b) =>
    b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.id.localeCompare(b.id)
  )
}

export function getKoWinner(match) {
  if (match.homeScore === null || match.awayScore === null) return null
  const hs = Number(match.homeScore)
  const as_ = Number(match.awayScore)
  if (hs > as_) return match.home
  if (as_ > hs) return match.away
  if (match.homePens !== null && match.awayPens !== null)
    return Number(match.homePens) > Number(match.awayPens) ? match.home : match.away
  return null
}

export function fmtScore(match) {
  if (match.homeScore === null) return '– : –'
  const base = `${match.homeScore} : ${match.awayScore}`
  if (match.homePens !== null)
    return `${base} (${match.homePens}–${match.awayPens} pens)`
  return base
}
