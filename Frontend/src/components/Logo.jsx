function Logo({ size = 'md', showTagline = false, dark = false }) {
  const s = {
    sm: { mark: 28, rx: 8,  svg: 16, font: 14 },
    md: { mark: 40, rx: 11, svg: 22, font: 20 },
    lg: { mark: 52, rx: 14, svg: 28, font: 24 },
  }[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'sm' ? 8 : 12 }}>
      <div style={{ width: s.mark, height: s.mark, flexShrink: 0, background: 'linear-gradient(135deg, #1565c0, #0288d1)', borderRadius: s.rx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={s.svg} height={s.svg} viewBox="0 0 32 32" fill="none">
          <rect x="5" y="7"  width="10" height="2.8" rx="1.4" fill="white"/>
          <rect x="5" y="13" width="15" height="2.8" rx="1.4" fill="white"/>
          <rect x="5" y="19" width="8"  height="2.8" rx="1.4" fill="white"/>
          <circle cx="24.5" cy="22" r="5" fill="none" stroke="white" strokeWidth="1.8"/>
          <path d="M22.5 22l1.5 1.5 2.5-2.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: s.font, fontWeight: 700, letterSpacing: '-0.4px', lineHeight: 1.1, color: dark ? '#60a5fa' : '#1565c0' }}>
          Focus<span style={{ color: dark ? '#38bdf8' : '#0288d1' }}>Flow</span>
        </div>
        {showTagline && (
          <div style={{ fontSize: 10, color: dark ? '#475569' : '#78aac8', letterSpacing: '0.8px', textTransform: 'uppercase', marginTop: 3 }}>
            Work · Study · Remind
          </div>
        )}
      </div>
    </div>
  );
}

export default Logo;