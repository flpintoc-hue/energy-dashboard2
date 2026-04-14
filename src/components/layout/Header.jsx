import { useAuthStore, useUIStore } from '../../store';

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const view = useUIStore((s) => s.view);
  const setView = useUIStore((s) => s.setView);

  return (
    <div style={{
      background: 'var(--orange)', padding: '0 20px', height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 2px 12px rgba(244,124,32,.35)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <h1 style={{
        fontSize: '1.15rem', fontWeight: 900, color: '#fff',
        letterSpacing: '.04em', display: 'flex', alignItems: 'center',
        gap: 10, margin: 0,
      }}>
        <span style={{ fontSize: '1.6rem' }}>⚡</span>
        <span className="hide-mobile">Energy Dashboard</span>
      </h1>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* View switcher */}
        <div style={{
          display: 'flex', borderRadius: 10, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,.3)',
        }}>
          {['sales', 'crm'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '7px 16px', border: 'none',
                background: view === v ? 'rgba(255,255,255,.22)' : 'transparent',
                color: '#fff', fontWeight: 800, fontSize: '.72rem',
                cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {v === 'sales' ? '⚡ Sales' : '📈 CRM'}
            </button>
          ))}
        </div>

        {/* User badge */}
        <div style={{
          background: 'rgba(255,255,255,.14)',
          border: '1px solid rgba(255,255,255,.22)',
          borderRadius: 10, padding: '6px 14px', color: '#fff',
          fontSize: '.75rem', fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: user?.role === 'admin' ? 'var(--yellow)' : 'var(--green)',
            boxShadow: `0 0 6px ${user?.role === 'admin' ? 'rgba(255,193,7,.5)' : 'rgba(46,204,113,.5)'}`,
          }} />
          <span className="hide-mobile">{user?.name} · </span>
          {user?.role === 'admin' ? 'Admin' : 'Agent'}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            background: 'linear-gradient(135deg,#E53935,#C62828)',
            border: 'none', color: '#fff', padding: '7px 14px',
            borderRadius: 8, fontWeight: 800, fontSize: '.73rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          🚪 <span className="hide-mobile">Logout</span>
        </button>
      </div>
    </div>
  );
}
