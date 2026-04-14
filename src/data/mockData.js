/*
  REAL DATA — extracted from your original index.html
  States, Utilities, Suppliers, Rates, ACC_INFO_MAP
  
  ⚠️ SECURITY: APP_SECRET removed - now using JWT authentication
*/

// ✅ SECURE: Only public Worker URL, no secrets
export const WORKER_URL = 'https://energy-dashboard-proxy.flpintoc.workers.dev';

// Google Maps API Key (restricted by referrer)
export const GOOGLE_MAPS_KEY = 'AIzaSyDd05Tpk1Jkg5ITlZFCvJrQl2ZGOdi0LiA';

// DEMO MODE: Set to false to use your real backend with 2M DNC numbers
export const DEMO_MODE = false;

// Mock DNC list (numbers that will be flagged as "on DNC list" in demo mode)
export const MOCK_DNC_LIST = [
  '5551234567',
  '3051234567',
  '7861234567',
];

export const MOCK_USERS = [
  {username:'admin',password:'admin123',name:'Felipe Admin',role:'admin',active:true,repId:'ADM001'},
  {username:'agent1',password:'agent123',name:'María García',role:'agent',active:true,repId:'REP001'},
  {username:'agent2',password:'agent123',name:'Carlos López',role:'agent',active:true,repId:'REP002'},
  {username:'agent3',password:'agent123',name:'Ana Martínez',role:'agent',active:true,repId:'REP003'},
];

export const STATES = [
  {id:'st1',name:'Massachusetts',code:'MA'},
  {id:'st2',name:'New Jersey',code:'NJ'},
  {id:'st3',name:'Pennsylvania',code:'PA'},
  {id:'st4',name:'Washington DC',code:'DC'},
  {id:'st5',name:'Indiana',code:'IN'},
  {id:'st7',name:'Virginia',code:'VA'},
  {id:'st8',name:'Delaware',code:'DE'},
  {id:'st9',name:'New York',code:'NY'},
  {id:'st10',name:'Michigan',code:'MI'},
  {id:'st11',name:'Ohio',code:'OH'},
];

export const UTILITIES = [
  // MA
  {id:'u_meco',name:'Massachusetts Electric Co. (MECO)',stateId:'st1',type:'electric'},
  {id:'u_nstar',name:'Eversource (NSTAR)',stateId:'st1',type:'electric'},
  {id:'u_wmeco',name:'Western MA Electric (WMECO)',stateId:'st1',type:'electric'},
  // NJ
  {id:'u_jcpl',name:'Jersey Central Power & Light (JCP&L)',stateId:'st2',type:'electric'},
  {id:'u_psege',name:'Public Service Electric & Gas (PSE&G)',stateId:'st2',type:'electric'},
  {id:'u_ace',name:'Atlantic City Electric (ACE)',stateId:'st2',type:'electric'},
  {id:'u_reco',name:'Rockland Electric (RECO)',stateId:'st2',type:'electric'},
  {id:'u_njng',name:'NJ Natural Gas (NJNG)',stateId:'st2',type:'gas'},
  {id:'u_psegg',name:'PSE&G Gas',stateId:'st2',type:'gas'},
  // PA
  {id:'u_peco',name:'PECO Energy',stateId:'st3',type:'electric'},
  {id:'u_duquesne',name:'Duquesne Light',stateId:'st3',type:'electric'},
  {id:'u_meted',name:'Met-Ed',stateId:'st3',type:'electric'},
  {id:'u_penelec',name:'Penelec',stateId:'st3',type:'electric'},
  {id:'u_pennpower',name:'Penn Power',stateId:'st3',type:'electric'},
  {id:'u_ppe',name:'PPL Electric',stateId:'st3',type:'electric'},
  {id:'u_westpenn',name:'West Penn Power',stateId:'st3',type:'electric'},
  {id:'u_columbia',name:'Columbia Gas',stateId:'st3',type:'gas'},
  // DC
  {id:'u_pepco_dc',name:'PEPCO',stateId:'st4',type:'electric'},
  // IN
  {id:'u_aepindiana',name:'AEP Indiana',stateId:'st5',type:'electric'},
  {id:'u_dukein',name:'Duke Energy Indiana',stateId:'st5',type:'electric'},
  {id:'u_nipsc',name:'NIPSCO',stateId:'st5',type:'electric'},
  {id:'u_vectren',name:'Vectren',stateId:'st5',type:'electric'},
  {id:'u_nipscogas',name:'NIPSCO Gas',stateId:'st5',type:'gas'},
  {id:'u_vectrengas',name:'Vectren Gas',stateId:'st5',type:'gas'},
  // VA
  {id:'u_dominion',name:'Dominion Energy',stateId:'st7',type:'electric'},
  {id:'u_appalachian',name:'Appalachian Power',stateId:'st7',type:'electric'},
  {id:'u_columbiagas_va',name:'Columbia Gas of Virginia',stateId:'st7',type:'gas'},
  // DE
  {id:'u_delmarva_de',name:'Delmarva Power',stateId:'st8',type:'electric'},
  // NY
  {id:'u_coned',name:'Con Edison',stateId:'st9',type:'electric'},
  {id:'u_nyseg',name:'NYSEG',stateId:'st9',type:'electric'},
  {id:'u_rge',name:'RG&E',stateId:'st9',type:'electric'},
  {id:'u_central_hudson',name:'Central Hudson',stateId:'st9',type:'electric'},
  {id:'u_o_and_r',name:'Orange & Rockland (O&R)',stateId:'st9',type:'electric'},
  {id:'u_nationalgrid_ny',name:'National Grid',stateId:'st9',type:'electric'},
  {id:'u_conedgas',name:'Con Edison Gas',stateId:'st9',type:'gas'},
  {id:'u_nationalgrid_nygas',name:'National Grid Gas',stateId:'st9',type:'gas'},
  // MI
  {id:'u_consumers',name:'Consumers Energy',stateId:'st10',type:'electric'},
  {id:'u_dte',name:'DTE Energy',stateId:'st10',type:'electric'},
  {id:'u_consumersgas',name:'Consumers Energy Gas',stateId:'st10',type:'gas'},
  // OH
  {id:'u_aepohio',name:'AEP Ohio',stateId:'st11',type:'electric'},
  {id:'u_firstenergy',name:'FirstEnergy',stateId:'st11',type:'electric'},
  {id:'u_duke_ohio',name:'Duke Energy Ohio',stateId:'st11',type:'electric'},
  {id:'u_dayton',name:'Dayton Power & Light (DP&L)',stateId:'st11',type:'electric'},
  {id:'u_columbia_ohio',name:'Columbia Gas of Ohio',stateId:'st11',type:'gas'},
];

export const SUPPLIER_BRANDS = [
  {id:'sup_inspire',name:'Inspire Energy',logo:'🌱'},
  {id:'sup_constellation',name:'Constellation',logo:'⭐'},
  {id:'sup_direct',name:'Direct Energy',logo:'⚡'},
  {id:'sup_igt',name:'IGS Energy',logo:'🔥'},
  {id:'sup_verde',name:'Verde Energy',logo:'🍃'},
  {id:'sup_spark',name:'Spark Energy',logo:'💡'},
];

export const RATES = [
  // Inspire Energy rates
  {id:'r1',supplierId:'sup_inspire',utilityId:'u_peco',rate:0.0899,term:12,type:'fixed'},
  {id:'r2',supplierId:'sup_inspire',utilityId:'u_peco',rate:0.0849,term:24,type:'fixed'},
  {id:'r3',supplierId:'sup_inspire',utilityId:'u_duquesne',rate:0.0879,term:12,type:'fixed'},
  {id:'r4',supplierId:'sup_inspire',utilityId:'u_duquesne',rate:0.0829,term:24,type:'fixed'},
  // Constellation rates
  {id:'r5',supplierId:'sup_constellation',utilityId:'u_peco',rate:0.0909,term:12,type:'fixed'},
  {id:'r6',supplierId:'sup_constellation',utilityId:'u_peco',rate:0.0859,term:24,type:'fixed'},
  {id:'r7',supplierId:'sup_constellation',utilityId:'u_duquesne',rate:0.0889,term:12,type:'fixed'},
  // Direct Energy rates
  {id:'r8',supplierId:'sup_direct',utilityId:'u_meco',rate:0.1129,term:12,type:'fixed'},
  {id:'r9',supplierId:'sup_direct',utilityId:'u_nstar',rate:0.1149,term:12,type:'fixed'},
  {id:'r10',supplierId:'sup_direct',utilityId:'u_nstar',rate:0.1099,term:24,type:'fixed'},
  // More rates
  {id:'r11',supplierId:'sup_igt',utilityId:'u_coned',rate:0.0999,term:12,type:'fixed'},
  {id:'r12',supplierId:'sup_verde',utilityId:'u_psege',rate:0.0889,term:12,type:'variable'},
  {id:'r13',supplierId:'sup_spark',utilityId:'u_jcpl',rate:0.0879,term:24,type:'fixed'},
];

// ACC INFO mapping (different utilities require different account # formats)
export const ACC_INFO_MAP = {
  'PECO Energy': {label:'PECO Account #',chars:10},
  'Duquesne Light': {label:'Duquesne Account #',chars:9},
  'PPL Electric': {label:'PPL Account #',chars:10},
  'Met-Ed': {label:'Met-Ed Account #',chars:9},
  'Penelec': {label:'Penelec Account #',chars:9},
  'Penn Power': {label:'Penn Power Account #',chars:9},
  'West Penn Power': {label:'West Penn Account #',chars:9},
  'Con Edison': {label:'Con Ed Account #',chars:10},
  'NYSEG': {label:'NYSEG Account #',chars:10},
  'RG&E': {label:'RG&E Account #',chars:10},
  'Massachusetts Electric Co. (MECO)': {label:'POD ID',chars:22},
  'Eversource (NSTAR)': {label:'POD ID',chars:22},
  'Western MA Electric (WMECO)': {label:'POD ID',chars:22},
  'Jersey Central Power & Light (JCP&L)': {label:'Service Reference #',chars:10},
  'Public Service Electric & Gas (PSE&G)': {label:'Service Reference #',chars:10},
  'Atlantic City Electric (ACE)': {label:'Service Reference #',chars:10},
  'Rockland Electric (RECO)': {label:'Service Reference #',chars:10},
  'Delmarva Power': {label:'Service Reference #',chars:10},
  'PEPCO': {label:'Service Reference #',chars:10},
  'Dominion Energy': {label:'Account #',chars:10},
  'Appalachian Power': {label:'Account #',chars:10},
  'Consumers Energy': {label:'Account #',chars:10},
  'DTE Energy': {label:'Account #',chars:10},
  'AEP Ohio': {label:'POD ID',chars:22},
  'FirstEnergy': {label:'Account #',chars:11},
  'Duke Energy Ohio': {label:'Account #',chars:10},
  'Duke Energy Indiana': {label:'Account #',chars:10},
  'NIPSCO': {label:'Account #',chars:10},
  'Vectren': {label:'Account #',chars:10},
  // Gas utilities
  'NJ Natural Gas (NJNG)': {label:'Account #',chars:10},
  'PSE&G Gas': {label:'Account #',chars:10},
  'Columbia Gas': {label:'Account #',chars:10},
  'Columbia Gas of Virginia': {label:'Account #',chars:10},
  'Columbia Gas of Ohio': {label:'Account #',chars:10},
  'NIPSCO Gas': {label:'Account #',chars:10},
  'Vectren Gas': {label:'Account #',chars:10},
  'Con Edison Gas': {label:'Account #',chars:10},
  'National Grid': {label:'Account #',chars:10},
  'National Grid Gas': {label:'Account #',chars:10},
  'Consumers Energy Gas': {label:'Account #',chars:10},
  'Central Hudson': {label:'Account #',chars:10},
  'Orange & Rockland (O&R)': {label:'Account #',chars:10},
  'Dayton Power & Light (DP&L)': {label:'Account #',chars:10},
};

export function getAccInfo(utilityName) {
  return ACC_INFO_MAP[utilityName] || null;
}

// Mock sales data for CRM
export function generateMockSales() {
  const agents = ['María García', 'Carlos López', 'Ana Martínez', 'Felipe Admin'];
  const states = ['MA', 'NJ', 'PA', 'NY', 'OH'];
  const suppliers = ['Inspire Energy', 'Constellation', 'Direct Energy', 'IGS Energy'];
  const statuses = ['completed', 'pending', 'in_progress', 'cancelled'];
  const sales = [];
  
  for (let i = 0; i < 50; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    sales.push({
      id: 'sale_' + i,
      date: date.toISOString().split('T')[0],
      holder: `Customer ${i + 1}`,
      phone: '555' + String(Math.floor(Math.random() * 10000000)).padStart(7, '0'),
      agent: agents[Math.floor(Math.random() * agents.length)],
      state: states[Math.floor(Math.random() * states.length)],
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      value: Math.floor(Math.random() * 300) + 50,
    });
  }
  
  return sales;
}

// Mock schedule events
export const SCHEDULE = [
  {
    id: 'ev1',
    type: 'call',
    title: 'Follow-up: Smith Account',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    agent: 'María García',
    notes: 'Review rate options for renewal'
  },
  {
    id: 'ev2',
    type: 'meeting',
    title: 'Team Standup',
    date: new Date().toISOString().split('T')[0],
    time: '9:00 AM',
    agent: 'all',
    notes: 'Daily team sync'
  },
  {
    id: 'ev3',
    type: 'training',
    title: 'New Rate Training',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '2:00 PM',
    agent: 'all',
    notes: 'Q2 rate updates and supplier changes'
  },
];
