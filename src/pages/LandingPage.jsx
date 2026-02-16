import { Link } from 'react-router-dom';
import Shell from '../components/Shell.jsx';

const STEPS = [
  { num: '01', title: 'Plan', desc: 'Drag activities onto a visual timeline. Food, adventures, culture — build your perfect day.', icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  )},
  { num: '02', title: 'Share', desc: 'One tap generates a beautiful link. Drop it in the group chat — done.', icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
  )},
  { num: '03', title: 'Go', desc: 'Follow the plan, react with emojis, and make memories together.', icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  )},
];

const FEATURES = [
  { title: 'Visual Timeline', desc: 'Drag-and-drop from 6 AM to midnight with 15-min snapping.', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', color: '#6366f1' },
  { title: 'Instant Sharing', desc: 'One beautiful link that opens as swipeable cards.', gradient: 'linear-gradient(135deg, #E8590C, #F97316)', color: '#E8590C' },
  { title: 'Live Reactions', desc: 'Your crew reacts with emojis in real-time. See what everyone loves.', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', color: '#ec4899' },
  { title: 'Smart Categories', desc: 'Food, drinks, outdoors, culture — each with its own vibrant style.', gradient: 'linear-gradient(135deg, #10b981, #34d399)', color: '#10b981' },
];

const USE_CASES = [
  { title: 'City Day Trips', desc: 'Brunch, museums, sunset spots — all timed and ready.', emoji: '\u{1F3D9}\u{FE0F}', bg: '#FFF7ED' },
  { title: 'Date Nights', desc: 'Dinner, cocktails, rooftop views — perfectly sequenced.', emoji: '\u{1F339}', bg: '#FFF1F2' },
  { title: 'Friend Hangouts', desc: 'Drop the plan in the chat. No more "so what are we doing?"', emoji: '\u{1F389}', bg: '#F0F9FF' },
  { title: 'Weekend Getaways', desc: 'Road trips, beach days, hiking — keep the crew aligned.', emoji: '\u{1F3D5}\u{FE0F}', bg: '#F0FDF4' },
];

export default function LandingPage() {
  return (
    <Shell maxWidth="none">
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px' }}>

        {/* Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 0',
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, boxShadow: 'var(--shadow-sm)',
            }}>
              {'\u{1F4DD}'}
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
              color: 'var(--text)', letterSpacing: '-0.01em',
            }}>
              Note That Down
            </span>
          </div>
          <Link to="/plan" style={{
            padding: '9px 20px', borderRadius: 'var(--radius-full)',
            background: 'var(--text)', color: 'var(--bg)',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', transition: 'transform 0.2s var(--ease-out), box-shadow 0.2s',
            boxShadow: 'var(--shadow-sm)',
          }}>
            Start Planning
          </Link>
        </nav>

        {/* Hero */}
        <section style={{
          textAlign: 'center',
          padding: 'clamp(48px, 8vw, 100px) 0 clamp(32px, 5vw, 60px)',
          animation: 'slideUp 0.7s var(--ease-out)',
        }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px 6px 8px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-soft)', border: '1px solid rgba(232, 89, 12, 0.12)',
            marginBottom: 28,
            animation: 'slideDown 0.5s var(--ease-out) 0.2s both',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--accent-gradient)', fontSize: 10, color: '#fff',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
              color: 'var(--accent)', letterSpacing: '0.02em',
            }}>
              Free &middot; No sign-up required
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(34px, 6.5vw, 68px)', lineHeight: 1.05,
            color: 'var(--text)', marginBottom: 20,
            letterSpacing: '-0.03em',
          }}>
            Plan your day.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #E8590C 0%, #F97316 50%, #FBBF24 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 4s ease infinite',
            }}>
              Drop it in the group chat.
            </span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 36px',
            lineHeight: 1.7, fontWeight: 400,
          }}>
            The easiest way to plan outings, city trips, and hangouts.
            Build a beautiful timeline and share it instantly.
          </p>

          <Link to="/plan" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 36px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gradient)', color: '#fff',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxShadow: 'var(--shadow-warm), var(--shadow-md)',
            transition: 'transform 0.2s var(--ease-out), box-shadow 0.2s',
          }}>
            Start Planning
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </section>

        {/* Phone mockup */}
        <section style={{
          display: 'flex', justifyContent: 'center', padding: '0 0 clamp(40px, 6vw, 80px)',
          animation: 'slideUp 0.7s var(--ease-out) 0.15s both',
        }}>
          <div style={{
            width: '100%', maxWidth: 340,
            background: 'var(--surface)',
            borderRadius: 24, border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
            padding: '20px 16px',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 16, padding: '0 4px',
            }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--text-dim)' }}>9:41</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 14, height: 10, borderRadius: 2, background: 'var(--text-faint)', opacity: 0.5 }} />
                <div style={{ width: 14, height: 10, borderRadius: 2, background: 'var(--text-faint)', opacity: 0.5 }} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800,
                color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4,
              }}>NYC Day Trip</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-dim)' }}>
                Sat, Feb 21 &middot; 5 stops
              </div>
            </div>
            {[
              { time: '9 AM', title: "Brunch at The Butcher's Daughter", gradient: 'linear-gradient(135deg, #ff6b35, #ff9a5c)', h: 50 },
              { time: '11 AM', title: 'Walk the High Line', gradient: 'linear-gradient(135deg, #10b981, #34d399)', h: 44 },
              { time: '1 PM', title: 'Chelsea Market', gradient: 'linear-gradient(135deg, #ff6b35, #ff9a5c)', h: 36 },
              { time: '2:30', title: 'The Whitney Museum', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', h: 44 },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, marginBottom: 6,
                animation: `slideUp 0.4s var(--ease-out) ${0.4 + i * 0.1}s both`,
              }}>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
                  color: 'var(--text-faint)', width: 30, paddingTop: 8, textAlign: 'right', flexShrink: 0,
                }}>{item.time}</div>
                <div style={{
                  flex: 1, background: item.gradient, borderRadius: 12,
                  padding: '10px 12px', height: item.h,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                    color: '#fff', lineHeight: 1.3,
                  }}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
              color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 10,
            }}>
              How it works
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>
              Three steps to the perfect day
            </h2>
          </div>
          <div className="landing-grid-3" style={{ display: 'grid', gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{
                padding: 28, borderRadius: 20,
                background: 'var(--surface)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                animation: `slideUp 0.5s var(--ease-out) ${0.1 * i}s both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: 'var(--accent-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
                    color: 'var(--text-faint)', letterSpacing: '0.06em',
                  }}>
                    STEP {s.num}
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                  color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em',
                }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
              color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 10,
            }}>
              Features
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text)',
              letterSpacing: '-0.02em', maxWidth: 500, margin: '0 auto',
            }}>
              Everything for the perfect day out
            </h2>
          </div>
          <div className="landing-grid-4" style={{ display: 'grid', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} style={{
                padding: 24, borderRadius: 20,
                background: 'var(--surface)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                animation: `slideUp 0.5s var(--ease-out) ${0.05 * i}s both`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: f.gradient, marginBottom: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 12px ${f.color}25`,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
                  color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em',
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
              color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 10,
            }}>
              Use cases
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>
              Plan any kind of outing
            </h2>
          </div>
          <div className="landing-grid-4" style={{ display: 'grid', gap: 16 }}>
            {USE_CASES.map((uc, i) => (
              <div key={uc.title} style={{
                padding: 24, borderRadius: 20,
                background: uc.bg, border: '1px solid var(--border)',
                animation: `slideUp 0.5s var(--ease-out) ${0.05 * i}s both`,
              }}>
                <div style={{
                  fontSize: 32, marginBottom: 12, lineHeight: 1,
                  animation: `float 3s ease-in-out ${i * 0.5}s infinite`,
                }}>
                  {uc.emoji}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
                  color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em',
                }}>
                  {uc.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: 'clamp(20px, 4vw, 40px) 0 clamp(40px, 6vw, 60px)' }}>
          <div style={{
            padding: 'clamp(36px, 5vw, 56px) clamp(24px, 4vw, 40px)',
            borderRadius: 24, background: 'var(--text)',
            position: 'relative', overflow: 'hidden', textAlign: 'center',
          }}>
            <div style={{
              position: 'absolute', top: '-40%', right: '-20%',
              width: '60%', height: '100%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232, 89, 12, 0.3) 0%, transparent 60%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-30%', left: '-10%',
              width: '50%', height: '80%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 60%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(22px, 4.5vw, 36px)', color: '#FFFDF8',
                letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.1,
              }}>
                Ready to plan your next day out?
              </h2>
              <p style={{
                color: 'rgba(255,253,248,0.6)', fontSize: 15,
                marginBottom: 28, maxWidth: 380, margin: '0 auto 28px', lineHeight: 1.6,
              }}>
                No sign-up, no fuss. Just build your timeline and share it.
              </p>
              <Link to="/plan" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 32px', borderRadius: 'var(--radius-full)',
                background: 'var(--accent-gradient)', color: '#fff',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(232, 89, 12, 0.4)',
              }}>
                Build a Plan
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '32px 0', borderTop: '1px solid var(--border)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>
              Note That Down
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              Beautiful day plans, shared instantly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/privacy" style={{ fontSize: 12, color: 'var(--text-dim)', textDecoration: 'none', fontWeight: 500 }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 12, color: 'var(--text-dim)', textDecoration: 'none', fontWeight: 500 }}>Terms</a>
          </div>
        </footer>

      </div>
    </Shell>
  );
}
