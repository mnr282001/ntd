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
        position: 'absolute', left: '4px', right: '0', zIndex: isDragging ? 50 : 10,
        top: `${displayTop}px`, height: `${height}px`,
        background: cat.gradient, borderRadius: '14px',
        padding: height > 60 ? '10px 14px' : '6px 14px',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        animation: isDragging ? 'none' : 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both',
        boxShadow: isDragging
          ? `0 12px 40px ${cat.color}55, 0 0 0 2px ${cat.color}88`
          : `0 4px 16px ${cat.color}33`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        transition: isDragging ? 'box-shadow 0.2s' : 'top 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s',
        opacity: isDragging ? 0.95 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
      }}
    >
      {/* Drag handle */}
      <div style={{
        position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)',
        width: '24px', height: '3px', borderRadius: '2px',
        background: 'rgba(255,255,255,0.25)', pointerEvents: 'none',
      }} />

      {/* Edit button */}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(act); }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: '6px', right: '34px', background: 'rgba(0,0,0,0.3)',
          border: 'none', borderRadius: '8px', width: '22px', height: '22px',
          color: 'rgba(255,255,255,0.7)', fontSize: '11px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}
      >✏️</button>

      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(act.id); }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: '6px', right: '8px', background: 'rgba(0,0,0,0.3)',
          border: 'none', borderRadius: '8px', width: '22px', height: '22px',
          color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}
      >×</button>

      <div style={{
        fontFamily: 'var(--font-display)', fontSize: height > 55 ? '14px' : '12px',
        fontWeight: 700, color: '#fff', lineHeight: 1.25, paddingRight: '56px', marginTop: '4px',
      }}>
        {act.title}
      </div>
      {height > 55 && (
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.7)',
          marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          📍 {act.location}
        </div>
      )}
      {height > 75 && (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
          {formatTime(sh, sm)} – {formatTime(endHour, endMin)}
        </div>
      )}
    </div>
  );
}
