import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import KineticTypography from './KineticTypography'
import InvertedCursor from './InvertedCursor'
import CryptoScrollText from './CryptoScrollText'
import FadeUp from './FadeUp'
import DramaticHeader from './DramaticHeader'
import InteractiveProjectCard, { type ProjectData } from './InteractiveProjectCard'
import UILab from './UILab'
import CapabilitiesMatrix from './CapabilitiesMatrix'

/* ─── Top Header Navigation ─────────────────────────────── */
function Header() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/[0.1] bg-black/80 px-6 sm:px-12 py-3.5 font-mono text-xs uppercase tracking-widest backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="font-bold text-white hover:bg-white hover:text-black px-2 py-0.5 transition-colors font-sans tracking-tight"
          data-cursor="interactive"
        >
          MANAS PATIL <span className="text-white/40 font-mono text-[10px] ml-1">/ PORTFOLIO</span>
        </a>
        <div className="hidden sm:flex items-center gap-2 border border-white/20 px-2 py-0.5 bg-white/[0.02]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-white/60">ONLINE // 60FPS</span>
        </div>
      </div>

      <div className="hidden items-center gap-6 md:flex text-white/50 text-[11px]">
        <span>LOCATION: GLOBAL</span>
        <span>•</span>
        <span>CLK: {time || '00:00:00 UTC'}</span>
      </div>

      <nav className="flex items-center gap-2 sm:gap-4 text-white text-[11px]">
        <a
          href="#work"
          className="hover:bg-white hover:text-black px-2 py-1 transition-colors"
          data-cursor="interactive"
        >
          [WORK]
        </a>
        <a
          href="#lab"
          className="hover:bg-white hover:text-black px-2 py-1 transition-colors hidden sm:inline-block"
          data-cursor="interactive"
        >
          [UI LAB]
        </a>
        <a
          href="#manifesto"
          className="hover:bg-white hover:text-black px-2 py-1 transition-colors"
          data-cursor="interactive"
        >
          [MANIFESTO]
        </a>
        <a
          href="#matrix"
          className="hover:bg-white hover:text-black px-2 py-1 transition-colors hidden sm:inline-block"
          data-cursor="interactive"
        >
          [STACK]
        </a>
        <a
          href="#contact"
          className="hover:bg-white hover:text-black px-2 py-1 transition-colors"
          data-cursor="interactive"
        >
          [CONTACT]
        </a>
      </nav>
    </header>
  )
}

/* ─── Hero Section ──────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative flex flex-col justify-between px-6 sm:px-12 pt-28 pb-16 min-h-[92vh]">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4 font-mono text-[11px] tracking-wider text-white/60 uppercase">
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white">AVAILABLE FOR SELECTIVE COMMISSIONS • 2026</span>
        </div>
        <div>DISCIPLINE: DESIGN ENGINEERING &amp; CREATIVE CODE</div>
        <div>RENDER_MODE: PROCEDURAL 1-BIT GLSL DITHER</div>
      </div>

      {/* Main Kinetic Typography Header */}
      <div className="my-auto py-12 mix-blend-difference text-white">
        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 border border-white/20 bg-white/[0.03] text-white/70 uppercase">
            LEAD UI/UX DEVELOPER
          </span>
          <CryptoScrollText
            text="SPECIALIZING IN HIGH-PRECISION DIGITAL EXPERIENCES"
            className="font-mono text-xs tracking-wider text-white/60 uppercase hidden sm:inline-block"
            duration={0.9}
          />
        </div>

        {/* Dynamic variable weight responsive header reacting to mouse Euclidean distance */}
        <KineticTypography
          text="MANAS"
          minWeight={100}
          maxWeight={900}
          radius={480}
          className="font-display text-[20vw] leading-[0.8] font-black tracking-[-0.05em] text-white"
        />

        {/* Hero Narrative with Cryptographic Reveal */}
        <FadeUp
          direction="right"
          delay={0.2}
          className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/15 pt-8 font-mono text-xs text-white/80 items-start"
        >
          <div className="md:col-span-6">
            <CryptoScrollText
              text="CRAFTING INTERFACES WHERE ARCHITECTURAL RIGOR MEETS TACTILE MICRO-INTERACTION DESIGN. SPECIALIZED IN LOW-LATENCY RUNTIMES, WEBGPU/WEBGL RENDERING, AND ZERO-COMPROMISE DIGITAL PRODUCTS."
              as="p"
              className="leading-relaxed text-white/80 max-w-xl text-xs sm:text-[13px]"
              duration={1.2}
            />
          </div>

          <div className="md:col-span-3">
            <span className="block text-white font-bold mb-1">// HARDWARE METRICS</span>
            <ul className="space-y-1 text-white/60 text-[11px]">
              <li>• 60 FPS Frame Budget Enforced</li>
              <li>• Sub-100ms Input Interaction Latency</li>
              <li>• WCAG AA Contrast Compliance</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <span className="block text-white font-bold mb-1">// CORE TOOLCHAIN</span>
            <ul className="space-y-1 text-white/60 text-[11px]">
              <li>• Rust + Tauri Desktop Engine</li>
              <li>• React 19 + TypeScript Strictly Typed</li>
              <li>• GLSL Shaders &amp; Three.js Physics</li>
            </ul>
          </div>
        </FadeUp>
      </div>

      {/* Hero Bottom Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 font-mono text-xs uppercase">
        <div className="flex items-center gap-4">
          <a
            href="#work"
            className="border border-white bg-white px-7 py-3 font-bold text-black transition-all hover:bg-black hover:text-white hover:border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            data-cursor="interactive"
          >
            EXPLORE SELECTED WORK ↓
          </a>
          <a
            href="#contact"
            className="border border-white/30 px-7 py-3 text-white transition-all hover:border-white hover:bg-white hover:text-black"
            data-cursor="interactive"
          >
            GET IN TOUCH ↗
          </a>
        </div>
        <div className="text-white/40 flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-white/60" />
          <span>SCROLL DOWN TO INITIATE CRYPTOGRAPHIC DECRYPT</span>
        </div>
      </div>
    </section>
  )
}

/* ─── Archive Section with Tighter Spatial Rhythm ────────── */
const PROJECTS: ProjectData[] = [
  {
    id: '01',
    title: 'ZERO-KNOWLEDGE CRYPTO VAULT',
    category: 'CRYPTOGRAPHIC SECURITY / DESKTOP',
    year: '2026',
    desc: 'Local-first desktop password manager enforcing zero-knowledge architecture via Argon2id key derivation and AES-256-GCM encryption.',
    stack: ['RUST', 'TAURI V2', 'REACT 19', 'TYPESCRIPT'],
    schematicType: 'crypto',
    link: 'https://github.com/manaspatil',
  },
  {
    id: '02',
    title: 'DHRUVA // THREAT INTEL',
    category: 'FORENSIC INTELLIGENCE / NLP',
    year: '2026',
    desc: 'Dark web forensic intelligence platform leveraging DeBERTa NLP models and Tor SOCKS5 proxy routing pipelines.',
    stack: ['PYTHON', 'DEBERTA NLP', 'PLAYWRIGHT', 'TOR SOCKS5'],
    schematicType: 'intel',
    link: 'https://github.com/manaspatil',
  },
  {
    id: '03',
    title: 'HEURISTIC SCAM ENGINE',
    category: 'ANOMALY DETECTION / ML',
    year: '2025',
    desc: 'Hybrid anomaly detection system utilizing TF-IDF vectorization, logistic regression, and a 7-category heuristic rule engine.',
    stack: ['PYTHON', 'TF-IDF', 'LOGISTIC REGRESSION'],
    schematicType: 'heuristic',
    link: 'https://github.com/manaspatil',
  },
]

function ArchiveSection() {
  return (
    <section
      id="work"
      className="py-24 sm:py-32 px-6 sm:px-12 border-t border-white/20 flex flex-col gap-16"
    >
      <FadeUp direction="right" className="flex flex-wrap items-end justify-between gap-6 mix-blend-difference text-white">
        <div>
          <span className="font-mono text-xs tracking-widest text-white/50 uppercase block mb-3">
            [INDEX 02] // SELECTED REPOSITORY
          </span>
          <DramaticHeader
            lines={['PROJECT', 'ARCHIVE']}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none"
            duration={0.9}
            stagger={0.15}
            start="top 85%"
            showTerminalCursor={true}
          />
        </div>
        <div className="font-mono text-xs text-white/50">
          COUNT: [03] SPECIFICATIONS LOADED // 3D TILT ACTIVE
        </div>
      </FadeUp>

      {/* Interactive Project Cards with 3D Tilt, Glitch & Depth Badge */}
      <div className="divide-y divide-white/20 border-t border-white/20">
        {PROJECTS.map((project, idx) => (
          <InteractiveProjectCard key={project.id} project={project} index={idx} />
        ))}
      </div>
    </section>
  )
}

/* ─── Manifesto Section with Cryptographic Text Reveal ────── */
function ManifestoSection() {
  return (
    <section
      id="manifesto"
      className="py-24 sm:py-32 px-6 sm:px-12 border-t border-white/20 flex flex-col gap-16"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        {/* Left Column: Dramatic Cryptographic Reveal for "FORM FOLLOWS COMPUTE." */}
        <FadeUp direction="right" className="lg:col-span-7 mix-blend-difference text-white">
          <span className="font-mono text-xs tracking-widest text-white/50 uppercase block mb-5">
            [INDEX 04] // SYSTEM MANIFESTO
          </span>

          {/* Cryptographic Scroll Reveal Header with Terminal Cursor */}
          <DramaticHeader
            lines={['FORM', 'FOLLOWS', 'COMPUTE.']}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.03em] leading-[0.88] text-white"
            duration={0.9}
            stagger={0.15}
            start="top 85%"
            showTerminalCursor={true}
          />

          <div className="mt-8">
            <CryptoScrollText
              text="STRIPPING AWAY THE SUPERFLUOUS. NO GRADIENT NOISE, NO ARTIFICIAL AMBIENCE. A PURE COLLISION OF 1-BIT GLSL SHADERS, RESPONSIVE VARIABLE GEOMETRIES, AND MATHEMATICAL RECTITUDE. WE BUILD DIGITAL STRUCTURES MEANT TO WITHSTAND THE EROSION OF TEMPORARY DESIGN FADS."
              as="p"
              className="font-mono text-xs sm:text-sm leading-relaxed text-white/80 max-w-xl"
              duration={1.2}
            />
          </div>
        </FadeUp>

        {/* Right Column: Architectural Doctrine Matrix */}
        <FadeUp direction="right" delay={0.15} className="lg:col-span-5 mix-blend-difference text-white border border-white/20 p-8 sm:p-10 font-mono text-xs bg-black/60 backdrop-blur-xl">
          <div className="border-b border-white/20 pb-4 font-bold uppercase flex items-center justify-between">
            <span className="text-white text-sm">// CORE DESIGN PRINCIPLES</span>
            <span className="text-white/40 text-[10px]">AESTHETIC SPEC</span>
          </div>

          <div className="mt-6 space-y-6 text-white/70">
            <div>
              <span className="block font-bold text-white mb-1">01. PIXEL-PERFECT FIDELITY</span>
              Every micro-interaction is tuned with mathematical easing curves and sub-pixel alignment.
            </div>
            <div>
              <span className="block font-bold text-white mb-1">02. MATHEMATICAL LIGHTING</span>
              Bypassing Three.js PBR shaders in favor of hardware-native screen-space Bayer matrices.
            </div>
            <div>
              <span className="block font-bold text-white mb-1">03. SYSTEMS-LEVEL RIGOR</span>
              Engineered with Rust, Tauri, C++, and React 19 for maximum memory safety and frame rates.
            </div>
            <div>
              <span className="block font-bold text-white mb-1">04. DYNAMIC ACCESSIBILITY</span>
              Global blend inversion guaranteeing 100% legibility across rotating white 3D geometry.
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─── Capabilities Matrix Section with Rapid Step Cascade ─── */
function MatrixSection() {
  return (
    <section
      id="matrix"
      className="py-24 sm:py-32 px-6 sm:px-12 border-t border-white/20 flex flex-col gap-16"
    >
      <FadeUp direction="right" className="mix-blend-difference text-white">
        <span className="font-mono text-xs tracking-widest text-white/50 uppercase block mb-3">
          [INDEX 05] // ARCHITECTURAL TOOLCHAIN
        </span>
        <DramaticHeader
          lines={['SYSTEMS &', 'CAPABILITIES']}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none"
          duration={0.9}
          stagger={0.15}
          start="top 85%"
          showTerminalCursor={true}
        />
      </FadeUp>

      {/* Rapid Decrypt Snap Step Cascade: 0.05s stagger */}
      <FadeUp direction="right" delay={0.12} className="mix-blend-difference text-white">
        <CapabilitiesMatrix />
      </FadeUp>
    </section>
  )
}

/* ─── Footer & Contact Section ───────────────────────────── */
function FooterSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('patilmanas2233@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer
      id="contact"
      className="py-24 sm:py-32 px-6 sm:px-12 border-t border-white/20 font-mono text-xs flex flex-col gap-16"
    >
      <FadeUp direction="right" className="mix-blend-difference text-white flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
        <div>
          <span className="text-white/50 tracking-widest uppercase block mb-4">
            [INDEX 06] // TRANSMISSION TERMINAL
          </span>
          <DramaticHeader
            lines={["LET'S", 'BUILD.']}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none"
            duration={0.9}
            stagger={0.15}
            start="top 85%"
            showTerminalCursor={true}
          />
          <p className="mt-6 max-w-md text-white/70 leading-relaxed text-xs sm:text-sm">
            OPEN FOR TECHNICAL LEADERSHIP, BESPOKE CREATIVE CODE COMMISSIONS,
            AND HIGH-IMPACT PRODUCT ARCHITECTURE.
          </p>
        </div>

        <div className="flex flex-col gap-4 min-w-[320px]">
          {/* Direct Email link with One-Click Copy Feedback */}
          <button
            onClick={handleCopy}
            className="w-full border border-white bg-white px-8 py-4 text-center font-bold text-black uppercase transition-all duration-300 hover:bg-black hover:text-white flex items-center justify-between text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            data-cursor="interactive"
          >
            <span>{copied ? 'EMAIL_COPIED_TO_CLIPBOARD ✓' : 'TRANSMIT: patilmanas2233@gmail.com'}</span>
            <span>↗</span>
          </button>

          {/* Social Links */}
          <div className="flex flex-wrap gap-2 text-center">
            <a
              href="https://www.linkedin.com/in/manas-patil-2450b2336/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-white/20 py-2.5 px-4 text-white/70 transition-colors hover:border-white hover:text-white"
              data-cursor="interactive"
            >
              [LINKEDIN]
            </a>
            <a
              href="https://github.com/manaspatil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-white/20 py-2.5 px-4 text-white/70 transition-colors hover:border-white hover:text-white"
              data-cursor="interactive"
            >
              [GITHUB]
            </a>
            <a
              href="mailto:patilmanas2233@gmail.com"
              className="flex-1 border border-white/20 py-2.5 px-4 text-white/70 transition-colors hover:border-white hover:text-white"
              data-cursor="interactive"
            >
              [DIRECT]
            </a>
          </div>
        </div>
      </FadeUp>

      {/* Global Copyright & Specifications Locked Text */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-8 text-white/40 mix-blend-difference text-[11px]">
        <div>© 2026 Manas Anil Patil. ALL SPECIFICATIONS LOCKED.</div>
        <div>DESIGN ENGINEERING // SYSTEMS ARCHITECTURE &amp; WEBGL</div>
      </div>
    </footer>
  )
}

/* ─── Main Brutalist Overlay ─────────────────────────────── */
export default function Overlay() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 })

  return (
    <main className="relative z-10 w-full bg-transparent text-white">
      {/* Top Monochrome Hairline Scroll Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left bg-white"
        style={{ scaleX }}
      />

      {/* Global Inverted Custom Cursor driven by GSAP */}
      <InvertedCursor />

      <Header />
      <Hero />
      <ArchiveSection />
      <UILab />
      <ManifestoSection />
      <MatrixSection />
      <FooterSection />
    </main>
  )
}
