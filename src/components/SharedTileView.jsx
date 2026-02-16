import { useState, useRef, useCallback, useEffect } from 'react';
import { CATEGORIES, EMOJI_REACTIONS, formatTime, formatDate, getShareUrl } from '../lib/constants.js';

// stackPosition: 'prev' | 'top' | 'next-1' | 'next-2'
function SwipeCard({ activity, reactions, myReactions, onReact, stackPosition, onSwipe, canSwipeLeft, canSwipeRight }) {
  const cat = CATEGORIES[activity.category] || CATEGORIES.activity;
  const sh = activity.start_hour ?? activity.startHour;
  const sm = activity.start_min ?? activity.startMin ?? 0;
  const endH = Math.floor(sh + (sm + activity.duration) / 60);
  const endM = (sm + activity.duration) % 60;
  const actReactions = reactions[activity.id] || {};
  const mySet = myReactions[activity.id] || new Set();
  const isTop = stackPosition === 'top';

  // Swipe drag state — all mutable values in refs to avoid stale closures
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
  const rotation = (renderOffset / 20).toFixed(1);

  let transform, transition, zIndex, opacity;
  const ease = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease';

  if (exitDir) {
    transform = `translateX(${exitDir === 'right' ? '120%' : '-120%'}) rotate(${exitDir === 'right' ? '25' : '-25'}deg)`;
    transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1)';
    zIndex = 10;
    opacity = 1;
  } else if (isTop) {
    transform = `translateX(${renderOffset}px) rotate(${rotation}deg)`;
    transition = renderOffset !== 0 ? 'none' : ease;
    zIndex = 10;
    opacity = 1;
  } else if (stackPosition === 'prev') {
    // Previous card peeks from the left
    transform = 'translateX(-18px) translateY(6px) scale(0.95) rotate(-2deg)';
    transition = ease;
    zIndex = 4;
    opacity = 0.6;
  } else if (stackPosition === 'next-1') {
    // First next card peeks from the right
    transform = 'translateX(18px) translateY(6px) scale(0.95) rotate(2deg)';
    transition = ease;
    zIndex = 5;
    opacity = 0.7;
  } else {
    // Second next card peeks further right
    transform = 'translateX(32px) translateY(12px) scale(0.90) rotate(3.5deg)';
    transition = ease;
    zIndex = 3;
    opacity = 0.4;
  }

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute', inset: 0,
        borderRadius: '28px', overflow: 'hidden',
        background: cat.gradient,
        transform, transition, zIndex, opacity,
        cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none', WebkitUserSelect: 'none',
        touchAction: 'none',
        boxShadow: isTop ? '0 20px 60px rgba(0,0,0,0.45)' : '0 8px 24px rgba(0,0,0,0.3)',
        pointerEvents: isTop ? 'auto' : 'none',
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-20%', right: '-15%', width: '60%', height: '60%', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '40%', height: '45%', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />

      {/* Swipe indicator labels */}
      {isTop && Math.abs(renderOffset) > 40 && (
        <div style={{
          position: 'absolute', top: '28px',
          ...(renderOffset > 0 ? { left: '24px' } : { right: '24px' }),
          padding: '8px 18px', borderRadius: '12px',
          border: `2.5px solid ${renderOffset > 0 ? '#10b981' : '#f472b6'}`,
          color: renderOffset > 0 ? '#10b981' : '#f472b6',
          fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
          letterSpacing: '0.05em',
          transform: `rotate(${renderOffset > 0 ? '-12' : '12'}deg)`,
          opacity: Math.min(1, Math.abs(renderOffset) / 120),
          zIndex: 20, pointerEvents: 'none',
        }}>
          {renderOffset > 0 ? 'NEXT →' : '← PREV'}
        </div>
      )}

      {/* Card content */}
      <div style={{
        position: 'relative', zIndex: 1, height: '100%',
        display: 'flex', flexDirection: 'column', padding: '28px 24px',
      }}>
        {/* Top row: category + time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '14px',
            background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              {cat.label}
            </span>
          </div>
          <div style={{
            padding: '8px 14px', borderRadius: '12px',
            background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)',
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700,
            color: 'rgba(255,255,255,0.85)',
          }}>
            {formatTime(sh, sm)} – {formatTime(endH, endM)}
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800,
          color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '14px',
        }}>
          {activity.title}
        </div>

        {/* Location */}
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(255,255,255,0.7)',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          📍 {activity.location}
        </div>

        {/* Notes */}
        {activity.notes && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.5)',
            fontStyle: 'italic', lineHeight: 1.5, marginTop: '12px',
          }}>
            💡 {activity.notes}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Reactions display */}
        {Object.keys(actReactions).length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {Object.entries(actReactions).map(([emoji, count]) => (
              <span key={emoji} onClick={(e) => { e.stopPropagation(); onReact(activity.id, emoji); }} style={{
                padding: '5px 12px', borderRadius: '14px',
                background: mySet.has(emoji) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)',
                fontSize: '14px', color: 'rgba(255,255,255,0.95)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, backdropFilter: 'blur(4px)',
                border: mySet.has(emoji) ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.1)',
              }}>
                {emoji} {count}
              </span>
            ))}
          </div>
        )}

        {/* Reaction picker — always visible at bottom */}
        <div style={{
          display: 'flex', gap: '4px', justifyContent: 'center',
          padding: '8px 12px', borderRadius: '20px',
          background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(10px)',
        }}>
          {EMOJI_REACTIONS.map((emoji) => (
            <button key={emoji} onClick={(e) => { e.stopPropagation(); onReact(activity.id, emoji); }} style={{
              background: mySet.has(emoji) ? 'rgba(255,255,255,0.15)' : 'none',
              border: 'none', fontSize: '22px', cursor: 'pointer',
              padding: '6px 8px', borderRadius: '12px', lineHeight: 1,
              transition: 'transform 0.15s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
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
        width: '48px', height: '48px', borderRadius: '50%',
        background: disabled ? 'var(--surface)' : 'rgba(255,107,53,0.12)',
        border: `1px solid ${disabled ? 'var(--border)' : 'rgba(255,107,53,0.25)'}`,
        color: disabled ? 'var(--text-faint)' : 'var(--accent)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: '20px', fontWeight: 700,
        transition: 'all 0.2s',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(255,107,53,0.2)'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = 'rgba(255,107,53,0.12)'; }}
    >
      {direction === 'left' ? '‹' : '›'}
    </button>
  );
}

export default function SharedTileView({ stops, reactions, myReactions, onReact, planName, planDate, shareSlug }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

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

  // Keyboard arrow support
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

  // Build stacked cards: prev (if exists) + current + next 1-2
  const stackCards = [];
  if (currentIndex > 0) {
    stackCards.push({ stop: sorted[currentIndex - 1], position: 'prev' });
  }
  if (sorted[currentIndex]) {
    stackCards.push({ stop: sorted[currentIndex], position: 'top' });
  }
  if (currentIndex + 1 < sorted.length) {
    stackCards.push({ stop: sorted[currentIndex + 1], position: 'next-1' });
  }
  if (currentIndex + 2 < sorted.length) {
    stackCards.push({ stop: sorted[currentIndex + 2], position: 'next-2' });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header — constrained width */}
      <div style={{
        width: '100%', maxWidth: '600px', padding: '16px 20px 12px',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px',
            background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)',
          }}>
            <span style={{ fontSize: '14px' }}>📝</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>Note That Down</span>
          </div>
          <button onClick={handleCopy} style={{
            background: copied ? 'rgba(16,185,129,0.15)' : 'var(--surface)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
            borderRadius: '10px', padding: '8px 14px',
            color: copied ? '#10b981' : 'var(--text-dim)',
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copied!' : '🔗 Copy link'}
          </button>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800,
          color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '8px',
        }}>
          {planName || 'Untitled Plan'}
        </div>

        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dim)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span>📅 {planDate ? formatDate(planDate) : 'Date TBD'}</span>
          <span style={{ color: 'var(--text-faint)' }}>·</span>
          <span>{sorted.length} stops</span>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex', gap: '6px', justifyContent: 'center', padding: '8px 0 16px',
        animation: 'fadeIn 0.4s ease 0.2s both',
      }}>
        {sorted.map((_, i) => (
          <button key={i} onClick={() => setCurrentIndex(i)} style={{
            width: i === currentIndex ? '24px' : '8px', height: '8px',
            borderRadius: '4px', border: 'none', cursor: 'pointer',
            background: i === currentIndex ? 'var(--accent)' : i < currentIndex ? 'rgba(255,107,53,0.3)' : 'var(--border-hover)',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          }} />
        ))}
      </div>

      {/* Card area with arrow buttons */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '16px', width: '100%', maxWidth: '700px', padding: '0 16px',
        flex: 1,
        animation: 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both',
      }}>
        {/* Left arrow — hidden on mobile via media query workaround */}
        <div className="desktop-arrows">
          <ArrowButton direction="left" disabled={!canLeft} onClick={() => handleSwipe('left')} />
        </div>

        {/* Card stack */}
        <div style={{
          position: 'relative', flex: 1, minHeight: '440px', maxHeight: '580px',
          maxWidth: '420px', width: '100%',
        }}>
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
              fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-dim)',
            }}>
              No stops in this plan yet
            </div>
          )}
        </div>

        {/* Right arrow */}
        <div className="desktop-arrows">
          <ArrowButton direction="right" disabled={!canRight} onClick={() => handleSwipe('right')} />
        </div>
      </div>

      {/* Bottom hint */}
      <div style={{
        textAlign: 'center', padding: '16px 20px 32px',
        fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-faint)',
        animation: 'fadeIn 1s ease 0.8s both',
      }}>
        {sorted.length > 1 ? (
          <>
            <span className="mobile-hint">← swipe to browse → · </span>
            <span className="desktop-hint">use arrows or keyboard ← → · </span>
            {currentIndex + 1} of {sorted.length}
          </>
        ) : (
          <>Tap emojis to react</>
        )}
      </div>
    </div>
  );
}
