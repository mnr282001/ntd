export default function Shell({ children, maxWidth = '430px' }) {
  return (
    <div className="shell-root" style={{ position: 'relative', width: '100%', minHeight: '100vh', maxWidth, margin: '0 auto' }}>
      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'var(--bg)' }}>
        <div style={{ position: 'absolute', top: '-40%', right: '-30%', width: '80vw', height: '80vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 65%)', filter: 'blur(80px)' }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
