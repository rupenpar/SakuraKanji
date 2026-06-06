import { motion } from 'framer-motion'
import { orbit } from '../lib/motion'

export function OrbitRings({ diameter }: { diameter: number }) {
  const ringA = Math.round(diameter * 1.46)
  const ringB = Math.round(diameter * 1.18)

  return (
    <div className="absolute inset-0 grid place-items-center">
      <Ring
        size={ringA}
        direction={1}
        duration={34}
        border="rgba(0,0,0,1)"
        dotSize={6}
        dotColor="rgba(0,0,0,1)"
      />
      <Ring
        size={ringB}
        direction={-1}
        duration={54}
        border="rgba(0,0,0,1)"
        dotSize={5}
        dotColor="rgba(0,0,0,1)"
      />
    </div>
  )
}

function Ring({
  size,
  duration,
  direction,
  border,
  dotSize,
  dotColor,
}: {
  size: number
  duration: number
  direction: 1 | -1
  border: string
  dotSize: number
  dotColor: string
}) {
  return (
    <motion.div
      aria-hidden
      className="absolute grid place-items-center"
      style={{ width: size, height: size }}
      animate={{ rotate: direction === 1 ? 360 : -360 }}
      transition={orbit(duration)}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${border}`,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      />

      {/* Orbit dot: Now perfectly centered on the line */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          background: dotColor,
          boxShadow: '0 10px 25px rgba(0,0,0,0.70)',
        }}
      />
    </motion.div>
  )
}