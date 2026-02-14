import { useState } from 'react';
import { CATEGORIES, EMOJI_REACTIONS, formatTime } from '../lib/constants.js';

export default function TileCard({ activity, size, index, reactions, myReactions, onReact }) {
  const [showPicker, setShowPicker] = useState(false);
  const cat = CATEGORIES[activity.category] || CATEGORIES.activity;
  const sh = activity.start_hour ?? activity.startHour;
  const sm = activity.start_min ?? activity.startMin ?? 0;
  const actReactions = reactions[activity.id] || {};
  const mySet = myReactions[activity.id] || new Set();
  const hasReactions = Object.keys(actReactions).length > 0;
  const isWide = size === 'full' || size === 'twothird';
  const isTall = size === 'full';
  const endH = Math.floor(sh + (sm + activity.duration) / 60);
  const endM = (sm + activity.duration) % 60;

  return (
    <div onClick={() => setShowPicker(!showPicker)} style={{
      position: 'relative', borderRadius: '22px', overflow: 'hidden', cursor: 'pointer',
      background: cat.gradient,
      minHeight: isTall ? '210px' : '170px',
      padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      animation: `scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s both`,
      flex: size === 'full' ? '1 1 100%' : size === 'twothird' ? '2 1 62%' : size === 'third' ? '1 1 34%' : '1 1 47%',
    }}>
      <div style={{ position: 'absolute', top: '-25%', right: '-20%', width: '55%', height: '70%', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '35%', height: '50%', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', pointerEvents: 'none' }} />

      <div style={{
        position: 'absolute', top: '14px', right: '14px', fontSize: '20px',
        width: '36px', height: '36px', borderRadius: '11px',
        background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {cat.emoji}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', padding: '5px 11px', borderRadius: '9px',
          background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700,
          color: 'rgba(255,255,255,0.9)', marginBottom: '10px',
        }}>
          {formatTime(sh, sm)} – {formatTime(endH, endM)}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: isWide ? '19px' : '16px', fontWeight: 700,
          color: '#fff', lineHeight: 1.2, marginBottom: '5px', paddingRight: '36px',
        }}>
          {activity.title}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
          📍 {activity.location}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', paddingTop: '10px' }}>
        {activity.notes && (isWide || isTall) && (
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.5)',
            fontStyle: 'italic', marginBottom: hasReactions ? '8px' : '0', lineHeight: 1.4,
          }}>
            💡 {activity.notes}
          </div>
        )}
        {hasReactions && (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {Object.entries(actReactions).map(([emoji, count]) => (
              <span key={emoji} onClick={(e) => { e.stopPropagation(); onReact(activity.id, emoji); }} style={{
                padding: '3px 9px', borderRadius: '12px',
                background: mySet.has(emoji) ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.28)',
                fontSize: '13px', color: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 600, backdropFilter: 'blur(4px)',
                border: mySet.has(emoji) ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
              }}>
                {emoji} {count}
              </span>
            ))}
          </div>
        )}
      </div>

      {showPicker && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(20,18,26,0.95)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '22px', padding: '7px 10px', display: 'flex', gap: '2px', zIndex: 20,
          backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {EMOJI_REACTIONS.map((emoji) => (
            <button key={emoji} onClick={() => { onReact(activity.id, emoji); setShowPicker(false); }} style={{
              background: mySet.has(emoji) ? 'rgba(255,255,255,0.1)' : 'none',
              border: 'none', fontSize: '22px', cursor: 'pointer',
              padding: '6px 7px', borderRadius: '10px', lineHeight: 1,
            }}>
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
