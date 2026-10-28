import { useEffect, useRef, useState, useCallback, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CryptoScrollTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div'
  className?: string
  duration?: number
  delay?: number
  start?: string
  triggerOnHover?: boolean
  chars?: string
  showTerminalTag?: boolean
}

const TECH_CHARS = '█▓▒░▚▞0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_+-=[]{}|<>~/'

export default function CryptoScrollText({
  text,
  as: Component = 'span',
  className = '',
  duration = 1.0,
  delay = 0,
  start = 'top 85%',
  triggerOnHover = true,
  chars = TECH_CHARS,
  showTerminalTag = false,
}: CryptoScrollTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [displayText, setDisplayText] = useState(text)
  const [isResolved, setIsResolved] = useState(false)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const decrypt = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill()
    }

    setIsResolved(false)
    const state = { progress: 0 }
    const length = text.length

    tweenRef.current = gsap.to(state, {
      progress: 1,
      duration,
      delay,
      ease: 'power2.out',
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
          } else if (i === resolvedCount) {
            // Decrypting leading edge character
            result += chars[Math.floor(Math.random() * chars.length)]
          } else {
            // Randomized background scramble
            result += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        setDisplayText(result)
      },
      onComplete: () => {
        setDisplayText(text)
        setIsResolved(true)
      },
    })
  }, [text, chars, duration, delay])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // 1. Initial State: smooth slide-up + soft blur fade
    gsap.set(el, {
      opacity: 0,
      y: 28,
      filter: 'blur(8px)',
    })

    // 2. Coordinated ScrollTrigger entrance: physically animates in, then decrypts
    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => {
        // Physical entrance animation
        gsap.to(el, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
        })
        // Cryptographic decrypt sequence
        decrypt()
      },
      onEnterBack: () => {
        decrypt()
      },
    })

    return () => {
      trigger.kill()
      if (tweenRef.current) {
        tweenRef.current.kill()
      }
    }
  }, [decrypt, start])

  const handleMouseEnter = () => {
    if (triggerOnHover && isResolved) {
      decrypt()
    }
  }

  const Tag = Component as ElementType

  return (
    <Tag
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block select-none will-change-[transform,filter,opacity] ${className}`}
      data-cursor="interactive"
    >
      <span>{displayText}</span>
      {showTerminalTag && (
        <span
          className="inline-block w-2.5 h-5 bg-white ml-2 align-middle animate-pulse"
          aria-hidden="true"
        />
      )}
    </Tag>
  )
}
