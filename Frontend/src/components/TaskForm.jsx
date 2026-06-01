import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function TaskForm({ onSubmit, onCancel, existingTask }) {
  const { dark } = useTheme();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    progress: 0,
    category: 'work',
    dueDate: '',
    assignedTo: ''
  });

  useEffect(() => {
    if (existingTask) {
      setForm({
        title: existingTask.title || '',
        description: existingTask.description || '',
        status: existingTask.status || 'todo',
        priority: existingTask.priority || 'medium',
        progress: existingTask.progress ?? 0,
        category: existingTask.category || 'work',
        dueDate: existingTask.dueDate
          ? existingTask.dueDate.substring(0, 10)
          : '',
        assignedTo: existingTask.assignedTo || ''
      });
    }
  }, [existingTask]);

  const set = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const bg = dark ? '#1a2332' : '#fff';
  const bdr = dark ? '#2d3f55' : '#bbdefb';
  const bdr2 = dark ? '#374760' : '#dce9f9';
  const txt = dark ? '#e2e8f0' : '#0d1b2a';
  const sub = dark ? '#64748b' : '#5b8db8';
  const inp = dark ? '#0f172a' : '#f5f9ff';
  const inpT = dark ? '#e2e8f0' : '#0d1b2a';
  const selBg = dark ? '#0f172a' : '#f5f9ff';

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 9,
    border: `0.5px solid ${bdr}`,
    background: inp,
    fontSize: 14,
    color: inpT,
    outline: 'none',
    fontFamily: 'inherit'
  };

  const lbl = (text) => (
    <label
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: sub,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginBottom: 5
      }}
    >
      {text}
    </label>
  );

  return (
    <div
      style={{
        background: bg,
        border: `0.5px solid ${bdr}`,
        borderRadius: 14,
        padding: '22px 24px',
        marginBottom: 20,
        boxShadow: dark
          ? '0 2px 16px rgba(0,0,0,0.3)'
          : '0 2px 16px rgba(21,101,192,0.07)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 18
        }}
      >
        <div
          style={{
            width: 4,
            height: 20,
            background: '#1565c0',
            borderRadius: 2
          }}
        />
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: txt
          }}
        >
          {existingTask ? 'Edit task' : 'New task'}
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 13
        }}
      >
        <div>
          {lbl('Title *')}
          <input
            style={inputStyle}
            type="text"
            name="title"
            value={form.title}
            onChange={set}
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div>
          {lbl('Description')}
          <textarea
            style={{
              ...inputStyle,
              resize: 'none'
            }}
            name="description"
            value={form.description}
            onChange={set}
            placeholder="Add more details..."
            rows={2}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12
          }}
        >
          <div>
            {lbl('Status')}
            <select
              disabled
              name="status"
              value={form.status}
              style={{
                ...inputStyle,
                background: selBg,
                opacity: 0.7,
                cursor: 'not-allowed'
              }}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            {lbl('Priority')}
            <select
              style={{
                ...inputStyle,
                background: selBg,
                cursor: 'pointer'
              }}
              name="priority"
              value={form.priority}
              onChange={set}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            {lbl('Category')}
            <select
              style={{
                ...inputStyle,
                background: selBg,
                cursor: 'pointer'
              }}
              name="category"
              value={form.category}
              onChange={set}
            >
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12
          }}
        >
          <div>
            {lbl('Due Date')}
            <input
              style={{
                ...inputStyle,
                colorScheme: dark ? 'dark' : 'light'
              }}
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={set}
            />
          </div>

          <div>
            {lbl('Assign To')}
            <input
              style={inputStyle}
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={set}
              placeholder="Name or teammate"
            />
          </div>
        </div>

        <div>
          {lbl(`Progress — ${form.progress}%`)}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={form.progress}
              onChange={(e) => {
                const progress = Number(e.target.value);

                let status;

                if (progress === 0) {
                  status = 'todo';
                } else if (progress === 100) {
                  status = 'done';
                } else {
                  status = 'in-progress';
                }

                setForm({
                  ...form,
                  progress,
                  status
                });
              }}
              style={{
                flex: 1,
                accentColor: '#1565c0'
              }}
            />

            <div
              style={{
                width: 80,
                background: dark ? '#0f172a' : '#e3f2fd',
                borderRadius: 6,
                height: 6,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${form.progress}%`,
                  height: '100%',
                  background: '#1565c0',
                  borderRadius: 6,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            paddingTop: 4
          }}
        >
          <button
            type="submit"
            style={{
              flex: 1,
              padding: 11,
              background: '#1565c0',
              border: 'none',
              borderRadius: 9,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            {existingTask ? 'Save Changes' : 'Add Task'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 11,
              background: inp,
              border: `0.5px solid ${bdr2}`,
              borderRadius: 9,
              fontSize: 14,
              color: sub,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}