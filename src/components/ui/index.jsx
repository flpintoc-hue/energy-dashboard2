import { useEffect } from 'react';
import { useUIStore } from '../../store';

// ── Toast Notification ──
export function Toast() {
  const toast = useUIStore((s) => s.toast);
  
  useEffect(() => {
    // Auto-dismiss handled by store
  }, [toast]);

  if (!toast) return null;

  const bgMap = {
    success: 'var(--green-dk)',
    error: 'var(--red)',
    warn: 'var(--orange)',
  };

  return (
    <div
      className="slide-up"
      style={{
        position: 'fixed', bottom: 24, right: 24,
        background: bgMap[toast.type] || bgMap.success,
        color: '#fff', padding: '12px 24px', borderRadius: 14,
        fontWeight: 700, fontSize: '.85rem', zIndex: 9999,
        boxShadow: 'var(--sh-lg)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}
    >
      {toast.message}
    </div>
  );
}

// ── Status Badge ──
export function StatusBadge({ status }) {
  const map = {
    completed:   { bg: 'var(--green-lt)', color: 'var(--green-dk)', label: 'Completed' },
    pending:     { bg: 'var(--yellow-lt)', color: '#e65100', label: 'Pending' },
    in_progress: { bg: 'var(--blue-lt)', color: 'var(--blue-dk)', label: 'In Progress' },
    cancelled:   { bg: 'var(--red-lt)', color: 'var(--red)', label: 'Cancelled' },
  };
  const s = map[status] || map.pending;

  return (
    <span style={{
      display: 'inline-block', background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: 20, fontSize: '.68rem',
      fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.03em',
    }}>
      {s.label}
    </span>
  );
}

// ── Section Title ──
export function SectionTitle({ children, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--orange)' }} />
      <h2 style={{ fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
        {children}
      </h2>
      {subtitle && (
        <span style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 600 }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

// ── Card Wrapper ──
export function Card({ children, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        boxShadow: 'var(--sh-md)', ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Metric Card ──
export function MetricCard({ icon, label, value, subtitle, color = 'var(--orange)' }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px 22px',
      boxShadow: 'var(--sh-md)', borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
        }}>
          {icon}
        </div>
        <span style={{
          fontSize: '.7rem', fontWeight: 800, color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '.06em',
        }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '.72rem', color: 'var(--muted)', fontWeight: 700, marginTop: 5 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
