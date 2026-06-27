import { useState } from 'react'

const NAV = [
  { id:'dashboard', label:'Dashboard'  },
  { id:'groups',    label:'Group Stage'},
  { id:'bracket',   label:'Knockout'   },
  { id:'teams',     label:'All Teams'  },
  { id:'summary',   label:'Summary'    },
]

export default function Header({ view, setView, onReset }) {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background:'rgba(6,4,26,0.96)', backdropFilter:'blur(20px)', borderBottom:'1px solid #2D2A6E', position:'sticky', top:0, zIndex:50 }}>
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>

          {/* Logo */}
          <button onClick={() => setView('dashboard')} style={{ display:'flex', alignItems:'center', gap:12, background:'none', border:'none', cursor:'pointer' }}>
            {/* WC2026 logo pill */}
            <div style={{
              background:'linear-gradient(135deg,#7C22E8,#DB2777,#E8222E,#F97316)',
              borderRadius:12, padding:'6px 12px', display:'flex', alignItems:'center', gap:8
            }}>
              <span style={{ fontSize:18 }}>⚽</span>
              <div style={{ lineHeight:1 }}>
                <div style={{ fontWeight:900, fontSize:13, color:'white', letterSpacing:'0.05em' }}>WORLD CUP</div>
                <div style={{ fontWeight:900, fontSize:11, color:'rgba(255,255,255,0.75)', letterSpacing:'0.15em' }}>2026™</div>
              </div>
            </div>
            <div style={{ lineHeight:1 }}>
              <div style={{ fontWeight:800, fontSize:13, color:'rgba(255,255,255,0.9)', letterSpacing:'0.02em' }}>Bracket Editor</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:2 }}>USA · CAN · MEX · 2026</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav style={{ display:'flex', gap:2 }} className="hidden md:flex">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setView(n.id)} className={`nav-btn ${view===n.id?'active':''}`}>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button
              onClick={onReset}
              className="btn-ghost hidden sm:block"
              style={{ padding:'6px 14px', fontSize:12 }}
            >↺ Reset</button>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden"
              style={{ background:'none', border:'1px solid #2D2A6E', borderRadius:8, padding:'6px 10px', color:'rgba(255,255,255,0.6)', cursor:'pointer' }}
            >{open ? '✕' : '☰'}</button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop:'1px solid #2D2A6E', paddingBottom:12, paddingTop:8, display:'flex', flexDirection:'column', gap:4 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => { setView(n.id); setOpen(false) }} className={`nav-btn ${view===n.id?'active':''}`} style={{ justifyContent:'flex-start' }}>
                {n.label}
              </button>
            ))}
            <button onClick={() => { onReset(); setOpen(false) }} className="nav-btn" style={{ justifyContent:'flex-start', color:'rgba(248,113,113,0.7)' }}>
              ↺ Reset All Data
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
