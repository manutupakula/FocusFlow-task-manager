import { useState, useEffect, useCallback} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axiosInstance';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { markActivity, cacheTasks } from '../utils/activity';   
import { useNotifications } from '../context/NotificationContext';
import NotifToast from '../components/NotifToast';

export default function Dashboard() {
  const { dark } = useTheme();
  const [tasks, setTasks]             = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [toast, setToast]             = useState('');
  const [search, setSearch]           = useState('');
  const [catFilter, setCat]           = useState('all');
  const { addNotification } = useNotifications();

  const checkDueNotifications = useCallback((taskList) => {

  const today = new Date();
  today.setHours(0,0,0,0);

  taskList.forEach(task => {

    if (!task.dueDate || task.status === 'done')
      return;

    const due = new Date(task.dueDate);
    due.setHours(0,0,0,0);

    if (due.getTime() === today.getTime()) {

      addNotification({
        key: `today_${task._id}`,
        type: 'due_today',
        title: task.title,
        message: 'This task is due today!'
      });

    }

    else if (due < today) {

      addNotification({
        key: `overdue_${task._id}`,
        type: 'overdue',
        title: task.title,
        message: 'This task is overdue.'
      });

    }

  });

}, [addNotification]);

  useEffect(() => { fetchTasks(); }, []);

 const fetchTasks = async () => {
  try {
    const res = await api.get('/tasks');

    setTasks(res.data);
  

    cacheTasks(res.data);
    checkDueNotifications(res.data);
  } catch (err) {
    setError('Failed to load tasks.');
  } finally {
    setLoading(false);
  }
};

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 2500); };

  const handleCreate = async (d) => {
    try {
      const r = await api.post('/tasks', d);
      setTasks(prev => [r.data, ...prev]);
      setShowForm(false);
      showToast('Task created!');
    } catch { setError('Failed to create task.'); }
  };

  const handleUpdate = async (d) => {
    try {
      const r = await api.put(`/tasks/${editingTask._id}`, d);
      setTasks(prev => prev.map(t => t._id === editingTask._id ? r.data : t));
      setEditingTask(null);
      setShowForm(false);
      showToast('Task updated!');
    } catch { setError('Failed to update task.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      showToast('Task deleted!');
    } catch { setError('Failed to delete.'); }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = async (id, cur) => {
  const next = {
    'todo': 'in-progress',
    'in-progress': 'done',
    'done': 'todo'
  }[cur];

  try {
   const progressMap = {
  'todo': 0,
  'in-progress': 50,
  'done': 100
};

const r = await api.put(`/tasks/${id}`, {
  status: next,
  progress: progressMap[next]
});

    setTasks(prev =>
      prev.map(t =>
        t._id === id ? r.data : t
      )
    );

    if (next === 'done') {

      markActivity();

      const task = tasks.find(
        t => t._id === id
      );

      addNotification({
        key: `completed_${id}_${Date.now()}`,
        type: 'completed',
        title: task?.title || 'Task',
        message: 'Great work! You completed this task.'
      });
    }

    showToast(`Status → ${next}`);

  } catch (err) {
    setError('Failed to update status.');
  }
};

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const newStatus = destination.droppableId;

    // Optimistically update UI first
    setTasks(prev => prev.map(t =>
      t._id === draggableId ? { ...t, status: newStatus } : t
    ));

    try {
      await api.put(`/tasks/${draggableId}`, { status: newStatus });
      if (newStatus === 'done') markActivity();
      showToast(`Moved to ${newStatus}`);
    } catch {
      setError('Failed to move task.');
      fetchTasks(); // revert on error
    }
  };

  // Filter tasks
  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (catFilter === 'all' || t.category === catFilter)
  );

  // Split into columns
  const todo   = filtered.filter(t => t.status === 'todo');
  const inProg = filtered.filter(t => t.status === 'in-progress');
  const done   = filtered.filter(t => t.status === 'done');

  // Summary counts (always from full task list, not filtered)
  const counts = {
    total: tasks.length,
    todo:  tasks.filter(t => t.status === 'todo').length,
    prog:  tasks.filter(t => t.status === 'in-progress').length,
    done:  tasks.filter(t => t.status === 'done').length,
  };

  // Theme colours
  const bg   = dark ? '#0d1117' : '#f5f9ff';
  const card = dark ? '#111827' : '#fff';
  const bdr  = dark ? '#1e2a3a' : '#e3f2fd';
  const bdr2 = dark ? '#2d3f55' : '#bbdefb';
  const txt  = dark ? '#e2e8f0' : '#0d1b2a';
  const sub  = dark ? '#64748b' : '#5b8db8';
  const inp  = dark ? '#1e2a3a' : '#fff';

  const statCards = [
    { label: 'Total tasks', val: counts.total, vc: dark?'#60a5fa':'#1565c0', lc: dark?'#3b82f6':'#1976d2', bg: dark?'#162032':'#e3f2fd', bdr: dark?'#1e3a5f':'#90caf9' },
    { label: 'Todo',        val: counts.todo,  vc: dark?'#fbbf24':'#e65100', lc: dark?'#d97706':'#f57c00', bg: dark?'#1c1a0e':'#fff8e1', bdr: dark?'#3d3000':'#ffe082' },
    { label: 'In progress', val: counts.prog,  vc: dark?'#34d399':'#006064', lc: dark?'#10b981':'#00838f', bg: dark?'#061a1a':'#e0f7fa', bdr: dark?'#0e3434':'#80deea' },
    { label: 'Done',        val: counts.done,  vc: dark?'#86efac':'#1b5e20', lc: dark?'#4ade80':'#2e7d32', bg: dark?'#0d1f0d':'#e8f5e9', bdr: dark?'#1a3d1a':'#a5d6a7' },
  ];

  const catFilters = [
    { key: 'all',      label: 'All' },
    { key: 'work',     label: '💼 Work' },
    { key: 'study',    label: '📚 Study' },
    { key: 'personal', label: '✨ Personal' },
  ];

  const columns = [
    {
      status: 'todo',
      title:  'Todo',
      tasks:  todo,
      dot:    dark ? '#475569' : '#90afc5',
      tc:     dark ? '#94a3b8' : '#5b8db8',
      colBg:  dark ? '#111827' : '#f0f6ff',
      colBdr: dark ? '#1e2a3a' : '#dce9f9',
      dropBg: dark ? 'rgba(29,111,160,0.08)' : 'rgba(21,101,192,0.04)',
    },
    {
      status: 'in-progress',
      title:  'In Progress',
      tasks:  inProg,
      dot:    dark ? '#1d6fa0' : '#0288d1',
      tc:     dark ? '#60a5fa' : '#006064',
      colBg:  dark ? '#0c1a2e' : '#e8f5fb',
      colBdr: dark ? '#1d6fa0' : '#b3e0f2',
      dropBg: dark ? 'rgba(29,111,160,0.12)' : 'rgba(2,136,209,0.05)',
    },
    {
      status: 'done',
      title:  'Done',
      tasks:  done,
      dot:    dark ? '#4ade80' : '#43a047',
      tc:     dark ? '#86efac' : '#1b5e20',
      colBg:  dark ? '#0d1f0d' : '#f1f8e9',
      colBdr: dark ? '#166534' : '#dcedc8',
      dropBg: dark ? 'rgba(74,222,128,0.08)' : 'rgba(67,160,71,0.05)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.25rem' }}>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {statCards.map(({ label, val, vc, lc, bg: sbg, bdr: sbdr }) => (
            <div key={label} style={{ background: sbg, border: `0.5px solid ${sbdr}`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: lc, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: vc }}>{val}</div>
            </div>
          ))}
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div style={{ background: dark?'#2d0a0a':'#fce4ec', border: `0.5px solid ${dark?'#7f1d1d':'#f48fb1'}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, color: dark?'#f87171':'#b71c1c', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: dark?'#f87171':'#b71c1c', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <i className="ti ti-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: dark?'#334155':'#90caf9', fontSize: 14 }} aria-hidden="true" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              style={{ width: '100%', padding: '9px 34px', background: inp, border: `0.5px solid ${bdr2}`, borderRadius: 9, fontSize: 13, color: txt, outline: 'none', fontFamily: 'inherit' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: dark?'#334155':'#90caf9', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            )}
          </div>

          {/* Category filters */}
          {catFilters.map(({ key, label }) => (
            <button key={key} onClick={() => setCat(key)} style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              background: catFilter === key ? '#1565c0' : (dark ? '#1e2a3a' : '#fff'),
              border: catFilter === key ? '0.5px solid #1565c0' : `0.5px solid ${bdr2}`,
              color: catFilter === key ? '#fff' : sub,
            }}>
              {label}
            </button>
          ))}

          {/* New task button */}
          {!showForm && (
            <button
              onClick={() => { setEditingTask(null); setShowForm(true); }}
              style={{ background: '#1565c0', border: 'none', borderRadius: 9, padding: '9px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              onMouseOver={e => e.currentTarget.style.background = '#0a5170'}
              onMouseOut={e => e.currentTarget.style.background = '#1565c0'}
            >
              + New task
            </button>
          )}
        </div>

        {/* ── Task form ── */}
        {showForm && (
          <TaskForm
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingTask(null); }}
            existingTask={editingTask}
          />
        )}

        {/* ── Kanban board ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: sub, fontSize: 14 }}>
            Loading tasks...
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>

              {columns.map(({ status, title, tasks: colTasks, dot, tc, colBg, colBdr, dropBg }) => (
                <div key={status} style={{ background: colBg, border: `0.5px solid ${colBdr}`, borderRadius: 14, padding: 14, minHeight: 300 }}>

                  {/* Column header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: tc }}>{title}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, background: dark?'#1e2a3a':card, border: `0.5px solid ${colBdr}`, borderRadius: 12, padding: '2px 8px', color: tc }}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Droppable zone */}
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          minHeight: 60,
                          borderRadius: 10,
                          padding: snapshot.isDraggingOver ? 6 : 0,
                          background: snapshot.isDraggingOver ? dropBg : 'transparent',
                          transition: 'background 0.15s, padding 0.15s',
                        }}
                      >
                        {/* Empty state */}
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div style={{ textAlign: 'center', padding: '1.5rem 0', fontSize: 12, color: dark?'#334155':'#90caf9', border: `1px dashed ${colBdr}`, borderRadius: 10 }}>
                            {status === 'done' ? '🎉 Nothing done yet' : 'Drop tasks here'}
                          </div>
                        )}

                        {/* Task cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {colTasks.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.88 : 1,
                                    cursor:  snapshot.isDragging ? 'grabbing' : 'grab',
                                    outline: snapshot.isDragging ? '2px solid #0288d1' : 'none',
                                    outlineOffset: 2,
                                    borderRadius: 12,
                                  }}
                                >
                                  <TaskCard
                                    task={task}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    onStatusChange={handleStatusChange}
                                    dark={dark}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}

            </div>
          </DragDropContext>
        )}
      </div>

      {/* ── Toast ── */}
      <NotifToast />
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: dark?'#1d6fa0':'#1565c0', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 20px rgba(21,101,192,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}