import type { Transition, Variants } from 'framer-motion'

export const springPremium: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 18,
  mass: 0.9,
}

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 110,
  damping: 22,
  mass: 1.0,
}

export function orbit(durationSec: number): Transition {
  return { repeat: Infinity, duration: durationSec, ease: 'linear' }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const staggerChildren: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

export const itemReveal: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}
