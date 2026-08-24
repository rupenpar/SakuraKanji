import { AnimatePresence, motion, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrbitRings } from './OrbitRings'
import { JLPT_LEVELS } from '../lib/levels'
import { springPremium } from '../lib/motion'

export function StartCenterpiece({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const navigate = useNavigate()
  const [hintLang, setHintLang] = useState<'en' | 'ja'>('en')

  useEffect(() => {
    const t = window.setInterval(() => {
      setHintLang((v) => (v === 'en' ? 'ja' : 'en'))
    }, 4000)
    return () => window.clearInterval(t)
  }, [])

  const fallbackDiameter = useMemo(() => {
    const vmin = Math.min(window.innerWidth, window.innerHeight)
    return Math.min(Math.round(vmin * 0.56), 340)
  }, [])

  const canopyLift = useMemo(() => -Math.min(window.innerHeight * 0.30, 180), [])

  const circleScale = useTransform(scrollProgress, [0, 0.45], [1, 3.5])
  const circleY = useTransform(scrollProgress, [0, 0.45], [0, canopyLift])
  const circleOpacity = useTransform(scrollProgress, [0, 1], [1, 1])

  const orbitOpacity = useTransform(scrollProgress, [0, 0.32, 0.6], [1, 1, 0])
  const orbitScale = useTransform(scrollProgress, [0, 0.6], [1, 1.6])

  const textOpacity = useTransform(scrollProgress, [0, 0.3], [1, 0])
  const levelOpacity = useTransform(scrollProgress, [0.45, 1], [0, 1])
  const levelY = useTransform(scrollProgress, [0.45, 1], [40, 0])
  const overlayOpacity = useTransform(scrollProgress, [0.45, 1], [0, 1])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(56vmin,340px)] h-[min(56vmin,340px)]">
        <motion.div
          className="absolute inset-0"
          style={{ scale: circleScale, y: circleY, opacity: circleOpacity }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: orbitOpacity, scale: orbitScale }}
          >
            <OrbitRings diameter={Math.round(fallbackDiameter)} />
          </motion.div>

          <motion.button
            type="button"
            className="absolute inset-0 grid place-items-center rounded-full soft-glass soft-shadow"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ pointerEvents: 'none' }}
            disabled
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    'radial-gradient(520px 420px at 32% 18%, rgba(255,255,255,0.92), rgba(255,255,255,0) 62%), radial-gradient(560px 460px at 78% 70%, rgba(248,215,218,0.56), rgba(255,255,255,0) 58%), linear-gradient(180deg, rgba(255,255,255,0.82), rgba(248,215,218,0.32) 55%, rgba(232,207,207,0.24))',
                }}
              />

              <img
                src="/assets/sakura-branch.png"
                alt="Sakura branch"
                className="absolute -left-8 -bottom-10 w-[132%] max-w-none opacity-100 mix-blend-multiply select-none pointer-events-none"
                style={{ filter: 'contrast(1.18) saturate(1.08)' }}
                draggable={false}
              />

              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  background:
                    'radial-gradient(520px 420px at 52% 16%, rgba(255,255,255,0.72), rgba(255,255,255,0) 58%), radial-gradient(420px 320px at 40% 76%, rgba(255,248,248,0.22), rgba(255,255,255,0) 62%)',
                }}
              />

              <div
                className="absolute inset-0"
                aria-hidden
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.58), inset 0 -40px 90px rgba(36,27,27,0.08)',
                }}
              />
            </div>

            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  'inset 0 0 0 1px rgba(255,255,255,0.55), 0 30px 80px rgba(26,20,20,0.12)',
              }}
            />
          </motion.button>

          <motion.div
            className="pointer-events-none absolute left-1/2 top-full z-30 mt-10 text-center whitespace-nowrap"
            style={{ x: '-50%', opacity: textOpacity }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={hintLang}
                className="text-[24px] sm:text-[24px] tracking-[0.34em] text-ink-900/85"
                style={{
                  textShadow:
                    '0 2px 10px rgba(255, 255, 255, 0.95), 0 1px 2px rgba(255, 255, 255, 0.9)',
                }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.3 }}
              >
                {hintLang === 'en' ? 'Scroll to Start' : 'スクロールして開始'}
              </motion.div>
            </AnimatePresence>

            <div
              className="mt-2 text-[11px] sm:text-xs font-serif tracking-[0.22em] text-ink-900/55"
              style={{ textShadow: '0 1px 8px rgba(255, 255, 255, 0.85)' }}
            >
              A quiet place to learn Kanji.
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 192, 203, 0.6)',
          backdropFilter: 'blur(10px)',
          opacity: overlayOpacity,
          zIndex: 40,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        style={{ opacity: levelOpacity, y: levelY }}
        className="absolute inset-0 z-50 flex flex-nowrap items-center justify-center gap-3 sm:gap-5 md:gap-7 pointer-events-none"
      >
        <div className="flex gap-3 sm:gap-5 md:gap-7 pointer-events-auto">
          {JLPT_LEVELS.map((level, idx) => (
            <JlptOrbitButton
              key={level.level}
              label={level.level.toUpperCase()}
              index={idx}
              onClick={() => navigate(`/${level.level}`)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function JlptOrbitButton({
  label,
  index,
  onClick,
}: {
  label: string
  index: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const baseDuration = 20 + index * 4
  const duration = hovered ? Math.max(12, baseDuration * 0.65) : baseDuration

  const orbitBorder = hovered ? 'rgba(26,20,20,0.62)' : 'rgba(26,20,20,0.42)'
  const orbitBorder2 = hovered ? 'rgba(36,27,27,0.22)' : 'rgba(36,27,27,0.14)'

  return (
    <motion.div
      className="relative grid place-items-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springPremium, delay: 0.1 * index }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${orbitBorder}`,
          boxShadow: `inset 0 0 0 1px ${orbitBorder2}`,
        }}
      />

      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration }}
      >
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
          style={{
            width: 5,
            height: 5,
            background: 'rgba(24,18,18,0.62)',
            boxShadow: '0 10px 22px rgba(24,18,18,0.12)',
          }}
        />
      </motion.div>

      <motion.button
        type="button"
        className="relative rounded-full soft-glass soft-shadow w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.62), 0 18px 55px rgba(26,20,20,0.10)',
        }}
        whileHover={{ scale: 1.08, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.8), 0 18px 55px rgba(250,180,190,0.22)' }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
      >
        <div
          className="absolute inset-0 rounded-full"
          aria-hidden
          style={{
            background:
              'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.66), rgba(255,255,255,0) 62%), radial-gradient(circle at 50% 75%, rgba(248,215,218,0.14), rgba(255,255,255,0) 58%)',
          }}
        />

        <div className="relative z-10 grid place-items-center h-full w-full">
          <div className="text-[11px] sm:text-sm tracking-[0.22em] text-ink-700">{label}</div>
        </div>
      </motion.button>
    </motion.div>
  )
}
