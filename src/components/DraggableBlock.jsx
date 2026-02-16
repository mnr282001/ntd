import { CATEGORIES, HOUR_HEIGHT, formatTime } from '../lib/constants.js';

export default function DraggableBlock({ act, onRemove, onEdit, onDragStart, isDragging, ghostTop }) {
  const cat = CATEGORIES[act.category] || CATEGORIES.activity;
  const sh = act.start_hour ?? act.startHour;
  const sm = act.start_min ?? act.startMin ?? 0;
  const top = (sh - 6) * HOUR_HEIGHT + (sm / 60) * HOUR_HEIGHT;
  const height = Math.max(44, (act.duration / 60) * HOUR_HEIGHT - 4);
  const endHour = Math.floor(sh + (sm + act.duration) / 60);
  const endMin = (sm + act.duration) % 60;
  const displayTop = isDragging && ghostTop !== null ? ghostTop : top;

  return (
    <div
      onMouseDown={(e) => { if (e.button === 0) onDragStart(act.id, e.clientY, top); }}
      onTouchStart={(e) => { onDragStart(act.id, e.touches[0].clientY, top); }}
      onDoubleClick={() => onEdit(act)}
      style={{
        position: 'absolute', left: 4, right: 0, zIndex: isDragging ? 50 : 10,
        top: `${displayTop}px`, height: `${height}px`,
        background: cat.gradient, borderRadius: 14,
        padding: height > 60 ? '10px 14px' : '6px 14px',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        animation: isDragging ? 'none' : 'scaleIn 0.3s var(--ease-out) both',
        boxShadow: isDragging
          ? `0 12px 40px ${cat.color}33, 0 0 0 2px rgba(255,255,255,0.2)`
          : `0 4px 16px ${cat.color}22, var(--shadow-sm)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        transition: isDragging ? 'box-shadow 0.2s' : 'top 0.3s var(--ease-out), box-shadow 0.2s',
        opacity: isDragging ? 0.95 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
      }}
    >
      {/* Drag handle */}
      <div style={{
        position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
        width: 24, height: 3, borderRadius: 2,
        background: 'rgba(255,255,255,0.3)', pointerEvents: 'none',
      }} />

      {/* Edit button */}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(act); }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: 6, right: 32, background: 'rgba(255,255,255,0.2)',
          border: 'none', borderRadius: 7, width: 22, height: 22,
          color: '#fff', fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          backdropFilter: 'blur(4px)',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </button>

      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(act.id); }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: 6, right: 6, background: 'rgba(255,255,255,0.2)',
          border: 'none', borderRadius: 7, width: 22, height: 22,
          color: '#fff', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          backdropFilter: 'blur(4px)',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div style={{
        fontFamily: 'var(--font-display)', fontSize: height > 55 ? 14 : 12,
        fontWeight: 700, color: '#fff', lineHeight: 1.25, paddingRight: 56, marginTop: 4,
      }}>
        {act.title}
      </div>
      {height > 55 && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.75)',
          marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          fontWeight: 500,
        }}>
          {act.location}
        </div>
      )}
      {height > 75 && (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 600 }}>
          {formatTime(sh, sm)} – {formatTime(endHour, endMin)}
        </div>
      )}
    </div>
  );
}
