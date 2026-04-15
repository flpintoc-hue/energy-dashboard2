import{useState}from'react';
import * as API from '../services/api';

export default function LoginScreen({onLogin}){
  const[user,setUser]=useState('');
  const[pass,setPass]=useState('');
  const[err,setErr]=useState('');
  const[loading,setLoading]=useState(false);
  
  const go=async()=>{
    if(!user.trim()||!pass.trim()){
      setErr('Enter username and password');
      return;
    }
    setLoading(true);
    setErr('');
    
    try {
      // Call backend with JWT
      const result = await API.loginUser(user.trim(), pass);
      
      if (result.success && result.user) {
        // Login successful - JWT already saved by API
        onLogin(result.user);
      } else {
        setErr(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErr('Connection error. Please try again.');
    }
    
    setLoading(false);
  };
  
  const iS={width:'100%',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,padding:'14px 16px',color:'#fff',fontSize:'.92rem',fontWeight:600,outline:'none',boxSizing:'border-box'};
  const lS={display:'block',fontSize:'.62rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.12em',color:'rgba(255,255,255,.4)',marginBottom:6};
  
  return(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#0c0f1a 0%,#111827 40%,#1e293b 100%)',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(244,124,32,.08) 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
    <div className="fade-up" style={{background:'rgba(255,255,255,.03)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,.08)',borderRadius:28,padding:'52px 44px',width:'min(440px,92vw)',position:'relative',zIndex:1,boxShadow:'0 40px 80px rgba(0,0,0,.5)'}}>
      <div style={{textAlign:'center',marginBottom:40}}>
        <div style={{fontSize:'3.2rem',marginBottom:10,filter:'drop-shadow(0 0 20px rgba(244,124,32,.4))'}}>⚡</div>
        <h1 style={{fontSize:'1.5rem',fontWeight:900,color:'#fff',letterSpacing:'.08em',textTransform:'uppercase'}}>Energy Dashboard</h1>
        <p style={{fontSize:'.7rem',color:'rgba(255,255,255,.28)',marginTop:8,letterSpacing:'.14em',textTransform:'uppercase'}}>Supplier Management · Sales · CRM</p>
      </div>
      {err&&<div className="shake" style={{background:'rgba(229,57,53,.1)',border:'1px solid rgba(229,57,53,.25)',borderRadius:10,padding:'11px 16px',color:'#f87171',fontSize:'.82rem',fontWeight:700,marginBottom:16,textAlign:'center'}}>{err}</div>}
      <div style={{marginBottom:16}}>
        <label style={lS}>Username</label>
        <input value={user} onChange={e=>{setUser(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="Enter your username" style={iS}/>
      </div>
      <div style={{marginBottom:24}}>
        <label style={lS}>Password</label>
        <input value={pass} onChange={e=>{setPass(e.target.value);setErr('');}} onKeyDown={e=>e.key==='Enter'&&go()} type="password" placeholder="••••••••" style={iS}/>
      </div>
      <button onClick={go} disabled={loading} style={{width:'100%',padding:16,background:'var(--orange)',border:'none',borderRadius:14,color:'#fff',fontWeight:900,fontSize:'.95rem',letterSpacing:'.06em',textTransform:'uppercase',cursor:loading?'wait':'pointer',boxShadow:'0 6px 24px rgba(244,124,32,.35)',opacity:loading?.6:1}}>
        {loading?'Verifying...':'Login →'}
      </button>
      <p style={{textAlign:'center',marginTop:24,fontSize:'.64rem',color:'rgba(255,255,255,.16)'}}>Demo: admin / admin123</p>
    </div>
  </div>);
}
