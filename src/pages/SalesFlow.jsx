import{useState,useEffect,useRef,Fragment}from'react';
import{useAuthStore,useUIStore}from'../store';
import * as API from '../services/api';
import{STATES,UTILITIES,SUPPLIER_BRANDS,RATES,getAccInfo,WORKER_URL,GOOGLE_MAPS_KEY,DEMO_MODE,MOCK_DNC_LIST}from'../data/mockData';

const STEP_LABELS=['DNC','State','Utility','Supplier & Rates','Checklist'];

function StepNav({current,maxReached,onGo}){
  return(<div style={{background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',gap:0,padding:'0 12px',overflowX:'auto'}}>
    {STEP_LABELS.map((label,i)=>{const active=i===current,done=i<current&&i<=maxReached;return(<Fragment key={i}>
      <button onClick={()=>onGo(i)} style={{display:'flex',alignItems:'center',gap:7,padding:'13px 16px',background:'none',border:'none',borderBottom:`3px solid ${active?'#fbbf24':'transparent'}`,color:active?'#fbbf24':done?'var(--green)':'rgba(255,255,255,.3)',fontWeight:800,fontSize:'.72rem',letterSpacing:'.04em',textTransform:'uppercase',cursor:'pointer',whiteSpace:'nowrap'}}>
        <span style={{width:24,height:24,borderRadius:'50%',background:active?'var(--orange)':done?'var(--green)':'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',fontWeight:900,color:'#fff',flexShrink:0}}>{done?'✓':(i+1)}</span>
        <span className="hide-mobile">{label}</span>
      </button>{i<4&&<span style={{color:'rgba(255,255,255,.12)',fontSize:'.7rem',margin:'0 2px'}}>›</span>}
    </Fragment>);})}
  </div>);
}

function ContextBar({sel,step}){
  const tags=[];
  if(sel.state&&step>=2)tags.push({l:'State',v:sel.state.code+' — '+sel.state.name,c:'var(--orange)',i:'📍'});
  if(sel.utils?.length&&step>=3)sel.utils.forEach(u=>tags.push({l:'Utility',v:u.name,c:'var(--blue)',i:u.type==='gas'?'🔥':'⚡'}));
  if(sel.supplier&&step>=4)tags.push({l:'Supplier',v:sel.supplier.name,c:'var(--teal)',i:'🏢'});
  if(!tags.length)return null;
  return(<div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:18}}>
    {tags.map((t,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:6,background:'#fff',border:'1.5px solid var(--border)',borderRadius:8,padding:'5px 12px',fontSize:'.72rem',fontWeight:700,color:'var(--muted)',boxShadow:'var(--sh)'}}>
      <span>{t.i}</span><span style={{fontSize:'.58rem',textTransform:'uppercase',letterSpacing:'.06em'}}>{t.l}</span><span style={{color:t.c,fontWeight:900}}>{t.v}</span>
    </div>)}
  </div>);
}

/* ── DNC with WhatsApp + backend check ── */
function StepDNC({onClear,user}){
  const[phone,setPhone]=useState('');const[result,setResult]=useState(null);const[busy,setBusy]=useState(false);const[waStatus,setWaStatus]=useState('');
  const digits=phone.replace(/\D/g,'');
  const check=async()=>{
    if(digits.length!==10)return;
    setBusy(true);
    setResult(null);
    setWaStatus('📱 Notifying supervisor...');
    const agentName=user?.name||'Agent';
    
    // DEMO MODE: Simulate WhatsApp + DNC check locally
    if(DEMO_MODE){
      // Simulate WhatsApp notification
      await new Promise(r=>setTimeout(r,800));
      setWaStatus('✅ Supervisor notified (demo mode)');
      
      // Simulate DNC database check
      await new Promise(r=>setTimeout(r,1200));
      const found=MOCK_DNC_LIST.includes(digits);
      
      if(found){
        setResult('blocked');
        setWaStatus('✅ Supervisor notified — 🚫 ON DNC (demo)');
      }else{
        setResult('clear');
        setWaStatus('✅ Supervisor notified — CLEAR (demo)');
      }
      setBusy(false);
      return;
    }
    
    // PRODUCTION MODE: Call real backend
    // STEP 1: Fire WhatsApp notification (fire & forget)
    fetch(WORKER_URL,{method:'POST',body:JSON.stringify({action:'notify_dnc',phone:digits,found:null,agent:agentName,state:''})}).then(()=>setWaStatus('✅ Supervisor notified')).catch(()=>setWaStatus('⚠️ WA unavailable'));
    // STEP 2: Check DNC database (2M numbers)
    try{
      const resp=await fetch(WORKER_URL,{method:'POST',body:JSON.stringify({action:'check_dnc',phone:digits,agent:agentName,state:''})});
      const data=JSON.parse(await resp.text());
      if(data.error){setResult('error');setWaStatus(w=>w+' — ⚠ Error');}
      else if(data.found){setResult('blocked');setWaStatus('✅ Supervisor notified — 🚫 ON DNC');}
      else{setResult('clear');setWaStatus('✅ Supervisor notified — CLEAR');}
    }catch(e){setResult('error');}
    setBusy(false);
  };
  return(<div className="fade-up" style={{maxWidth:640,margin:'0 auto'}}>
    <div style={{background:'#fff',borderRadius:18,overflow:'hidden',boxShadow:'var(--sh-lg)'}}>
      <div style={{background:'linear-gradient(135deg,var(--navy),var(--navy-mid))',padding:'28px 32px',display:'flex',alignItems:'center',gap:18}}>
        <div style={{fontSize:'2.4rem',position:'relative'}}>🚫<div style={{position:'absolute',inset:-10,border:'2.5px solid rgba(255,255,255,.25)',borderRadius:'50%',animation:'pulseRing 2s ease-out infinite'}}/></div>
        <div><h3 style={{color:'#fff',fontWeight:900,fontSize:'1.15rem',margin:0}}>Do Not Call — Validator</h3><p style={{color:'rgba(255,255,255,.4)',fontSize:'.78rem',margin:'5px 0 0'}}>Verify the customer number before proceeding</p></div>
      </div>
      <div style={{padding:'28px 32px'}}>
        {DEMO_MODE&&<div style={{display:'flex',alignItems:'center',gap:10,background:'#fff3cd',border:'1.5px solid #ffc107',borderRadius:10,padding:'10px 16px',marginBottom:16,fontSize:'.78rem'}}><span style={{fontSize:'1.2rem'}}>🧪</span><span style={{color:'#856404',fontWeight:700}}>DEMO MODE — Backend disabled · Using simulated DNC list</span></div>}
        <div style={{display:'flex',alignItems:'center',gap:10,background:'#f8fafc',borderRadius:10,padding:'10px 16px',marginBottom:22,fontSize:'.78rem'}}><div style={{width:9,height:9,borderRadius:'50%',background:'var(--green)',boxShadow:'0 0 6px rgba(46,204,113,.5)'}}/><span style={{color:'var(--muted)',fontWeight:700}}>🔒 DNC list active — 2M+ numbers database</span></div>
        <div style={{display:'flex',gap:10,marginBottom:16}}>
          <input value={phone} onChange={e=>{setPhone(e.target.value.replace(/\D/g,'').slice(0,10));setResult(null);setWaStatus('');}} onKeyDown={e=>e.key==='Enter'&&check()} placeholder="5551234567" maxLength={10} style={{flex:1,border:'2px solid var(--border)',borderRadius:14,padding:'15px 20px',fontSize:'1.1rem',fontWeight:700,letterSpacing:'.06em',outline:'none',boxSizing:'border-box'}}/>
          <button onClick={check} disabled={busy||digits.length!==10} style={{background:'var(--blue)',color:'#fff',border:'none',borderRadius:14,padding:'15px 26px',fontWeight:900,fontSize:'.9rem',cursor:'pointer',whiteSpace:'nowrap',opacity:busy||digits.length!==10?.45:1,boxShadow:'0 4px 14px rgba(33,150,243,.25)'}}>{busy?'Checking...':'Verify'}</button>
        </div>
        {/* WhatsApp status */}
        {waStatus&&<div style={{display:'flex',alignItems:'center',gap:8,background:'var(--green-lt)',border:'1px solid #a5d6a7',borderRadius:10,padding:'10px 16px',fontSize:'.8rem',fontWeight:800,color:'var(--green-dk)',marginBottom:16}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          {waStatus}
        </div>}
        {busy&&<div style={{display:'flex',alignItems:'center',gap:14,background:'var(--yellow-lt)',border:'2px solid #ffe082',borderRadius:14,padding:'18px 22px',marginBottom:16}}><span style={{fontSize:'2rem'}}>🔍</span><div><div style={{fontWeight:900,fontSize:'1rem',color:'#e65100'}}>Checking DNC list...</div><div style={{fontSize:'.8rem',color:'#e65100',opacity:.75,marginTop:2}}>⏳ This may take a moment — <b>you can keep talking to the client</b></div></div></div>}
        {result==='clear'&&<div className="fade-up" style={{display:'flex',alignItems:'center',gap:16,background:'var(--green-lt)',border:'2px solid #a5d6a7',borderRadius:14,padding:'18px 22px',marginBottom:16}}><span style={{fontSize:'2rem'}}>✅</span><div><div style={{fontWeight:900,fontSize:'1.05rem',color:'var(--green-dk)'}}>Number Clear — Can Proceed</div><div style={{fontSize:'.8rem',color:'var(--green-dk)',opacity:.75,marginTop:2}}>{phone} is not on the DNC list</div></div></div>}
        {result==='blocked'&&<div className="fade-up" style={{display:'flex',alignItems:'center',gap:16,background:'var(--red-lt)',border:'2px solid #ef9a9a',borderRadius:14,padding:'18px 22px',marginBottom:16}}><span style={{fontSize:'2rem'}}>🚫</span><div><div style={{fontWeight:900,fontSize:'1.05rem',color:'var(--red)'}}>NUMBER ON DNC — DO NOT CALL</div><div style={{fontSize:'.8rem',color:'var(--red)',opacity:.75,marginTop:2}}>{phone} is registered on the Do Not Call list</div></div></div>}
        {result==='error'&&<div className="fade-up" style={{display:'flex',alignItems:'center',gap:16,background:'var(--yellow-lt)',border:'2px solid #ffe082',borderRadius:14,padding:'18px 22px',marginBottom:16}}><span style={{fontSize:'2rem'}}>⚠️</span><div><div style={{fontWeight:900,fontSize:'1.05rem',color:'#e65100'}}>Connection Error</div><div style={{fontSize:'.8rem',color:'#e65100',opacity:.75,marginTop:2}}>Could not connect to DNC validator</div></div></div>}
        {result==='clear'&&<button className="fade-up" onClick={()=>onClear(phone)} style={{width:'100%',background:'var(--green-dk)',color:'#fff',border:'none',borderRadius:14,padding:16,fontWeight:900,fontSize:'.95rem',cursor:'pointer',boxShadow:'0 4px 16px rgba(27,94,32,.3)'}}>✓ Number Clear — Continue with Sale →</button>}
      </div>
    </div>
  </div>);
}

/* ── State selector ── */
function StepState({onSelect}){
  return(<div className="fade-up">
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}><div style={{width:14,height:14,borderRadius:4,background:'var(--orange)'}}/><h2 style={{fontSize:'1.05rem',fontWeight:900,textTransform:'uppercase',margin:0}}>Select State</h2></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(135px,1fr))',gap:12}}>
      {STATES.map(s=>{const cnt=UTILITIES.filter(u=>u.stateId===s.id).length;return(
        <button key={s.id} onClick={()=>onSelect(s)} style={{background:'#fff',border:'2px solid var(--border)',borderRadius:14,padding:'20px 12px',cursor:'pointer',textAlign:'center',boxShadow:'var(--sh)'}}>
          <div style={{fontSize:'1.9rem',fontWeight:900,color:'var(--orange)',lineHeight:1}}>{s.code}</div>
          <div style={{fontSize:'.68rem',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',marginTop:5}}>{s.name}</div>
          <div style={{marginTop:8,background:cnt>0?'var(--green)':'var(--border)',color:'#fff',borderRadius:100,fontSize:'.62rem',fontWeight:800,padding:'3px 10px',display:'inline-block'}}>{cnt} util{cnt!==1?'s':''}</div>
        </button>);})}
    </div>
  </div>);
}

/* ── Utility selector ── */
function StepUtility({stateId,selected,onToggle,onProceed}){
  const all=UTILITIES.filter(u=>u.stateId===stateId);
  const elec=all.filter(u=>u.type==='electric'||u.type==='both');
  const gas=all.filter(u=>u.type==='gas'||u.type==='both');
  const Group=({title,icon,items,bg,clr})=>items.length===0?null:(
    <div style={{flex:1,minWidth:220,background:'#fff',borderRadius:14,overflow:'hidden',boxShadow:'var(--sh)',border:'1.5px solid var(--border)'}}>
      <div style={{padding:'13px 18px',fontWeight:900,fontSize:'.85rem',textTransform:'uppercase',display:'flex',alignItems:'center',gap:8,background:bg,color:clr}}>{icon} {title}</div>
      <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:8}}>
        {items.map(u=>{const isSel=selected.some(x=>x.id===u.id);const acc=getAccInfo(u.name);return(
          <button key={u.id} onClick={()=>onToggle(u)} style={{background:isSel?'var(--blue-lt)':'#fff',border:'2px solid '+(isSel?'var(--blue)':'var(--border)'),borderRadius:10,padding:'14px 18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',textAlign:'left',width:'100%'}}>
            <div><div style={{fontWeight:800,fontSize:'.95rem'}}>{u.name}</div>{acc&&<div style={{fontSize:'.65rem',color:'var(--muted)',fontWeight:700,marginTop:3}}>{acc.label}{acc.chars?' · '+acc.chars+' chars':''}</div>}</div>
            <span style={{color:isSel?'var(--blue)':'var(--muted)',fontWeight:900,fontSize:isSel?'1.1rem':'.75rem',flexShrink:0}}>{isSel?'✓':'+ Add'}</span>
          </button>);})}
      </div>
    </div>);
  return(<div className="fade-up">
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}><div style={{width:14,height:14,borderRadius:4,background:'var(--orange)'}}/><h2 style={{fontSize:'1.05rem',fontWeight:900,textTransform:'uppercase',margin:0}}>Select Utility</h2></div>
    <p style={{fontSize:'.78rem',color:'var(--muted)',marginBottom:18,fontWeight:600}}>💡 Max 1 electric and 1 gas</p>
    {all.length===0?<div style={{background:'#fff',borderRadius:14,padding:40,textAlign:'center',color:'var(--muted)',border:'2px dashed var(--border)'}}><div style={{fontSize:'2.5rem',marginBottom:10}}>🔌</div><p style={{fontWeight:700}}>No utilities for this state yet</p></div>:
    <div style={{display:'flex',gap:16,flexWrap:'wrap'}}><Group title="Electricity" icon="⚡" items={elec} bg="var(--orange-lt)" clr="var(--orange)"/><Group title="Gas" icon="🔥" items={gas} bg="var(--green-lt)" clr="var(--green-dk)"/></div>}
    {selected.length>0&&<div className="fade-up" style={{marginTop:18,display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--blue-lt)',borderRadius:14,padding:'14px 20px',border:'1.5px solid rgba(33,150,243,.2)',flexWrap:'wrap',gap:10}}>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{selected.map(u=><span key={u.id} style={{background:'var(--blue)',color:'#fff',borderRadius:20,padding:'5px 14px',fontSize:'.75rem',fontWeight:800}}>{u.type==='gas'?'🔥':'⚡'} {u.name}</span>)}</div>
      <button onClick={onProceed} style={{background:'var(--orange)',color:'#fff',border:'none',borderRadius:10,padding:'11px 24px',fontWeight:900,fontSize:'.85rem',cursor:'pointer',boxShadow:'0 3px 12px rgba(244,124,32,.3)'}}>View Suppliers →</button>
    </div>}
  </div>);
}

/* ── Supplier & Rates ── */
function StepSupplier({selectedUtils,onSelect}){
  const[selectedRates,setSelectedRates]=useState({electric:null,gas:null});
  
  const handleSelectRate=(sup,rate)=>{
    setSelectedRates(prev=>({
      ...prev,
      [rate.eType]:rate.eType===prev[rate.eType]?.eType&&prev[rate.eType]?.id===rate.id?null:{...rate,supplier:sup}
    }));
  };
  
  const handleConfirm=()=>{
    // Pass both rates if available, or just the one selected
    const ratesToPass=selectedRates.electric||selectedRates.gas;
    const supplierToPass=selectedRates.electric?.supplier||selectedRates.gas?.supplier;
    if(ratesToPass)onSelect(supplierToPass,ratesToPass);
  };
  
  const hasSelection=selectedRates.electric||selectedRates.gas;
  const selectionCount=(selectedRates.electric?1:0)+(selectedRates.gas?1:0);
  
  // Get selected utility names to filter rates
  const selectedUtilNames = selectedUtils.map(u => {
    const nameMap = {
      'u_peco': 'PECO', 'u_pple': 'PPL', 'u_pnlc': 'PNLC', 'u_penelec': 'Penelec', 'u_meted': 'MetEd',
      'u_duqe': 'DUQE', 'u_alleg': 'ALLEG', 'u_westpenn': 'West Penn', 'u_meco': 'MECO', 'u_nstar': 'NSTAR',
      'u_wmeco': 'WMECO', 'u_jcpl': 'JCP&L', 'u_psege': 'PSE&G', 'u_ace': 'ACE', 'u_reco': 'RECO',
      'u_njng': 'NJNG', 'u_psegg': 'PSE&G Gas', 'u_etown': 'E-Town', 'u_sjg': 'SJG', 'u_pecog': 'PECO Gas',
      'u_pgw': 'PGW', 'u_ugi': 'UGI', 'u_colgaspa': 'Col. Gas PA', 'u_peoples': 'Peoples', 'u_pepcodc': 'Pepco DC',
      'u_washgasdc': 'Wash. Gas DC', 'u_nipsco': 'NIPSCO', 'u_colgasva': 'Col. Gas VA', 'u_washgasva': 'Wash. Gas VA',
      'u_delmarva': 'Delmarva', 'u_coned': 'ConEd', 'u_dte': 'DTE', 'u_consumers': 'Consumers', 'u_consumers_g': 'Consumers',
      'u_dte_g': 'DTE', 'u_aep_oh': 'AEP Ohio', 'u_duke_oh': 'Duke OH', 'u_firstenergy': 'FirstEnergy',
      'u_aes_oh': 'AES/DPL', 'u_columbia_oh': 'Columbia OH', 'u_dominion_oh': 'Dominion OH',
    };
    return nameMap[u.id] || u.name;
  });
  
  return(<div className="fade-up">
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}><div style={{width:14,height:14,borderRadius:4,background:'var(--orange)'}}/><h2 style={{fontSize:'1.05rem',fontWeight:900,textTransform:'uppercase',margin:0}}>Supplier & Rates</h2></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))',gap:18}}>
      {SUPPLIER_BRANDS.map(sup=>{
        const allRates=RATES.filter(r=>r.brand===sup.id && selectedUtilNames.includes(r.util));
        if(allRates.length===0)return null;
        const electricRates=allRates.filter(r=>r.eType==='electric');
        const gasRates=allRates.filter(r=>r.eType==='gas');
        return(
        <div key={sup.id} style={{background:'#fff',border:'2px solid '+sup.color,borderRadius:16,overflow:'hidden',boxShadow:'var(--sh-lg)'}}>
          <div style={{background:sup.color,padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{color:'#fff',fontWeight:900,fontSize:'1.2rem'}}>{sup.name}</span>
            <span style={{background:'rgba(255,255,255,.25)',color:'#fff',fontSize:'.75rem',fontWeight:800,padding:'5px 16px',borderRadius:20}}>{allRates.length} rate{allRates.length!==1?'s':''}</span>
          </div>
          <div style={{padding:16}}>
            {electricRates.length>0&&<div style={{marginBottom:gasRates.length>0?20:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,paddingBottom:8,borderBottom:'2px solid var(--orange-lt)'}}>
                <span style={{fontSize:'1.1rem'}}>⚡</span>
                <span style={{fontSize:'.75rem',fontWeight:900,textTransform:'uppercase',color:'var(--orange)',letterSpacing:'.06em'}}>Electric</span>
              </div>
              <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Utility','Type','Price','Term','ETF',''].map((h,j)=><th key={j} style={{background:'#f8fafc',padding:'8px 6px',textAlign:'left',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',color:'var(--muted)',borderBottom:'2px solid var(--border)'}}>{h}</th>)}</tr></thead>
                <tbody>{electricRates.map(r=>{const isSel=selectedRates.electric?.id===r.id;return(
                  <tr key={r.id} onClick={()=>handleSelectRate(sup,r)} style={{cursor:'pointer',background:isSel?'var(--orange-lt)':'',borderLeft:isSel?'4px solid var(--orange)':'4px solid transparent',transition:'all .2s'}} onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='#f1f5f9'}} onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=''}}>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontSize:'.78rem',fontWeight:700}}>{r.util}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)'}}><span style={{background:r.rType==='fixed'?'var(--blue-lt)':'var(--yellow-lt)',color:r.rType==='fixed'?'var(--blue-dk)':'#e65100',padding:'3px 8px',borderRadius:20,fontSize:'.62rem',fontWeight:800}}>{r.rType}</span></td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontWeight:900,color:'var(--green-dk)',fontSize:'.88rem'}}>{r.price}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontSize:'.75rem',fontWeight:700}}>{r.months}{!isNaN(r.months)?' mo':''}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontSize:'.72rem',fontWeight:600}}>{r.etf}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',textAlign:'center'}}>
                      {isSel?<div style={{display:'flex',alignItems:'center',gap:6,color:'var(--orange)',fontWeight:900,fontSize:'.8rem'}}><span style={{background:'var(--orange)',color:'#fff',width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem'}}>✓</span></div>:<button style={{background:'var(--orange)',color:'#fff',border:'none',borderRadius:8,padding:'5px 12px',fontSize:'.68rem',fontWeight:800,cursor:'pointer',boxShadow:'0 2px 8px rgba(244,124,32,.25)'}}>Select</button>}
                    </td>
                  </tr>)})}</tbody>
              </table></div>
            </div>}
            {electricRates.length>0&&gasRates.length>0&&<div style={{margin:'16px 0',display:'flex',alignItems:'center',gap:12}}>
              <div style={{flex:1,height:2,background:'linear-gradient(to right, var(--orange-lt), var(--green-lt))'}}/>
              <span style={{fontSize:'.7rem',fontWeight:800,color:'var(--muted)',textTransform:'uppercase'}}>⚡ → 🔥</span>
              <div style={{flex:1,height:2,background:'linear-gradient(to right, var(--green-lt), var(--orange-lt))'}}/>
            </div>}
            {gasRates.length>0&&<div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,paddingBottom:8,borderBottom:'2px solid var(--green-lt)'}}>
                <span style={{fontSize:'1.1rem'}}>🔥</span>
                <span style={{fontSize:'.75rem',fontWeight:900,textTransform:'uppercase',color:'var(--green-dk)',letterSpacing:'.06em'}}>Gas</span>
              </div>
              <div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>{['Utility','Type','Price','Term','ETF',''].map((h,j)=><th key={j} style={{background:'#f8fafc',padding:'8px 6px',textAlign:'left',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',color:'var(--muted)',borderBottom:'2px solid var(--border)'}}>{h}</th>)}</tr></thead>
                <tbody>{gasRates.map(r=>{const isSel=selectedRates.gas?.id===r.id;return(
                  <tr key={r.id} onClick={()=>handleSelectRate(sup,r)} style={{cursor:'pointer',background:isSel?'var(--green-lt)':'',borderLeft:isSel?'4px solid var(--green)':'4px solid transparent',transition:'all .2s'}} onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='#f1f5f9'}} onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=''}}>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontSize:'.78rem',fontWeight:700}}>{r.util}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)'}}><span style={{background:r.rType==='fixed'?'var(--blue-lt)':'var(--yellow-lt)',color:r.rType==='fixed'?'var(--blue-dk)':'#e65100',padding:'3px 8px',borderRadius:20,fontSize:'.62rem',fontWeight:800}}>{r.rType}</span></td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontWeight:900,color:'var(--green-dk)',fontSize:'.88rem'}}>{r.price}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontSize:'.75rem',fontWeight:700}}>{r.months}{!isNaN(r.months)?' mo':''}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',fontSize:'.72rem',fontWeight:600}}>{r.etf}</td>
                    <td style={{padding:'10px 8px',borderBottom:'1px solid var(--border)',textAlign:'center'}}>
                      {isSel?<div style={{display:'flex',alignItems:'center',gap:6,color:'var(--green-dk)',fontWeight:900,fontSize:'.8rem'}}><span style={{background:'var(--green)',color:'#fff',width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem'}}>✓</span></div>:<button style={{background:'var(--green)',color:'#fff',border:'none',borderRadius:8,padding:'5px 12px',fontSize:'.68rem',fontWeight:800,cursor:'pointer',boxShadow:'0 2px 8px rgba(46,204,113,.25)'}}>Select</button>}
                    </td>
                  </tr>)})}</tbody>
              </table></div>
            </div>}
          </div>
        </div>);})}
    </div>
    
    {/* CONFIRMATION PANEL */}
    {hasSelection&&<div className="fade-up" style={{marginTop:24,background:'linear-gradient(135deg,rgba(244,124,32,.08),rgba(33,150,243,.08))',border:'2px solid var(--orange)',borderRadius:18,padding:'24px 32px',boxShadow:'var(--sh-lg)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:280}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:16,height:16,borderRadius:4,background:'var(--orange)'}}/>
            <h3 style={{fontSize:'1.05rem',fontWeight:900,textTransform:'uppercase',margin:0,color:'var(--navy)'}}>Selection Summary</h3>
            <span style={{background:'var(--orange)',color:'#fff',fontSize:'.68rem',fontWeight:900,padding:'3px 12px',borderRadius:20}}>{selectionCount} rate{selectionCount>1?'s':''}</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {selectedRates.electric&&<div style={{display:'flex',alignItems:'center',gap:12,background:'#fff',borderRadius:12,padding:'12px 16px',border:'2px solid var(--orange-lt)',boxShadow:'var(--sh)'}}>
              <div style={{background:'var(--orange-lt)',width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>⚡</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'.7rem',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>Electric</div>
                <div style={{fontWeight:900,fontSize:'.9rem',color:'var(--navy)'}}>{selectedRates.electric.supplier.name} · {selectedRates.electric.util}</div>
                <div style={{fontSize:'.75rem',color:'var(--green-dk)',fontWeight:800,marginTop:2}}>{selectedRates.electric.price} {selectedRates.electric.uom} · {selectedRates.electric.months}{!isNaN(selectedRates.electric.months)?' mo':''} · {selectedRates.electric.rType}</div>
              </div>
              <button onClick={()=>setSelectedRates(p=>({...p,electric:null}))} style={{background:'rgba(229,57,53,.1)',color:'#c62828',border:'none',borderRadius:8,padding:'6px 10px',fontSize:'.7rem',fontWeight:800,cursor:'pointer'}}>✕</button>
            </div>}
            {selectedRates.gas&&<div style={{display:'flex',alignItems:'center',gap:12,background:'#fff',borderRadius:12,padding:'12px 16px',border:'2px solid var(--green-lt)',boxShadow:'var(--sh)'}}>
              <div style={{background:'var(--green-lt)',width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>🔥</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'.7rem',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:2}}>Gas</div>
                <div style={{fontWeight:900,fontSize:'.9rem',color:'var(--navy)'}}>{selectedRates.gas.supplier.name} · {selectedRates.gas.util}</div>
                <div style={{fontSize:'.75rem',color:'var(--green-dk)',fontWeight:800,marginTop:2}}>{selectedRates.gas.price} {selectedRates.gas.uom} · {selectedRates.gas.months}{!isNaN(selectedRates.gas.months)?' mo':''} · {selectedRates.gas.rType}</div>
              </div>
              <button onClick={()=>setSelectedRates(p=>({...p,gas:null}))} style={{background:'rgba(229,57,53,.1)',color:'#c62828',border:'none',borderRadius:8,padding:'6px 10px',fontSize:'.7rem',fontWeight:800,cursor:'pointer'}}>✕</button>
            </div>}
          </div>
        </div>
        <button onClick={handleConfirm} style={{background:'var(--orange)',color:'#fff',border:'none',borderRadius:14,padding:'16px 40px',fontWeight:900,fontSize:'1rem',cursor:'pointer',boxShadow:'0 6px 20px rgba(244,124,32,.35)',textTransform:'uppercase',letterSpacing:'.06em',minWidth:200}}>Confirm & Continue →</button>
      </div>
    </div>}
  </div>);
}

/* ── Checklist (ONLY template form, no sale checklist checkboxes) ── */
function StepChecklist({sel,user,onHome}){
  const showToast=useUIStore(s=>s.showToast);
  const[tpl,setTpl]=useState({lang:'English',auth:'',holder:'',authName:'',phone:sel.phone||'',address:'',apt:'',city:'',zip:'',acc:'',repId:user?.repId||'',tarifa:''});
  const[copied,setCopied]=useState(false);
  const addressRef=useRef(null);const autocompleteRef=useRef(null);

  useEffect(()=>{if(sel.supplier&&sel.rate)setTpl(p=>({...p,tarifa:sel.supplier.name+' — '+sel.rate.price+' '+sel.rate.uom+' | '+sel.rate.months+(!isNaN(sel.rate.months)?'m':'')+' | ETF '+sel.rate.etf+(sel.rate.notes?' | '+sel.rate.notes:'')}));},[sel.supplier,sel.rate]);

  // FIX #8: Google Places autocomplete (uses script loaded in index.html)
  useEffect(()=>{
    if(autocompleteRef.current)return;
    
    const initAutocomplete=()=>{
      const input=addressRef.current;
      if(!input){return;}
      if(!window.google?.maps?.places){
        // Wait for Google Maps to load
        setTimeout(initAutocomplete,500);
        return;
      }
      try{
        const ac=new window.google.maps.places.Autocomplete(input,{
          types:['address'],
          componentRestrictions:{country:'us'},
          fields:['address_components','formatted_address']
        });
        ac.addListener('place_changed',()=>{
          const place=ac.getPlace();
          if(!place?.address_components)return;
          let city='',state='',zip='',num='',road='';
          place.address_components.forEach(c=>{
            if(c.types.includes('locality'))city=c.long_name;
            if(c.types.includes('sublocality_level_1')&&!city)city=c.long_name;
            if(c.types.includes('administrative_area_level_1'))state=c.short_name;
            if(c.types.includes('postal_code'))zip=c.long_name;
            if(c.types.includes('street_number'))num=c.long_name;
            if(c.types.includes('route'))road=c.long_name;
          });
          setTpl(p=>({
            ...p,
            address:(num?num+' ':'')+road||place.formatted_address.split(',')[0],
            city:city||p.city,
            zip:zip||p.zip
          }));
        });
        autocompleteRef.current=ac;
      }catch(err){
        console.error('Google Places error:',err);
      }
    };
    
    // Start initialization
    initAutocomplete();
  },[]);

  const iStyle={width:'100%',border:'1.5px solid var(--border)',borderRadius:9,padding:'10px 13px',fontSize:'.84rem',fontWeight:600,outline:'none',background:'#fafbfc',boxSizing:'border-box'};
  
  const copy=()=>{
    const holderLine=tpl.auth==='Yes — Account Holder'?'ACC HOLDER: '+tpl.holder:tpl.auth==='Yes — Authorized User'?'AUTHORIZED USER: '+tpl.authName+'\nACC HOLDER: '+tpl.holder:'';
    
    // Build ACC INFO lines dynamically
    const accInfoLines=(sel.utils||[]).map((util,idx)=>{
      const accInfo=getAccInfo(util.name);
      const value=tpl[`acc_${idx}`]||'';
      return value?`${accInfo?.label||'ACC INFO'} (${util.name}): ${value}`:'';
    }).filter(Boolean).join('\n');
    
    const lines=['LANGUAGE: '+tpl.lang,'AUTHORIZED: '+tpl.auth,holderLine,'STATE: '+(sel.state?.name||''),'PHONE: '+tpl.phone,'ADDRESS: '+tpl.address+(tpl.apt?', '+tpl.apt:''),'CITY: '+tpl.city,'ZIP: '+tpl.zip,accInfoLines,'UTILITY: '+(sel.utils||[]).map(u=>u.name).join(', '),'REP ID: '+tpl.repId,'RATE: '+tpl.tarifa].filter(Boolean).join('\n');
    navigator.clipboard?.writeText(lines).then(()=>{setCopied(true);showToast('✓ Template copied!','success');setTimeout(()=>setCopied(false),3000);});
  };

  return(<div className="fade-up">
    {/* Summary bar */}
    <div style={{background:'linear-gradient(135deg,var(--orange),var(--orange-dk))',borderRadius:16,padding:'20px 26px',color:'#fff',marginBottom:22,display:'flex',gap:28,flexWrap:'wrap',alignItems:'center',boxShadow:'0 6px 20px rgba(244,124,32,.3)'}}>
      {[{l:'State',v:sel.state?.code},{l:'Utility',v:(sel.utils||[]).map(u=>u.name).join(', ')},{l:'Supplier',v:sel.supplier?.name},{l:'Agent',v:user?.name}].map((item,i)=><div key={i}><div style={{fontSize:'.56rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',opacity:.7,marginBottom:3}}>{item.l}</div><div style={{fontSize:'1rem',fontWeight:900}}>{item.v||'—'}</div></div>)}
    </div>
    {/* Template form */}
    <div style={{background:'#fff',borderRadius:16,boxShadow:'var(--sh-md)',padding:'24px 26px'}}>
      <h3 style={{fontSize:'.92rem',fontWeight:900,textTransform:'uppercase',marginBottom:18}}>📝 Sale Template</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 18px'}} className="full-mobile">
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Language</label>
          <select value={tpl.lang} onChange={e=>setTpl({...tpl,lang:e.target.value})} style={iStyle}><option>English</option><option>Spanish</option></select></div>
        {/* FIX #7: Auth field with dynamic holder/auth name fields */}
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Authorized *</label>
          <select value={tpl.auth} onChange={e=>setTpl({...tpl,auth:e.target.value,holder:'',authName:''})} style={iStyle}><option value="">— Select —</option><option>Yes — Account Holder</option><option>Yes — Authorized User</option></select></div>
        {/* Dynamic fields based on auth selection */}
        {tpl.auth==='Yes — Account Holder'&&<div style={{gridColumn:'1 / -1'}}><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Account Holder Name *</label>
          <input value={tpl.holder} onChange={e=>setTpl({...tpl,holder:e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ .\-]/g,'')})} placeholder="Full name of account holder" style={iStyle}/></div>}
        {tpl.auth==='Yes — Authorized User'&&<>
          <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Authorized User Name *</label>
            <input value={tpl.authName} onChange={e=>setTpl({...tpl,authName:e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ .\-]/g,'')})} placeholder="Name of authorized person" style={iStyle}/></div>
          <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Account Holder Name *</label>
            <input value={tpl.holder} onChange={e=>setTpl({...tpl,holder:e.target.value})} placeholder="Account holder name" style={iStyle}/></div>
        </>}
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Phone Number *</label>
          <input value={tpl.phone} onChange={e=>setTpl({...tpl,phone:e.target.value.replace(/\D/g,'').slice(0,10)})} style={iStyle}/></div>
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>State</label>
          <input value={sel.state?.name||''} readOnly style={{...iStyle,background:'#f0f0f0'}}/></div>
        {/* FIX #8: Address with Google Places autocomplete */}
        <div style={{gridColumn:'1 / -1'}}><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Address * (Google autocomplete)</label>
          <input ref={addressRef} value={tpl.address} onChange={e=>setTpl({...tpl,address:e.target.value})} placeholder="Start typing address..." style={iStyle}/></div>
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Apt / Suite</label>
          <input value={tpl.apt||''} onChange={e=>setTpl({...tpl,apt:e.target.value})} style={iStyle}/></div>
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>City *</label>
          <input value={tpl.city} onChange={e=>setTpl({...tpl,city:e.target.value})} style={iStyle}/></div>
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>ZIP Code *</label>
          <input value={tpl.zip} onChange={e=>setTpl({...tpl,zip:e.target.value.replace(/\D/g,'').slice(0,5)})} maxLength={5} style={iStyle}/></div>
        
        {/* ACC INFO - Dynamic fields based on selected utilities */}
        {(sel.utils||[]).map((util,idx)=>{
          const accInfo=getAccInfo(util.name);
          if(!accInfo)return null;
          return(<div key={idx} style={{gridColumn:'1 / -1'}}>
            <label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>
              {accInfo.label} ({util.name}) *{accInfo.chars&&<span style={{fontSize:'.65rem',fontWeight:600,color:'var(--orange)',marginLeft:6}}>• {accInfo.chars} chars</span>}
            </label>
            <input 
              value={tpl[`acc_${idx}`]||''} 
              onChange={e=>setTpl({...tpl,[`acc_${idx}`]:e.target.value})} 
              placeholder={`${accInfo.label} for ${util.name}`}
              maxLength={accInfo.chars||999}
              style={iStyle}
            />
          </div>);
        })}
        
        <div><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Rep ID</label>
          <input value={tpl.repId} onChange={e=>setTpl({...tpl,repId:e.target.value})} style={iStyle}/></div>
        <div style={{gridColumn:'1 / -1'}}><label style={{display:'block',fontSize:'.6rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--muted)',marginBottom:5}}>Selected Rate</label>
          <input value={tpl.tarifa} readOnly style={{...iStyle,background:'#f0f0f0',fontSize:'.78rem'}}/></div>
      </div>
      <div style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'}}>
        <button onClick={copy} style={{flex:1,minWidth:200,background:copied?'var(--green-dk)':'var(--blue)',color:'#fff',border:'none',borderRadius:12,padding:'13px 24px',fontWeight:800,fontSize:'.88rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'background .3s'}}>{copied?'✅ Copied!':'📋 Copy Template'}</button>
        <button onClick={onHome} style={{background:'var(--orange)',color:'#fff',border:'none',borderRadius:12,padding:'13px 24px',fontWeight:900,fontSize:'.88rem',cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>🏠 New Sale</button>
      </div>
    </div>
  </div>);
}

/* ── MAIN ORCHESTRATOR ── */
export default function SalesFlow(){
  const user=useAuthStore(s=>s.user);const showToast=useUIStore(s=>s.showToast);
  const[step,setStep]=useState(0);const[maxReached,setMaxReached]=useState(0);
  const[sel,setSel]=useState({state:null,utils:[],supplier:null,rate:null,phone:''});

  const canGo=n=>{if(n<=step)return true;if(n>=1&&!sel.phone)return false;if(n>=2&&!sel.state)return false;if(n>=3&&!sel.utils.length)return false;if(n>=4&&!sel.supplier)return false;return true;};

  // FIX #2 & #3: Going back clears current step data + resets step nav indicator
  const goStep=n=>{
    if(n>step&&!canGo(n)){
      if(n>=1&&!sel.phone)showToast('⚠ Verify DNC first','warn');
      else if(n>=2&&!sel.state)showToast('⚠ Select a state','warn');
      else if(n>=3&&!sel.utils.length)showToast('⚠ Select a utility','warn');
      else if(n>=4&&!sel.supplier)showToast('⚠ Select a supplier','warn');
      return;
    }
    // FIX #2: Going BACK clears the data from the step we're leaving
    if(n<step){
      if(step>=4)setSel(p=>({...p,supplier:null,rate:null})); // leaving checklist → clear supplier
      if(step>=3&&n<3)setSel(p=>({...p,supplier:null,rate:null})); // leaving supplier → clear supplier
      if(step>=2&&n<2)setSel(p=>({...p,utils:[],supplier:null,rate:null})); // leaving utility → clear utils+supplier
      if(step>=1&&n<1)setSel(p=>({...p,state:null,utils:[],supplier:null,rate:null})); // leaving state → clear state+all
    }
    setStep(n);
    // FIX #3: maxReached tracks the highest step nav indicator
    if(n>maxReached)setMaxReached(n);
    if(n<maxReached)setMaxReached(n); // going back resets max
  };

  const toggleUtil=u=>{setSel(p=>{const exists=p.utils.find(x=>x.id===u.id);if(exists)return{...p,utils:p.utils.filter(x=>x.id!==u.id)};const keep=p.utils.filter(x=>x.type!==u.type);return{...p,utils:[...keep,u]};});};
  const reset=()=>{setSel({state:null,utils:[],supplier:null,rate:null,phone:''});setStep(0);setMaxReached(0);};

  return(<div>
    <StepNav current={step} maxReached={maxReached} onGo={goStep}/>
    <div style={{padding:'22px 28px 60px',maxWidth:1200,margin:'0 auto'}}>
      <ContextBar sel={sel} step={step}/>
      {step===0&&<StepDNC user={user} onClear={phone=>{setSel(p=>({...p,phone}));goStep(1);}}/>}
      {step===1&&<StepState onSelect={s=>{setSel(p=>({...p,state:s,utils:[],supplier:null,rate:null}));goStep(2);}}/>}
      {step===2&&<StepUtility stateId={sel.state?.id} selected={sel.utils} onToggle={toggleUtil} onProceed={()=>goStep(3)}/>}
      {step===3&&<StepSupplier selectedUtils={sel.utils||[]} onSelect={(sup,rate)=>{setSel(p=>({...p,supplier:sup,rate}));goStep(4);}}/>}
      {step===4&&<StepChecklist sel={sel} user={user} onHome={reset}/>}
      {step>0&&<div style={{marginTop:20}}><button onClick={()=>goStep(step-1)} style={{background:'#fff',color:'var(--muted)',border:'2px solid var(--border)',borderRadius:10,padding:'10px 22px',fontWeight:800,fontSize:'.85rem',cursor:'pointer'}}>← Back</button></div>}
    </div>
  </div>);
}
