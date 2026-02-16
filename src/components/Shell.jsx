export default function Shell({ children, maxWidth = '430px' }) {
  return (
    <div className="shell-root" style={{ position: 'relative', width: '100%', minHeight: '100vh', maxWidth, margin: '0 auto' }}>
      {/* Ambient warm background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'var(--bg)', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-30%', right: '-20%',
          width: '70vw', height: '70vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 89, 12, 0.05) 0%, rgba(249, 115, 22, 0.02) 40%, transparent 65%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-25%', left: '-15%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '80vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(251, 191, 36, 0.025) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
