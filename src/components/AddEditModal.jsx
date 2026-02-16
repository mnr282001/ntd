import { useState } from 'react';
import { CATEGORIES, HOURS, formatTime } from '../lib/constants.js';
import LocationInput from './LocationInput.jsx';

const Pill = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '8px 16px', borderRadius: 'var(--radius-full)',
    border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent-soft)' : 'var(--surface)',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s var(--ease-smooth)', whiteSpace: 'nowrap', flexShrink: 0,
  }}>
    {children}
  </button>
);

export default function AddEditModal({ hour, stop, onSave, onDelete, onClose }) {
  const isEdit = !!stop;

  const [title, setTitle] = useState(stop?.title || '');
  const [location, setLocation] = useState(stop?.location || '');
  const [notes, setNotes] = useState(stop?.notes || '');
  const [category, setCategory] = useState(stop?.category || 'food');
  const [startHour, setStartHour] = useState(stop?.start_hour ?? stop?.startHour ?? hour ?? 12);
  const [startMin, setStartMin] = useState(stop?.start_min ?? stop?.startMin ?? 0);
  const [duration, setDuration] = useState(stop?.duration || 60);

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26, 22, 20, 0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} />
      <div onClick={(e) => e.stopPropagation()} className="modal-sheet" style={{
        position: 'relative', width: '100%', maxWidth: 430,
        background: 'var(--bg)', border: '1px solid var(--border)',
        padding: '8px 20px 36px',
        maxHeight: '85vh', overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
      }}>
        {/* Handle bar */}
        <div style={{ width: 36, height: 4, borderRadius: 4, background: 'var(--border-hover)', margin: '8px auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {isEdit ? 'Edit stop' : 'Add a stop'}
          </div>
          {isEdit && onDelete && (
            <button onClick={() => { onDelete(stop.id); onClose(); }} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(220, 38, 38, 0.2)',
              background: 'rgba(220, 38, 38, 0.06)', color: '#DC2626',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              Delete
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's the move?" autoFocus />

          <div className="scroll-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 0' }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Pill key={key} active={category === key} onClick={() => setCategory(key)}>
                {cat.emoji} {cat.label}
              </Pill>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 6, display: 'block',
              }}>Start</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <select value={startHour} onChange={(e) => setStartHour(+e.target.value)} style={{ flex: 1 }}>
                  {HOURS.map((h) => <option key={h} value={h}>{formatTime(h)}</option>)}
                </select>
                <select value={startMin} onChange={(e) => setStartMin(+e.target.value)} style={{ width: 72 }}>
                  {[0, 15, 30, 45].map((m) => <option key={m} value={m}>:{m.toString().padStart(2, '0')}</option>)}
                </select>
              </div>
            </div>
            <div style={{ flex: 0.55 }}>
              <label style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 6, display: 'block',
              }}>Duration</label>
              <select value={duration} onChange={(e) => setDuration(+e.target.value)}>
                {[30, 45, 60, 90, 120, 150, 180].map((d) => (
                  <option key={d} value={d}>{d < 60 ? `${d}m` : `${d / 60}h${d % 60 ? ` ${d % 60}m` : ''}`}</option>
                ))}
              </select>
            </div>
          </div>

          <LocationInput value={location} onChange={setLocation} />
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes for the group (optional)" />

          <button onClick={() => {
            if (!title.trim()) return;
            onSave({
              ...(stop || {}),
              title: title.trim(),
              location: location.trim() || 'TBD',
              notes: notes.trim(),
              category,
              start_hour: startHour,
              start_min: startMin,
              startHour, startMin,
              duration,
            });
            onClose();
          }} style={{
            width: '100%', padding: 16, borderRadius: 'var(--radius)', border: 'none',
            background: 'var(--accent-gradient)', color: '#fff',
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', marginTop: 4,
            boxShadow: 'var(--shadow-warm)',
            transition: 'transform 0.15s var(--ease-spring)',
          }}>
            {isEdit ? 'Save changes' : 'Add to plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
