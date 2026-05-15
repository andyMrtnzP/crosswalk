export default function AnimatedEqBars() {
  return <span className="flex h-full items-end justify-center gap-0.5">
    <span
      className="w-0.5 rounded-sm bg-accent-gold"
      style={{ animation: 'eq 1s ease-in-out infinite', height: '40%' }}
    />
    <span
      className="w-0.5 rounded-sm bg-accent-gold"
      style={{
        animation: 'eq 1s ease-in-out infinite',
        animationDelay: '0.2s',
        height: '100%',
      }}
    />
    <span
      className="w-0.5 rounded-sm bg-accent-gold"
      style={{
        animation: 'eq 1s ease-in-out infinite',
        animationDelay: '0.4s',
        height: '60%',
      }}
    />
  </span>
}