import { useState } from 'react';
import { TILE_PATTERNS, formatTime, formatDate, getShareUrl } from '../lib/constants.js';
import TileCard from './TileCard.jsx';

export default function SharedTileView({ stops, reactions, myReactions, onReact, planName, planDate, shareSlug, onBack }) {
  const [copied, setCopied] = useState(false);
  const sorted = [...stops].sort((a, b) => {
    const aMin = (a.start_hour ?? a.startHour) * 60 + (a.start_min ?? a.startMin ?? 0);
    const bMin = (b.start_hour ?? b.startHour) * 60 + (b.start_min ?? b.startMin ?? 0);
    return aMin - bMin;
  });

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const firstStart = first ? formatTime(first.start_hour ?? first.startHour, first.start_min ?? first.startMin ?? 0) : '';
  const lastEnd = last ? formatTime(
    Math.floor((last.start_hour ?? last.startHour) + ((last.start_min ?? last.startMin ?? 0) + last.duration) / 60),
    ((last.start_min ?? last.startMin ?? 0) + last.duration) % 60
  ) : '';

  const buildLayout = () => {
    const rows = []; let idx = 0, pat = 0;
    while (idx < sorted.length) {
      const rem = sorted.length - idx;
      let p = rem === 1 ? 'full' : rem === 2 ? 'half-half' : TILE_PATTERNS[pat % TILE_PATTERNS.length];
      if (p === 'full') { rows.push([{ act: sorted[idx], size: 'full' }]); idx++; }
      else if (p === 'half-half') { rows.push([{ act: sorted[idx], size: 'half' }, { act: sorted[idx + 1], size: 'half' }]); idx += 2; }
      else if (p === 'third-twothird' && rem >= 2) { rows.push([{ act: sorted[idx], size: 'third' }, { act: sorted[idx + 1], size: 'twothird' }]); idx += 2; }
      else if (p === 'twothird-third' && rem >= 2) { rows.push([{ act: sorted[idx], size: 'twothird' }, { act: sorted[idx + 1], size: 'third' }]); idx += 2; }
      else { rows.push([{ act: sorted[idx], size: 'full' }]); idx++; }
      pat++;
    }
    return rows;
  };

  const layout = buildLayout();

  const handleCopy = () => {
    const url = shareSlug ? getShareUrl(shareSlug) : window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div style={{
        padding: '16px 20px 24px', position: 'relative',
        background: 'linear-gradient(180deg, rgba(255,107,53,0.06) 0%, transparent 100%)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {onBack ? (
            <button onClick={onBack} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '8px 14px', color: 'var(--text-dim)',
              fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>
              ← Editor
            </button>
          ) : <div />}
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
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: '20px',
          background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)',
          marginBottom: '14px', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both',
        }}>
          <span style={{ fontSize: '14px' }}>📝</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>Note That Down</span>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800,
          color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '10px',
          animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both',
        }}>
          {planName || 'Untitled Plan'}
        </div>

        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-dim)',
          display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
          animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.15s both',
        }}>
          <span>📅 {planDate ? formatDate(planDate) : 'Date TBD'}</span>
          <span style={{ color: 'var(--text-faint)' }}>·</span>
          <span>{sorted.length} stops</span>
          {firstStart && <>
            <span style={{ color: 'var(--text-faint)' }}>·</span>
            <span>🕐 {firstStart} – {lastEnd}</span>
          </>}
        </div>
      </div>

      <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {layout.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: '12px' }}>
            {row.map(({ act, size }, ci) => (
              <TileCard key={act.id} activity={act} size={size} index={ri * 2 + ci}
                reactions={reactions} myReactions={myReactions} onReact={onReact} />
            ))}
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center', padding: '8px 20px 40px',
        fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-faint)',
        animation: 'fadeIn 1s ease 0.8s both',
      }}>
        Tap any tile to react 💬
      </div>
    </>
  );
}
