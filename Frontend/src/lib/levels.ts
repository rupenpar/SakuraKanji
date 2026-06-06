import type { JlptLevel } from '../types/kanji'

export const JLPT_LEVELS: { level: JlptLevel; label: string }[] = [
  { level: 'n5', label: 'JLPT N5' },
  { level: 'n4', label: 'JLPT N4' },
  { level: 'n3', label: 'JLPT N3' },
  { level: 'n2', label: 'JLPT N2' },
  { level: 'n1', label: 'JLPT N1' },
]

export function isJlptLevel(value: string | undefined): value is JlptLevel {
  return value === 'n5' || value === 'n4' || value === 'n3' || value === 'n2' || value === 'n1'
}
