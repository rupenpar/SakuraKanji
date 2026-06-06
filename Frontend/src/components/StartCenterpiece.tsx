import {
  AnimatePresence,
  motion,
  useAnimationControls,
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrbitRings } from './OrbitRings'
import { JLPT_LEVELS } from '../lib/levels'
import { springPremium, springSoft } from '../lib/motion'

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect
      setSize({ width: cr.width, height: cr.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, size }
}

export function StartCenterpiece({
  onDimChange,
  onIntroComplete,
}: {
  onDimChange?: (dim: boolean) => void
  onIntroComplete?: () => void
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showLevels, setShowLevels] = useState(false)
  const [hintLang, setHintLang] = useState<'en' | 'ja'>('en')
  const controls = useAnimationControls()
  const { ref: wrapRef, size } = useElementSize<HTMLDivElement>()

  useEffect(() => {
    onDimChange?.(open)
  }, [open, onDimChange])

  const fallbackDiameter = useMemo(() => {
    const vmin = Math.min(window.innerWidth, window.innerHeight)
    return Math.min(Math.round(vmin * 0.56), 340)
  }, [])

  useEffect(() => {
    if (open) return
    const t = window.setInterval(() => {
      setHintLang((v) => (v === 'en' ? 'ja' : 'en'))
    }, 2200)
    return () => window.clearInterval(t)
  }, [open])

  async function handleOpen() {
    if (open) return
    setOpen(true)
    onDimChange?.(true)

    // Step 1: slight enlarge (cinematic)
    await controls.start({
      scale: 1.18,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    })

    // Step 2: become a giant atmospheric element cropped by the top edge.
    // Target: roughly half of the circle remains visible, and the orbit rings feel screen-filling.
    const maxDim = Math.max(window.innerWidth, window.innerHeight)
    const baseDiameter = size.width || fallbackDiameter
    const outerOrbitDiameter = baseDiameter * 1.46
    const desiredOuterOrbit = maxDim * 1.05
    const targetScale = Math.min(5.2, Math.max(2.0, desiredOuterOrbit / outerOrbitDiameter))
    const targetY = -Math.round(window.innerHeight * 0.46)
    await controls.start({
      y: targetY,
      scale: targetScale,
      opacity: 0.52,
      transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
    })

    setShowLevels(true)
    onIntroComplete?.()
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={wrapRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(56vmin,340px)] h-[min(56vmin,340px)]"
      >
        <motion.div
          className="absolute inset-0"
          animate={controls}
          initial={{ y: 0, scale: 1, opacity: 1 }}
          transition={springSoft}
        >
          <div className="absolute inset-0 pointer-events-none opacity-65">
            <OrbitRings diameter={Math.round(size.width || fallbackDiameter)} />
          </div>

          <motion.button
            type="button"
            className="absolute inset-0 grid place-items-center rounded-full soft-glass soft-shadow"
            onClick={handleOpen}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ pointerEvents: open ? 'none' : 'auto' }}
            disabled={open}
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

              {/* Decorative branch (user-provided / replaceable asset). */}
              <img
                src="/assets/sakura-branch.png"
                alt="Sakura branch"
                className="absolute -left-8 -bottom-10 w-[132%] max-w-none opacity-100 mix-blend-multiply select-none pointer-events-none"
                style={{
                  filter: 'contrast(1.18) saturate(1.08)',
                }}
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

          <AnimatePresence mode="wait">
            {!open ? (
              <motion.div
                className="pointer-events-none absolute left-1/2 top-full z-30 mt-10 text-center whitespace-nowrap"
                // Using Framer Motion to handle the X centering prevents conflicts with the Y animations
                style={{ x: '-50%' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28 }}
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
                    transition={{ duration: 0.22 }}
                  >
                    {hintLang === 'en' ? 'Click to Start' : 'クリックして開始'}
                  </motion.div>
                </AnimatePresence>

                <div
                  className="mt-2 text-[11px] sm:text-xs font-serif tracking-[0.22em] text-ink-900/55"
                  style={{
                    textShadow: '0 1px 8px rgba(255, 255, 255, 0.85)',
                  }}
                >
                  A quiet place to learn Kanji.
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {showLevels ? (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(96vw,1040px)] z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex flex-nowrap items-center justify-center gap-7 sm:gap-9 md:gap-12 w-full">
              {JLPT_LEVELS.map((b, idx) => (
                <JlptOrbitButton
                  key={b.level}
                  label={b.label.replace('JLPT ', '')}
                  index={idx}
                  onClick={() => navigate(`/${b.level}`)}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
      className="relative grid place-items-center w-16 h-16 sm:w-28 sm:h-28 md:w-32 md:h-32"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springPremium, delay: 0.1 * index }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Outer orbit ring (outside the button) */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${orbitBorder}`,
          boxShadow: `inset 0 0 0 1px ${orbitBorder2}`,
        }}
      />

      {/* Orbit dot: pinned to top of the orbit ring and rotates perfectly */}
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
        className="relative rounded-full soft-glass soft-shadow w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.62), 0 18px 55px rgba(26,20,20,0.10)',
        }}
        whileHover={{ scale: 1.05 }}
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

        <div className="relative grid place-items-center h-full w-full">
          <div className="text-[11px] sm:text-base tracking-[0.22em] text-ink-700">{label}</div>
        </div>
      </motion.button>
    </motion.div>
  )
}
