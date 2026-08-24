import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import { ScenicBackdrop } from '../components/ScenicBackdrop'
import { StartCenterpiece } from '../components/StartCenterpiece'

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div
      ref={containerRef}
      className="no-scrollbar"
      style={{
        height: '150vh',
        position: 'relative',
        background: '#f8f3f1',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <ScenicBackdrop dim={false} />
        <StartCenterpiece scrollProgress={scrollYProgress} />
      </div>
    </div>
  )
}
