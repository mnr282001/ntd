import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import SharedTileView from '../components/SharedTileView.jsx';
import { usePlan, useReactions, useRealtimeReactions } from '../hooks/useSupabase.js';

function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → hold → exit

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 100);
    const exitTimer = setTimeout(() => setPhase('exit'), 1400);
    const doneTimer = setTimeout(onDone, 2000);
    return () => { clearTimeout(holdTimer); clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.05)' : 'scale(1)',
      transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: phase === 'exit' ? 'none' : 'auto',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'scale(0.5)' : 'scale(1)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
      }} />

      {/* Logo icon */}
      <div style={{
        fontSize: '56px', marginBottom: '20px',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(20px) scale(0.8)' : 'translateY(0) scale(1)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>
        📝
      </div>

      {/* Brand name */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
        color: 'var(--text)', letterSpacing: '-0.02em',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(16px)' : 'translateY(0)',
        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s',
      }}>
        Note That Down
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-dim)',
        marginTop: '8px',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(12px)' : 'translateY(0)',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s',
      }}>
        someone made a plan for you
      </div>

      {/* Loading dots */}
      <div style={{
        display: 'flex', gap: '6px', marginTop: '32px',
        opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.3s ease 0.5s',
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent)',
            animation: `splashDot 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function SharedView() {
  const { slug } = useParams();
  const { plan, stops, loading, error } = usePlan(slug);
  const [showSplash, setShowSplash] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const stopIds = useMemo(() => stops.map((s) => s.id), [stops]);
  const { reactions, myReactions, toggleReaction, loadReactions } = useReactions(stopIds);

  const handleRealtimeReaction = useCallback(() => {
    loadReactions(stopIds);
  }, [loadReactions, stopIds]);

  useRealtimeReactions(stopIds, handleRealtimeReaction);

  const dataLoaded = !loading && !error && plan;

  const handleSplashDone = useCallback(() => {
    setShowSplash(false);
    // Small delay so content animates in after splash is gone
    setTimeout(() => setContentReady(true), 50);
  }, []);

  // If data loaded before splash finishes, splash still plays out fully
  // If data hasn't loaded when splash ends, we wait
  const showContent = !showSplash && dataLoaded;

  if (!showSplash && (error || (!loading && !plan))) {
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
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      {/* Still loading after splash */}
      {!showSplash && loading && (
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
      )}

      {showContent && (
        <div style={{
          opacity: contentReady ? 1 : 0,
          transform: contentReady ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <SharedTileView
            stops={stops}
            reactions={reactions}
            myReactions={myReactions}
            onReact={toggleReaction}
            planName={plan.name}
            planDate={plan.plan_date}
            shareSlug={plan.share_slug}
          />
        </div>
      )}
    </Shell>
  );
}
