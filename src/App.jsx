import{useAuthStore,useUIStore}from'./store';import{Toast}from'./components/ui';import LoginScreen from'./pages/LoginScreen';import SalesFlow from'./pages/SalesFlow';import CRMDashboard from'./pages/CRMDashboard';import Header from'./components/layout/Header';
export default function App(){const user=useAuthStore(s=>s.user);const view=useUIStore(s=>s.view);
if(!user)return<LoginScreen onLogin={u=>{useAuthStore.getState().login(u,crypto.randomUUID());}}/>;
return(<div style={{minHeight:'100vh',background:'var(--bg)'}}><Header/>{view==='sales'&&<SalesFlow/>}{view==='crm'&&<CRMDashboard/>}<Toast/></div>);}
