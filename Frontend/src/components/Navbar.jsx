import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // colours that flip with dark mode
  const nav   = dark ? '#111827' : '#fff';
  const bdr   = dark ? '#1e2a3a' : '#e3f2fd';
  const uc    = dark ? '#60a5fa' : '#1565c0';
  const ubg   = dark ? '#162032' : '#e3f2fd';
  const ubdr  = dark ? '#2d3f55' : '#90caf9';
  const tc    = dark ? '#94a3b8' : '#5b8db8';
  const lbdr  = dark ? '#1e2a3a' : '#e3f2fd';
  const lc    = dark ? '#64748b' : '#90afc5';

  return (
    <nav style={{ background: nav, borderBottom: `0.5px solid ${bdr}`, padding: '0 1.5rem', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
      <Logo size="sm" dark={dark} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Dark mode toggle */}
        <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 6, background: dark ? '#1e2a3a' : '#f0f6ff', border: `0.5px solid ${bdr}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          <span style={{ fontSize: 14 }}>{dark ? '🌙' : '☀️'}</span>
          <span style={{ fontSize: 12, color: tc, fontWeight: 500 }}>{dark ? 'Dark' : 'Light'}</span>
        </button>

        <div style={{ width: 1, height: 18, background: bdr }} />

         <NotificationBell />

        <div style={{ width: 1, height: 18, background: bdr }} />

        {/* Profile link */}
        <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: ubg, border: `1.5px solid ${ubdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: uc, overflow: 'hidden' }}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          <span style={{ fontSize: 13, color: tc }}>{user?.name?.split(' ')[0]}</span>
        </Link>

        <div style={{ width: 1, height: 18, background: bdr }} />

        <button onClick={() => { logout(); navigate('/login'); }}
          style={{ background: 'none', border: `0.5px solid ${lbdr}`, borderRadius: 7, padding: '5px 12px', fontSize: 12, color: lc, cursor: 'pointer', fontFamily: 'inherit' }}
          onMouseOver={e => { e.target.style.borderColor = '#f48fb1'; e.target.style.color = '#b71c1c'; }}
          onMouseOut={e => { e.target.style.borderColor = lbdr; e.target.style.color = lc; }}>
          Logout
        </button>
      </div>
    </nav>
  );
}