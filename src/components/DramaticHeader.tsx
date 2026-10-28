import { useEffect, useRef, useState, useCallback, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface DramaticHeaderProps {
  lines: string[]
  className?: string
  lineClassName?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div'
  duration?: number
  stagger?: number
  delay?: number
  start?: string
  showTerminalCursor?: boolean
}

const GLYPHS = '█▓▒░▚▞0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_+-=[]{}|<>~/'

export default function DramaticHeader({
  lines,
  className = '',
  lineClassName = '',
  as: Component = 'h2',
  duration = 0.9,
  stagger = 0.15,
  delay = 0,
  start = 'top 85%',
  showTerminalCursor = true,
}: DramaticHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const cursorRef = useRef<HTMLSpanElement>(null)
  const [displayLines, setDisplayLines] = useState<string[]>(lines)

  const decryptLine = useCallback(
    (index: number, lineText: string, lineDelay: number) => {
      const state = { progress: 0 }
      const length = lineText.length

      gsap.to(state, {
        progress: 1,
        duration,
        delay: lineDelay,
        ease: 'power2.out',
        onUpdate: () => {
          const p = state.progress
          const resolved = Math.floor(p * length)

          let res = ''
          for (let i = 0; i < length; i++) {
            const char = lineText[i]
            if (char === ' ') {
              res += ' '
            } else if (i < resolved) {
              res += char
            } else {
              res += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            }
          }

          setDisplayLines((prev) => {
            const next = [...prev]
            next[index] = res
            return next
          })
        },
        onComplete: () => {
          setDisplayLines((prev) => {
            const next = [...prev]
            next[index] = lineText
            return next
          })
        },
      })
    },
    [duration]
  )

  const runEntranceAndDecrypt = useCallback(() => {
    const validLines = lineRefs.current.filter(Boolean) as HTMLSpanElement[]
    if (validLines.length === 0) return

    // Smooth physical entrance with soft blur and slide
    gsap.to(validLines, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out',
      stagger,
    })

    // Cryptographic text resolution per line
    lines.forEach((line, idx) => {
      decryptLine(idx, line, delay + idx * stagger)
    })
  }, [lines, stagger, delay, decryptLine])

  useEffect(() => {
    const validLines = lineRefs.current.filter(Boolean) as HTMLSpanElement[]
    if (validLines.length === 0 || !containerRef.current) return

    // Initial state: offset, hidden, softly blurred
    gsap.set(validLines, {
      opacity: 0,
      y: 30,
      filter: 'blur(8px)',
    })

    // ScrollTrigger: triggers physical slide + cryptographic decrypt
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start,
      onEnter: () => {
        runEntranceAndDecrypt()
      },
      onEnterBack: () => {
        runEntranceAndDecrypt()
      },
    })

    // Terminal blinking cursor timeline
    let cursorTimeline: gsap.core.Timeline | null = null
    if (cursorRef.current && showTerminalCursor) {
      cursorTimeline = gsap.timeline({ repeat: -1 })
      cursorTimeline
        .set(cursorRef.current, { opacity: 1 })
        .to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'steps(1)',
          delay: 0.2,
        })
        .to(cursorRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: 'steps(1)',
        })
    }

    return () => {
      trigger.kill()
      if (cursorTimeline) {
        cursorTimeline.kill()
      }
    }
  }, [runEntranceAndDecrypt, start, showTerminalCursor])

  const Tag = Component as ElementType

  return (
    <Tag ref={containerRef} className={`select-none ${className}`}>
      {displayLines.map((line, idx) => {
        const isLastLine = idx === lines.length - 1
        return (
          <span key={idx} className="block overflow-hidden py-1">
            <span
              ref={(el) => {
                lineRefs.current[idx] = el
              }}
              className={`inline-block will-change-[transform,filter,opacity] ${lineClassName}`}
            >
              {line}
            </span>
            {isLastLine && showTerminalCursor && (
              <span
                ref={cursorRef}
                className="inline-block w-[0.42em] h-[0.78em] bg-white ml-3 sm:ml-4 align-baseline select-none shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                aria-hidden="true"
              />
            )}
          </span>
        )
      })}
    </Tag>
  )
}
