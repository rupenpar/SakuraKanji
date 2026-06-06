import { AnimatePresence, motion } from 'framer-motion'
import { fadeIn } from '../lib/motion'
import { PetalField } from './PetalField'

export function ScenicBackdrop({
  dim,
  tone = 'landing',
}: {
  dim?: boolean
  tone?: 'landing' | 'grounded'
}) {
  return (
    <div className="fixed inset-0 -z-10 bg-sakura-cinematic">
      <div
        className={
          tone === 'grounded'
            ? 'absolute inset-0 opacity-55 paper-sheen animate-shimmer'
            : 'absolute inset-0 opacity-70 paper-sheen animate-shimmer'
        }
      />
      <div className="absolute inset-0 bg-white/10" />
      {tone === 'grounded' ? (
        <div className="absolute inset-0 bg-ink-900/8" />
      ) : null}
      <PetalField />

      <AnimatePresence>
        {dim ? (
          <motion.div
            className="absolute inset-0 bg-ink-900/10 backdrop-blur-sm"
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.35 }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
