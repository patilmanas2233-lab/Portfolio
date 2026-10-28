import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface KineticTypographyProps {
  text?: string
  className?: string
  minWeight?: number
  maxWeight?: number
  radius?: number
}

export default function KineticTypography({
  text = 'MANAS',
  className = '',
  minWeight = 100,
  maxWeight = 900,
  radius = 380,
}: KineticTypographyProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[]
    if (letters.length === 0) return

    // Set initial resting weights
    letters.forEach((span) => {
      gsap.set(span, {
        fontVariationSettings: `'wght' ${minWeight + 200}`,
      })
    })

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY

      letters.forEach((span) => {
        const rect = span.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Exact pixel Euclidean distance from cursor to letter center
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY)

        // Proximity calculation: 1.0 when right over center, 0.0 at or beyond radius
        const proximity = Math.max(0, 1 - dist / radius)

        // Exponential power curve for punchy brutalist weight response
        const intensity = Math.pow(proximity, 1.3)
        const targetWeight = Math.round(minWeight + intensity * (maxWeight - minWeight))

        // Animate the variable font weight via GSAP
        gsap.to(span, {
          fontVariationSettings: `'wght' ${targetWeight}`,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    }

    const handleMouseLeave = () => {
      // Smoothly return all letters to resting weight when cursor leaves window
      letters.forEach((span) => {
        gsap.to(span, {
          fontVariationSettings: `'wght' ${minWeight + 150}`,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [minWeight, maxWeight, radius, text])

  const characters = text.split('')

  return (
    <h1
      ref={containerRef}
      className={`select-none font-sans uppercase tracking-tighter leading-none text-white ${className}`}
      style={{ fontOpticalSizing: 'auto' }}
    >
      {characters.map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            lettersRef.current[index] = el
          }}
          className="inline-block transition-transform duration-75 will-change-[font-variation-settings]"
          style={{
            fontVariationSettings: `'wght' ${minWeight + 200}`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  )
}
