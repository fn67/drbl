import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── Env ───────────────────────────────────────────────────────────────────────

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Time helpers ──────────────────────────────────────────────────────────────

const now = new Date()

const daysAgo = (d: number, h = 18): string => {
  const t = new Date(now)
  t.setDate(t.getDate() - d)
  t.setUTCHours(h, 0, 0, 0)
  return t.toISOString()
}
const hoursAgo = (h: number): string =>
  new Date(now.getTime() - h * 3_600_000).toISOString()
const hoursFromNow = (h: number): string =>
  new Date(now.getTime() + h * 3_600_000).toISOString()
const daysFromNow = (d: number, h = 18): string => {
  const t = new Date(now)
  t.setDate(t.getDate() + d)
  t.setUTCHours(h, 0, 0, 0)
  return t.toISOString()
}

// ── Original 10 users (full predictions across all matches) ───────────────────

const SEED_USERS = [
  { name: 'James Fletcher', email: 'james.fletcher@drbl-seed.test' },
  { name: 'Sarah Okafor',   email: 'sarah.okafor@drbl-seed.test'   },
  { name: 'Ravi Patel',     email: 'ravi.patel@drbl-seed.test'     },
  { name: 'Carlos Mendez',  email: 'carlos.mendez@drbl-seed.test'  },
  { name: 'Priya Sharma',   email: 'priya.sharma@drbl-seed.test'   },
  { name: 'Emma Walsh',     email: 'emma.walsh@drbl-seed.test'     },
  { name: 'Tom Bishop',     email: 'tom.bishop@drbl-seed.test'     },
  { name: 'Mei Chen',       email: 'mei.chen@drbl-seed.test'       },
  { name: 'David Osei',     email: 'david.osei@drbl-seed.test'     },
  { name: 'Sophie Laurent', email: 'sophie.laurent@drbl-seed.test' },
]

// ── Extra 140 users for a realistic leaderboard ───────────────────────────────

const EXTRA_USERS = [
  // --- 55 pts tier (3) ---
  { name: 'Oliver Webb',          email: 'oliver.webb@drbl-seed.test'          },
  { name: 'Grace Holloway',       email: 'grace.holloway@drbl-seed.test'       },
  { name: 'Arjun Mehta',          email: 'arjun.mehta@drbl-seed.test'          },
  // --- 50 pts tier (7) ---
  { name: 'Divya Krishnamurthy',  email: 'divya.krishnamurthy@drbl-seed.test'  },
  { name: 'Sam Thornton',         email: 'sam.thornton@drbl-seed.test'         },
  { name: 'Rohan Gupta',          email: 'rohan.gupta@drbl-seed.test'          },
  { name: 'Lucas Wong',           email: 'lucas.wong@drbl-seed.test'           },
  { name: 'Yuki Tanaka',          email: 'yuki.tanaka@drbl-seed.test'          },
  { name: 'Ella Whitfield',       email: 'ella.whitfield@drbl-seed.test'       },
  { name: 'Min-jun Park',         email: 'min-jun.park@drbl-seed.test'         },
  // --- 45 pts tier (10) ---
  { name: 'Ananya Iyer',          email: 'ananya.iyer@drbl-seed.test'          },
  { name: 'Harry Morrison',       email: 'harry.morrison@drbl-seed.test'       },
  { name: 'Kofi Asante',          email: 'kofi.asante@drbl-seed.test'          },
  { name: 'Chloe Archer',         email: 'chloe.archer@drbl-seed.test'         },
  { name: 'Vikram Nair',          email: 'vikram.nair@drbl-seed.test'          },
  { name: 'Fiona Lim',            email: 'fiona.lim@drbl-seed.test'            },
  { name: 'William Hayes',        email: 'william.hayes@drbl-seed.test'        },
  { name: 'Pooja Reddy',          email: 'pooja.reddy@drbl-seed.test'          },
  { name: 'Hiroshi Yamamoto',     email: 'hiroshi.yamamoto@drbl-seed.test'     },
  { name: 'Blessing Okonkwo',     email: 'blessing.okonkwo@drbl-seed.test'     },
  // --- 40 pts tier (15) ---
  { name: 'Lucy Barker',          email: 'lucy.barker@drbl-seed.test'          },
  { name: 'Aarav Verma',          email: 'aarav.verma@drbl-seed.test'          },
  { name: 'Chidi Eze',            email: 'chidi.eze@drbl-seed.test'            },
  { name: 'Andres Castillo',      email: 'andres.castillo@drbl-seed.test'      },
  { name: 'Sneha Pillai',         email: 'sneha.pillai@drbl-seed.test'         },
  { name: 'Freddie Stone',        email: 'freddie.stone@drbl-seed.test'        },
  { name: 'Jae-won Kim',          email: 'jae-won.kim@drbl-seed.test'          },
  { name: 'Fatima Diallo',        email: 'fatima.diallo@drbl-seed.test'        },
  { name: 'Niklas Bauer',         email: 'niklas.bauer@drbl-seed.test'         },
  { name: 'Valentina Cruz',       email: 'valentina.cruz@drbl-seed.test'       },
  { name: 'Imogen Clarke',        email: 'imogen.clarke@drbl-seed.test'        },
  { name: 'Karan Bhatia',         email: 'karan.bhatia@drbl-seed.test'         },
  { name: 'Emmanuel Adjei',       email: 'emmanuel.adjei@drbl-seed.test'       },
  { name: 'Ingrid Svensson',      email: 'ingrid.svensson@drbl-seed.test'      },
  { name: 'Diego Morales',        email: 'diego.morales@drbl-seed.test'        },
  // --- 35 pts tier (15) ---
  { name: 'Meera Joshi',          email: 'meera.joshi@drbl-seed.test'          },
  { name: 'Siu-wai Ho',           email: 'siu-wai.ho@drbl-seed.test'           },
  { name: 'Amara Toure',          email: 'amara.toure@drbl-seed.test'          },
  { name: 'Marco Ferrari',        email: 'marco.ferrari@drbl-seed.test'        },
  { name: 'Isabella Romero',      email: 'isabella.romero@drbl-seed.test'      },
  { name: 'Ling Zhang',           email: 'ling.zhang@drbl-seed.test'           },
  { name: 'Mateo Herrera',        email: 'mateo.herrera@drbl-seed.test'        },
  { name: 'Sofia Andersen',       email: 'sofia.andersen@drbl-seed.test'       },
  { name: 'Oluseun Bello',        email: 'oluseun.bello@drbl-seed.test'        },
  { name: 'Haruto Nakamura',      email: 'haruto.nakamura@drbl-seed.test'      },
  { name: 'Camila Torres',        email: 'camila.torres@drbl-seed.test'        },
  { name: 'Jan Kowalski',         email: 'jan.kowalski@drbl-seed.test'         },
  { name: 'Ji-yeon Cho',          email: 'ji-yeon.cho@drbl-seed.test'          },
  { name: 'Ngozi Ibe',            email: 'ngozi.ibe@drbl-seed.test'            },
  { name: 'Santiago Vargas',      email: 'santiago.vargas@drbl-seed.test'      },
  // --- 30 pts tier (15) ---
  { name: 'Miriam Dubois',        email: 'miriam.dubois@drbl-seed.test'        },
  { name: 'Lucia Pena',           email: 'lucia.pena@drbl-seed.test'           },
  { name: 'Omar Khalid',          email: 'omar.khalid@drbl-seed.test'          },
  { name: 'Aleksei Volkov',       email: 'aleksei.volkov@drbl-seed.test'       },
  { name: 'Kwame Mensah',         email: 'kwame.mensah@drbl-seed.test'         },
  { name: 'Lena Muller',          email: 'lena.muller@drbl-seed.test'          },
  { name: 'Emilio Rios',          email: 'emilio.rios@drbl-seed.test'          },
  { name: 'Layla Hassan',         email: 'layla.hassan@drbl-seed.test'         },
  { name: 'Tyler Brooks',         email: 'tyler.brooks@drbl-seed.test'         },
  { name: 'Adaeze Nwosu',         email: 'adaeze.nwosu@drbl-seed.test'         },
  { name: 'Gabriela Fuentes',     email: 'gabriela.fuentes@drbl-seed.test'     },
  { name: 'Bram van der Berg',    email: 'bram.vanderberg@drbl-seed.test'      },
  { name: 'Tariq Al-Rashid',      email: 'tariq.alrashid@drbl-seed.test'       },
  { name: 'Madison Green',        email: 'madison.green@drbl-seed.test'        },
  { name: 'Astrid Eriksen',       email: 'astrid.eriksen@drbl-seed.test'       },
  // --- 25 pts tier (15) ---
  { name: 'Nadia Aziz',           email: 'nadia.aziz@drbl-seed.test'           },
  { name: 'Austin Reid',          email: 'austin.reid@drbl-seed.test'          },
  { name: 'Youssef Mansour',      email: 'youssef.mansour@drbl-seed.test'      },
  { name: 'Kayla Pierce',         email: 'kayla.pierce@drbl-seed.test'         },
  { name: 'Tanvir Rahman',        email: 'tanvir.rahman@drbl-seed.test'        },
  { name: 'Sara Badr',            email: 'sara.badr@drbl-seed.test'            },
  { name: 'Logan Carter',         email: 'logan.carter@drbl-seed.test'         },
  { name: 'Nalini Wickramasinghe',email: 'nalini.wickramasinghe@drbl-seed.test'},
  { name: 'Karim Farouk',         email: 'karim.farouk@drbl-seed.test'         },
  { name: 'Ashley Morgan',        email: 'ashley.morgan@drbl-seed.test'        },
  { name: 'Jordan Banks',         email: 'jordan.banks@drbl-seed.test'         },
  { name: 'Budi Santoso',         email: 'budi.santoso@drbl-seed.test'         },
  { name: 'Rania Samir',          email: 'rania.samir@drbl-seed.test'          },
  { name: 'Taylor Flynn',         email: 'taylor.flynn@drbl-seed.test'         },
  { name: 'Ryan Simmons',         email: 'ryan.simmons@drbl-seed.test'         },
  // --- 20 pts tier (12) ---
  { name: 'Brooke Kennedy',       email: 'brooke.kennedy@drbl-seed.test'       },
  { name: 'Thanh Nguyen',         email: 'thanh.nguyen@drbl-seed.test'         },
  { name: 'Asha Perera',          email: 'asha.perera@drbl-seed.test'          },
  { name: 'Patrick Gallagher',    email: 'patrick.gallagher@drbl-seed.test'    },
  { name: 'Rizwan Baig',          email: 'rizwan.baig@drbl-seed.test'          },
  { name: 'Niamh OBrien',         email: 'niamh.obrien@drbl-seed.test'         },
  { name: 'Suparna Dey',          email: 'suparna.dey@drbl-seed.test'          },
  { name: 'Callum Mackenzie',     email: 'callum.mackenzie@drbl-seed.test'     },
  { name: 'Ahmed Nour',           email: 'ahmed.nour@drbl-seed.test'           },
  { name: 'Siobhan Murphy',       email: 'siobhan.murphy@drbl-seed.test'       },
  { name: 'Farhan Hossain',       email: 'farhan.hossain@drbl-seed.test'       },
  { name: 'Declan Fitzpatrick',   email: 'declan.fitzpatrick@drbl-seed.test'   },
  // --- 15 pts tier (10) ---
  { name: 'Hana Qasim',           email: 'hana.qasim@drbl-seed.test'           },
  { name: 'Kai Oduya',            email: 'kai.oduya@drbl-seed.test'            },
  { name: 'Zara Al-Farsi',        email: 'zara.alfarsi@drbl-seed.test'         },
  { name: 'Finn Johansson',       email: 'finn.johansson@drbl-seed.test'       },
  { name: 'Pritha Banerjee',      email: 'pritha.banerjee@drbl-seed.test'      },
  { name: 'Maya Petrov',          email: 'maya.petrov@drbl-seed.test'          },
  { name: 'Aoife Ryan',           email: 'aoife.ryan@drbl-seed.test'           },
  { name: 'Luca De Santis',       email: 'luca.desantis@drbl-seed.test'        },
  { name: 'Brendan OSullivan',    email: 'brendan.osullivan@drbl-seed.test'    },
  { name: 'Maeve Byrne',          email: 'maeve.byrne@drbl-seed.test'          },
  // --- 10 pts tier (15) ---
  { name: 'Nadia Popescu',        email: 'nadia.popescu@drbl-seed.test'        },
  { name: 'Rafael Gomes',         email: 'rafael.gomes@drbl-seed.test'         },
  { name: 'Chiara Ricci',         email: 'chiara.ricci@drbl-seed.test'         },
  { name: 'Connor Daly',          email: 'connor.daly@drbl-seed.test'          },
  { name: 'Elias Stamatis',       email: 'elias.stamatis@drbl-seed.test'       },
  { name: 'Vera Novak',           email: 'vera.novak@drbl-seed.test'           },
  { name: 'Orla Hennessy',        email: 'orla.hennessy@drbl-seed.test'        },
  { name: 'Priscilla Osei',       email: 'priscilla.osei@drbl-seed.test'       },
  { name: 'Theo Nakamura',        email: 'theo.nakamura@drbl-seed.test'        },
  { name: 'Serena Baptiste',      email: 'serena.baptiste@drbl-seed.test'      },
  { name: 'Mo Abdullahi',         email: 'mo.abdullahi@drbl-seed.test'         },
  { name: 'Hira Butt',            email: 'hira.butt@drbl-seed.test'            },
  { name: 'Damilola Adeyemi',     email: 'damilola.adeyemi@drbl-seed.test'     },
  { name: 'Yannick Girard',       email: 'yannick.girard@drbl-seed.test'       },
  { name: 'Amelia da Silva',      email: 'amelia.dasilva@drbl-seed.test'       },
  // --- 0 pts tier (23) ---
  { name: 'Jebril Moussa',        email: 'jebril.moussa@drbl-seed.test'        },
  { name: 'Cecilia Fontaine',     email: 'cecilia.fontaine@drbl-seed.test'     },
  { name: 'Reginald Smyth',       email: 'reginald.smyth@drbl-seed.test'       },
  { name: 'Harriet Stanton',      email: 'harriet.stanton@drbl-seed.test'      },
  { name: 'Gerald Fowler',        email: 'gerald.fowler@drbl-seed.test'        },
  { name: 'Philippa Carrington',  email: 'philippa.carrington@drbl-seed.test'  },
  { name: 'Tristram Hadley',      email: 'tristram.hadley@drbl-seed.test'      },
  { name: 'Rosalind Ennis',       email: 'rosalind.ennis@drbl-seed.test'       },
  { name: 'Benedict Holt',        email: 'benedict.holt@drbl-seed.test'        },
  { name: 'Cordelia Shaw',        email: 'cordelia.shaw@drbl-seed.test'        },
  { name: 'Phineas Drummond',     email: 'phineas.drummond@drbl-seed.test'     },
  { name: 'Lavinia Hartley',      email: 'lavinia.hartley@drbl-seed.test'      },
  { name: 'Zainab Hussain',       email: 'zainab.hussain@drbl-seed.test'       },
  { name: 'Dante Esposito',       email: 'dante.esposito@drbl-seed.test'       },
  { name: 'Lior Ben-David',       email: 'lior.bendavid@drbl-seed.test'        },
  { name: 'Fatou Diop',           email: 'fatou.diop@drbl-seed.test'           },
  { name: 'Marios Papadopoulos',  email: 'marios.papadopoulos@drbl-seed.test'  },
  { name: 'Ekundayo Adewale',     email: 'ekundayo.adewale@drbl-seed.test'     },
  { name: 'Sorcha MacLeod',       email: 'sorcha.macleod@drbl-seed.test'       },
  { name: 'Bogdan Ionescu',       email: 'bogdan.ionescu@drbl-seed.test'       },
  { name: 'Preethi Natarajan',    email: 'preethi.natarajan@drbl-seed.test'    },
  { name: 'Jaakko Virtanen',      email: 'jaakko.virtanen@drbl-seed.test'      },
  { name: 'Suresh Ramasamy',      email: 'suresh.ramasamy@drbl-seed.test'      },
]

// ── Matches ───────────────────────────────────────────────────────────────────
// Indices: 0-3 completed, 4-7 locked, 8-13 voting_open, 14-19 upcoming

const SEED_MATCHES = [
  // ── Completed (4) ────────────────────────────────────────────────────────
  { home_team: 'Brazil',      away_team: 'Morocco',      home_flag: 'br',     away_flag: 'ma',
    kickoff_at: daysAgo(14),      round: 'Group Stage',  group_name: 'Group A',
    status: 'completed', home_score: 2, away_score: 1, manually_locked: false },
  { home_team: 'Germany',     away_team: 'Colombia',     home_flag: 'de',     away_flag: 'co',
    kickoff_at: daysAgo(10),      round: 'Group Stage',  group_name: 'Group B',
    status: 'completed', home_score: 1, away_score: 1, manually_locked: false },
  { home_team: 'France',      away_team: 'Nigeria',      home_flag: 'fr',     away_flag: 'ng',
    kickoff_at: daysAgo(7),       round: 'Group Stage',  group_name: 'Group D',
    status: 'completed', home_score: 3, away_score: 0, manually_locked: false },
  { home_team: 'Spain',       away_team: 'Australia',    home_flag: 'es',     away_flag: 'au',
    kickoff_at: daysAgo(3),       round: 'Group Stage',  group_name: 'Group E',
    status: 'completed', home_score: 2, away_score: 0, manually_locked: false },

  // ── Locked (4) ───────────────────────────────────────────────────────────
  { home_team: 'England',     away_team: 'Japan',        home_flag: 'gb-eng', away_flag: 'jp',
    kickoff_at: hoursAgo(6),      round: 'Group Stage',  group_name: 'Group C',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Portugal',    away_team: 'Tunisia',      home_flag: 'pt',     away_flag: 'tn',
    kickoff_at: hoursAgo(3),      round: 'Group Stage',  group_name: 'Group F',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Netherlands', away_team: 'Jordan',       home_flag: 'nl',     away_flag: 'jo',
    kickoff_at: hoursAgo(18),     round: 'Group Stage',  group_name: 'Group G',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Belgium',     away_team: 'Qatar',        home_flag: 'be',     away_flag: 'qa',
    kickoff_at: hoursAgo(2),      round: 'Group Stage',  group_name: 'Group H',
    status: 'locked', home_score: null, away_score: null, manually_locked: false },

  // ── Voting open (6) ──────────────────────────────────────────────────────
  { home_team: 'USA',         away_team: 'New Zealand',  home_flag: 'us',     away_flag: 'nz',
    kickoff_at: hoursFromNow(4),  round: 'Group Stage',  group_name: 'Group A',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Mexico',      away_team: 'Saudi Arabia', home_flag: 'mx',     away_flag: 'sa',
    kickoff_at: hoursFromNow(8),  round: 'Group Stage',  group_name: 'Group B',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Canada',      away_team: 'Ivory Coast',  home_flag: 'ca',     away_flag: 'ci',
    kickoff_at: hoursFromNow(20), round: 'Group Stage',  group_name: 'Group C',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Argentina',   away_team: 'South Korea',  home_flag: 'ar',     away_flag: 'kr',
    kickoff_at: hoursFromNow(30), round: 'Group Stage',  group_name: 'Group D',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Egypt',       away_team: 'Ecuador',      home_flag: 'eg',     away_flag: 'ec',
    kickoff_at: hoursFromNow(36), round: 'Group Stage',  group_name: 'Group E',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Uruguay',     away_team: 'South Africa', home_flag: 'uy',     away_flag: 'za',
    kickoff_at: hoursFromNow(44), round: 'Group Stage',  group_name: 'Group F',
    status: 'voting_open', home_score: null, away_score: null, manually_locked: false },

  // ── Upcoming (6) ─────────────────────────────────────────────────────────
  { home_team: 'Switzerland', away_team: 'Cameroon',     home_flag: 'ch',     away_flag: 'cm',
    kickoff_at: daysFromNow(3),   round: 'Group Stage',   group_name: 'Group I',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Denmark',     away_team: 'Iraq',         home_flag: 'dk',     away_flag: 'iq',
    kickoff_at: daysFromNow(4),   round: 'Group Stage',   group_name: 'Group J',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Italy',       away_team: 'Slovakia',     home_flag: 'it',     away_flag: 'sk',
    kickoff_at: daysFromNow(5),   round: 'Group Stage',   group_name: 'Group K',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Austria',     away_team: 'Hungary',      home_flag: 'at',     away_flag: 'hu',
    kickoff_at: daysFromNow(7),   round: 'Group Stage',   group_name: 'Group L',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'Brazil',      away_team: 'France',       home_flag: 'br',     away_flag: 'fr',
    kickoff_at: daysFromNow(10),  round: 'Quarter Final', group_name: '',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
  { home_team: 'England',     away_team: 'Spain',        home_flag: 'gb-eng', away_flag: 'es',
    kickoff_at: daysFromNow(14),  round: 'Semi Final',    group_name: '',
    status: 'upcoming', home_score: null, away_score: null, manually_locked: false },
]

// ── Original 10-user prediction matrix ────────────────────────────────────────
// [userIdx, matchIdx, predicted_winner, goal_difference]
//
// Completed results:  M0 Brazil 2-1 Morocco · M1 Germany 1-1 Colombia
//                     M2 France 3-0 Nigeria · M3 Spain 2-0 Australia

type PredRow = [number, number, 'home' | 'draw' | 'away', number | null]

const SEED_PREDICTIONS: PredRow[] = [
  // ── M0: Brazil 2-1 Morocco ────────────────────────────────────────────────
  [0, 0, 'home', 1], [1, 0, 'home', 1], [2, 0, 'home', 2], [3, 0, 'home', 2],
  [4, 0, 'away', null], [5, 0, 'home', 1], [6, 0, 'away', null],
  [7, 0, 'home', 3], [8, 0, 'home', 2], [9, 0, 'away', null],

  // ── M1: Germany 1-1 Colombia ──────────────────────────────────────────────
  [0, 1, 'draw', null], [1, 1, 'draw', null], [2, 1, 'home', 1], [3, 1, 'draw', null],
  [4, 1, 'draw', null], [5, 1, 'away', null], [6, 1, 'home', 1],
  [7, 1, 'away', null], [8, 1, 'home', 2],    [9, 1, 'home', 1],

  // ── M2: France 3-0 Nigeria ────────────────────────────────────────────────
  [0, 2, 'home', 3], [1, 2, 'home', 2], [2, 2, 'home', 3], [3, 2, 'away', null],
  [4, 2, 'home', 1], [5, 2, 'home', 1], [6, 2, 'draw', null],
  [7, 2, 'away', null], [8, 2, 'away', null], [9, 2, 'away', null],

  // ── M3: Spain 2-0 Australia ───────────────────────────────────────────────
  [0, 3, 'home', 2], [1, 3, 'home', 1], [2, 3, 'home', 2], [3, 3, 'home', 2],
  [4, 3, 'home', 1], [5, 3, 'draw', null], [6, 3, 'home', 2],
  [7, 3, 'draw', null], [8, 3, 'away', null], [9, 3, 'home', 1],

  // ── M4: England vs Japan (locked) ────────────────────────────────────────
  [0, 4, 'home', 1], [1, 4, 'home', 2], [2, 4, 'home', 1], [3, 4, 'draw', null],
  [4, 4, 'home', 1], [5, 4, 'away', null], [6, 4, 'home', 2],
  [7, 4, 'draw', null], [8, 4, 'home', 1], [9, 4, 'home', 3],

  // ── M5: Portugal vs Tunisia (locked) ─────────────────────────────────────
  [0, 5, 'home', 2], [1, 5, 'home', 1], [2, 5, 'home', 2], [3, 5, 'home', 1],
  [4, 5, 'draw', null], [5, 5, 'home', 1], [6, 5, 'away', null],
  [7, 5, 'home', 2], [8, 5, 'home', 1], [9, 5, 'draw', null],

  // ── M6: Netherlands vs Jordan (locked) — Sophie missing ──────────────────
  [0, 6, 'home', 3], [1, 6, 'home', 2], [2, 6, 'home', 3], [3, 6, 'home', 2],
  [4, 6, 'home', 1], [5, 6, 'home', 2], [6, 6, 'draw', null],
  [7, 6, 'home', 1], [8, 6, 'away', null],

  // ── M7: Belgium vs Qatar (locked) — David + Sophie missing ───────────────
  [0, 7, 'home', 2], [1, 7, 'home', 1], [2, 7, 'home', 2], [3, 7, 'draw', null],
  [4, 7, 'home', 1], [5, 7, 'home', 2], [6, 7, 'away', null], [7, 7, 'home', 1],

  // ── M8: USA vs New Zealand (voting_open) ─────────────────────────────────
  [0, 8, 'home', 2], [1, 8, 'home', 1], [2, 8, 'home', 2], [3, 8, 'draw', null],
  [4, 8, 'home', 1], [5, 8, 'home', 1], [6, 8, 'away', null],
  [7, 8, 'home', 2], [8, 8, 'home', 1],

  // ── M9: Mexico vs Saudi Arabia (voting_open) ─────────────────────────────
  [0, 9, 'home', 1], [1, 9, 'home', 2], [2, 9, 'away', null], [3, 9, 'home', 1],
  [4, 9, 'draw', null], [5, 9, 'home', 1], [6, 9, 'home', 2], [7, 9, 'draw', null],

  // ── M10: Canada vs Ivory Coast (voting_open) ──────────────────────────────
  [0, 10, 'home', 1], [1, 10, 'away', null], [2, 10, 'home', 2],
  [3, 10, 'draw', null], [4, 10, 'home', 1], [5, 10, 'away', null], [6, 10, 'home', 1],

  // ── M11: Argentina vs South Korea (voting_open) ───────────────────────────
  [0, 11, 'home', 2], [1, 11, 'home', 1], [2, 11, 'home', 2], [3, 11, 'home', 1],
  [4, 11, 'draw', null], [5, 11, 'home', 1], [6, 11, 'away', null],

  // ── M12: Egypt vs Ecuador (voting_open) ───────────────────────────────────
  [0, 12, 'draw', null], [1, 12, 'home', 1], [2, 12, 'away', null],
  [3, 12, 'home', 2], [4, 12, 'draw', null],

  // ── M13: Uruguay vs South Africa (voting_open) ────────────────────────────
  [0, 13, 'home', 2], [1, 13, 'home', 1], [2, 13, 'home', 1], [3, 13, 'away', null],

  // ── Upcoming: sparse ─────────────────────────────────────────────────────
  [0, 14, 'home', 1], [1, 14, 'home', 2],
  [0, 15, 'home', 2], [1, 15, 'home', 1], [2, 15, 'away', null],
  [0, 16, 'home', 2],
  [0, 17, 'home', 1], [1, 17, 'draw', null],
  [0, 18, 'home', 1], [1, 18, 'away', null],
  [0, 19, 'home', 2],
]

// ── Extra user prediction profiles ───────────────────────────────────────────
//
// Completed match outcomes (determines points after calculate_points runs):
//   M0 Brazil 2-1 Morocco  → exact=(home,1)=15  correct=(home,2)=10  wrong=(away)=0
//   M1 Germany 1-1 Colombia → exact=(draw)=10   correct=(draw)=10    wrong=(home,1)=0
//   M2 France 3-0 Nigeria  → exact=(home,3)=15  correct=(home,1)=10  wrong=(away)=0
//   M3 Spain 2-0 Australia → exact=(home,2)=15  correct=(home,1)=10  wrong=(draw)=0
//   skip = no prediction row inserted for that match

type Outcome = 'exact' | 'correct' | 'wrong' | 'skip'

// What to predict (winner, goal_diff) for each outcome on each completed match
const OUTCOME_PRED: Record<Exclude<Outcome, 'skip'>, Record<0|1|2|3, ['home'|'draw'|'away', number|null]>> = {
  exact:   { 0: ['home', 1], 1: ['draw', null], 2: ['home', 3], 3: ['home', 2] },
  correct: { 0: ['home', 2], 1: ['draw', null], 2: ['home', 1], 3: ['home', 1] },
  wrong:   { 0: ['away', null], 1: ['home', 1], 2: ['away', null], 3: ['draw', null] },
}

// [m0, m1, m2, m3, userCount]  — sequential, matches EXTRA_USERS order
const EXTRA_BATCHES: [Outcome, Outcome, Outcome, Outcome, number][] = [
  // 55 pts (3)
  ['exact',   'correct', 'exact',   'exact',   3],
  // 50 pts (7)
  ['exact',   'correct', 'exact',   'correct', 3],
  ['correct', 'correct', 'exact',   'exact',   2],
  ['exact',   'correct', 'correct', 'exact',   2],
  // 45 pts (10)
  ['exact',   'wrong',   'exact',   'exact',   3],
  ['exact',   'correct', 'correct', 'correct', 3],
  ['correct', 'correct', 'exact',   'correct', 2],
  ['correct', 'correct', 'correct', 'exact',   2],
  // 40 pts (15)
  ['correct', 'correct', 'correct', 'correct', 5],
  ['exact',   'correct', 'exact',   'skip',    3],
  ['skip',    'correct', 'exact',   'exact',   3],
  ['exact',   'wrong',   'correct', 'exact',   2],
  ['exact',   'correct', 'skip',    'exact',   2],
  // 35 pts (15)
  ['exact',   'correct', 'correct', 'skip',    3],
  ['exact',   'correct', 'skip',    'correct', 3],
  ['correct', 'correct', 'exact',   'skip',    3],
  ['correct', 'correct', 'skip',    'exact',   3],
  ['exact',   'wrong',   'correct', 'correct', 3],
  // 30 pts (15)
  ['correct', 'correct', 'correct', 'skip',    3],
  ['correct', 'correct', 'skip',    'correct', 3],
  ['exact',   'wrong',   'exact',   'skip',    3],
  ['exact',   'wrong',   'skip',    'exact',   3],
  ['skip',    'wrong',   'exact',   'exact',   3],
  // 25 pts (15)
  ['exact',   'correct', 'wrong',   'skip',    3],
  ['skip',    'correct', 'exact',   'skip',    3],
  ['correct', 'wrong',   'skip',    'exact',   3],
  ['exact',   'wrong',   'skip',    'correct', 3],
  ['exact',   'skip',    'skip',    'correct', 3],
  // 20 pts (12)
  ['correct', 'correct', 'wrong',   'skip',    3],
  ['correct', 'skip',    'correct', 'skip',    3],
  ['skip',    'skip',    'correct', 'correct', 3],
  ['skip',    'correct', 'skip',    'correct', 3],
  // 15 pts (10)
  ['exact',   'wrong',   'skip',    'skip',    4],
  ['skip',    'wrong',   'exact',   'skip',    3],
  ['skip',    'skip',    'skip',    'exact',   3],
  // 10 pts (15)
  ['correct', 'wrong',   'skip',    'skip',    4],
  ['skip',    'correct', 'skip',    'skip',    4],
  ['skip',    'wrong',   'correct', 'skip',    4],
  ['skip',    'skip',    'skip',    'correct', 3],
  // 0 pts (23)
  ['wrong',   'wrong',   'wrong',   'wrong',   8],
  ['wrong',   'wrong',   'wrong',   'skip',    5],
  ['wrong',   'skip',    'wrong',   'wrong',   5],
  ['skip',    'skip',    'skip',    'skip',    5],
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding database...\n')

  // 1. Create all 150 auth users
  console.log('Creating users (150)...')
  const allUsers = [...SEED_USERS, ...EXTRA_USERS]
  const userIds: string[] = []
  for (const u of allUsers) {
    const { data, error } = await sb.auth.admin.createUser({
      email: u.email,
      password: 'SeedPass123!',
      email_confirm: true,
      user_metadata: { full_name: u.name },
    })
    if (error) throw new Error(`createUser ${u.email}: ${error.message}`)
    userIds.push(data.user.id)
    process.stdout.write('.')
  }
  console.log(` ✓ ${userIds.length} users`)

  // 2. Insert matches
  console.log('\nInserting matches...')
  const { data: matchRows, error: matchErr } = await sb
    .from('matches')
    .insert(SEED_MATCHES)
    .select('id')
  if (matchErr || !matchRows) throw new Error(`insert matches: ${matchErr?.message}`)
  const matchIds = matchRows.map((r: { id: string }) => r.id)
  console.log(`  ✓ ${matchIds.length} matches`)

  // 3. Insert original 10-user predictions (all 20 matches)
  console.log('\nInserting core predictions...')
  const corePredRows = SEED_PREDICTIONS.map(([ui, mi, winner, diff]) => ({
    user_id: userIds[ui],
    match_id: matchIds[mi],
    predicted_winner: winner,
    goal_difference: diff,
    points_earned: 0,
  }))
  const { error: corePredErr } = await sb.from('predictions').insert(corePredRows)
  if (corePredErr) throw new Error(`insert core predictions: ${corePredErr.message}`)
  console.log(`  ✓ ${corePredRows.length} predictions`)

  // 4. Generate + insert extra 140-user predictions (completed matches only)
  console.log('\nInserting extra predictions...')
  const extraPredRows: {
    user_id: string; match_id: string
    predicted_winner: string; goal_difference: number | null; points_earned: number
  }[] = []

  let extraUserIdx = 0
  for (const [m0, m1, m2, m3, count] of EXTRA_BATCHES) {
    const outcomes: Outcome[] = [m0, m1, m2, m3]
    for (let i = 0; i < count; i++) {
      const uid = userIds[SEED_USERS.length + extraUserIdx]
      outcomes.forEach((outcome, matchIdx) => {
        if (outcome === 'skip') return
        const [winner, diff] = OUTCOME_PRED[outcome][matchIdx as 0|1|2|3]
        extraPredRows.push({
          user_id: uid,
          match_id: matchIds[matchIdx],
          predicted_winner: winner,
          goal_difference: diff,
          points_earned: 0,
        })
      })
      extraUserIdx++
    }
  }

  const { error: extraPredErr } = await sb.from('predictions').insert(extraPredRows)
  if (extraPredErr) throw new Error(`insert extra predictions: ${extraPredErr.message}`)
  console.log(`  ✓ ${extraPredRows.length} predictions`)

  // 5. Calculate points for 4 completed matches
  console.log('\nCalculating points...')
  for (let i = 0; i < 4; i++) {
    const { error } = await sb.rpc('calculate_points', { match_id_input: matchIds[i] })
    if (error) throw new Error(`calculate_points M${i}: ${error.message}`)
    const m = SEED_MATCHES[i]
    console.log(`  ✓ ${m.home_team} ${m.home_score}–${m.away_score} ${m.away_team}`)
  }

  const totalPreds = corePredRows.length + extraPredRows.length
  console.log(`\n✅ Done — 150 users · ${matchIds.length} matches · ${totalPreds} predictions`)
  console.log('\nLeaderboard shape:')
  console.log('  Top tier  (~55 pts): 4 users  (James + 3 extras)')
  console.log('  High      (40–50 pts): ~32 users')
  console.log('  Mid       (20–35 pts): ~57 users')
  console.log('  Low       (10–15 pts): ~25 users')
  console.log('  Zero/tail  (0–10 pts): ~32 users')
}

seed().catch(err => {
  console.error('\n❌', err.message)
  process.exit(1)
})
