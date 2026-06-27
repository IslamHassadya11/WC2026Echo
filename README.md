# 🏆 FIFA World Cup 2026 Bracket Editor

A professional, full-featured bracket editor for the 2026 FIFA World Cup hosted by the USA, Canada, and Mexico.

## Features

- **Dashboard** — Live overview of all 12 groups, recent results, tournament progress, and confederation breakdown
- **Group Stage** — Edit match scores for all 96 group stage games across 12 groups (A–L); auto-calculates standings with W/D/L/GF/GA/GD/PTS and form indicators
- **Knockout Bracket** — Full R32 → R16 → QF → SF → Final bracket editor with team pickers, score inputs, penalty shootout support, and champion declaration
- **All Teams** — Browse all 48 teams with stats, filterable by confederation, group, or search
- **Summary** — Complete tournament summary: group standings, qualified teams (top 2 + best 8 third-place), podium, and confederation breakdown

## Tech Stack

- React 18 + Vite
- Tailwind CSS (dark theme with gold accents)
- localStorage persistence (no backend needed)

## Teams

**48 nations across 6 confederations:**

| Conf | Teams |
|------|-------|
| UEFA | 16 |
| CONMEBOL | 6 |
| CONCACAF | 6 |
| CAF | 9 |
| AFC | 8 |
| OFC | 1 |
| Intercontinental | 2 |

**12 Groups (A–L)** · 4 teams each · Round-robin (6 matches per group)

**Knockout:** Top 2 from each group (24) + Best 8 third-place teams = 32 teams advance

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Data Persistence

All bracket data is saved automatically to `localStorage`. Use the **Reset** button in the header to clear everything and start fresh.

---

*FIFA World Cup 2026 · USA · Canada · Mexico · Jun 11 – Jul 19, 2026*
