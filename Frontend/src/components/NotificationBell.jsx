import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const typeConfig = {
  due_today: {
    icon:    'ti-clock',
    color:   '#f59e0b',
    bg:      '#fef3c7',
    darkBg:  '#2d1f00',
    darkC:   '#fbbf24',
    label:   'Due today',
  },
  overdue: {
    icon:    'ti-alert-triangle',
    color:   '#ef4444',
    bg:      '#fee2e2',
    darkBg:  '#2d0a0a',
    darkC:   '#f87171',
    label:   'Overdue',
  },
  completed: {
    icon:    'ti-circle-check',
    color:   '#22c55e',
    bg:      '#dcfce7',
    darkBg:  '#0d2d0d',
    darkC:   '#4ade80',
    label:   'Completed',
  },
};

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, deleteNotif, clearAll } = useNotifications();
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const [tab, setTab]   = useState('all'); // 'all' | 'unread'
  const ref = useRef();

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const bg     = dark ? '#111827' : '#fff';
  const bdr    = dark ? '#1e2a3a' : '#e3f2fd';
  const txt    = dark ? '#e2e8f0' : '#0d1b2a';
  const sub    = dark ? '#64748b' : '#5b8db8';
  const rowBg  = dark ? '#1e2a3a' : '#f8fbff';
  const rowHov = dark ? '#243044' : '#f0f7ff';
  const unread = dark ? '#162032' : '#eff6ff';

  const shown = tab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative',
          background: open ? (dark ? '#1e2a3a' : '#e3f2fd') : 'none',
          border: `0.5px solid ${open ? bdr : 'transparent'}`,
          borderRadius: 9, width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.15s'
        }}
        aria-label="Notifications"
      >
        <i className="ti ti-bell" style={{ fontSize: 18, color: dark ? '#94a3b8' : '#5b8db8' }} aria-hidden="true" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute', top: 4, right: 4,
            width: unreadCount > 9 ? 18 : 14,
            height: 14,
            background: '#ef4444', borderRadius: 7,
            fontSize: 9, fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${dark ? '#111827' : '#fff'}`,
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0,
          width: 360, maxHeight: 500,
          background: bg, border: `0.5px solid ${bdr}`,
          borderRadius: 14, zIndex: 999,
          boxShadow: dark
            ? '0 8px 32px rgba(0,0,0,0.5)'
            : '0 8px 32px rgba(21,101,192,0.12)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{ padding: '14px 16px 10px', borderBottom: `0.5px solid ${bdr}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="ti ti-bell" style={{ fontSize: 16, color: dark ? '#60a5fa' : '#1565c0' }} aria-hidden="true" />
                <span style={{ fontSize: 14, fontWeight: 700, color: txt }}>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: 11, color: dark ? '#60a5fa' : '#1565c0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} style={{ fontSize: 11, color: dark ? '#64748b' : '#90afc5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'unread'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                  background: tab === t ? '#1565c0' : 'transparent',
                  color: tab === t ? '#fff' : sub,
                  transition: 'all 0.15s'
                }}>
                  {t === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Notification list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {shown.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <i className="ti ti-bell-off" style={{ fontSize: 36, color: dark ? '#334155' : '#bfdbfe', display: 'block', marginBottom: 10 }} aria-hidden="true" />
                <div style={{ fontSize: 13, color: sub, fontWeight: 500 }}>
                  {tab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </div>
                <div style={{ fontSize: 12, color: dark ? '#334155' : '#90caf9', marginTop: 4 }}>
                  {tab === 'unread' ? 'You\'re all caught up!' : 'Due today and overdue tasks will appear here'}
                </div>
              </div>
            ) : (
              shown.map((n) => {
                const cfg = typeConfig[n.type] || typeConfig.completed;
                const iconBg  = dark ? cfg.darkBg  : cfg.bg;
                const iconCol = dark ? cfg.darkC   : cfg.color;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '12px 16px',
                      background: n.read ? 'transparent' : (dark ? unread : '#f0f7ff'),
                      borderBottom: `0.5px solid ${bdr}`,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      position: 'relative'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = rowHov}
                    onMouseOut={e => e.currentTarget.style.background = n.read ? 'transparent' : (dark ? unread : '#f0f7ff')}
                  >
                    {/* Type icon */}
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`ti ${cfg.icon}`} style={{ fontSize: 18, color: iconCol }} aria-hidden="true" />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: iconCol }}>{cfg.label}</span>
                        {!n.read && (
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                        )}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: txt, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: 12, color: sub, lineHeight: 1.4 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: dark ? '#334155' : '#90caf9', marginTop: 4 }}>
                        {timeAgo(n.time)}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? '#334155' : '#bfdbfe', fontSize: 16, padding: '2px', flexShrink: 0, lineHeight: 1 }}
                      aria-label="Delete notification"
                    >
                      <i className="ti ti-x" aria-hidden="true" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}