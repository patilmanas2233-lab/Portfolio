import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

interface GlitchTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div'
  className?: string
  duration?: number
  delay?: number
  triggerOnView?: boolean
  triggerOnHover?: boolean
  chars?: string
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~'

export default function GlitchText({
  text,
  as: Component = 'span',
  className = '',
  duration = 1.0,
  delay = 0,
  triggerOnView = true,
  triggerOnHover = true,
  chars = DEFAULT_CHARS,
}: GlitchTextProps) {
  const elementRef = useRef<HTMLElement>(null)
  const [displayText, setDisplayText] = useState(text)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const hasTriggeredRef = useRef(false)

  const runGlitch = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill()
    }

    const state = { progress: 0 }
    const length = text.length

    tweenRef.current = gsap.to(state, {
      progress: 1,
      duration,
      delay,
      ease: 'power2.inOut',
      onUpdate: () => {
        const progress = state.progress
        const resolvedCount = Math.floor(progress * length)

        let result = ''
        for (let i = 0; i < length; i++) {
          const char = text[i]
          if (char === ' ') {
            result += ' '
          } else if (i < resolvedCount) {
            result += char
          } else {
            // Scramble unsolved characters with random cryptographic symbols
            result += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        setDisplayText(result)
      },
      onComplete: () => {
        setDisplayText(text)
      },
    })
  }, [text, chars, duration, delay])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    if (!triggerOnView) {
      runGlitch()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true
            runGlitch()
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (tweenRef.current) {
        tweenRef.current.kill()
      }
    }
  }, [runGlitch, triggerOnView])

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      runGlitch()
    }
  }

  // Type-safe dynamic tag rendering
  const Tag = Component as React.ElementType

  return (
    <Tag
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      className={`select-none inline-block will-change-contents ${className}`}
      data-cursor="interactive"
    >
      {displayText}
    </Tag>
  )
}
