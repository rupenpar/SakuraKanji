import { memo } from 'react'
import { motion } from 'framer-motion'

export const KanjiBubble = memo(function KanjiBubble({
  kanji,
  layoutId,
  index,
  onClick,
}: {
  kanji: string
  layoutId: string
  index: number
  onClick: () => void
}) {
  const delay = (index % 8) * 0.07

  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      className={
        'relative grid place-items-center rounded-full soft-glass soft-shadow ' +
        'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 '
      }
      style={{
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.64), inset 0 0 0 2px rgba(36,27,27,0.10), 0 24px 70px rgba(26,20,20,0.14)',
      }}
      onClick={onClick}
      whileHover={{
        y: -6,
        scale: 1.07,
        boxShadow:
          'inset 0 0 0 1px rgba(255,255,255,0.70), inset 0 0 0 2px rgba(36,27,27,0.14), 0 30px 85px rgba(26,20,20,0.18)',
      }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        aria-hidden
        initial={{ opacity: 0.65 }}
        animate={{ opacity: [0.55, 0.75, 0.55], scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 5.8 + (index % 6) * 0.5, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.82), rgba(253,236,239,0.56) 46%, rgba(248,215,218,0.25) 76%, rgba(232,207,207,0.14) 100%)',
        }}
      />
      <div className="relative text-3xl sm:text-4xl text-ink-900">{kanji}</div>
    </motion.button>
  )
})
