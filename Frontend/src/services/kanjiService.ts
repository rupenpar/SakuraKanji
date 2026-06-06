import { supabase } from '../lib/supabase.ts'

const levelCache = new Map<string, KanjiEntry[]>()

type KanjiEntry = {
  id: string
  kanji: string
  meaning: string
  onyomi: string[]
  kunyomi: string[]
  jlpt_level: string
  stroke_count: number
  stroke_order: string | null
  created_at: string | null
}

function normalizeReading(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }

  if (typeof value !== 'string') return []

  return value
    .split(/[,、\s]+/)
    .map((v) => v.trim())
    .filter(Boolean)
}

function mapKanjiRow(row: Record<string, unknown>): KanjiEntry {
  return {
    id: String(row.id ?? ''),
    kanji: String(row.kanji ?? ''),
    meaning: String(row.meaning ?? ''),
    onyomi: normalizeReading(row.onyomi),
    kunyomi: normalizeReading(row.kunyomi),
    jlpt_level: String(row.jlpt_level ?? ''),
    stroke_count: Number(row.stroke_count ?? 0),
    stroke_order: (row.stroke_order as string | null | undefined) ?? null,
    created_at: (row.created_at as string | null | undefined) ?? null,
  }
}

function normalizeLevel(level: string): string {
  const clean = String(level ?? '').trim().toUpperCase()
  if (/^N[1-5]$/.test(clean)) return clean
  return ''
}

export async function getKanjiByLevel(level: string): Promise<KanjiEntry[]> {
  const normalizedLevel = normalizeLevel(level)

  if (!normalizedLevel) {
    throw new Error('Invalid JLPT level. Expected one of N5, N4, N3, N2, N1.')
  }

  const cached = levelCache.get(normalizedLevel)
  if (cached) {
    return cached
  }

  const { data, error } = await supabase
    .from('kanji')
    .select('id, kanji, meaning, onyomi, kunyomi, jlpt_level, stroke_count, stroke_order, created_at')
    .eq('jlpt_level', normalizedLevel)
    .order('stroke_count', { ascending: true })
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch ${normalizedLevel} kanji: ${error.message}`)
  }

  const mapped = ((data ?? []) as Record<string, unknown>[]).map((row) => mapKanjiRow(row))
  levelCache.set(normalizedLevel, mapped)
  return mapped
}
