import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { KanjiBubble } from '../components/KanjiBubble'
import { KanjiScrollModal } from '../components/KanjiScrollModal'
import { ScenicBackdrop } from '../components/ScenicBackdrop'
import { isJlptLevel } from '../lib/levels'
import { getKanjiByLevel } from '../services/kanjiService.ts'
import type { KanjiEntry } from '../types/kanji'

export function JlptLevelPage() {
  const params = useParams()
  const levelRaw = params.level

  const level = isJlptLevel(levelRaw) ? levelRaw : null

  const [list, setList] = useState<KanjiEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selected, setSelected] = useState<KanjiEntry | null>(null)

  useEffect(() => {
    if (!level) return
    const selectedLevel = level

    let active = true

    async function loadKanji() {
      setLoading(true)
      setError(null)
      setSelected(null)

      try {
        const rows = await getKanjiByLevel(selectedLevel)
        if (!active) return
        setList(rows)
      } catch (err) {
        if (!active) return
        const message = err instanceof Error ? err.message : 'Unable to load kanji for this level.'
        setError(message)
        setList([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadKanji()

    return () => {
      active = false
    }
  }, [level])

  const levelLabel = useMemo(() => (level ? level.toUpperCase() : ''), [level])

  if (!level) return <Navigate to="/" replace />

  return (
    <div className="relative min-h-svh">
      <ScenicBackdrop tone="grounded" />

      <main className="relative w-full min-h-svh px-4 sm:px-6 pt-4 pb-12">
        <div className="w-full rounded-none border-0 bg-transparent px-0 pt-4 pb-10">
          <div className="flex items-center justify-between gap-4 px-1 sm:px-2">
            <Link
              to="/"
              className="rounded-full border border-ink-900/18 bg-white/38 hover:bg-white/52 transition px-4 py-2 text-xs tracking-[0.26em] text-ink-900/80 shadow-[0_16px_40px_rgba(26,20,20,0.14)] hover:-translate-y-0.5"
            >
              ← 戻る
            </Link>
            <div className="text-xs tracking-[0.28em] text-ink-900/55">MADE BY RUPEN</div>
          </div>

          <header className="mt-8 text-center">
            <div className="text-[clamp(26px,4.2vmin,44px)] tracking-[0.10em] text-ink-900">
              JLPT {levelLabel}
            </div>
            <div className="mt-3 text-sm text-ink-900/65">
              Choose a kanji. Slow down. Let it unfold.
            </div>
          </header>

          <section className="mt-10 w-full">
            {loading ? <LoadingState level={levelLabel} /> : null}

            {!loading && error ? (
              <ErrorState
                message={error}
                onRetry={async () => {
                  setLoading(true)
                  setError(null)
                  try {
                    const rows = await getKanjiByLevel(level)
                    setList(rows)
                  } catch (err) {
                    const message =
                      err instanceof Error ? err.message : 'Unable to load kanji for this level.'
                    setError(message)
                  } finally {
                    setLoading(false)
                  }
                }}
              />
            ) : null}

            {!loading && !error && list.length === 0 ? <EmptyState level={levelLabel} /> : null}

            {!loading && !error && list.length > 0 ? (
              <div className="mx-auto grid w-full max-w-7xl grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 sm:gap-7 place-items-center px-2 sm:px-4">
                {list.map((k, idx) => (
                  <KanjiBubble
                    key={k.id}
                    kanji={k.kanji}
                    index={idx}
                    layoutId={`kanji-${k.id}`}
                    onClick={() => setSelected(k)}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <KanjiScrollModal
          open={selected != null}
          entry={selected}
          layoutId={selected ? `kanji-${selected.id}` : null}
          onClose={() => setSelected(null)}
        />
      </main>
    </div>
  )
}

function LoadingState({ level }: { level: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-ink-900/12 bg-white/36 ring-1 ring-ink-900/6 p-8 text-center">
      <div className="text-xs tracking-[0.30em] text-ink-700/70">読み込み中</div>
      <div className="mt-3 text-sm text-ink-900/75">Preparing JLPT {level} kanji garden...</div>
      <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-ink-900/35 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-900/40 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-900/45 animate-bounce" />
      </div>
    </div>
  )
}

function EmptyState({ level }: { level: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-ink-900/12 bg-white/34 ring-1 ring-ink-900/6 p-8 text-center">
      <div className="text-xs tracking-[0.30em] text-ink-700/70">空</div>
      <div className="mt-3 text-sm text-ink-900/75">
        No kanji records found for JLPT {level}.
      </div>
    </div>
  )
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => Promise<void>
}) {
  const [retrying, setRetrying] = useState(false)

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-red-900/18 bg-white/36 ring-1 ring-red-900/10 p-8 text-center">
      <div className="text-xs tracking-[0.30em] text-red-900/70">接続エラー</div>
      <div className="mt-3 text-sm text-ink-900/80">{message}</div>
      <button
        type="button"
        className="mt-6 rounded-full border border-ink-900/18 bg-white/42 px-5 py-2 text-xs tracking-[0.24em] text-ink-900/80 hover:bg-white/58 transition disabled:opacity-60"
        disabled={retrying}
        onClick={async () => {
          setRetrying(true)
          try {
            await onRetry()
          } finally {
            setRetrying(false)
          }
        }}
      >
        {retrying ? '再試行中...' : '再試行'}
      </button>
    </div>
  )
}
