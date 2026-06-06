import type { JlptLevel } from '../types/kanji'
import raw from './kanji.json'

type LegacyKanjiEntry = {
  id: string
  kanji: string
  meaning: string
  onyomi: string[]
  kunyomi: string[]
  strokes: number
  examples: Array<{ word: string; reading: string; meaning: string }>
}

type KanjiJson = Record<JlptLevel, LegacyKanjiEntry[]>

export const KANJI_BY_LEVEL = raw as unknown as KanjiJson

export function getKanjiForLevel(level: JlptLevel): LegacyKanjiEntry[] {
  return KANJI_BY_LEVEL[level] ?? []
}
