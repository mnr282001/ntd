import { useState, useEffect, useRef, useCallback } from 'react';
import { HOURS, HOUR_HEIGHT, formatTime, minutesToTime } from '../lib/constants.js';
import DraggableBlock from './DraggableBlock.jsx';
import AddEditModal from './AddEditModal.jsx';

export default function CalendarView({ activities, onAdd, onRemove, onUpdate, onUpdateTime, planName, setPlanName, planDate, setPlanDate, onShare, onLoadSample, shareSlug }) {
  const [modalState, setModalState] = useState(null); // null | { mode: 'add', hour } | { mode: 'edit', stop }
  const scrollRef = useRef(null);
  const now = new Date();
  const currentHour = now.getHours();

  // Drag state
  const [dragId, setDragId] = useState(null);
  const [ghostTop, setGhostTop] = useState(null);
  const dragStartY = useRef(0);
  const dragStartTop = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      const target = Math.max(0, (Math.min(currentHour, 10) - 6) * HOUR_HEIGHT);
      scrollRef.current.scrollTop = target;
    }
  }, []);

  const handleDragStart = useCallback((id, clientY, origTop) => {
    setDragId(id);
    setGhostTop(origTop);
    dragStartY.current = clientY;
    dragStartTop.current = origTop;
  }, []);

  const handleDragMove = useCallback((clientY) => {
    if (dragId === null) return;
    const delta = clientY - dragStartY.current;
    const newTop = Math.max(0, Math.min(HOURS.length * HOUR_HEIGHT - 44, dragStartTop.current + delta));
    setGhostTop(newTop);
  }, [dragId]);

  const handleDragEnd = useCallback(() => {
    if (dragId === null || ghostTop === null) return;
    const totalMinutes = ((ghostTop / HOUR_HEIGHT) + 6) * 60;
    const { startHour, startMin } = minutesToTime(totalMinutes);
    onUpdateTime(dragId, startHour, startMin);
    setDragId(null);
    setGhostTop(null);
  }, [dragId, ghostTop, onUpdateTime]);

  useEffect(() => {
    if (dragId === null) return;
    const onMove = (e) => { e.preventDefault(); handleDragMove(e.clientY); };
    const onUp = () => handleDragEnd();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragId, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (dragId === null) return;
    const onMove = (e) => { e.preventDefault(); handleDragMove(e.touches[0].clientY); };
    const onEnd = () => handleDragEnd();
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); window.removeEventListener('touchcancel', onEnd); };
  }, [dragId, handleDragMove, handleDragEnd]);

  const snapIndicator = dragId !== null && ghostTop !== null ? (() => {
    const totalMinutes = ((ghostTop / HOUR_HEIGHT) + 6) * 60;
    const { startHour, startMin } = minutesToTime(totalMinutes);
    return { time: formatTime(startHour, startMin), top: ((startHour - 6) * 60 + startMin) / 60 * HOUR_HEIGHT };
  })() : null;

  const handleModalSave = (data) => {
    if (modalState?.mode === 'edit') {
      onUpdate(data.id, data);
    } else {
      onAdd({ ...data, id: Date.now() });
    }
  };

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50, padding: '14px 16px',
        background: 'rgba(8,8,12,0.88)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📝</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, background: 'linear-gradient(135deg, #ff6b35, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Note That Down</span>
        </div>
        {activities.length > 0 && (
          <button onClick={onShare} style={{
            padding: '9px 20px', borderRadius: '20px', border: 'none',
            background: 'linear-gradient(135deg, #ff6b35, #ff8f5e)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 2px 12px var(--accent-glow)', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Share <span style={{ fontSize: '15px' }}>↗</span>
          </button>
        )}
      </div>

      {/* Plan name & date */}
      <div style={{ padding: '16px 16px 0', animation: 'fadeIn 0.4s ease' }}>
        <input
          value={planName} onChange={(e) => setPlanName(e.target.value)}
          placeholder="Name your plan..."
          style={{
            background: 'none', border: 'none', padding: '0 0 8px 0', marginBottom: '6px',
            fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.02em', width: '100%',
            borderBottom: '1px solid transparent',
          }}
          onFocus={(e) => (e.target.style.borderBottomColor = 'rgba(255,107,53,0.3)')}
          onBlur={(e) => (e.target.style.borderBottomColor = 'transparent')}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '13px', width: 'auto' }}
          />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-faint)' }}>
            {activities.length} stop{activities.length !== 1 ? 's' : ''} planned
          </span>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '14px 16px 0' }} />

      {/* Calendar body */}
      <div ref={scrollRef} className="scroll-hide" style={{
        overflowY: dragId ? 'hidden' : 'auto',
        height: 'calc(100vh - 168px)', position: 'relative',
      }}>
        <div style={{ position: 'relative', marginLeft: '56px', marginRight: '12px', paddingBottom: '100px' }}>
          {HOURS.map((h) => (
            <div key={h} onClick={() => { if (!dragId) setModalState({ mode: 'add', hour: h }); }} style={{
              position: 'absolute', left: 0, right: 0,
              top: `${(h - 6) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px`,
              borderTop: '1px solid var(--border)', cursor: dragId ? 'grabbing' : 'pointer',
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => { if (!dragId) e.currentTarget.style.background = 'rgba(255,107,53,0.025)'; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            />
          ))}

          {HOURS.map((h) => (
            <div key={`l${h}`} style={{
              position: 'absolute', top: `${(h - 6) * HOUR_HEIGHT - 7}px`,
              left: '-52px', width: '44px', textAlign: 'right',
              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
              color: 'var(--text-faint)', pointerEvents: 'none', userSelect: 'none',
            }}>
              {formatTime(h)}
            </div>
          ))}

          {currentHour >= 6 && currentHour <= 23 && (
            <div style={{
              position: 'absolute', left: '-8px', right: 0, zIndex: 5, pointerEvents: 'none',
              top: `${(currentHour - 6) * HOUR_HEIGHT + (now.getMinutes() / 60) * HOUR_HEIGHT}px`,
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4444', flexShrink: 0 }} />
              <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, #ff4444 0%, transparent 100%)' }} />
            </div>
          )}

          {snapIndicator && (
            <div style={{
              position: 'absolute', left: '-52px', right: 0, zIndex: 45, pointerEvents: 'none',
              top: `${snapIndicator.top}px`, display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700,
                color: 'var(--accent)', background: 'rgba(255,107,53,0.15)',
                padding: '2px 8px', borderRadius: '6px', marginRight: '4px', whiteSpace: 'nowrap',
              }}>
                {snapIndicator.time}
              </div>
              <div style={{ flex: 1, height: '1.5px', background: 'var(--accent)', opacity: 0.4 }} />
            </div>
          )}

          {activities.map((act) => (
            <DraggableBlock
              key={act.id} act={act} onRemove={onRemove}
              onEdit={(a) => setModalState({ mode: 'edit', stop: a })}
              onDragStart={handleDragStart}
              isDragging={dragId === act.id}
              ghostTop={dragId === act.id ? ghostTop : null}
            />
          ))}

          <div style={{ height: `${HOURS.length * HOUR_HEIGHT}px`, pointerEvents: 'none' }} />
        </div>

        {activities.length === 0 && (
          <div style={{
            position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, -50%)',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '10px', animation: 'shimmer 2.5s ease infinite' }}>👆</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-faint)', lineHeight: 1.6 }}>
              Tap a time slot to add a stop<br />or use the + button
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <div style={{ position: 'fixed', bottom: '28px', right: 'max(20px, calc((100vw - 430px)/2 + 20px))', zIndex: 100 }}>
        <button onClick={() => setModalState({ mode: 'add', hour: 12 })} style={{
          width: '56px', height: '56px', borderRadius: '18px', border: 'none',
          background: 'linear-gradient(135deg, #ff6b35, #ff8f5e)', color: '#fff',
          fontSize: '28px', fontWeight: 300, cursor: 'pointer',
          boxShadow: '0 6px 24px var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: activities.length === 0 ? 'pulse 2.5s ease infinite' : 'none',
        }}>+</button>
      </div>

      {activities.length === 0 && (
        <div style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(calc(-50% - 20px))', zIndex: 100, animation: 'fadeIn 0.6s ease 0.5s both' }}>
          <button onClick={onLoadSample} style={{
            padding: '10px 20px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            color: 'var(--text-dim)', fontFamily: 'var(--font-body)', fontSize: '13px',
            fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap',
          }}>
            Load sample plan →
          </button>
        </div>
      )}

      {activities.length > 0 && activities.length <= 2 && !dragId && (
        <div style={{
          position: 'fixed', bottom: '92px', right: 'max(20px, calc((100vw - 430px)/2 + 20px))', zIndex: 99,
          background: 'rgba(20,18,26,0.9)', border: '1px solid var(--border-hover)',
          borderRadius: '12px', padding: '8px 12px',
          fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-dim)',
          backdropFilter: 'blur(10px)', animation: 'fadeIn 1s ease 1.5s both',
        }}>
          ↕ Drag to reorder · Tap ✏️ to edit
        </div>
      )}

      {modalState && (
        <AddEditModal
          hour={modalState.mode === 'add' ? modalState.hour : undefined}
          stop={modalState.mode === 'edit' ? modalState.stop : undefined}
          onSave={handleModalSave}
          onDelete={onRemove}
          onClose={() => setModalState(null)}
        />
      )}
    </>
  );
}
