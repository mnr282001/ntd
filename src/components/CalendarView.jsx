import { useState, useEffect, useRef, useCallback } from 'react';
import { HOURS, HOUR_HEIGHT, formatTime, minutesToTime } from '../lib/constants.js';
import DraggableBlock from './DraggableBlock.jsx';
import AddEditModal from './AddEditModal.jsx';

export default function CalendarView({ activities, onAdd, onRemove, onUpdate, onUpdateTime, planName, setPlanName, planDate, setPlanDate, onShare, onLoadSample, sharing }) {
  const [modalState, setModalState] = useState(null);
  const scrollRef = useRef(null);
  const now = new Date();
  const currentHour = now.getHours();

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
        position: 'sticky', top: 0, zIndex: 50, padding: '12px 16px',
        background: 'rgba(255, 253, 248, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>
            {'\u{1F4DD}'}
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.01em',
          }}>
            Note That Down
          </span>
        </div>
        {activities.length > 0 && (
          <button onClick={onShare} disabled={sharing} style={{
            padding: '8px 18px', borderRadius: 'var(--radius-full)', border: 'none',
            background: sharing ? 'var(--surface-dim)' : 'var(--accent-gradient)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
            cursor: sharing ? 'wait' : 'pointer',
            boxShadow: sharing ? 'none' : 'var(--shadow-warm)',
            display: 'flex', alignItems: 'center', gap: 6,
            opacity: sharing ? 0.6 : 1, transition: 'all 0.2s var(--ease-smooth)',
          }}>
            {sharing ? (
              <span style={{ color: 'var(--text-dim)' }}>Sharing...</span>
            ) : (
              <>
                Share
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Plan name & date */}
      <div style={{ padding: '16px 16px 0', animation: 'fadeIn 0.4s ease' }}>
        <input
          value={planName} onChange={(e) => setPlanName(e.target.value)}
          placeholder="Name your plan..."
          style={{
            background: 'none', border: 'none', padding: '0 0 8px 0', marginBottom: 6,
            fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.02em', width: '100%',
            borderBottom: '2px solid transparent',
            transition: 'border-color 0.2s',
            boxShadow: 'none',
          }}
          onFocus={(e) => (e.target.style.borderBottomColor = 'var(--accent)')}
          onBlur={(e) => (e.target.style.borderBottomColor = 'transparent')}
        />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)}
            style={{
              padding: '7px 12px', borderRadius: 'var(--radius-xs)', fontSize: 13,
              width: 'auto', fontWeight: 600, background: 'var(--surface-dim)',
              border: '1px solid var(--border)',
            }}
          />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', fontWeight: 500,
          }}>
            {activities.length} stop{activities.length !== 1 ? 's' : ''} planned
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '14px 16px 0' }} />

      {/* Calendar body */}
      <div ref={scrollRef} className="scroll-hide" style={{
        overflowY: dragId ? 'hidden' : 'auto',
        height: 'calc(100vh - 168px)', position: 'relative',
      }}>
        <div style={{ position: 'relative', marginLeft: 56, marginRight: 12, paddingBottom: 100 }}>
          {HOURS.map((h) => (
            <div key={h} onClick={() => { if (!dragId) setModalState({ mode: 'add', hour: h }); }} style={{
              position: 'absolute', left: 0, right: 0,
              top: `${(h - 6) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px`,
              borderTop: '1px solid var(--border)', cursor: dragId ? 'grabbing' : 'pointer',
              transition: 'background 0.15s',
            }}
              onMouseEnter={(e) => { if (!dragId) e.currentTarget.style.background = 'var(--accent-soft)'; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            />
          ))}

          {HOURS.map((h) => (
            <div key={`l${h}`} style={{
              position: 'absolute', top: `${(h - 6) * HOUR_HEIGHT - 7}px`,
              left: -52, width: 44, textAlign: 'right',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
              color: 'var(--text-faint)', pointerEvents: 'none', userSelect: 'none',
            }}>
              {formatTime(h)}
            </div>
          ))}

          {currentHour >= 6 && currentHour <= 23 && (
            <div style={{
              position: 'absolute', left: -8, right: 0, zIndex: 5, pointerEvents: 'none',
              top: `${(currentHour - 6) * HOUR_HEIGHT + (now.getMinutes() / 60) * HOUR_HEIGHT}px`,
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8590C', flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1.5, background: 'linear-gradient(90deg, #E8590C 0%, transparent 100%)' }} />
            </div>
          )}

          {snapIndicator && (
            <div style={{
              position: 'absolute', left: -52, right: 0, zIndex: 45, pointerEvents: 'none',
              top: `${snapIndicator.top}px`, display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                color: 'var(--accent)', background: 'var(--accent-soft)',
                padding: '2px 8px', borderRadius: 6, marginRight: 4, whiteSpace: 'nowrap',
              }}>
                {snapIndicator.time}
              </div>
              <div style={{ flex: 1, height: 1.5, background: 'var(--accent)', opacity: 0.3 }} />
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
            <div style={{ fontSize: 40, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6, fontWeight: 500 }}>
              Tap a time slot to add a stop<br />or use the + button
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="plan-fab" style={{ position: 'fixed', bottom: 28, zIndex: 100 }}>
        <button onClick={() => setModalState({ mode: 'add', hour: 12 })} style={{
          width: 56, height: 56, borderRadius: 18, border: 'none',
          background: 'var(--accent-gradient)', color: '#fff',
          fontSize: 26, fontWeight: 300, cursor: 'pointer',
          boxShadow: 'var(--shadow-warm), var(--shadow-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: activities.length === 0 ? 'pulse 2.5s ease infinite' : 'none',
          transition: 'transform 0.2s var(--ease-spring)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      {activities.length > 0 && activities.length <= 2 && !dragId && (
        <div className="plan-hint" style={{
          position: 'fixed', bottom: 92, zIndex: 99,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '8px 14px',
          fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-dim)', fontWeight: 500,
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 1s ease 1.5s both',
        }}>
          Drag to reorder · Double-tap to edit
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
