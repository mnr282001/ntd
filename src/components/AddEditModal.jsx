import { useState, useEffect } from 'react';
import { CATEGORIES, HOURS, formatTime } from '../lib/constants.js';
import LocationInput from './LocationInput.jsx';

const Pill = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '8px 16px', borderRadius: '20px',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'rgba(255,107,53,0.12)' : 'var(--surface)',
    color: active ? 'var(--accent)' : 'var(--text-dim)',
    fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'relative', width: '100%', maxWidth: '430px',
        background: '#14121a', border: '1px solid var(--border)', borderBottom: 'none',
        borderRadius: '24px 24px 0 0', padding: '8px 20px 36px',
        animation: 'slideSheet 0.35s cubic-bezier(0.16,1,0.3,1)',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ width: '36px', height: '4px', borderRadius: '4px', background: 'var(--border-hover)', margin: '8px auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
            {isEdit ? 'Edit stop' : 'Add a stop'}
          </div>
          {isEdit && onDelete && (
            <button onClick={() => { onDelete(stop.id); onClose(); }} style={{
              padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(255,68,68,0.3)',
              background: 'rgba(255,68,68,0.08)', color: '#ff4444',
              fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}>
              Delete
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's the move?" autoFocus />

          <div className="scroll-hide" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '2px 0' }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Pill key={key} active={category === key} onClick={() => setCategory(key)}>
                {cat.emoji} {cat.label}
              </Pill>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'block' }}>Start</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <select value={startHour} onChange={(e) => setStartHour(+e.target.value)} style={{ flex: 1 }}>
                  {HOURS.map((h) => <option key={h} value={h}>{formatTime(h)}</option>)}
                </select>
                <select value={startMin} onChange={(e) => setStartMin(+e.target.value)} style={{ width: '72px' }}>
                  {[0, 15, 30, 45].map((m) => <option key={m} value={m}>:{m.toString().padStart(2, '0')}</option>)}
                </select>
              </div>
            </div>
            <div style={{ flex: 0.55 }}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'block' }}>Duration</label>
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
              startHour, startMin, // include both key formats for local state compat
              duration,
            });
            onClose();
          }} style={{
            width: '100%', padding: '16px', borderRadius: 'var(--radius)', border: 'none',
            background: 'linear-gradient(135deg, #ff6b35, #ff8f5e)', color: '#fff',
            fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700,
            cursor: 'pointer', marginTop: '4px', boxShadow: '0 4px 20px var(--accent-glow)',
          }}>
            {isEdit ? 'Save changes' : 'Add to plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
