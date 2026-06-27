// ─── 48 Qualified Teams — FIFA World Cup 2026 ───────────────────────────────
// flagCode = ISO 3166-1 alpha-2 for flagcdn.com
// gb-eng / gb-sct for England / Scotland

export const TEAMS = {
  // ── Group A (Host: USA) ──────────────────────────────────────────────
  usa: { id:'usa', name:'United States',   short:'USA', flagCode:'us',     group:'A', conf:'CONCACAF', rank:13,  host:true  },
  bol: { id:'bol', name:'Bolivia',         short:'BOL', flagCode:'bo',     group:'A', conf:'CONMEBOL', rank:86              },
  dza: { id:'dza', name:'Algeria',         short:'ALG', flagCode:'dz',     group:'A', conf:'CAF',      rank:52              },
  pan: { id:'pan', name:'Panama',          short:'PAN', flagCode:'pa',     group:'A', conf:'CONCACAF', rank:48              },

  // ── Group B (Host: Mexico) ───────────────────────────────────────────
  mex: { id:'mex', name:'Mexico',          short:'MEX', flagCode:'mx',     group:'B', conf:'CONCACAF', rank:15,  host:true  },
  jam: { id:'jam', name:'Jamaica',         short:'JAM', flagCode:'jm',     group:'B', conf:'CONCACAF', rank:55              },
  sen: { id:'sen', name:'Senegal',         short:'SEN', flagCode:'sn',     group:'B', conf:'CAF',      rank:20              },
  civ: { id:'civ', name:"Côte d'Ivoire",   short:'CIV', flagCode:'ci',     group:'B', conf:'CAF',      rank:27              },

  // ── Group C (Host: Canada) ───────────────────────────────────────────
  can: { id:'can', name:'Canada',          short:'CAN', flagCode:'ca',     group:'C', conf:'CONCACAF', rank:47,  host:true  },
  ven: { id:'ven', name:'Venezuela',       short:'VEN', flagCode:'ve',     group:'C', conf:'CONMEBOL', rank:34              },
  mar: { id:'mar', name:'Morocco',         short:'MAR', flagCode:'ma',     group:'C', conf:'CAF',      rank:14              },
  irn: { id:'irn', name:'Iran',            short:'IRN', flagCode:'ir',     group:'C', conf:'AFC',      rank:22              },

  // ── Group D ─────────────────────────────────────────────────────────
  arg: { id:'arg', name:'Argentina',       short:'ARG', flagCode:'ar',     group:'D', conf:'CONMEBOL', rank:1               },
  chl: { id:'chl', name:'Chile',           short:'CHI', flagCode:'cl',     group:'D', conf:'CONMEBOL', rank:38              },
  jpn: { id:'jpn', name:'Japan',           short:'JPN', flagCode:'jp',     group:'D', conf:'AFC',      rank:18              },
  rsa: { id:'rsa', name:'South Africa',    short:'RSA', flagCode:'za',     group:'D', conf:'CAF',      rank:57              },

  // ── Group E ─────────────────────────────────────────────────────────
  esp: { id:'esp', name:'Spain',           short:'ESP', flagCode:'es',     group:'E', conf:'UEFA',     rank:3               },
  bra: { id:'bra', name:'Brazil',          short:'BRA', flagCode:'br',     group:'E', conf:'CONMEBOL', rank:5               },
  brh: { id:'brh', name:'Bahrain',         short:'BHR', flagCode:'bh',     group:'E', conf:'AFC',      rank:77              },
  srb: { id:'srb', name:'Serbia',          short:'SRB', flagCode:'rs',     group:'E', conf:'UEFA',     rank:26              },

  // ── Group F ─────────────────────────────────────────────────────────
  fra: { id:'fra', name:'France',          short:'FRA', flagCode:'fr',     group:'F', conf:'UEFA',     rank:2               },
  ury: { id:'ury', name:'Uruguay',         short:'URY', flagCode:'uy',     group:'F', conf:'CONMEBOL', rank:17              },
  qat: { id:'qat', name:'Qatar',           short:'QAT', flagCode:'qa',     group:'F', conf:'AFC',      rank:37              },
  cmr: { id:'cmr', name:'Cameroon',        short:'CMR', flagCode:'cm',     group:'F', conf:'CAF',      rank:41              },

  // ── Group G ─────────────────────────────────────────────────────────
  eng: { id:'eng', name:'England',         short:'ENG', flagCode:'gb-eng', group:'G', conf:'UEFA',     rank:5               },
  col: { id:'col', name:'Colombia',        short:'COL', flagCode:'co',     group:'G', conf:'CONMEBOL', rank:9               },
  nga: { id:'nga', name:'Nigeria',         short:'NGA', flagCode:'ng',     group:'G', conf:'CAF',      rank:30              },
  aus: { id:'aus', name:'Australia',       short:'AUS', flagCode:'au',     group:'G', conf:'AFC',      rank:23              },

  // ── Group H ─────────────────────────────────────────────────────────
  ned: { id:'ned', name:'Netherlands',     short:'NED', flagCode:'nl',     group:'H', conf:'UEFA',     rank:7               },
  ecu: { id:'ecu', name:'Ecuador',         short:'ECU', flagCode:'ec',     group:'H', conf:'CONMEBOL', rank:40              },
  ksa: { id:'ksa', name:'Saudi Arabia',    short:'KSA', flagCode:'sa',     group:'H', conf:'AFC',      rank:56              },
  cro: { id:'cro', name:'Croatia',         short:'CRO', flagCode:'hr',     group:'H', conf:'UEFA',     rank:10              },

  // ── Group I ─────────────────────────────────────────────────────────
  por: { id:'por', name:'Portugal',        short:'POR', flagCode:'pt',     group:'I', conf:'UEFA',     rank:6               },
  kor: { id:'kor', name:'South Korea',     short:'KOR', flagCode:'kr',     group:'I', conf:'AFC',      rank:24              },
  gui: { id:'gui', name:'Guinea',          short:'GUI', flagCode:'gn',     group:'I', conf:'CAF',      rank:74              },
  pol: { id:'pol', name:'Poland',          short:'POL', flagCode:'pl',     group:'I', conf:'UEFA',     rank:28              },

  // ── Group J ─────────────────────────────────────────────────────────
  ger: { id:'ger', name:'Germany',         short:'GER', flagCode:'de',     group:'J', conf:'UEFA',     rank:12              },
  tun: { id:'tun', name:'Tunisia',         short:'TUN', flagCode:'tn',     group:'J', conf:'CAF',      rank:32              },
  crc: { id:'crc', name:'Costa Rica',      short:'CRC', flagCode:'cr',     group:'J', conf:'CONCACAF', rank:51              },
  sui: { id:'sui', name:'Switzerland',     short:'SUI', flagCode:'ch',     group:'J', conf:'UEFA',     rank:19              },

  // ── Group K ─────────────────────────────────────────────────────────
  bel: { id:'bel', name:'Belgium',         short:'BEL', flagCode:'be',     group:'K', conf:'UEFA',     rank:4               },
  par: { id:'par', name:'Paraguay',        short:'PAR', flagCode:'py',     group:'K', conf:'CONMEBOL', rank:61              },
  nzl: { id:'nzl', name:'New Zealand',     short:'NZL', flagCode:'nz',     group:'K', conf:'OFC',      rank:102             },
  egy: { id:'egy', name:'Egypt',           short:'EGY', flagCode:'eg',     group:'K', conf:'CAF',      rank:35              },

  // ── Group L ─────────────────────────────────────────────────────────
  ita: { id:'ita', name:'Italy',           short:'ITA', flagCode:'it',     group:'L', conf:'UEFA',     rank:9               },
  tur: { id:'tur', name:'Turkey',          short:'TUR', flagCode:'tr',     group:'L', conf:'UEFA',     rank:29              },
  idn: { id:'idn', name:'Indonesia',       short:'IDN', flagCode:'id',     group:'L', conf:'AFC',      rank:130             },
  ukr: { id:'ukr', name:'Ukraine',         short:'UKR', flagCode:'ua',     group:'L', conf:'UEFA',     rank:22              },
}

export const GROUP_TEAMS = {
  A: ['usa','bol','dza','pan'],
  B: ['mex','jam','sen','civ'],
  C: ['can','ven','mar','irn'],
  D: ['arg','chl','jpn','rsa'],
  E: ['esp','bra','brh','srb'],
  F: ['fra','ury','qat','cmr'],
  G: ['eng','col','nga','aus'],
  H: ['ned','ecu','ksa','cro'],
  I: ['por','kor','gui','pol'],
  J: ['ger','tun','crc','sui'],
  K: ['bel','par','nzl','egy'],
  L: ['ita','tur','idn','ukr'],
}

const GROUP_DATES = {
  A:['Jun 12','Jun 12','Jun 16','Jun 16','Jun 20','Jun 20'],
  B:['Jun 13','Jun 13','Jun 17','Jun 17','Jun 21','Jun 21'],
  C:['Jun 14','Jun 14','Jun 18','Jun 18','Jun 22','Jun 22'],
  D:['Jun 15','Jun 15','Jun 19','Jun 19','Jun 23','Jun 23'],
  E:['Jun 12','Jun 12','Jun 16','Jun 16','Jun 20','Jun 20'],
  F:['Jun 13','Jun 13','Jun 17','Jun 17','Jun 21','Jun 21'],
  G:['Jun 14','Jun 14','Jun 18','Jun 18','Jun 22','Jun 22'],
  H:['Jun 15','Jun 15','Jun 19','Jun 19','Jun 23','Jun 23'],
  I:['Jun 12','Jun 12','Jun 16','Jun 16','Jun 20','Jun 20'],
  J:['Jun 13','Jun 13','Jun 17','Jun 17','Jun 21','Jun 21'],
  K:['Jun 14','Jun 14','Jun 18','Jun 18','Jun 22','Jun 22'],
  L:['Jun 15','Jun 15','Jun 19','Jun 19','Jun 23','Jun 23'],
}

function makeMatches(group, teams) {
  const dates = GROUP_DATES[group]
  const pairs = []
  for (let i = 0; i < teams.length; i++)
    for (let j = i + 1; j < teams.length; j++)
      pairs.push([teams[i], teams[j]])
  return pairs.map(([home, away], idx) => ({
    id: `${group}${idx + 1}`, home, away,
    homeScore: null, awayScore: null,
    date: dates[idx] ?? 'TBD',
  }))
}

export const INITIAL_MATCHES = Object.fromEntries(
  Object.entries(GROUP_TEAMS).map(([g, t]) => [g, makeMatches(g, t)])
)

const koMatch = id => ({ id, home:null, away:null, homeScore:null, awayScore:null, homePens:null, awayPens:null })

export const INITIAL_KNOCKOUT = {
  r32:       Array.from({length:16}, (_,i) => koMatch(`R32_${i+1}`)),
  r16:       Array.from({length:8 }, (_,i) => koMatch(`R16_${i+1}`)),
  qf:        Array.from({length:4 }, (_,i) => koMatch(`QF_${i+1}`)),
  sf:        Array.from({length:2 }, (_,i) => koMatch(`SF_${i+1}`)),
  thirdPlace: koMatch('TP'),
  final:      koMatch('FINAL'),
  winner: null,
}

export const CONF_META = {
  UEFA:     { color:'#60A5FA', bg:'rgba(59,130,246,0.12)',  border:'rgba(59,130,246,0.3)',   label:'UEFA'     },
  CONMEBOL: { color:'#4ADE80', bg:'rgba(74,222,128,0.10)',  border:'rgba(74,222,128,0.25)',  label:'CONMEBOL' },
  CONCACAF: { color:'#F87171', bg:'rgba(248,113,113,0.10)', border:'rgba(248,113,113,0.25)', label:'CONCACAF' },
  CAF:      { color:'#FBBF24', bg:'rgba(251,191,36,0.10)',  border:'rgba(251,191,36,0.25)',  label:'CAF'      },
  AFC:      { color:'#C084FC', bg:'rgba(192,132,252,0.10)', border:'rgba(192,132,252,0.25)', label:'AFC'      },
  OFC:      { color:'#2DD4BF', bg:'rgba(45,212,191,0.10)',  border:'rgba(45,212,191,0.25)',  label:'OFC'      },
}
