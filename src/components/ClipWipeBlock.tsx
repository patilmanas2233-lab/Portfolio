import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ClipWipeBlockProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
  start?: string
  as?: 'p' | 'div' | 'span' | 'article'
}

export default function ClipWipeBlock({
  children,
  className = '',
  duration = 0.8,
  delay = 0,
  start = 'top 80%',
  as: Component = 'div',
}: ClipWipeBlockProps) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // Strict left-to-right clip-path wipe initial state
    gsap.set(el, {
      clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    })

    const tween = gsap.to(el, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration,
      ease: 'power2.inOut',
      delay,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill()
      }
    }
  }, [duration, delay, start])

  const Tag = Component as React.ElementType

  return (
    <Tag ref={elementRef} className={`will-change-[clip-path] ${className}`}>
      {children}
    </Tag>
  )
}
