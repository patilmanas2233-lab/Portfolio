import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlitchText from './GlitchText'
import { createProceduralSchematic } from '../utils/proceduralPatterns'

gsap.registerPlugin(ScrollTrigger)

export interface ProjectData {
  id: string
  title: string
  category: string
  year: string
  desc: string
  stack: string[]
  image?: string
  schematicType?: 'crypto' | 'intel' | 'heuristic'
  link?: string
}

interface InteractiveProjectCardProps {
  project: ProjectData
  index: number
}

export default function InteractiveProjectCard({
  project,
  index,
}: InteractiveProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const windowWrapperRef = useRef<HTMLDivElement>(null)
  const imageBoxRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const [proceduralSrc, setProceduralSrc] = useState<string>(() => {
    const type =
      project.schematicType ||
      (index === 0 ? 'crypto' : index === 1 ? 'intel' : 'heuristic')
    return createProceduralSchematic(type)
  })

  useEffect(() => {
    const type =
      project.schematicType ||
      (index === 0 ? 'crypto' : index === 1 ? 'intel' : 'heuristic')
    const dataUrl = createProceduralSchematic(type)
    setProceduralSrc(dataUrl)
  }, [project.schematicType, index])

  useEffect(() => {
    const meta = metaRef.current
    const windowWrapper = windowWrapperRef.current
    const imageBox = imageBoxRef.current
    const badge = badgeRef.current
    if (!windowWrapper || !imageBox || !badge) return

    // Initialize 3D preserve-3d and perspective
    gsap.set(imageBox, {
      transformPerspective: 1200,
      transformStyle: 'preserve-3d',
    })

    // Depth Layering: Push the badge 50px out in Z-space
    gsap.set(badge, {
      z: 50,
      opacity: 0,
      scale: 0.85,
    })

    // ─── DRAMATIC SLIDE-FROM-RIGHT SCROLL ENTRANCE ───────────────
    // The diagram (SPEC 1, 2, 3) starts 350px off to the right with 3D angle and blur
    const windowTween = gsap.fromTo(
      windowWrapper,
      {
        x: 350,
        opacity: 0,
        filter: 'blur(12px)',
        rotateY: -18,
        scale: 0.92,
      },
      {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        rotateY: 0,
        scale: 1,
        duration: 1.1,
        delay: (index % 3) * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: windowWrapper,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        onComplete: () => {
          // High-tech terminal CRT flash when window docks into position
          const targetImg = imageRef.current
          if (targetImg) {
            gsap.fromTo(
              targetImg,
              { filter: 'contrast(250%) brightness(180%)' },
              {
                filter: 'contrast(120%) brightness(50%)',
                duration: 0.4,
                ease: 'power2.out',
              }
            )
          }
        },
      }
    )

    // Left metadata text section slides in from the right too as requested
    let metaTween: gsap.core.Tween | null = null
    if (meta) {
      metaTween = gsap.fromTo(
        meta,
        {
          x: 200,
          opacity: 0,
          filter: 'blur(8px)',
        },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.0,
          delay: (index % 3) * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: windowWrapper,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }

    // Refresh ScrollTrigger calculations after rendering
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    // ─── 3D MOUSE TRACKING TILT & MAGNETIC BADGE ─────────────────
    const rotXTo = gsap.quickTo(imageBox, 'rotateX', {
      duration: 0.35,
      ease: 'power2.out',
    })
    const rotYTo = gsap.quickTo(imageBox, 'rotateY', {
      duration: 0.35,
      ease: 'power2.out',
    })

    const badgeXTo = gsap.quickTo(badge, 'x', {
      duration: 0.22,
      ease: 'power2.out',
    })
    const badgeYTo = gsap.quickTo(badge, 'y', {
      duration: 0.22,
      ease: 'power2.out',
    })

    const handleMouseMove = (e: MouseEvent) => {
      const rect = imageBox.getBoundingClientRect()
      const localX = e.clientX - rect.left
      const localY = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const normX = (localX - centerX) / centerX
      const normY = (localY - centerY) / centerY

      rotXTo(-normY * 10)
      rotYTo(normX * 10)

      badgeXTo(localX)
      badgeYTo(localY)
    }

    const handleMouseEnter = () => {
      // Fade in magnetic badge
      gsap.to(badge, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      })

      // Terminal Glitch Transition: black & white contrast stutter
      const targetImage = imageRef.current
      if (targetImage) {
        const tl = gsap.timeline()
        tl.to(targetImage, {
          filter: 'contrast(250%) invert(1)',
          clipPath: 'polygon(0 15%, 100% 15%, 100% 42%, 0 42%)',
          x: -8,
          duration: 0.04,
          ease: 'none',
        })
          .to(targetImage, {
            filter: 'contrast(180%) invert(0)',
            clipPath: 'polygon(0 58%, 100% 58%, 100% 88%, 0 88%)',
            x: 8,
            duration: 0.04,
            ease: 'none',
          })
          .to(targetImage, {
            filter: 'contrast(220%) invert(1)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            x: -3,
            duration: 0.04,
            ease: 'none',
          })
          .to(targetImage, {
            filter: 'none',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            x: 0,
            duration: 0.03,
            ease: 'none',
          })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(imageBox, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
      })

      gsap.to(badge, {
        opacity: 0,
        scale: 0.85,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    imageBox.addEventListener('mousemove', handleMouseMove)
    imageBox.addEventListener('mouseenter', handleMouseEnter)
    imageBox.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      if (windowTween.scrollTrigger) windowTween.scrollTrigger.kill()
      if (metaTween?.scrollTrigger) metaTween.scrollTrigger.kill()
      imageBox.removeEventListener('mousemove', handleMouseMove)
      imageBox.removeEventListener('mouseenter', handleMouseEnter)
      imageBox.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [index])

  const displayImageSrc = proceduralSrc || project.image || ''

  return (
    <div
      ref={cardRef}
      className="group relative border-b border-white/20 py-20 transition-colors hover:bg-white/[0.015]"
      data-cursor="interactive"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Project Metadata & Description (5 cols) */}
        <div
          ref={metaRef}
          className="lg:col-span-5 flex flex-col justify-between will-change-[transform,opacity,filter]"
        >
          <div>
            <div className="flex items-center gap-3 font-mono text-xs text-white/40 mb-4 uppercase tracking-wider">
              <span className="text-white/70">[{project.id}]</span>
              <span>•</span>
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>

            <GlitchText
              text={project.title}
              as="h3"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-white group-hover:underline"
              duration={0.9}
              delay={index * 0.08}
            />

            {/* Strict monospaced uppercase description */}
            <p className="mt-5 font-mono text-xs uppercase leading-relaxed text-white/70">
              {project.desc}
            </p>
          </div>

          {/* Tech Badges with thin 1px border */}
          <div className="mt-8 flex flex-wrap items-center font-mono">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="border border-white/30 px-2 py-1 mr-2 mb-2 font-mono text-[10px] uppercase text-white/80 inline-block bg-black/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Dramatic Slide-From-Right 3D Project Window (7 cols) */}
        <div
          ref={windowWrapperRef}
          className="lg:col-span-7 will-change-[transform,opacity,filter]"
          style={{ perspective: '1200px' }}
        >
          <div
            ref={imageBoxRef}
            className="relative overflow-hidden border border-white/30 bg-black aspect-[16/10] sm:aspect-[16/9] cursor-none will-change-transform grayscale contrast-[1.2] grayscale-[100%] saturate-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Corner Crosshairs / Targeting Brackets */}
            <div
              className="pointer-events-none absolute top-0 left-0 z-20"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="absolute top-0 left-0 w-4 h-[1px] bg-white" />
              <div className="absolute top-0 left-0 w-[1px] h-4 bg-white" />
            </div>
            <div
              className="pointer-events-none absolute top-0 right-0 z-20"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="absolute top-0 right-0 w-4 h-[1px] bg-white" />
              <div className="absolute top-0 right-0 w-[1px] h-4 bg-white" />
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-0 z-20"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-white" />
              <div className="absolute bottom-0 left-0 w-[1px] h-4 bg-white" />
            </div>
            <div
              className="pointer-events-none absolute bottom-0 right-0 z-20"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-white" />
              <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-white" />
            </div>

            {/* Procedural 1-bit high-contrast black & white static schematic */}
            {displayImageSrc ? (
              <img
                ref={imageRef}
                src={displayImageSrc}
                alt={project.title}
                className="h-full w-full object-cover grayscale contrast-[1.2] grayscale-[100%] saturate-0 scale-100 group-hover:grayscale group-hover:grayscale-[100%] group-hover:saturate-0 group-hover:contrast-[1.5] group-hover:brightness-150 group-hover:scale-105 transition-all duration-500 ease-out will-change-[transform,filter,clip-path]"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-black flex items-center justify-center font-mono text-xs text-white/40">
                GENERATING_SCHEMATIC...
              </div>
            )}

            {/* Schematic HUD Meta Labels */}
            <div
              className="pointer-events-none absolute top-3 left-3 border border-white/30 bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur-sm z-10"
              style={{ transform: 'translateZ(15px)' }}
            >
              SPEC_{project.id} // PROCEDURAL_B&amp;W
            </div>
            <div
              className="pointer-events-none absolute bottom-3 right-3 border border-white/30 bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/60 backdrop-blur-sm z-10"
              style={{ transform: 'translateZ(15px)' }}
            >
              1-BIT TELEVISION STATIC
            </div>

            {/* Magnetic Crosshair Badge floating at translateZ(50px) */}
            <div
              ref={badgeRef}
              className="pointer-events-none absolute top-0 left-0 z-30 -translate-x-1/2 -translate-y-1/2 font-mono text-xs tracking-widest uppercase bg-white text-black px-4 py-2 border border-black shadow-2xl"
              style={{
                mixBlendMode: 'difference',
                transformStyle: 'preserve-3d',
              }}
            >
              VIEW REPOSITORY ↗
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
