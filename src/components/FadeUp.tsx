import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface FadeUpProps {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
  stagger?: number
  x?: number
  y?: number
  direction?: 'right' | 'up'
  duration?: number
  as?: 'div' | 'section' | 'article' | 'footer' | 'header' | 'li'
}

export default function FadeUp({
  children,
  className = '',
  id,
  delay = 0,
  stagger = 0,
  x = 220,
  y = 0,
  direction = 'right',
  duration = 1.0,
  as: Component = 'div',
}: FadeUpProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let triggerInstance: ScrollTrigger | null = null

    const initialX = direction === 'right' ? x : 0
    const initialY = direction === 'up' ? (y || 50) : 0

    if (stagger > 0 && el.children.length > 0) {
      // Stagger child elements
      gsap.set(el.children, {
        opacity: 0,
        x: initialX,
        y: initialY,
        filter: 'blur(8px)',
      })

      const tween = gsap.to(el.children, {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        duration,
        ease: 'power3.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
      triggerInstance = tween.scrollTrigger ?? null
    } else {
      // Animate container itself
      gsap.set(el, {
        opacity: 0,
        x: initialX,
        y: initialY,
        filter: 'blur(8px)',
      })

      const tween = gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        duration,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
      triggerInstance = tween.scrollTrigger ?? null
    }

    return () => {
      if (triggerInstance) {
        triggerInstance.kill()
      }
    }
  }, [delay, stagger, x, y, direction, duration])

  const Tag = Component as React.ElementType

  return (
    <Tag
      ref={containerRef}
      id={id}
      className={`will-change-[transform,opacity,filter] ${className}`}
    >
      {children}
    </Tag>
  )
}

export const SlideText = FadeUp
