/*
  REAL DATA — extracted from your original index.html
  States, Utilities, Suppliers, Rates, ACC_INFO_MAP
*/

export const WORKER_URL = 'https://energy-dashboard-proxy.flpintoc.workers.dev';

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
  {id:'u_etown',name:'Elizabethtown Gas (E-Town)',stateId:'st2',type:'gas'},
  {id:'u_sjg',name:'South Jersey Gas (SJG)',stateId:'st2',type:'gas'},
  // PA
  {id:'u_peco',name:'PECO Energy (PECO)',stateId:'st3',type:'electric'},
  {id:'u_pple',name:'PPL Electric Utilities (PPL)',stateId:'st3',type:'electric'},
  {id:'u_pnlc',name:'Penelec (PNLC)',stateId:'st3',type:'electric'},
  {id:'u_meted',name:'Metropolitan Edison (MetEd)',stateId:'st3',type:'electric'},
  {id:'u_duqe',name:'Duquesne Light (DUQE)',stateId:'st3',type:'electric'},
  {id:'u_penn_pa',name:'Penn Power (PA)',stateId:'st3',type:'electric'},
  {id:'u_alleg',name:'Allegheny Power (ALLEG)',stateId:'st3',type:'electric'},
  {id:'u_westpenn',name:'West Penn Power',stateId:'st3',type:'electric'},
  {id:'u_penelec',name:'Penelec',stateId:'st3',type:'electric'},
  {id:'u_pecog',name:'PECO Energy Gas',stateId:'st3',type:'gas'},
  {id:'u_pgw',name:'Philadelphia Gas Works (PGW)',stateId:'st3',type:'gas'},
  {id:'u_ugi',name:'UGI Utilities (UGI)',stateId:'st3',type:'gas'},
  {id:'u_colgaspa',name:'Columbia Gas Pennsylvania',stateId:'st3',type:'gas'},
  {id:'u_peoples',name:'Peoples Natural Gas',stateId:'st3',type:'gas'},
  // DC
  {id:'u_pepcodc',name:'Potomac Electric (Pepco DC)',stateId:'st4',type:'electric'},
  {id:'u_washgasdc',name:'Washington Gas DC',stateId:'st4',type:'gas'},
  // IN
  {id:'u_nipsco',name:'N. Indiana Public Service (NIPSCO)',stateId:'st5',type:'gas'},
  // VA
  {id:'u_colgasva',name:'Columbia Gas Virginia',stateId:'st7',type:'gas'},
  {id:'u_washgasva',name:'Washington Gas Virginia',stateId:'st7',type:'gas'},
  // DE
  {id:'u_delmarva',name:'Delmarva Power (Delmarva)',stateId:'st8',type:'electric'},
  // NY
  {id:'u_coned',name:'Con Edison Zone J (ConEd)',stateId:'st9',type:'electric'},
  // MI
  {id:'u_dte',name:'DTE Energy (Electric)',stateId:'st10',type:'electric'},
  {id:'u_consumers',name:'Consumers Energy (Electric)',stateId:'st10',type:'electric'},
  {id:'u_consumers_g',name:'Consumers Energy (Gas)',stateId:'st10',type:'gas'},
  {id:'u_dte_g',name:'DTE Energy (Gas)',stateId:'st10',type:'gas'},
  // OH
  {id:'u_aep_oh',name:'AEP Ohio / AEP Columbus',stateId:'st11',type:'electric'},
  {id:'u_duke_oh',name:'Duke Energy Ohio',stateId:'st11',type:'electric'},
  {id:'u_firstenergy',name:'FirstEnergy (Toledo Ed, Ohio Ed)',stateId:'st11',type:'electric'},
  {id:'u_aes_oh',name:'AES / Dayton Power & Light',stateId:'st11',type:'electric'},
  {id:'u_columbia_oh',name:'Columbia Gas Ohio',stateId:'st11',type:'gas'},
  {id:'u_dominion_oh',name:'Dominion Energy Ohio',stateId:'st11',type:'gas'},
];

export const ACC_INFO_MAP = {
  'PSE&G Gas':{label:'POD ID',chars:20},'PSE&G':{label:'POD ID',chars:20},
  'JCP&L':{label:'CUSTOMER #',chars:20},'Atlantic City':{label:'SERVICE #',chars:22},
  'South Jersey':{label:'SERVICE AGREEMENT ID',chars:null},'NJ Natural Gas':{label:'ACC #',chars:12},
  'Elizabethtown':{label:'SERVICE AGREEMENT ID',chars:10},'PECO Energy':{label:'CHOICE ID #',chars:10},
  'PECO Energy Gas':{label:'CHOICE ID',chars:10},'Penelec':{label:'CUSTOMER #',chars:20},
  'PPL':{label:'ACC #',chars:10},'Metropolitan Edison':{label:'CUSTOMER #',chars:20},
  'West Penn':{label:'CUSTOMER #',chars:20},'Duquesne':{label:'SUPPLIER AGREEMENT ID',chars:10},
  'UGI':{label:'ACC #',chars:12},'Philadelphia Gas':{label:'ACC # + SERVICE POINT ID',chars:20},
  'Columbia Gas PA':{label:'ACC #',chars:15},'Columbia Gas Virginia':{label:'ACC #',chars:12},
  'Eversource':{label:'ACC # + SERVICE REFERENCE',chars:'11+8'},
  'MECO':{label:'ACC # + SERVICE REFERENCE',chars:'11+8'},
  'NSTAR':{label:'ACC # + SERVICE REFERENCE',chars:'11+8'},
  'WMECO':{label:'ACC # + SERVICE REFERENCE',chars:'11+8'},
  'Pepco':{label:'SERVICE #',chars:22},'Potomac Electric':{label:'SERVICE #',chars:22},
  'Washington Gas':{label:'ACC #',chars:12},'Delmarva':{label:'SERVICE #',chars:22},
  'ConEd':{label:'ACC #',chars:15},'PG&E':{label:'ACC #',chars:10},'NIPSCO':{label:'ACC #',chars:10},
  'Rockland':{label:'CUSTOMER #',chars:20},
};

export function getAccInfo(utilName){
  if(!utilName)return null;
  const key=Object.keys(ACC_INFO_MAP).find(k=>utilName.includes(k));
  return key?ACC_INFO_MAP[key]:null;
}

export const SUPPLIER_BRANDS = [
  {id:'nge',name:'NG&E',color:'#0891b2'},
  {id:'indra',name:'INDRA',color:'#db2777'},
  {id:'rushmore',name:'Rushmore',color:'#ea580c'},
  {id:'ecoplus',name:'Ecoplus Power',color:'#16a34a'},
];

// All rates with supplier brand + utility mapping
export const RATES = [
  // ── NG&E RATES ──
  {id:'r_peco',brand:'nge',util:'PECO',eType:'electric',rType:'fixed',price:'0.1299',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_pple',brand:'nge',util:'PPL',eType:'electric',rType:'fixed',price:'0.1399',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_pnlc',brand:'nge',util:'PNLC',eType:'electric',rType:'fixed',price:'0.1799',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_meted',brand:'nge',util:'METED',eType:'electric',rType:'fixed',price:'0.1399',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_duqe',brand:'nge',util:'DUQE',eType:'electric',rType:'fixed',price:'0.1599',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_alleg',brand:'nge',util:'ALLEG',eType:'electric',rType:'fixed',price:'0.1399',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_meco',brand:'nge',util:'MECO',eType:'electric',rType:'fixed',price:'0.1899',months:'EOY26',etf:'$150',uom:'$/kWh',notes:''},
  {id:'r_nstar',brand:'nge',util:'NSTAR',eType:'electric',rType:'fixed',price:'0.1899',months:'EOY26',etf:'$150',uom:'$/kWh',notes:''},
  {id:'r_wmeco',brand:'nge',util:'WMECO',eType:'electric',rType:'fixed',price:'0.1899',months:'EOY26',etf:'$150',uom:'$/kWh',notes:''},
  {id:'r_jcpl',brand:'nge',util:'JCP&L',eType:'electric',rType:'fixed',price:'0.1999',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_psege',brand:'nge',util:'PSE&G',eType:'electric',rType:'fixed',price:'0.2299',months:'3',etf:'$125',uom:'$/kWh',notes:''},
  {id:'r_pecog',brand:'nge',util:'PECO Gas',eType:'gas',rType:'fixed',price:'0.99',months:'3',etf:'$125',uom:'$/CCF',notes:''},
  {id:'r_pgw',brand:'nge',util:'PGW',eType:'gas',rType:'fixed',price:'1.19',months:'3',etf:'$150',uom:'$/CCF',notes:''},
  {id:'r_ugi',brand:'nge',util:'UGI',eType:'gas',rType:'fixed',price:'0.899',months:'3',etf:'$150',uom:'$/CCF',notes:''},
  {id:'r_njng',brand:'nge',util:'NJNG',eType:'gas',rType:'fixed',price:'1.09',months:'3',etf:'$125',uom:'$/Therm',notes:''},
  {id:'r_psegg',brand:'nge',util:'PSE&G Gas',eType:'gas',rType:'fixed',price:'1.09',months:'3',etf:'$125',uom:'$/Therm',notes:''},
  // ── RUSHMORE RATES (36M Fixed, $5/mo remaining ETF) ──
  {id:'rr_de',brand:'rushmore',util:'Delmarva',eType:'electric',rType:'fixed',price:'0.1460',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_jcpl',brand:'rushmore',util:'JCP&L',eType:'electric',rType:'fixed',price:'0.1940',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_ace',brand:'rushmore',util:'ACE',eType:'electric',rType:'fixed',price:'0.1940',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_psege',brand:'rushmore',util:'PSE&G',eType:'electric',rType:'fixed',price:'0.2230',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_aep',brand:'rushmore',util:'AEP Ohio',eType:'electric',rType:'fixed',price:'0.1360',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_duke',brand:'rushmore',util:'Duke OH',eType:'electric',rType:'fixed',price:'0.1300',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_fe',brand:'rushmore',util:'FirstEnergy',eType:'electric',rType:'fixed',price:'0.1330',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_aes',brand:'rushmore',util:'AES/DPL',eType:'electric',rType:'fixed',price:'0.1290',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_peco',brand:'rushmore',util:'PECO',eType:'electric',rType:'fixed',price:'0.1560',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_ppl',brand:'rushmore',util:'PPL',eType:'electric',rType:'fixed',price:'0.1830',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_duq',brand:'rushmore',util:'DUQE',eType:'electric',rType:'fixed',price:'0.1900',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  {id:'rr_meted',brand:'rushmore',util:'MetEd',eType:'electric',rType:'fixed',price:'0.1700',months:'36',etf:'$5/mo rem.',uom:'$/kWh',notes:'Fixed'},
  // ── INDRA RATES ──
  // NJ Electric
  {id:'i_jcpl_v',brand:'indra',util:'JCP&L',eType:'electric',rType:'variable',price:'0.139',months:'1',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_jcpl_2p',brand:'indra',util:'JCP&L',eType:'electric',rType:'fixed',price:'0.139→0.2687',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_jcpl_6f',brand:'indra',util:'JCP&L',eType:'electric',rType:'fixed',price:'0.2218',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_psege_v',brand:'indra',util:'PSE&G',eType:'electric',rType:'variable',price:'0.179',months:'1',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_psege_2p',brand:'indra',util:'PSE&G',eType:'electric',rType:'fixed',price:'0.179→0.3052',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_psege_6f',brand:'indra',util:'PSE&G',eType:'electric',rType:'fixed',price:'0.2563',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_ace_v',brand:'indra',util:'ACE',eType:'electric',rType:'variable',price:'0.174',months:'1',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_ace_2p',brand:'indra',util:'ACE',eType:'electric',rType:'fixed',price:'0.174→0.2779',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_ace_6f',brand:'indra',util:'ACE',eType:'electric',rType:'fixed',price:'0.2311',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_reco_v',brand:'indra',util:'RECO',eType:'electric',rType:'variable',price:'0.154',months:'1',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_reco_2p',brand:'indra',util:'RECO',eType:'electric',rType:'fixed',price:'0.154→0.2934',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_reco_6f',brand:'indra',util:'RECO',eType:'electric',rType:'fixed',price:'0.2448',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  // NJ Gas
  {id:'i_njng_v',brand:'indra',util:'NJNG',eType:'gas',rType:'variable',price:'0.39',months:'1',etf:'No ETF',uom:'$/Therm',notes:'Variable Intro'},
  {id:'i_njng_2p',brand:'indra',util:'NJNG',eType:'gas',rType:'fixed',price:'0.39→1.987',months:'13',etf:'No ETF',uom:'$/Therm',notes:'2-Phase'},
  {id:'i_njng_6f',brand:'indra',util:'NJNG',eType:'gas',rType:'fixed',price:'1.4468',months:'6',etf:'$10/mo',uom:'$/Therm',notes:'6M Fixed'},
  {id:'i_njng_12f',brand:'indra',util:'NJNG',eType:'gas',rType:'fixed',price:'1.5609',months:'12',etf:'$10/mo',uom:'$/Therm',notes:'12M Fixed'},
  {id:'i_psegg_v',brand:'indra',util:'PSE&G Gas',eType:'gas',rType:'variable',price:'0.29',months:'1',etf:'No ETF',uom:'$/Therm',notes:'Variable Intro'},
  {id:'i_psegg_2p',brand:'indra',util:'PSE&G Gas',eType:'gas',rType:'fixed',price:'0.29→2.095',months:'13',etf:'No ETF',uom:'$/Therm',notes:'2-Phase'},
  {id:'i_psegg_6f',brand:'indra',util:'PSE&G Gas',eType:'gas',rType:'fixed',price:'1.5558',months:'6',etf:'$10/mo',uom:'$/Therm',notes:'6M Fixed'},
  {id:'i_etown_v',brand:'indra',util:'E-Town',eType:'gas',rType:'variable',price:'0.56',months:'1',etf:'No ETF',uom:'$/Therm',notes:'Variable Intro'},
  {id:'i_etown_2p',brand:'indra',util:'E-Town',eType:'gas',rType:'fixed',price:'0.56→2.099',months:'13',etf:'No ETF',uom:'$/Therm',notes:'2-Phase'},
  {id:'i_etown_6f',brand:'indra',util:'E-Town',eType:'gas',rType:'fixed',price:'1.5614',months:'6',etf:'$10/mo',uom:'$/Therm',notes:'6M Fixed'},
  {id:'i_sjg_v',brand:'indra',util:'SJG',eType:'gas',rType:'variable',price:'0.44',months:'1',etf:'No ETF',uom:'$/Therm',notes:'Variable Intro'},
  {id:'i_sjg_2p',brand:'indra',util:'SJG',eType:'gas',rType:'fixed',price:'0.44→1.968',months:'13',etf:'No ETF',uom:'$/Therm',notes:'2-Phase'},
  {id:'i_sjg_6f',brand:'indra',util:'SJG',eType:'gas',rType:'fixed',price:'1.427',months:'6',etf:'$10/mo',uom:'$/Therm',notes:'6M Fixed'},
  // PA Electric
  {id:'i_peco_v',brand:'indra',util:'PECO',eType:'electric',rType:'variable',price:'0.101',months:'2',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_peco_2p',brand:'indra',util:'PECO',eType:'electric',rType:'fixed',price:'0.101→0.243',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_peco_6f',brand:'indra',util:'PECO',eType:'electric',rType:'fixed',price:'0.1955',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_ppl_v',brand:'indra',util:'PPL',eType:'electric',rType:'variable',price:'0.119',months:'2',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_ppl_2p',brand:'indra',util:'PPL',eType:'electric',rType:'fixed',price:'0.119→0.267',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_ppl_6f',brand:'indra',util:'PPL',eType:'electric',rType:'fixed',price:'0.2199',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_duqe_v',brand:'indra',util:'DUQE',eType:'electric',rType:'variable',price:'0.129',months:'2',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_duqe_2p',brand:'indra',util:'DUQE',eType:'electric',rType:'fixed',price:'0.129→0.257',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_duqe_6f',brand:'indra',util:'DUQE',eType:'electric',rType:'fixed',price:'0.2111',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_meted_v',brand:'indra',util:'MetEd',eType:'electric',rType:'variable',price:'0.119',months:'2',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_meted_2p',brand:'indra',util:'MetEd',eType:'electric',rType:'fixed',price:'0.119→0.258',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_meted_6f',brand:'indra',util:'MetEd',eType:'electric',rType:'fixed',price:'0.2104',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_wpp_v',brand:'indra',util:'West Penn',eType:'electric',rType:'variable',price:'0.103',months:'2',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_wpp_2p',brand:'indra',util:'West Penn',eType:'electric',rType:'fixed',price:'0.103→0.247',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_wpp_6f',brand:'indra',util:'West Penn',eType:'electric',rType:'fixed',price:'0.2004',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_pen_v',brand:'indra',util:'Penelec',eType:'electric',rType:'variable',price:'0.109',months:'2',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_pen_2p',brand:'indra',util:'Penelec',eType:'electric',rType:'fixed',price:'0.109→0.265',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_pen_6f',brand:'indra',util:'Penelec',eType:'electric',rType:'fixed',price:'0.218',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  // PA Gas
  {id:'i_pecog_v',brand:'indra',util:'PECO Gas',eType:'gas',rType:'variable',price:'0.499',months:'2',etf:'No ETF',uom:'$/CCF',notes:'Variable Intro'},
  {id:'i_pecog_2p',brand:'indra',util:'PECO Gas',eType:'gas',rType:'fixed',price:'0.499→1.81',months:'13',etf:'No ETF',uom:'$/CCF',notes:'2-Phase'},
  {id:'i_pecog_6f',brand:'indra',util:'PECO Gas',eType:'gas',rType:'fixed',price:'1.3545',months:'6',etf:'$10/mo',uom:'$/CCF',notes:'6M Fixed'},
  {id:'i_pgw_v',brand:'indra',util:'PGW',eType:'gas',rType:'variable',price:'0.58',months:'2',etf:'No ETF',uom:'$/CCF',notes:'Variable Intro'},
  {id:'i_pgw_2p',brand:'indra',util:'PGW',eType:'gas',rType:'fixed',price:'0.58→1.81',months:'13',etf:'No ETF',uom:'$/CCF',notes:'2-Phase'},
  {id:'i_pgw_6f',brand:'indra',util:'PGW',eType:'gas',rType:'fixed',price:'1.3717',months:'6',etf:'$10/mo',uom:'$/CCF',notes:'6M Fixed'},
  {id:'i_ugi_v',brand:'indra',util:'UGI',eType:'gas',rType:'variable',price:'0.59',months:'2',etf:'No ETF',uom:'$/CCF',notes:'Variable Intro'},
  {id:'i_ugi_2p',brand:'indra',util:'UGI',eType:'gas',rType:'fixed',price:'0.59→1.86',months:'13',etf:'No ETF',uom:'$/CCF',notes:'2-Phase'},
  {id:'i_ugi_6f',brand:'indra',util:'UGI',eType:'gas',rType:'fixed',price:'1.4487',months:'6',etf:'$10/mo',uom:'$/CCF',notes:'6M Fixed'},
  {id:'i_colpa_v',brand:'indra',util:'Col. Gas PA',eType:'gas',rType:'variable',price:'0.289',months:'2',etf:'No ETF',uom:'$/CCF',notes:'Variable Intro'},
  {id:'i_colpa_2p',brand:'indra',util:'Col. Gas PA',eType:'gas',rType:'fixed',price:'0.289→1.66',months:'13',etf:'No ETF',uom:'$/CCF',notes:'2-Phase'},
  {id:'i_colpa_6f',brand:'indra',util:'Col. Gas PA',eType:'gas',rType:'fixed',price:'1.2928',months:'6',etf:'$10/mo',uom:'$/CCF',notes:'6M Fixed'},
  // DC
  {id:'i_pepdc_v',brand:'indra',util:'Pepco DC',eType:'electric',rType:'variable',price:'0.144',months:'1',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_pepdc_2p',brand:'indra',util:'Pepco DC',eType:'electric',rType:'fixed',price:'0.144→0.297',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_pepdc_6f',brand:'indra',util:'Pepco DC',eType:'electric',rType:'fixed',price:'0.252',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_pepdc_12f',brand:'indra',util:'Pepco DC',eType:'electric',rType:'fixed',price:'0.2565',months:'12',etf:'$10/mo',uom:'$/kWh',notes:'12M Fixed'},
  {id:'i_wgdc_v',brand:'indra',util:'Wash. Gas DC',eType:'gas',rType:'variable',price:'0.52',months:'1',etf:'No ETF',uom:'$/Therm',notes:'Variable Intro'},
  {id:'i_wgdc_2p',brand:'indra',util:'Wash. Gas DC',eType:'gas',rType:'fixed',price:'0.52→1.82',months:'13',etf:'No ETF',uom:'$/Therm',notes:'2-Phase'},
  {id:'i_wgdc_6f',brand:'indra',util:'Wash. Gas DC',eType:'gas',rType:'fixed',price:'1.398',months:'6',etf:'$10/mo',uom:'$/Therm',notes:'6M Fixed'},
  {id:'i_wgdc_12f',brand:'indra',util:'Wash. Gas DC',eType:'gas',rType:'fixed',price:'1.4206',months:'12',etf:'$10/mo',uom:'$/Therm',notes:'12M Fixed'},
  // IN
  {id:'i_nips_12f',brand:'indra',util:'NIPSCO',eType:'gas',rType:'fixed',price:'1.20',months:'12',etf:'$10/mo',uom:'$/CCF',notes:'12M Fixed'},
  // VA
  {id:'i_colva_v',brand:'indra',util:'Col. Gas VA',eType:'gas',rType:'variable',price:'0.44',months:'1',etf:'No ETF',uom:'$/Therm',notes:'Variable Intro'},
  {id:'i_colva_6f',brand:'indra',util:'Col. Gas VA',eType:'gas',rType:'fixed',price:'1.5637',months:'6',etf:'$10/mo',uom:'$/Therm',notes:'6M Fixed'},
  {id:'i_colva_12f',brand:'indra',util:'Col. Gas VA',eType:'gas',rType:'fixed',price:'1.5637',months:'12',etf:'$10/mo',uom:'$/Therm',notes:'12M Fixed'},
  {id:'i_wgva_v',brand:'indra',util:'Wash. Gas VA',eType:'gas',rType:'variable',price:'0.48',months:'1',etf:'No ETF',uom:'$/Therm',notes:'Variable Intro'},
  {id:'i_wgva_6f',brand:'indra',util:'Wash. Gas VA',eType:'gas',rType:'fixed',price:'1.3692',months:'6',etf:'$10/mo',uom:'$/Therm',notes:'6M Fixed'},
  {id:'i_wgva_12f',brand:'indra',util:'Wash. Gas VA',eType:'gas',rType:'fixed',price:'1.3894',months:'12',etf:'$10/mo',uom:'$/Therm',notes:'12M Fixed'},
  // DE
  {id:'i_delm_v',brand:'indra',util:'Delmarva',eType:'electric',rType:'variable',price:'0.1049',months:'1',etf:'No ETF',uom:'$/kWh',notes:'Variable Intro'},
  {id:'i_delm_2p',brand:'indra',util:'Delmarva',eType:'electric',rType:'fixed',price:'0.1049→0.246',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
  {id:'i_delm_6f',brand:'indra',util:'Delmarva',eType:'electric',rType:'fixed',price:'0.2027',months:'6',etf:'$10/mo',uom:'$/kWh',notes:'6M Fixed'},
  {id:'i_delm_12f',brand:'indra',util:'Delmarva',eType:'electric',rType:'fixed',price:'0.2064',months:'12',etf:'$10/mo',uom:'$/kWh',notes:'12M Fixed'},
  // NY
  {id:'i_coned_2p',brand:'indra',util:'ConEd J',eType:'electric',rType:'fixed',price:'0.104→0.288',months:'13',etf:'No ETF',uom:'$/kWh',notes:'2-Phase'},
];

export const GOOGLE_MAPS_KEY = 'AIzaSyDd05Tpk1Jkg5ITlZFCvJrQl2ZGOdi0LiA';

export const SCHEDULE = [
  {id:'e1',title:'Follow-up: Johnson acct',date:'2026-04-08',time:'09:00',agent:'María García',type:'call',notes:'Customer requested callback about rate change'},
  {id:'e2',title:'PA Campaign Review',date:'2026-04-08',time:'14:00',agent:'admin',type:'meeting',notes:'Review PA performance metrics'},
  {id:'e3',title:'NJ Renewal Batch',date:'2026-04-09',time:'10:00',agent:'Carlos López',type:'task',notes:'Process 12 pending NJ renewals'},
  {id:'e4',title:'Training: New Rates',date:'2026-04-10',time:'11:00',agent:'all',type:'meeting',notes:'Ecoplus new rate training'},
  {id:'e5',title:'Monthly Report',date:'2026-04-11',time:'09:00',agent:'admin',type:'task',notes:'Generate April performance report'},
];

export function generateMockSales(count=48){
  const agents=['María García','Carlos López','Ana Martínez'];
  const supps=['NG&E','INDRA','Rushmore','Ecoplus Power'];
  const sts=['PA','NJ','NY','MA','VA','DC','DE','OH','MI'];
  const statuses=['completed','pending','in_progress','cancelled'];
  const w=[.55,.2,.15,.1];
  return Array.from({length:count},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-Math.floor(Math.random()*30));
    let r=Math.random(),si=0;for(let j=0;j<w.length;j++){r-=w[j];if(r<=0){si=j;break;}}
    return{id:'s'+i,date:d.toISOString().slice(0,10),agent:agents[i%3],supplier:supps[i%4],
      state:sts[i%sts.length],holder:'Customer '+(i+1),phone:'555'+String(1e6+i).slice(0,7),
      status:statuses[si],tpv:si===0?'TPV-'+(1e4+i):'',value:Math.floor(Math.random()*80+15)};
  });
}
