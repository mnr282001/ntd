import { useState, useRef, useCallback, useEffect } from 'react';
import { CATEGORIES, EMOJI_REACTIONS, formatTime, formatDate, getShareUrl } from '../lib/constants.js';

function SwipeCard({ activity, reactions, myReactions, onReact, isTop, behindIndex, onSwipe }) {
  const cat = CATEGORIES[activity.category] || CATEGORIES.activity;
  const sh = activity.start_hour ?? activity.startHour;
  const sm = activity.start_min ?? activity.startMin ?? 0;
  const endH = Math.floor(sh + (sm + activity.duration) / 60);
  const endM = (sm + activity.duration) % 60;
  const actReactions = reactions[activity.id] || {};
  const mySet = myReactions[activity.id] || new Set();

  // Swipe drag state
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDir, setExitDir] = useState(null);
  const startX = useRef(0);
  const dragging = useRef(false);

  const handleStart = useCallback((clientX) => {
    if (!isTop || exitDir) return;
    startX.current = clientX;
    dragging.current = true;
    setIsDragging(true);
  }, [isTop, exitDir]);

  const handleMove = useCallback((clientX) => {
    if (!dragging.current) return;
    setOffset(clientX - startX.current);
  }, []);

  const handleEnd = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    if (Math.abs(offset) > 100) {
      const dir = offset > 0 ? 'right' : 'left';
      setExitDir(dir);
      setTimeout(() => onSwipe(dir), 280);
    } else {
      setOffset(0);
    }
  }, [offset, onSwipe]);

  // Window listeners for drag
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => handleMove(e.clientX ?? e.touches?.[0]?.clientX);
    const onEnd = () => handleEnd();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const rotation = (offset / 20).toFixed(1);

  let transform, cardOpacity, transition;
  if (exitDir) {
    transform = `translateX(${exitDir === 'right' ? '120%' : '-120%'}) rotate(${exitDir === 'right' ? '25' : '-25'}deg)`;
    cardOpacity = 0;
    transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease';
  } else if (isTop) {
    transform = `translateX(${offset}px) rotate(${rotation}deg)`;
    cardOpacity = 1;
    transition = isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
  } else {
    const scale = Math.max(0.9, 1 - behindIndex * 0.05);
    const yOff = behindIndex * 14;
    transform = `translateY(${yOff}px) scale(${scale})`;
    cardOpacity = Math.max(0.5, 1 - behindIndex * 0.2);
    transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease';
  }

  return (
    <div
      onMouseDown={isTop ? (e) => { e.preventDefault(); handleStart(e.clientX); } : undefined}
      onTouchStart={isTop ? (e) => handleStart(e.touches[0].clientX) : undefined}
      style={{
        position: 'absolute', inset: 0,
        borderRadius: '28px', overflow: 'hidden',
        background: cat.gradient,
        transform, opacity: cardOpacity, transition,
        zIndex: isTop ? 10 : 5 - behindIndex,
        cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none', WebkitUserSelect: 'none',
        touchAction: 'pan-y',
        boxShadow: isTop ? '0 20px 60px rgba(0,0,0,0.45)' : '0 10px 30px rgba(0,0,0,0.2)',
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-20%', right: '-15%', width: '60%', height: '60%', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '40%', height: '45%', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />

      {/* Swipe indicator labels */}
      {isTop && Math.abs(offset) > 40 && (
        <div style={{
          position: 'absolute', top: '28px',
          ...(offset > 0 ? { left: '24px' } : { right: '24px' }),
          padding: '8px 18px', borderRadius: '12px',
          border: `2.5px solid ${offset > 0 ? '#10b981' : '#f472b6'}`,
          color: offset > 0 ? '#10b981' : '#f472b6',
          fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
          letterSpacing: '0.05em',
          transform: `rotate(${offset > 0 ? '-12' : '12'}deg)`,
          opacity: Math.min(1, Math.abs(offset) / 120),
          zIndex: 20, pointerEvents: 'none',
        }}>
          {offset > 0 ? 'NEXT →' : '← PREV'}
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

  const handleCopy = () => {
    const url = shareSlug ? getShareUrl(shareSlug) : window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const visibleCards = sorted.slice(currentIndex, currentIndex + 3);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ padding: '16px 4px 12px', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>
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

      {/* Card stack */}
      <div style={{
        position: 'relative', flex: 1, minHeight: '440px', maxHeight: '540px',
        marginBottom: '16px',
        animation: 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both',
      }}>
        {visibleCards.map((stop, i) => (
          <SwipeCard
            key={`${stop.id}-${currentIndex}`}
            activity={stop}
            reactions={reactions}
            myReactions={myReactions}
            onReact={onReact}
            isTop={i === 0}
            behindIndex={i}
            onSwipe={handleSwipe}
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

      {/* Bottom hint */}
      <div style={{
        textAlign: 'center', padding: '0 20px 32px',
        fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-faint)',
        animation: 'fadeIn 1s ease 0.8s both',
      }}>
        {sorted.length > 1 ? (
          <>← swipe to browse → · {currentIndex + 1} of {sorted.length}</>
        ) : (
          <>Tap emojis to react 💬</>
        )}
      </div>
    </div>
  );
}
