import { motion } from 'framer-motion'

const PETALS = [
  { left: 8, top: 18, size: 10, delay: 0.2, duration: 10 },
  { left: 18, top: 76, size: 14, delay: 1.1, duration: 13 },
  { left: 26, top: 34, size: 12, delay: 0.6, duration: 12 },
  { left: 36, top: 64, size: 16, delay: 0.9, duration: 15 },
  { left: 46, top: 22, size: 12, delay: 0.3, duration: 11 },
  { left: 56, top: 52, size: 18, delay: 1.5, duration: 16 },
  { left: 66, top: 16, size: 10, delay: 0.8, duration: 12 },
  { left: 74, top: 72, size: 14, delay: 0.4, duration: 14 },
  { left: 84, top: 38, size: 12, delay: 1.3, duration: 13 },
  { left: 92, top: 62, size: 16, delay: 0.7, duration: 15 }
]

export function PetalField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: Math.round(p.size * 1.25),
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(253,236,239,0.9) 45%, rgba(248,215,218,0.55) 70%, rgba(232,207,207,0.25) 100%)',
            filter: 'blur(0.2px)',
          }}
          initial={{ opacity: 0.0, y: -8, rotate: -12 }}
          animate={{
            opacity: [0.0, 0.7, 0.35],
            y: [-10, 14, -6],
            x: [0, 10, -6],
            rotate: [-18, 12, -8],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage:
          'radial-gradient(1px 1px at 20% 30%, rgba(232,207,207,0.65) 0, transparent 60%), radial-gradient(1px 1px at 70% 55%, rgba(248,215,218,0.65) 0, transparent 60%), radial-gradient(1px 1px at 40% 80%, rgba(253,236,239,0.75) 0, transparent 60%)',
        backgroundSize: '180px 180px',
      }} />
    </div>
  )
}
