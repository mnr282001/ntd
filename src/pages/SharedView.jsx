import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Shell from '../components/Shell.jsx';
import SharedTileView from '../components/SharedTileView.jsx';
import { usePlan, useReactions, useRealtimeReactions } from '../hooks/useSupabase.js';

function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter');

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
      transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
      transition: 'opacity 0.6s var(--ease-smooth), transform 0.6s var(--ease-smooth)',
      pointerEvents: phase === 'exit' ? 'none' : 'auto',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232, 89, 12, 0.1) 0%, transparent 70%)',
        filter: 'blur(50px)',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'scale(0.5)' : 'scale(1)',
        transition: 'all 0.8s var(--ease-out)',
      }} />

      {/* Logo */}
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: 'var(--accent-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, marginBottom: 18,
        boxShadow: 'var(--shadow-warm)',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(16px) scale(0.8)' : 'translateY(0) scale(1)',
        transition: 'all 0.7s var(--ease-out) 0.1s',
      }}>
        {'\u{1F4DD}'}
      </div>

      {/* Brand */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
        color: 'var(--text)', letterSpacing: '-0.02em',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(12px)' : 'translateY(0)',
        transition: 'all 0.6s var(--ease-out) 0.2s',
      }}>
        Note That Down
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-dim)', fontWeight: 400,
        marginTop: 8,
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'translateY(10px)' : 'translateY(0)',
        transition: 'all 0.5s var(--ease-out) 0.35s',
      }}>
        someone made a plan for you
      </div>

      {/* Loading dots */}
      <div style={{
        display: 'flex', gap: 6, marginTop: 28,
        opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
        transition: 'opacity 0.3s ease 0.5s',
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
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
    setTimeout(() => setContentReady(true), 50);
  }, []);

  const showContent = !showSplash && dataLoaded;

  if (!showSplash && (error || (!loading && !plan))) {
    return (
      <Shell maxWidth="none">
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', gap: 16, padding: 20,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'var(--surface-dim)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
            color: 'var(--text)', textAlign: 'center', letterSpacing: '-0.01em',
          }}>
            Plan not found
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-dim)',
            textAlign: 'center', maxWidth: 280, lineHeight: 1.6,
          }}>
            This link might have expired or the plan was deleted. Ask whoever shared it for a new one!
          </div>
          <a href="/" style={{
            marginTop: 8, padding: '12px 24px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gradient)', color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700,
            textDecoration: 'none', boxShadow: 'var(--shadow-warm)',
          }}>
            Make your own plan
          </a>
        </div>
      </Shell>
    );
  }

  return (
    <Shell maxWidth="none">
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      {!showSplash && loading && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, animation: 'logoFloat 2s ease-in-out infinite',
            boxShadow: 'var(--shadow-warm)',
          }}>
            {'\u{1F4DD}'}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-dim)',
            animation: 'shimmer 2s ease infinite', fontWeight: 500,
          }}>
            Loading plan...
          </div>
        </div>
      )}

      {showContent && (
        <div style={{
          opacity: contentReady ? 1 : 0,
          transform: contentReady ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)',
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
