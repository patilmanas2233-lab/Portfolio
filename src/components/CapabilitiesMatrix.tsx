import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STACK_GROUPS = [
  {
    title: '01. SYSTEMS & NATIVE',
    items: [
      { name: 'Rust', spec: 'Memory safety & high-throughput systems' },
      { name: 'Tauri', spec: 'Ultra-lean native desktop application harness' },
      { name: 'C++', spec: 'Performance-critical compute & low-level algorithms' },
      { name: 'Python', spec: 'Automation, telemetry, & algorithmic tooling' },
    ],
  },
  {
    title: '02. GRAPHICS & SHADERS',
    items: [
      { name: 'WebGL / GLSL Shaders', spec: 'Custom procedural fragment & vertex shaders' },
      { name: 'Three.js & R3F', spec: '3D scene graph orchestration & camera rigs' },
      { name: 'Bayer Dithering', spec: 'Ordered 1-bit monochrome screen-space thresholding' },
      { name: 'GPU Post-Processing', spec: 'Hardware-accelerated film noise & vignette passes' },
    ],
  },
  {
    title: '03. FRONTEND ARCHITECTURE',
    items: [
      { name: 'React 19', spec: 'Modern concurrent runtime & server actions' },
      { name: 'TypeScript', spec: 'Strictly-typed contracts & zero-error compilation' },
      { name: 'Tailwind CSS v4', spec: 'High-performance tokenized design systems' },
      { name: 'Vite Ecosystem', spec: 'Sub-second HMR & optimized production bundling' },
    ],
  },
  {
    title: '04. KINETICS & PERFORMANCE',
    items: [
      { name: 'GSAP 3 & ScrollTrigger', spec: 'Physics-based timelines & viewport triggers' },
      { name: 'Variable Typography', spec: 'Real-time font-variation-settings interpolation' },
      { name: '60 FPS Frame Budget', spec: 'Hardware acceleration & zero layout shifts' },
      { name: 'Zero Input Lag', spec: 'gsap.quickTo mouse vector tracking' },
    ],
  },
]

export default function CapabilitiesMatrix() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const validItems = itemRefs.current.filter(Boolean) as HTMLLIElement[]
    if (validItems.length === 0 || !containerRef.current) return

    // 5. Matrix Data Cascade: Rapid decrypt snap effect
    // Start completely hidden
    gsap.set(validItems, {
      opacity: 0,
      x: 0,
      filter: 'brightness(2)',
    })

    // Instant snap into visibility one by one using stagger: 0.05 and step interpolation (no easing)
    const tween = gsap.to(validItems, {
      opacity: 1,
      filter: 'brightness(1)',
      duration: 0.01,
      ease: 'steps(1)',
      stagger: 0.05,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
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
      className="border border-white/20 p-8 sm:p-12 font-mono text-xs bg-black/60 backdrop-blur-md"
    >
      <div className="border-b border-white/20 pb-4 font-bold text-white uppercase flex items-center justify-between">
        <span className="text-sm tracking-wider">// CAPABILITIES MATRIX</span>
        <span className="text-white/40 text-[10px]">CASCADE: 0.05s STEP</span>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {STACK_GROUPS.map((group, groupIdx) => (
          <div key={group.title}>
            <span className="block font-bold text-white text-xs mb-4 pb-2 border-b border-white/10 tracking-wider">
              {group.title}
            </span>
            <ul className="space-y-4">
              {group.items.map((item, itemIdx) => {
                const globalIdx = groupIdx * 4 + itemIdx
                return (
                  <li
                    key={item.name}
                    ref={(el) => {
                      itemRefs.current[globalIdx] = el
                    }}
                    className="will-change-[opacity,filter]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-white inline-block" />
                      <strong className="text-white text-[13px] tracking-wide font-sans font-bold">
                        {item.name}
                      </strong>
                    </div>
                    <div className="text-white/50 text-[11px] mt-0.5 pl-3.5 leading-normal">
                      {item.spec}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
