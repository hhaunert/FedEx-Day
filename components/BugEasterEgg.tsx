'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const BUG_TYPES = [
  { emoji: '🪲', name: 'beetle' },
  { emoji: '🐜', name: 'ant' },
  { emoji: '🪳', name: 'cockroach' },
  { emoji: '🕷️', name: 'spider' },
  { emoji: '🦗', name: 'cricket' },
  { emoji: '🐛', name: 'caterpillar' },
  { emoji: '🪰', name: 'fly' },
]

interface Bug {
  id: number
  emoji: string
  x: number
  y: number
  angle: number
  speed: number
  size: number
  turnRate: number
  wobble: number
  wobbleSpeed: number
}

function createBug(id: number): Bug {
  const type = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)]
  return {
    id,
    emoji: type.emoji,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    angle: Math.random() * 360,
    speed: 1.5 + Math.random() * 3,
    size: 18 + Math.floor(Math.random() * 20),
    turnRate: (Math.random() - 0.5) * 6,
    wobble: 0,
    wobbleSpeed: 0.05 + Math.random() * 0.1,
  }
}

export default function BugEasterEgg() {
  const [active, setActive] = useState(false)
  const bugsRef = useRef<Bug[]>([])
  const frameRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const animate = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const w = window.innerWidth
    const h = window.innerHeight

    bugsRef.current = bugsRef.current.map((bug) => {
      const wobble = bug.wobble + bug.wobbleSpeed
      const angleRad = (bug.angle * Math.PI) / 180
      let x = bug.x + Math.cos(angleRad) * bug.speed
      let y = bug.y + Math.sin(angleRad) * bug.speed
      let angle = bug.angle + bug.turnRate + Math.sin(wobble) * 2.5

      // Bounce off edges with a turn inward
      if (x < 0) { x = 0; angle = 180 - angle }
      if (x > w) { x = w; angle = 180 - angle }
      if (y < 0) { y = 0; angle = -angle }
      if (y > h) { y = h; angle = -angle }

      return { ...bug, x, y, angle, wobble }
    })

    bugsRef.current.forEach((bug) => {
      const el = container.querySelector<HTMLElement>(`[data-bug="${bug.id}"]`)
      if (!el) return
      el.style.transform = `translate(${bug.x}px, ${bug.y}px) rotate(${bug.angle}deg)`
    })

    frameRef.current = requestAnimationFrame(animate)
  }, [])

  const handleClick = useCallback(() => {
    if (active) return
    setActive(true)

    const count = 120 + Math.floor(Math.random() * 80)
    bugsRef.current = Array.from({ length: count }, (_, i) => createBug(i))

    // Start animation after state renders the bugs
    requestAnimationFrame(() => {
      frameRef.current = requestAnimationFrame(animate)
    })

    timeoutRef.current = setTimeout(() => {
      cancelAnimationFrame(frameRef.current)
      setActive(false)
      bugsRef.current = []
    }, 5000)
  }, [active, animate])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleClick}
        className="fixed bottom-4 right-4 z-50 w-7 h-7 flex items-center justify-center opacity-20 hover:opacity-60 transition-opacity duration-300 cursor-pointer select-none"
        aria-label="Easter egg"
        title=""
      >
        <span className="text-lg">🐛</span>
      </button>

      {/* Bug swarm overlay */}
      {active && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          style={{ animation: 'bugFadeOut 0.5s ease-out 4.5s forwards' }}
        >
          {bugsRef.current.map((bug) => (
            <span
              key={bug.id}
              data-bug={bug.id}
              className="absolute top-0 left-0 leading-none select-none will-change-transform"
              style={{
                fontSize: bug.size,
                transform: `translate(${bug.x}px, ${bug.y}px) rotate(${bug.angle}deg)`,
              }}
            >
              {bug.emoji}
            </span>
          ))}
        </div>
      )}

      <style>{`
        @keyframes bugFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </>
  )
}
