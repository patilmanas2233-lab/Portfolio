import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Manifesto3DTextProps {
  lines?: string[]
  className?: string
}

export default function Manifesto3DText({
  lines = ['FORM', 'FOLLOWS', 'COMPUTE.'],
  className = '',
}: Manifesto3DTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLHeadingElement | null)[]>([])

  useEffect(() => {
    const validLines = lineRefs.current.filter(Boolean) as HTMLHeadingElement[]
    if (validLines.length === 0 || !containerRef.current) return

    // Set initial 3D rotated state (rotateX: 90, opacity: 0)
    gsap.set(validLines, {
      rotateX: 90,
      opacity: 0,
      y: 40,
      transformOrigin: '50% 100% -20px',
    })

    // Animate each line into view along the X-axis with staggered ScrollTrigger
    const tween = gsap.to(validLines, {
      rotateX: 0,
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power4.out',
      stagger: 0.18,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
    })

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`select-none ${className}`}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          className="overflow-hidden py-1"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <h2
            ref={(el) => {
              lineRefs.current[index] = el
            }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[-0.03em] leading-[0.9] text-white will-change-[transform,opacity]"
          >
            {line}
          </h2>
        </div>
      ))}
    </div>
  )
}
