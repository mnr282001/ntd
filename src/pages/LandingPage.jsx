import { Link } from 'react-router-dom';
import Shell from '../components/Shell.jsx';

const STEPS = [
  { num: '01', title: 'Plan', desc: 'Drag and drop activities onto a visual timeline. Add food spots, outdoor adventures, cultural stops, and more.', emoji: '📋' },
  { num: '02', title: 'Share', desc: 'Generate a beautiful shareable link and drop it in your group chat. Everyone sees the same gorgeous plan.', emoji: '🔗' },
  { num: '03', title: 'Go', desc: 'Follow your plan in real-time. React with emojis, swap stops on the fly, and make memories.', emoji: '🚀' },
];

const FEATURES = [
  { title: 'Visual Timeline', desc: 'Drag-and-drop scheduling from 6 AM to midnight. Snap activities to 15-minute intervals.', icon: '⏱️' },
  { title: 'Shareable Links', desc: 'One tap to share. Beautiful tile layouts your friends will actually want to open.', icon: '✨' },
  { title: 'Live Reactions', desc: 'Your crew can react with emojis in real-time. Know what everyone is hyped about.', icon: '🔥' },
  { title: 'Smart Categories', desc: 'Food, drinks, outdoors, culture, shopping, travel — each with its own color-coded gradient.', icon: '🎨' },
];

const USE_CASES = [
  { title: 'City Day Trips', desc: 'Exploring NYC, LA, Chicago, or any city? Map out brunch, museum visits, park walks, and sunset spots in one clean timeline.', gradient: 'linear-gradient(135deg, #ff6b35 0%, #ff8f65 100%)' },
  { title: 'Date Nights', desc: 'Plan the perfect evening — dinner reservations, cocktail bars, rooftop views — all timed and ready to share.', gradient: 'linear-gradient(135deg, #e91e8c 0%, #f06baf 100%)' },
  { title: 'Friend Hangouts', desc: 'Drop the plan in the group chat. No more "so what are we doing?" texts. Everyone sees the vibe.', gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' },
  { title: 'Weekend Getaways', desc: 'Road trips, beach days, hiking adventures — plan every stop and keep the whole crew on the same page.', gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' },
];

export default function LandingPage() {
  return (
    <Shell maxWidth="none">
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>

        {/* Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 0', animation: 'fadeIn 0.6s ease',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>
            Note That Down
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              disabled
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                background: 'var(--surface)', color: 'var(--text-dim)', fontFamily: 'var(--font-body)',
                fontSize: 14, cursor: 'not-allowed', opacity: 0.5,
              }}
            >
              Sign In
            </button>
            <button
              disabled
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent)',
                background: 'rgba(255,107,53,0.15)', color: 'var(--accent)', fontFamily: 'var(--font-body)',
                fontSize: 14, cursor: 'not-allowed', opacity: 0.5,
              }}
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section style={{
          textAlign: 'center', padding: '80px 0 60px',
          animation: 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(36px, 7vw, 64px)', lineHeight: 1.1,
            color: 'var(--text)', marginBottom: 20,
          }}>
            Plan your day.<br />
            <span style={{ color: 'var(--accent)' }}>Drop it in the group chat.</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'var(--text-dim)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6,
          }}>
            The easiest way to plan day outings, city trips, and hangouts with friends.
            Build a beautiful timeline, share it instantly, and make every day count.
          </p>
          <Link to="/plan" style={{
            display: 'inline-block', padding: '16px 40px', borderRadius: 'var(--radius)',
            background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: 18, textDecoration: 'none',
            boxShadow: '0 0 30px var(--accent-glow)', transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Start Planning
          </Link>
          <p style={{ color: 'var(--text-faint)', fontSize: 13, marginTop: 14 }}>
            Free to use — no account required
          </p>
        </section>

        {/* How It Works */}
        <section style={{ padding: '60px 0' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 4vw, 36px)',
            textAlign: 'center', marginBottom: 48, color: 'var(--text)',
          }}>
            How It Works
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{
                padding: 28, borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                background: 'var(--surface)', animation: 'fadeIn 0.6s ease',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                  color: 'var(--accent)', marginBottom: 6, letterSpacing: 1,
                }}>
                  STEP {s.num}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22,
                  color: 'var(--text)', marginBottom: 8,
                }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '60px 0' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 4vw, 36px)',
            textAlign: 'center', marginBottom: 16, color: 'var(--text)',
          }}>
            Everything You Need to Plan the Perfect Day
          </h2>
          <p style={{
            textAlign: 'center', color: 'var(--text-dim)', fontSize: 16,
            maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6,
          }}>
            Whether it's a spontaneous city adventure or a carefully curated day trip, we've got you covered.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                background: 'var(--surface)',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
                  color: 'var(--text)', marginBottom: 6,
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section style={{ padding: '60px 0' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(24px, 4vw, 36px)',
            textAlign: 'center', marginBottom: 16, color: 'var(--text)',
          }}>
            Plan Any Outing
          </h2>
          <p style={{
            textAlign: 'center', color: 'var(--text-dim)', fontSize: 16,
            maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6,
          }}>
            From brunch crawls to museum marathons — create shareable itineraries for every kind of day out.
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {USE_CASES.map((uc) => (
              <div key={uc.title} style={{
                padding: 28, borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                background: 'var(--surface)', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: uc.gradient,
                }} />
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19,
                  color: 'var(--text)', marginBottom: 8,
                }}>
                  {uc.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          textAlign: 'center', padding: '60px 0 40px',
        }}>
          <div style={{
            padding: '48px 32px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(99,102,241,0.06) 100%)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(24px, 5vw, 40px)', color: 'var(--text)', marginBottom: 16,
            }}>
              Ready to plan your next outing?
            </h2>
            <p style={{
              color: 'var(--text-dim)', fontSize: 16, marginBottom: 32,
              maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6,
            }}>
              No sign-up, no fuss. Just start building your day and share it with the crew.
            </p>
            <Link to="/plan" style={{
              display: 'inline-block', padding: '16px 40px', borderRadius: 'var(--radius)',
              background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: 18, textDecoration: 'none',
              boxShadow: '0 0 30px var(--accent-glow)',
            }}>
              Build a Plan
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '40px 0', borderTop: '1px solid var(--border)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              Note That Down
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>
              Plan beautiful day outings and share them instantly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="/privacy" style={{ fontSize: 13, color: 'var(--text-dim)', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <a href="/terms" style={{ fontSize: 13, color: 'var(--text-dim)', textDecoration: 'none' }}>
              Terms of Service
            </a>
          </div>
        </footer>

      </div>
    </Shell>
  );
}
