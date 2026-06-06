import { supabase } from '../lib/supabase'

const levelCache = new Map()

function normalizeReading(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }

  if (typeof value !== 'string') return []

  return value
    .split(/[,、\s]+/)
    .map((v) => v.trim())
    .filter(Boolean)
}

function mapKanjiRow(row) {
  return {
    id: String(row.id),
    kanji: row.kanji ?? '',
    meaning: row.meaning ?? '',
    onyomi: normalizeReading(row.onyomi),
    kunyomi: normalizeReading(row.kunyomi),
    jlpt_level: row.jlpt_level ?? '',
    stroke_count: Number(row.stroke_count ?? 0),
    stroke_order: row.stroke_order || null,
    created_at: row.created_at || null,
  }
}

function normalizeLevel(level) {
  const clean = String(level ?? '').trim().toUpperCase()
  if (/^N[1-5]$/.test(clean)) return clean
  return ''
}

export async function getKanjiByLevel(level) {
  const normalizedLevel = normalizeLevel(level)

  if (!normalizedLevel) {
    throw new Error('Invalid JLPT level. Expected one of N5, N4, N3, N2, N1.')
  }

  if (levelCache.has(normalizedLevel)) {
    return levelCache.get(normalizedLevel)
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

  const mapped = (data ?? []).map(mapKanjiRow)
  levelCache.set(normalizedLevel, mapped)
  return mapped
}
