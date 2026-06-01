import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const LogoMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="5" y="7"  width="10" height="2.8" rx="1.4" fill="white"/>
    <rect x="5" y="13" width="15" height="2.8" rx="1.4" fill="white"/>
    <rect x="5" y="19" width="8"  height="2.8" rx="1.4" fill="white"/>
    <circle cx="24.5" cy="22" r="5" fill="none" stroke="white" strokeWidth="1.8"/>
    <path d="M22.5 22l1.5 1.5 2.5-2.5" stroke="white" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const features = [
  {
    icon: 'briefcase',
    color: 'rgba(255,255,255,0.15)',
    iconColor: '#93c5fd',
    title: 'Organize work',
    desc: 'Manage tasks by priority, deadline, and team member. Never drop the ball on a project again.'
  },
  {
    icon: 'school',
    color: 'rgba(255,255,255,0.15)',
    iconColor: '#6ee7b7',
    title: 'Track study goals',
    desc: 'Break down subjects into tasks, set due dates, and watch your progress bar fill up session by session.'
  },
  {
    icon: 'bell-ringing',
    color: 'rgba(255,255,255,0.15)',
    iconColor: '#fcd34d',
    title: 'Never miss a deadline',
    desc: 'Color-coded countdowns show overdue, due today, and upcoming tasks at a glance across every project.'
  },
];

// Floating stat badges shown on the right panel
const floatingStats = [
  { value: '2,400+', label: 'Tasks completed today', icon: 'circle-check', color: '#dcfce7', tc: '#166534' },
  { value: '98%',    label: 'Users stay on track',   icon: 'trending-up',  color: '#dbeafe', tc: '#1e40af' },
  { value: '4.9 ★',  label: 'Average user rating',   icon: 'star',         color: '#fef9c3', tc: '#854d0e' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>

      {/* ════════════════════════════════
          LEFT PANEL — brand side
      ════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(160deg, #1565c0 0%, #1976d2 60%, #0288d1 100%)',
        padding: '48px 56px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden'
      }}>

        {/* Decorative background circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoMark size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              Focus<span style={{ color: '#93c5fd' }}>Flow</span>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 1 }}>
              Work · Study · Remind
            </div>
          </div>
        </div>

        {/* Headline block */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 12px', marginBottom: 20 }}>
            <i className="ti ti-sparkles" style={{ fontSize: 13, color: '#fcd34d' }} aria-hidden="true" />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Your productivity workspace</span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.5px', marginBottom: 14 }}>
            One place for<br />
            <span style={{ color: '#93c5fd' }}>everything</span> that<br />
            matters.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 380 }}>
            From work projects to study goals — FocusFlow keeps you focused, organised, and always on track.
          </div>
        </div>

        {/* Feature rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
          {features.map(({ icon, color, iconColor, title, desc }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.13)', borderRadius: 13, padding: '14px 16px', backdropFilter: 'blur(4px)' }}>
              <div style={{ width: 40, height: 40, background: color, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '0.5px solid rgba(255,255,255,0.2)' }}>
                <i className={`ti ti-${icon}`} style={{ fontSize: 20, color: iconColor }} aria-hidden="true" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trusted by row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          {/* Avatar stack */}
          <div style={{ display: 'flex' }}>
            {['#f87171','#60a5fa','#34d399','#fbbf24'].map((c, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid rgba(21,101,192,0.9)', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                {['R','A','S','M'][i]}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Trusted by 2,400+ users</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Join them today — it's free</div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          RIGHT PANEL — form side
      ════════════════════════════════ */}
      <div style={{
        background: '#fff',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '48px 64px',
        position: 'relative'
      }}>

        {/* Subtle background pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#e3f2fd 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5, pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

          {/* Floating stat badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {floatingStats.map(({ value, label, icon, color, tc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, background: color, borderRadius: 20, padding: '6px 12px', border: `0.5px solid ${tc}22` }}>
                <i className={`ti ti-${icon}`} style={{ fontSize: 13, color: tc }} aria-hidden="true" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tc, lineHeight: 1.1 }}>{value}</div>
                  <div style={{ fontSize: 10, color: tc, opacity: 0.7 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0d1b2a', marginBottom: 4, letterSpacing: '-0.4px' }}>
            Welcome back 👋
          </h1>
          <p style={{ fontSize: 14, color: '#5b8db8', marginBottom: 28, lineHeight: 1.5 }}>
            Sign in to your workspace and pick up right where you left off.
          </p>

          {/* Error */}
          {error && (
            <div style={{ background: '#fce4ec', border: '0.5px solid #f48fb1', borderRadius: 10, padding: '11px 14px', fontSize: 13, color: '#b71c1c', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email field */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5b8db8', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 7 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-mail" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#90caf9' }} aria-hidden="true" />
                <input
                  type="email" name="email"
                  value={form.email} onChange={onChange}
                  placeholder="you@example.com" required
                  style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 10, border: '0.5px solid #bbdefb', background: '#f8fbff', fontSize: 14, color: '#0d1b2a', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#1565c0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.1)'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#bbdefb'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fbff'; }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5b8db8', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <i className="ti ti-lock" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#90caf9' }} aria-hidden="true" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password} onChange={onChange}
                  placeholder="Your password" required
                  style={{ width: '100%', padding: '11px 40px 11px 40px', borderRadius: 10, border: '0.5px solid #bbdefb', background: '#f8fbff', fontSize: 14, color: '#0d1b2a', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#1565c0'; e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.1)'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#bbdefb'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fbff'; }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#90caf9', fontSize: 16, padding: 0 }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  <i className={`ti ti-eye${showPass ? '-off' : ''}`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 4, width: '100%', padding: '13px',
                background: loading ? '#90caf9' : '#1565c0',
                border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', letterSpacing: '0.2px',
                transition: 'background 0.15s, transform 0.1s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#0d47a1'; }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = '#1565c0'; }}
            >
              {loading ? (
                <>
                  <i className="ti ti-loader" style={{ fontSize: 16, animation: 'spin 1s linear infinite' }} aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to FocusFlow
                  <i className="ti ti-arrow-right" style={{ fontSize: 16 }} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '0.5px solid #e3f2fd' }} />
            <span style={{ fontSize: 12, color: '#90caf9', fontWeight: 500 }}>or</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '0.5px solid #e3f2fd' }} />
          </div>

          {/* Sign up link */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#5b8db8', marginBottom: 0 }}>
              New here?{' '}
              <Link to="/signup" style={{ color: '#1565c0', fontWeight: 700, textDecoration: 'none' }}>
                Create a free account →
              </Link>
            </p>
          </div>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 28, padding: '10px 16px', background: '#f0f9ff', border: '0.5px solid #bae6fd', borderRadius: 10 }}>
            <i className="ti ti-shield-check" style={{ fontSize: 15, color: '#0369a1' }} aria-hidden="true" />
            <span style={{ fontSize: 12, color: '#0369a1', fontWeight: 500 }}>Your data is encrypted and secure</span>
          </div>
        </div>
      </div>

      {/* Spin animation for loader */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}