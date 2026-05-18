'use client'

import { useState, useCallback, useRef } from 'react'

const PIGS = [
  { delay: 0,   yPct: 18, size: 72, duration: 5.0, bobRate: 0.9 },
  { delay: 1.1, yPct: 44, size: 88, duration: 4.4, bobRate: 0.7 },
  { delay: 2.0, yPct: 68, size: 78, duration: 4.8, bobRate: 1.0 },
]

function FlyingPig({ size, style }: { size: number; style?: React.CSSProperties }) {
  const wingW = Math.round(size * 0.55)
  const wingH = Math.round(size * 0.38)

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', ...style }}>
      {/* Left wing */}
      <div style={{
        width: wingW,
        height: wingH,
        background: 'linear-gradient(135deg, #ffb3c6 0%, #ff85a1 100%)',
        borderRadius: '50% 50% 0 70%',
        marginRight: -Math.round(size * 0.15),
        transformOrigin: 'right center',
        animation: 'pigWingFlap 0.22s ease-in-out infinite alternate',
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
        zIndex: 0,
      }} />

      {/* Body */}
      <span style={{ fontSize: size, lineHeight: 1, zIndex: 1, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
        🐷
      </span>

      {/* Right wing */}
      <div style={{
        width: wingW,
        height: wingH,
        background: 'linear-gradient(225deg, #ffb3c6 0%, #ff85a1 100%)',
        borderRadius: '50% 50% 70% 0',
        marginLeft: -Math.round(size * 0.15),
        transformOrigin: 'left center',
        animation: 'pigWingFlap 0.22s ease-in-out infinite alternate-reverse',
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
        zIndex: 0,
      }} />
    </div>
  )
}

export default function FlyingPigEasterEgg() {
  const [active, setActive] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handleClick = useCallback(() => {
    if (active) return
    setActive(true)
    timeoutRef.current = setTimeout(() => setActive(false), 7500)
  }, [active])

  return (
    <>
      {/* Trigger */}
      <button
        onClick={handleClick}
        className="fixed bottom-4 left-4 z-50 w-7 h-7 flex items-center justify-center opacity-20 hover:opacity-60 transition-opacity duration-300 cursor-pointer select-none"
        aria-label="Easter egg"
        title=""
      >
        <span className="text-lg">🐷</span>
      </button>

      {/* Flying pigs */}
      {active && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          {PIGS.map((pig, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${pig.yPct}%`,
                left: 0,
                animation: `pigFlyAcross ${pig.duration}s linear ${pig.delay}s forwards, pigBob ${pig.bobRate}s ease-in-out ${pig.delay}s infinite`,
                opacity: 0,
              }}
            >
              <FlyingPig size={pig.size} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pigFlyAcross {
          0%   { transform: translateX(-220px); opacity: 0; }
          5%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateX(calc(100vw + 220px)); opacity: 0; }
        }
        @keyframes pigBob {
          0%, 100% { margin-top: 0px; }
          50%       { margin-top: -28px; }
        }
        @keyframes pigWingFlap {
          from { transform: scaleY(1)   rotate(-8deg); }
          to   { transform: scaleY(-1)  rotate(8deg); }
        }
      `}</style>
    </>
  )
}
