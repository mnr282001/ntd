import { useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import SharedTileView from '../components/SharedTileView.jsx';
import { usePlan, useReactions, useRealtimeReactions } from '../hooks/useSupabase.js';

export default function SharedView() {
  const { slug } = useParams();
  const { plan, stops, loading, error } = usePlan(slug);

  const stopIds = useMemo(() => stops.map((s) => s.id), [stops]);
  const { reactions, myReactions, toggleReaction, loadReactions } = useReactions(stopIds);

  // Live reaction updates
  const handleRealtimeReaction = useCallback(() => {
    loadReactions(stopIds);
  }, [loadReactions, stopIds]);

  useRealtimeReactions(stopIds, handleRealtimeReaction);

  if (loading) {
    return (
      <Shell>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', gap: '16px',
        }}>
          <div style={{ fontSize: '40px', animation: 'logoFloat 2s ease-in-out infinite' }}>📝</div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-dim)',
            animation: 'shimmer 2s ease infinite',
          }}>
            Loading plan...
          </div>
        </div>
      </Shell>
    );
  }

  if (error || !plan) {
    return (
      <Shell>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', gap: '16px', padding: '20px',
        }}>
          <div style={{ fontSize: '48px' }}>🤷</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
            color: 'var(--text)', textAlign: 'center',
          }}>
            Plan not found
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-dim)',
            textAlign: 'center', maxWidth: '280px',
          }}>
            This link might have expired or the plan was deleted. Ask whoever shared it with you for a new one!
          </div>
          <a href="/" style={{
            marginTop: '12px', padding: '12px 24px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #ff6b35, #ff8f5e)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700,
            textDecoration: 'none',
          }}>
            Make your own plan →
          </a>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <SharedTileView
        stops={stops}
        reactions={reactions}
        myReactions={myReactions}
        onReact={toggleReaction}
        planName={plan.name}
        planDate={plan.plan_date}
        shareSlug={plan.share_slug}
      />
    </Shell>
  );
}
