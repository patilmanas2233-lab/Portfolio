import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function InvertedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Ensure initial placement is off-screen until first mouse event
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 1,
    })

    // GSAP quickTo creates the smoothest zero-lag hardware-accelerated tracking
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3.out' })

    let isVisible = false

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        isVisible = true
        gsap.to(cursor, { opacity: 1, duration: 0.2 })
      }
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.65,
        duration: 0.12,
        ease: 'power2.out',
      })
    }

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: isHoveredRef.current ? 2.2 : 1,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    const handleMouseEnterInteractive = () => {
      isHoveredRef.current = true
      gsap.to(cursor, {
        scale: 2.2,
        rotate: 45,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    const handleMouseLeaveInteractive = () => {
      isHoveredRef.current = false
      gsap.to(cursor, {
        scale: 1,
        rotate: 0,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    const handleMouseLeaveWindow = () => {
      isVisible = false
      gsap.to(cursor, { opacity: 0, duration: 0.2 })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeaveWindow)

    // Attach listeners for interactive elements
    const attachInteractiveListeners = () => {
      const interactiveEls = document.querySelectorAll(
        'a, button, [data-cursor="interactive"], input, textarea'
      )
      interactiveEls.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive)
        el.addEventListener('mouseleave', handleMouseLeaveInteractive)
      })
      return interactiveEls
    }

    const interactiveEls = attachInteractiveListeners()

    // MutationObserver to attach to any newly mounted dynamic elements
    const observer = new MutationObserver(() => {
      attachInteractiveListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
      interactiveEls.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive)
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive)
      })
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] hidden md:block"
      style={{
        mixBlendMode: 'difference',
        willChange: 'transform',
      }}
    >
      {/* 
        Minimal brutalist geometric cursor shape with mix-blend-mode: difference 
        Inverts colors of any element it hovers over
      */}
      <div className="relative flex items-center justify-center h-5 w-5 bg-white border border-white">
        <div className="h-1.5 w-1.5 bg-black" />
      </div>
    </div>
  )
}
