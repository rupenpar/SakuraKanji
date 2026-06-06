import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScenicBackdrop } from '../components/ScenicBackdrop'
import { StartCenterpiece } from '../components/StartCenterpiece'

export function LandingPage() {
  const [dim, setDim] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)
  const onDimChange = useCallback((v: boolean) => setDim(v), [])
  const prevOverflowRef = useRef<{
    bodyOverflow: string
    bodyOverflowX: string
    bodyOverflowY: string
    htmlOverflow: string
    htmlOverflowX: string
    htmlOverflowY: string
  } | null>(null)

  useEffect(() => {
    const body = document.body
    const html = document.documentElement

    if (!prevOverflowRef.current) {
      prevOverflowRef.current = {
        bodyOverflow: body.style.overflow,
        bodyOverflowX: body.style.overflowX,
        bodyOverflowY: body.style.overflowY,
        htmlOverflow: html.style.overflow,
        htmlOverflowX: html.style.overflowX,
        htmlOverflowY: html.style.overflowY,
      }
    }

    return () => {
      const prev = prevOverflowRef.current
      if (!prev) return
      body.style.overflow = prev.bodyOverflow
      body.style.overflowX = prev.bodyOverflowX
      body.style.overflowY = prev.bodyOverflowY
      html.style.overflow = prev.htmlOverflow
      html.style.overflowX = prev.htmlOverflowX
      html.style.overflowY = prev.htmlOverflowY
    }
  }, [])

  useLayoutEffect(() => {
    const body = document.body
    const html = document.documentElement

    if (!introComplete) {
      // Intro must never scroll.
      body.style.overflow = 'hidden'
      body.style.overflowX = 'hidden'
      body.style.overflowY = 'hidden'
      html.style.overflow = 'hidden'
      html.style.overflowX = 'hidden'
      html.style.overflowY = 'hidden'
      return
    }

    // After the intro animation, allow vertical scrolling (keep x locked).
    body.style.overflow = ''
    body.style.overflowX = 'hidden'
    body.style.overflowY = 'auto'
    html.style.overflow = ''
    html.style.overflowX = 'hidden'
    html.style.overflowY = 'auto'
  }, [introComplete])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <ScenicBackdrop dim={dim} />

      <main className="relative w-screen h-screen overflow-hidden">
        <StartCenterpiece
          onDimChange={onDimChange}
          onIntroComplete={() => setIntroComplete(true)}
        />
      </main>
    </div>
  )
}
