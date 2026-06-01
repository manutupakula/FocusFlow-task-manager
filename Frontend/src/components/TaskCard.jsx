export default function TaskCard({ task, onDelete, onEdit, onStatusChange, dark = false }) {

  const priority = {
    high:   { bg: '#fce4ec', color: '#b71c1c', border: '#f48fb1', label: 'High' },
    medium: { bg: '#fff8e1', color: '#e65100', border: '#ffe082', label: 'Med'  },
    low:    { bg: '#e8f5e9', color: '#1b5e20', border: '#a5d6a7', label: 'Low'  },
  };

  const priorityDark = {
    high:   { bg: '#2d0a0a', color: '#f87171', border: '#7f1d1d', label: 'High' },
    medium: { bg: '#2d1f00', color: '#fbbf24', border: '#78350f', label: 'Med'  },
    low:    { bg: '#0d2d0d', color: '#4ade80', border: '#166534', label: 'Low'  },
  };

  const category = {
    work:     { bg: '#e3f2fd', color: '#1565c0' },
    study:    { bg: '#e0f7fa', color: '#006064' },
    personal: { bg: '#f3e5f5', color: '#6a1b9a' },
  };

  const categoryDark = {
    work:     { bg: '#162032', color: '#60a5fa' },
    study:    { bg: '#061a1a', color: '#34d399' },
    personal: { bg: '#1a0a2e', color: '#c084fc' },
  };

  // ── Status → border color ──────────────────────────
  // todo        = blue  (#1565c0)
  // in-progress = orange (#f97316)
  // done        = green  (#22c55e)
  const statusBorder = {
    'todo':        '#1565c0',
    'in-progress': '#f97316',
    'done':        '#22c55e',
  };

  const statusBorderDark = {
    'todo':        '#3b82f6',
    'in-progress': '#fb923c',
    'done':        '#4ade80',
  };

  const progressBarColor = {
    'todo':        dark ? '#3b82f6'  : '#1565c0',
    'in-progress': dark ? '#fb923c'  : '#f97316',
    'done':        dark ? '#4ade80'  : '#22c55e',
  };

  const p       = (dark ? priorityDark : priority)[task.priority]  || (dark ? priorityDark : priority).medium;
  const c       = (dark ? categoryDark : category)[task.category]  || (dark ? categoryDark : category).work;
  const border  = (dark ? statusBorderDark : statusBorder)[task.status];
const displayProgress =
  task.status === 'done'
    ? 100
    : task.progress || 0;
    const isDone = task.status === 'done';

  // colours that flip with mode
  const cardBg  = dark ? '#1e2a3a' : '#fff';
  const titleC  = dark ? '#e2e8f0' : '#0d1b2a';
  const descC   = dark ? '#64748b' : '#78aac8';
  const progBg  = dark ? '#0d1117' : '#e3f2fd';
  const editBg  = dark ? '#162032' : '#e3f2fd';
  const editC   = dark ? '#60a5fa' : '#1565c0';
  const editBdr = dark ? '#2d3f55' : '#90caf9';
  const delBg   = dark ? '#2d0a0a' : '#fce4ec';
  const delC    = dark ? '#f87171' : '#b71c1c';
  const delBdr  = dark ? '#7f1d1d' : '#f48fb1';
  const metaC   = dark ? '#334155' : '#90caf9';
  const statusTxtC = dark ? '#94a3b8' : '#5b8db8';

  const deadline = (() => {
    if (!task.dueDate || isDone) return null;
    const diff = Math.ceil((new Date(task.dueDate) - new Date()) / 86400000);
    const fmt  = new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (diff < 0)   return { label: `⚠ Overdue · ${fmt}`,    color: dark ? '#f87171' : '#c62828' };
    if (diff === 0) return { label: `Due today · ${fmt}`,     color: dark ? '#fb923c' : '#e65100' };
    if (diff <= 3)  return { label: `${diff}d left · ${fmt}`, color: dark ? '#fbbf24' : '#f57c00' };
    return { label: fmt, color: metaC };
  })();

  return (
    <div
      style={{
        background: cardBg,
        // Full colored border on ALL 4 sides — thick 2px
        border: `2px solid ${border}`,
        borderRadius: 12,
        padding: '14px 16px',
        opacity: isDone ? 0.88 : 1,
        transition: 'box-shadow 0.15s, transform 0.15s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform  = 'translateY(-3px)';
        e.currentTarget.style.boxShadow  = `0 6px 24px ${border}40`;
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Subtle top glow strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: border, opacity: 0.6, borderRadius: '12px 12px 0 0'
      }} />

      {/* Title + priority */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6, marginTop: 4 }}>
        <h3 style={{
          fontSize: 13, fontWeight: 600, color: titleC,
          lineHeight: 1.4, flex: 1,
          textDecoration: isDone ? 'line-through' : 'none'
        }}>
          {task.title}
        </h3>
        <span style={{
          background: p.bg, color: p.color,
          border: `0.5px solid ${p.border}`,
          borderRadius: 12, padding: '2px 8px',
          fontSize: 9, fontWeight: 700, flexShrink: 0,
          letterSpacing: '0.3px', textTransform: 'uppercase'
        }}>
          {p.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{ fontSize: 12, color: descC, marginBottom: 8, lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      {/* Category + status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{
          background: c.bg, color: c.color,
          borderRadius: 12, padding: '2px 9px',
          fontSize: 10, fontWeight: 600
        }}>
          {task.category}
        </span>
        <button
          onClick={() => onStatusChange(task._id, task.status)}
          title="Click to cycle status"
          style={{
            background: 'transparent',
            border: `0.5px solid ${border}`,
            borderRadius: 12, padding: '2px 9px',
            fontSize: 10, fontWeight: 600,
            color: border,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s'
          }}
          onMouseOver={e => { e.target.style.background = border; e.target.style.color = '#fff'; }}
          onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = border; }}
        >
          {task.status}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: dark ? '#475569' : '#90afc5', fontWeight: 600 }}>
            Progress
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: progressBarColor[task.status] }}>
            {displayProgress}%
          </span>
        </div>
        <div style={{ background: progBg, borderRadius: 4, height: 5, overflow: 'hidden' }}>
          <div style={{
            width: `${displayProgress}%`,
            height: '100%',
            background: progressBarColor[task.status],
            borderRadius: 4,
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Deadline + assigned */}
      {(deadline || task.assignedTo) && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          {deadline && (
            <span style={{ fontSize: 11, color: deadline.color, fontWeight: 500 }}>
              📅 {deadline.label}
            </span>
          )}
          {task.assignedTo && (
            <span style={{ fontSize: 11, color: metaC }}>
              👤 {task.assignedTo}
            </span>
          )}
        </div>
      )}

      {/* Done checkmark */}
      {isDone && (
        <div style={{ fontSize: 11, color: dark ? '#4ade80' : '#22c55e', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="ti ti-circle-check" style={{ fontSize: 14 }} aria-hidden="true" />
          Completed
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 7 }}>
        <button
          onClick={() => onEdit(task)}
          style={{ flex: 1, fontSize: 11, padding: 6, background: editBg, color: editC, border: `0.5px solid ${editBdr}`, borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
          onMouseOver={e => e.target.style.opacity = '0.75'}
          onMouseOut={e => e.target.style.opacity = '1'}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          style={{ flex: 1, fontSize: 11, padding: 6, background: delBg, color: delC, border: `0.5px solid ${delBdr}`, borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
          onMouseOver={e => e.target.style.opacity = '0.75'}
          onMouseOut={e => e.target.style.opacity = '1'}
        >
          Delete
        </button>
      </div>
    </div>
  );
}