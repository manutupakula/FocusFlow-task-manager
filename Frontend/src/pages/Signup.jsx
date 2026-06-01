import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import Logo from '../components/Logo';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/signup', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f4f9f7', padding: '1rem'
    }}>
      <div style={{
        width: '100%', maxWidth: '460px',
        background: '#fff', borderRadius: '20px',
        border: '0.5px solid #dbeae6', padding: '40px',
        boxShadow: '0 4px 40px rgba(14,110,110,0.08)'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <Logo size="md" showTagline />
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0d2d2d', marginBottom: 4 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 13, color: '#6b9e96', marginBottom: 24 }}>
          Start organizing your work and study life
        </p>

        {error && (
          <div style={{
            background: '#fdf2f2', border: '0.5px solid #f7c1c1',
            borderRadius: 9, padding: '10px 14px',
            fontSize: 13, color: '#a32d2d', marginBottom: 16
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Full name', name: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', name: 'password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b9e96', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
              </label>
              <input className="ff-input" type={type} name={name}
                value={form[name]} onChange={handleChange}
                placeholder={placeholder} required />
            </div>
          ))}

          <button className="ff-btn" type="submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        {/* Benefit pills */}
        <div style={{ display: 'flex', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
          {['Work tasks', 'Study goals', 'Reminders'].map((tag, i) => (
            <span key={tag} style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500,
              background: ['#e8f5f1','#dce9f9','#faeeda'][i],
              color: ['#085041','#0c447c','#633806'][i]
            }}>{tag}</span>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b9e96', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0e6e6e', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;