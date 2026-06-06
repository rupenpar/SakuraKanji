export type JlptLevel = 'n5' | 'n4' | 'n3' | 'n2' | 'n1'

export type KanjiExample = {
  word: string
  reading: string
  meaning: string
}

export type KanjiEntry = {
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
