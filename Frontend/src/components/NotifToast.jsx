import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const typeConfig = {
  due_today: { icon: 'ti-clock',          color: '#f59e0b', bg: '#fef3c7', darkBg: '#2d1f00', darkC: '#fbbf24', label: 'Due today' },
  overdue:   { icon: 'ti-alert-triangle', color: '#ef4444', bg: '#fee2e2', darkBg: '#2d0a0a', darkC: '#f87171', label: 'Overdue'   },
  completed: { icon: 'ti-circle-check',   color: '#22c55e', bg: '#dcfce7', darkBg: '#0d2d0d', darkC: '#4ade80', label: 'Completed' },
};

export default function NotifToast() {
  const { notifications } = useNotifications();
  const { dark } = useTheme();
  const [visible, setVisible] = useState(null);
  const prevCount = useRef(notifications.length);
  const timer = useRef();

  useEffect(() => {
    // A new notification was added
    if (notifications.length > prevCount.current) {
      const newest = notifications[0];
      setVisible(newest);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(null), 4000);
    }
    prevCount.current = notifications.length;
  }, [notifications]);

  if (!visible) return null;

  const cfg = typeConfig[visible.type] || typeConfig.completed;
  const iconBg  = dark ? cfg.darkBg : cfg.bg;
  const iconCol = dark ? cfg.darkC  : cfg.color;
  const bg      = dark ? '#1e2a3a' : '#fff';
  const bdr     = dark ? '#2d3f55' : '#e3f2fd';
  const txt     = dark ? '#e2e8f0' : '#0d1b2a';
  const sub     = dark ? '#64748b' : '#5b8db8';

  return (
    <div style={{
      position: 'fixed', bottom: 80, right: 24, zIndex: 2000,
      background: bg, border: `0.5px solid ${bdr}`,
      borderRadius: 14, padding: '14px 16px',
      boxShadow: dark
        ? '0 8px 32px rgba(0,0,0,0.5)'
        : '0 8px 32px rgba(21,101,192,0.15)',
      display: 'flex', alignItems: 'flex-start', gap: 12,
      maxWidth: 320,
      animation: 'slideInRight 0.3s ease',
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`ti ${cfg.icon}`} style={{ fontSize: 20, color: iconCol }} aria-hidden="true" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: iconCol, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{cfg.label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: txt, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{visible.title}</div>
        <div style={{ fontSize: 12, color: sub, lineHeight: 1.4 }}>{visible.message}</div>
      </div>
      <button
        onClick={() => setVisible(null)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? '#334155' : '#bfdbfe', fontSize: 16, padding: 0, flexShrink: 0, lineHeight: 1 }}
        aria-label="Dismiss"
      >
        <i className="ti ti-x" aria-hidden="true" />
      </button>

      {/* Auto-dismiss progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: dark ? '#1e2a3a' : '#e3f2fd', borderRadius: '0 0 14px 14px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: iconCol, borderRadius: '0 0 14px 14px', animation: 'shrink 4s linear forwards' }} />
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}