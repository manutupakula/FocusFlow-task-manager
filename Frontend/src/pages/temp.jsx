import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosInstance';

export default function Profile() {
  const { user, login, token } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(user?.name || '');
  const [email, setEmail]       = useState(user?.email || '');
  const [avatar, setAvatar]     = useState(user?.avatar || null);
  const [preview, setPreview]   = useState(user?.avatar || null);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');
  const fileRef = useRef();

  const c = {
    bg:    dark ? '#0d1117' : '#f5f9ff',
    card:  dark ? '#111827' : '#fff',
    bdr:   dark ? '#1e2a3a' : '#e3f2fd',
    bdr2:  dark ? '#2d3f55' : '#bbdefb',
    txt:   dark ? '#e2e8f0' : '#0d1b2a',
    sub:   dark ? '#64748b' : '#5b8db8',
    sbg:   dark ? '#162032' : '#e3f2fd',
    sval:  dark ? '#60a5fa' : '#1565c0',
    slbl:  dark ? '#3b82f6' : '#1976d2',
    inp:   dark ? '#1e2a3a' : '#f5f9ff',
    inpb:  dark ? '#2d3f55' : '#bbdefb',
  };

  // Stats computed from tasks (stored in localStorage for demo)
  const tasks = JSON.parse(localStorage.getItem('ff-tasks-cache') || '[]');
  const completed   = tasks.filter(t => t.status === 'done').length;
  const thisWeek    = tasks.filter(t => {
    if (t.status !== 'done') return false;
    const d = new Date(t.updatedAt);
    const now = new Date();
    return (now - d) < 7 * 86400000;
  }).length;

  // Streak — read from localStorage
  const streak = parseInt(localStorage.getItem('ff-streak') || '0');

  // Activity grid — last 14 days
  const activityDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toDateString();
    const active = localStorage.getItem(`ff-activity-${key}`) === '1';
    const isToday = i === 13;
    return { label: ['S','M','T','W','T','F','S'][d.getDay()], active, isToday };
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to backend — you'll add this route in Step 6
      await api.put('/auth/profile', { name, email, avatar });
      // Update context
      login(token, { ...user, name, email, avatar });
      setEditing(false);
      setToast('Profile updated!');
      setTimeout(() => setToast(''), 2500);
    } catch {
      setToast('Failed to save.');
      setTimeout(() => setToast(''), 2500);
    } finally { setSaving(false); }
  };

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const statCards = [
    { label: 'Total tasks', val: tasks.length, color: c.sval, lc: c.slbl },
    { label: 'Completed',   val: completed,    color: dark ? '#4ade80' : '#43a047', lc: dark ? '#22c55e' : '#2e7d32' },
    { label: 'Day streak',  val: `🔥 ${streak}`, color: dark ? '#fbbf24' : '#f57c00', lc: dark ? '#d97706' : '#ef6c00' },
    { label: 'This week',   val: thisWeek,     color: dark ? '#38bdf8' : '#0288d1', lc: dark ? '#0ea5e9' : '#0277bd' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: c.bg }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.25rem' }}>

        {/* Profile card */}
        <div style={{ background: c.card, border: `0.5px solid ${c.bdr}`, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>

          {/* Banner */}
          <div style={{ height: 90, background: 'linear-gradient(135deg, #1565c0, #0288d1)', position: 'relative' }}>
            {/* Theme toggle in banner */}
            <div style={{ position: 'absolute', top: 12, right: 16 }}>
            </div>
          </div>

          {/* Avatar */}
          <div style={{ position: 'relative', marginTop: -40, paddingLeft: 28 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: c.card, border: `3px solid ${c.card}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 74, height: 74, borderRadius: '50%', background: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#fff', overflow: 'hidden' }}>
                {preview
                  ? <img src={preview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initials}
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '12px 28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: c.txt, marginBottom: 2 }}>{name}</div>
                <div style={{ fontSize: 13, color: c.sub }}>{email}</div>
              </div>
              <button onClick={() => setEditing(e => !e)} style={{ padding: '7px 14px', background: c.sbg, border: `0.5px solid ${c.bdr2}`, borderRadius: 8, fontSize: 12, fontWeight: 600, color: c.sval, cursor: 'pointer', fontFamily: 'inherit' }}>
                {editing ? 'Cancel' : 'Edit profile'}
              </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
              {statCards.map(({ label, val, color, lc }) => (
                <div key={label} style={{ background: c.sbg, border: `0.5px solid ${c.bdr}`, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color, marginBottom: 4 }}>{val}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: lc, letterSpacing: '0.4px', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Activity grid */}
            <div style={{ marginBottom: editing ? 20 : 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.sub, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Activity — last 14 days
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {activityDays.map((d, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600,
                    background: d.isToday ? '#0288d1' : d.active ? '#1565c0' : (dark ? '#1e2a3a' : '#e3f2fd'),
                    color: d.active || d.isToday ? '#fff' : (dark ? '#334155' : '#90caf9'),
                    outline: d.isToday ? `2px solid #0288d1` : 'none',
                    outlineOffset: 2
                  }}>{d.label}</div>
                ))}
              </div>
            </div>

            {/* Edit form */}
            {editing && (
              <div style={{ background: dark ? '#1e2a3a' : '#f5f9ff', border: `0.5px solid ${c.bdr2}`, borderRadius: 12, padding: '18px 20px', marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 18, background: '#1565c0', borderRadius: 2 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: c.txt }}>Edit profile</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.sub, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 5 }}>Full name</label>
                    <input className="ff-input" value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.sub, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 5 }}>Email</label>
                    <input className="ff-input" type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com" />
                  </div>
                </div>

                {/* Photo upload */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.sub, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 5 }}>Profile photo</label>
                  <div
                    onClick={() => fileRef.current.click()}
                    style={{ border: `1px dashed ${c.bdr2}`, borderRadius: 9, padding: '14px', textAlign: 'center', cursor: 'pointer', background: dark ? '#111827' : '#fff' }}
                  >
                    {preview ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                        <img src={preview} alt="preview" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: 12, color: c.sub }}>Click to change photo</span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>📁</div>
                        <div style={{ fontSize: 12, color: c.sub }}>Click to upload — JPG or PNG, max 2MB</div>
                      </div>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleSave} disabled={saving} className="ff-btn" style={{ flex: 1, width: 'auto', padding: '10px' }}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '10px', background: dark ? '#111827' : '#fff', border: `0.5px solid ${c.bdr2}`, borderRadius: 9, fontSize: 13, color: c.sub, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to dashboard */}
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: `0.5px solid ${c.bdr2}`, borderRadius: 9, padding: '9px 18px', fontSize: 13, color: c.sub, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back to dashboard
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1565c0', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 20px rgba(21,101,192,0.3)' }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}