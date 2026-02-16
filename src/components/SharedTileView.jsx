import { useState, useRef, useCallback, useEffect } from 'react';
import { CATEGORIES, EMOJI_REACTIONS, formatTime, formatDate, getShareUrl } from '../lib/constants.js';
import { downloadICS, addToGoogleCalendar } from '../lib/calendar.js';

function SwipeCard({ activity, reactions, myReactions, onReact, stackPosition, onSwipe, canSwipeLeft, canSwipeRight }) {
  const cat = CATEGORIES[activity.category] || CATEGORIES.activity;
  const sh = activity.start_hour ?? activity.startHour;
  const sm = activity.start_min ?? activity.startMin ?? 0;
  const endH = Math.floor(sh + (sm + activity.duration) / 60);
  const endM = (sm + activity.duration) % 60;
  const actReactions = reactions[activity.id] || {};
  const mySet = myReactions[activity.id] || new Set();
  const isTop = stackPosition === 'top';

  const [renderOffset, setRenderOffset] = useState(0);
  const [exitDir, setExitDir] = useState(null);
  const dragState = useRef({ active: false, startX: 0, startY: 0, dx: 0, locked: false });
  const cardRef = useRef(null);

  useEffect(() => {
    if (!isTop) return;
    const el = cardRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (exitDir) return;
      const t = e.touches[0];
      dragState.current = { active: true, startX: t.clientX, startY: t.clientY, dx: 0, locked: false };
    };

    const onTouchMove = (e) => {
      const ds = dragState.current;
      if (!ds.active) return;
      const t = e.touches[0];
      const dx = t.clientX - ds.startX;
      const dy = t.clientY - ds.startY;

      if (!ds.locked) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          ds.locked = true;
          ds.isHorizontal = Math.abs(dx) > Math.abs(dy);
        }
        return;
      }

      if (!ds.isHorizontal) { ds.active = false; setRenderOffset(0); return; }

      e.preventDefault();
      ds.dx = dx;
      setRenderOffset(dx);
    };

    const onTouchEnd = () => {
      const ds = dragState.current;
      if (!ds.active) return;
      ds.active = false;
      const dx = ds.dx;
      const dir = dx > 0 ? 'right' : 'left';
      const canGo = dir === 'right' ? canSwipeRight : canSwipeLeft;
      if (Math.abs(dx) > 80 && canGo) {
        setExitDir(dir);
        setTimeout(() => onSwipe(dir), 280);
      } else {
        setRenderOffset(0);
      }
    };

    const onMouseDown = (e) => {
      if (exitDir) return;
      e.preventDefault();
      dragState.current = { active: true, startX: e.clientX, startY: e.clientY, dx: 0, locked: true, isHorizontal: true };
    };

    const onMouseMove = (e) => {
      const ds = dragState.current;
      if (!ds.active) return;
      const dx = e.clientX - ds.startX;
      ds.dx = dx;
      setRenderOffset(dx);
    };

    const onMouseUp = () => {
      const ds = dragState.current;
      if (!ds.active) return;
      ds.active = false;
      const dx = ds.dx;
      const dir = dx > 0 ? 'right' : 'left';
      const canGo = dir === 'right' ? canSwipeRight : canSwipeLeft;
      if (Math.abs(dx) > 80 && canGo) {
        setExitDir(dir);
        setTimeout(() => onSwipe(dir), 280);
      } else {
        setRenderOffset(0);
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isTop, exitDir, onSwipe, canSwipeLeft, canSwipeRight]);

  const isDragging = dragState.current.active;
  const rotation = (renderOffset / 22).toFixed(1);

  let transform, transition, zIndex, opacity;
  const ease = 'transform 0.4s var(--ease-out), opacity 0.4s ease';

  if (exitDir) {
    transform = `translateX(${exitDir === 'right' ? '120%' : '-120%'}) rotate(${exitDir === 'right' ? '20' : '-20'}deg)`;
    transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1)';
    zIndex = 10;
    opacity = 1;
  } else if (isTop) {
    transform = `translateX(${renderOffset}px) rotate(${rotation}deg)`;
    transition = renderOffset !== 0 ? 'none' : ease;
    zIndex = 10;
    opacity = 1;
  } else if (stackPosition === 'prev') {
    transform = 'translateX(-14px) translateY(6px) scale(0.96) rotate(-1.5deg)';
    transition = ease;
    zIndex = 4;
    opacity = 0.5;
  } else if (stackPosition === 'next-1') {
    transform = 'translateX(14px) translateY(6px) scale(0.96) rotate(1.5deg)';
    transition = ease;
    zIndex = 5;
    opacity = 0.6;
  } else {
    transform = 'translateX(24px) translateY(12px) scale(0.92) rotate(3deg)';
    transition = ease;
    zIndex = 3;
    opacity = 0.35;
  }

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute', inset: 0,
        borderRadius: 24, overflow: 'hidden',
        background: cat.gradient,
        transform, transition, zIndex, opacity,
        cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none', WebkitUserSelect: 'none',
        touchAction: 'none',
        boxShadow: isTop ? 'var(--shadow-xl)' : 'var(--shadow-md)',
        pointerEvents: isTop ? 'auto' : 'none',
      }}
    >
      {/* Decorative shapes */}
      <div style={{ position: 'absolute', top: '-20%', right: '-15%', width: '55%', height: '55%', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: '35%', height: '40%', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', pointerEvents: 'none' }} />

      {/* Swipe labels */}
      {isTop && Math.abs(renderOffset) > 40 && (
        <div style={{
          position: 'absolute', top: 24,
          ...(renderOffset > 0 ? { left: 20 } : { right: 20 }),
          padding: '7px 16px', borderRadius: 'var(--radius-sm)',
          border: `2.5px solid ${renderOffset > 0 ? '#fff' : '#fff'}`,
          color: '#fff',
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800,
          letterSpacing: '0.04em',
          transform: `rotate(${renderOffset > 0 ? '-10' : '10'}deg)`,
          opacity: Math.min(1, Math.abs(renderOffset) / 120),
          zIndex: 20, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)',
        }}>
          {renderOffset > 0 ? 'NEXT' : 'PREV'}
        </div>
      )}

      {/* Card content */}
      <div style={{
        position: 'relative', zIndex: 1, height: '100%',
        display: 'flex', flexDirection: 'column', padding: '24px 22px',
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '7px 14px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: 16 }}>{cat.emoji}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {cat.label}
            </span>
          </div>
          <div style={{
            padding: '7px 13px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            {formatTime(sh, sm)} – {formatTime(endH, endM)}
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          {activity.title}
        </div>

        {/* Location */}
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.75)',
          display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: 'inherit', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.3)', textUnderlineOffset: '2px' }}>{activity.location}</a>
        </div>

        {/* Notes */}
        {activity.notes && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.55)',
            fontStyle: 'italic', lineHeight: 1.5, marginTop: 10, fontWeight: 400,
          }}>
            {activity.notes}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Reaction counts */}
        {Object.keys(actReactions).length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {Object.entries(actReactions).map(([emoji, count]) => (
              <span key={emoji} onClick={(e) => { e.stopPropagation(); onReact(activity.id, emoji); }} style={{
                padding: '5px 11px', borderRadius: 'var(--radius-full)',
                background: mySet.has(emoji) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
                fontSize: 13, color: '#fff', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600,
                border: mySet.has(emoji) ? '1.5px solid rgba(255,255,255,0.35)' : '1.5px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(4px)',
              }}>
                {emoji} {count}
              </span>
            ))}
          </div>
        )}

        {/* Reaction picker */}
        <div style={{
          display: 'flex', gap: 2, justifyContent: 'center',
          padding: '7px 10px', borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
        }}>
          {EMOJI_REACTIONS.map((emoji) => (
            <button key={emoji} onClick={(e) => { e.stopPropagation(); onReact(activity.id, emoji); }} style={{
              background: mySet.has(emoji) ? 'rgba(255,255,255,0.18)' : 'none',
              border: 'none', fontSize: 21, cursor: 'pointer',
              padding: '5px 7px', borderRadius: 'var(--radius-sm)', lineHeight: 1,
              transition: 'transform 0.15s var(--ease-spring)',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowButton({ direction, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 44, height: 44, borderRadius: '50%',
        background: disabled ? 'var(--surface-dim)' : 'var(--surface)',
        border: `1.5px solid ${disabled ? 'var(--border)' : 'var(--border-hover)'}`,
        color: disabled ? 'var(--text-faint)' : 'var(--text-secondary)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 18, fontWeight: 700,
        transition: 'all 0.2s var(--ease-smooth)',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
        boxShadow: disabled ? 'none' : 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; } }}
      onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
    >
      {direction === 'left' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      )}
    </button>
  );
}

export default function SharedTileView({ stops, reactions, myReactions, onReact, planName, planDate, shareSlug }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [calMenuOpen, setCalMenuOpen] = useState(false);

  const sorted = [...stops].sort((a, b) => {
    const aMin = (a.start_hour ?? a.startHour) * 60 + (a.start_min ?? a.startMin ?? 0);
    const bMin = (b.start_hour ?? b.startHour) * 60 + (b.start_min ?? b.startMin ?? 0);
    return aMin - bMin;
  });

  const handleSwipe = useCallback((dir) => {
    setCurrentIndex((prev) => {
      if (dir === 'right') return Math.min(prev + 1, sorted.length - 1);
      if (dir === 'left') return Math.max(prev - 1, 0);
      return prev;
    });
  }, [sorted.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSwipe]);

  const handleCopy = () => {
    const url = shareSlug ? getShareUrl(shareSlug) : window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canLeft = currentIndex > 0;
  const canRight = currentIndex < sorted.length - 1;

  const stackCards = [];
  if (currentIndex > 0) stackCards.push({ stop: sorted[currentIndex - 1], position: 'prev' });
  if (sorted[currentIndex]) stackCards.push({ stop: sorted[currentIndex], position: 'top' });
  if (currentIndex + 1 < sorted.length) stackCards.push({ stop: sorted[currentIndex + 1], position: 'next-1' });
  if (currentIndex + 2 < sorted.length) stackCards.push({ stop: sorted[currentIndex + 2], position: 'next-2' });

  return (
    <div className="shared-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <div className="shared-header" style={{
        width: '100%', maxWidth: 600, padding: '16px 20px 12px',
        animation: 'slideUp 0.4s var(--ease-out) 0.05s both',
      }}>
        {/* Top bar: logo left, copy link right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-soft)', border: '1px solid rgba(232, 89, 12, 0.12)',
          }}>
            <span style={{ fontSize: 13 }}>{'\u{1F4DD}'}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>Note That Down</span>
          </div>
          <button onClick={handleCopy} style={{
            background: copied ? 'rgba(16,185,129,0.08)' : 'var(--surface)',
            border: `1.5px solid ${copied ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-xs)', padding: '7px 14px',
            color: copied ? '#059669' : 'var(--text-secondary)',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s', boxShadow: 'var(--shadow-xs)',
          }}>
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        {/* Plan title */}
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
          color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 8,
        }}>
          {planName || 'Untitled Plan'}
        </div>

        {/* Date & stops */}
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-dim)', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        }}>
          <span>{planDate ? formatDate(planDate) : 'Date TBD'}</span>
          <span style={{ color: 'var(--text-faint)' }}>&middot;</span>
          <span>{sorted.length} stops</span>
        </div>

        {/* Add to Calendar */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button onClick={() => setCalMenuOpen((v) => !v)} style={{
            background: 'none', border: 'none', padding: 0,
            color: 'var(--accent)', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Add to Calendar
          </button>
          {calMenuOpen && (
            <>
              <div onClick={() => setCalMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 6,
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: 4,
                boxShadow: 'var(--shadow-lg)', zIndex: 50,
                minWidth: 190, animation: 'fadeIn 0.15s ease',
              }}>
                <button onClick={() => { downloadICS(planName, planDate, stops); setCalMenuOpen(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 14px', border: 'none', borderRadius: 'var(--radius-xs)',
                  background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-dim)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{'\uF8FF'}</span>
                  <span>Apple Calendar</span>
                </button>
                <button onClick={() => { addToGoogleCalendar(planDate, stops); setCalMenuOpen(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '10px 14px', border: 'none', borderRadius: 'var(--radius-xs)',
                  background: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-dim)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  <span>Google Calendar</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex', gap: 6, justifyContent: 'center', padding: '8px 0 16px',
        animation: 'fadeIn 0.4s ease 0.2s both',
      }}>
        {sorted.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} style={{
            width: i === currentIndex ? 24 : 8, height: 8,
            borderRadius: 4, border: 'none', cursor: 'pointer',
            background: i === currentIndex ? 'var(--accent)' : i < currentIndex ? 'rgba(232, 89, 12, 0.25)' : 'var(--border-hover)',
            transition: 'all 0.3s var(--ease-out)',
          }} />
        ))}
      </div>

      {/* Card area */}
      <div className="shared-card-area" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 16, width: '100%', padding: '0 16px',
        flex: 1,
        animation: 'scaleIn 0.5s var(--ease-out) 0.15s both',
      }}>
        <div className="desktop-arrows">
          <ArrowButton direction="left" disabled={!canLeft} onClick={() => handleSwipe('left')} />
        </div>

        <div className="shared-card-stack" style={{ position: 'relative', flex: 1, width: '100%' }}>
          {stackCards.map(({ stop, position }) => (
            <SwipeCard
              key={`${stop.id}-${currentIndex}`}
              activity={stop}
              reactions={reactions}
              myReactions={myReactions}
              onReact={onReact}
              stackPosition={position}
              onSwipe={handleSwipe}
              canSwipeLeft={canLeft}
              canSwipeRight={canRight}
            />
          ))}

          {sorted.length === 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
              fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-dim)', fontWeight: 500,
            }}>
              No stops in this plan yet
            </div>
          )}
        </div>

        <div className="desktop-arrows">
          <ArrowButton direction="right" disabled={!canRight} onClick={() => handleSwipe('right')} />
        </div>
      </div>

      {/* Bottom hint */}
      <div style={{
        textAlign: 'center', padding: '16px 20px 32px',
        fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-faint)', fontWeight: 500,
        animation: 'fadeIn 1s ease 0.8s both',
      }}>
        {sorted.length > 1 ? (
          <>
            <span className="mobile-hint">swipe to browse &middot; </span>
            <span className="desktop-hint">use arrows or keyboard &middot; </span>
            {currentIndex + 1} of {sorted.length}
          </>
        ) : (
          <>Tap emojis to react</>
        )}
      </div>
    </div>
  );
}
