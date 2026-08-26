import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import type { KanjiEntry } from '../types/kanji'
import { itemReveal, springSoft, staggerChildren } from '../lib/motion'

export function KanjiScrollModal({
  open,
  entry,
  layoutId,
  onClose,
}: {
  open: boolean
  entry: KanjiEntry | null
  layoutId: string | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && entry && layoutId ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-5">
          <motion.button
            type="button"
            className="absolute inset-0 bg-ink-900/16 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            aria-label="Close"
          />

          <motion.div
            layoutId={layoutId}
            className="relative w-[min(82vw,560px)] max-h-[84vh] rounded-[32px] soft-glass soft-shadow overflow-hidden"
            transition={springSoft}
          >
            <div className="absolute inset-0 opacity-75" aria-hidden style={{
              background:
                'radial-gradient(900px 500px at 50% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%), linear-gradient(180deg, rgba(253,236,239,0.8), rgba(255,248,248,0.55))',
            }} />

            <motion.div
              className="relative max-h-[84vh] overflow-y-auto no-scrollbar"
              initial={{ scaleY: 0.86, opacity: 0.0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0.94, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top' }}
            >
              <div className="relative px-5 sm:px-7 pt-6 sm:pt-8 pb-6 sm:pb-8">
                <div
                  aria-hidden
                  className="absolute left-0 right-0 top-0 h-6"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(150,110,80,0.35), rgba(150,110,80,0.10), rgba(150,110,80,0))',
                  }}
                />
                <div
                  aria-hidden
                  className="absolute left-0 right-0 bottom-0 h-6"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(150,110,80,0.32), rgba(150,110,80,0.08), rgba(150,110,80,0))',
                  }}
                />

                <div className="flex items-start justify-between gap-4 sm:gap-6">
                  <div>
                    <div className="text-5xl sm:text-6xl leading-none text-ink-900">{entry.kanji}</div>
                    <div className="mt-2 text-xs sm:text-sm tracking-[0.22em] text-ink-700/80">{entry.meaning}</div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="shrink-0 rounded-full px-3 py-2 text-[10px] sm:text-xs tracking-[0.26em] text-ink-900/75 border border-ink-900/16 bg-white/38 hover:bg-white/52 transition hover:-translate-y-0.5"
                  >
                    閉じる
                  </button>
                </div>

                <motion.div
                  className="mt-6 grid gap-4 sm:gap-5"
                  variants={staggerChildren}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div variants={itemReveal} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Detail label="Meaning" value={entry.meaning || '—'} />
                    <Detail label="Stroke Count" value={String(entry.stroke_count || 0)} />
                    <Detail label="Onyomi" value={entry.onyomi.join(' ・ ') || '—'} />
                    <Detail label="Kunyomi" value={entry.kunyomi.join(' ・ ') || '—'} />
                  </motion.div>

                  {entry.stroke_order ? (
                    <motion.div variants={itemReveal}>
                      <div className="text-[10px] sm:text-xs tracking-[0.28em] text-ink-700/70">STROKE ORDER</div>
                      <div className="mt-2 rounded-2xl border border-ink-900/10 bg-white/30 p-3">
                        <img
                          src={entry.stroke_order}
                          alt={`${entry.kanji} stroke order`}
                          loading="lazy"
                          className="w-full h-auto max-h-[240px] object-contain rounded-xl"
                        />
                      </div>
                    </motion.div>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white/26 px-4 py-3">
      <div className="text-xs tracking-[0.28em] text-ink-700/70">{label}</div>
      <div className="mt-1 text-sm text-ink-900/90">{value}</div>
    </div>
  )
}
