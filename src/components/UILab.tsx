import { useState } from 'react'
import CryptoScrollText from './CryptoScrollText'
import FadeUp from './FadeUp'

export default function UILab() {
  const [toggleActive, setToggleActive] = useState(true)
  const [sliderVal, setSliderVal] = useState(85)
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('patilmanas2233@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 border-t border-white/20 flex flex-col gap-14">
      {/* Section Header */}
      <FadeUp direction="right" className="flex flex-wrap items-end justify-between gap-6 mix-blend-difference text-white">
        <div>
          <span className="font-mono text-xs tracking-widest text-white/50 uppercase block mb-3">
            [INDEX 03] // UI/UX LAB &amp; PROTOTYPE BENCH
          </span>
          <CryptoScrollText
            text="TACTILE MICRO-INTERACTIONS"
            as="h2"
            className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none"
            duration={0.9}
          />
        </div>
        <div className="font-mono text-xs text-white/50">
          PROVING DESIGN CRAFTSMANSHIP THROUGH CODE
        </div>
      </FadeUp>

      {/* Interactive Bento Showcase */}
      <FadeUp
        direction="right"
        delay={0.15}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs"
      >
        {/* Lab 01: Interactive Haptic Toggle & State Machine */}
        <div className="border border-white/20 p-8 bg-black/60 backdrop-blur-xl flex flex-col justify-between group hover:border-white/50 transition-colors">
          <div>
            <div className="flex items-center justify-between text-[10px] text-white/40 mb-4 uppercase">
              <span>MODULE // 01</span>
              <span>STATE_MACHINE</span>
            </div>
            <h3 className="text-white text-lg font-bold font-sans uppercase mb-2">
              Bespoke Switch Control
            </h3>
            <p className="text-white/60 text-[11px] leading-relaxed mb-6">
              Spring-physics toggling with custom tactile travel curve.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/80 text-xs">
              STATUS: {toggleActive ? 'ARMED // 1' : 'STANDBY // 0'}
            </span>
            <button
              onClick={() => setToggleActive(!toggleActive)}
              className={`relative h-7 w-14 rounded-full border transition-all duration-300 p-0.5 ${
                toggleActive
                  ? 'bg-white border-white'
                  : 'bg-black border-white/40'
              }`}
              data-cursor="interactive"
            >
              <div
                className={`h-5 w-5 rounded-full transition-transform duration-300 ${
                  toggleActive
                    ? 'translate-x-7 bg-black'
                    : 'translate-x-0 bg-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Lab 02: Responsive Friction Slider */}
        <div className="border border-white/20 p-8 bg-black/60 backdrop-blur-xl flex flex-col justify-between group hover:border-white/50 transition-colors">
          <div>
            <div className="flex items-center justify-between text-[10px] text-white/40 mb-4 uppercase">
              <span>MODULE // 02</span>
              <span>TACTILE_SLIDER</span>
            </div>
            <h3 className="text-white text-lg font-bold font-sans uppercase mb-2">
              Dynamic Damping Field
            </h3>
            <p className="text-white/60 text-[11px] leading-relaxed mb-6">
              Granular numeric steppers responding with mathematical friction.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <div className="flex justify-between text-xs text-white">
              <span>OUTPUT_POWER:</span>
              <span className="font-bold">{sliderVal}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full accent-white bg-white/20 h-1.5 appearance-none cursor-pointer"
              data-cursor="interactive"
            />
          </div>
        </div>

        {/* Lab 03: One-Click Haptic Terminal Link */}
        <div className="border border-white/20 p-8 bg-black/60 backdrop-blur-xl flex flex-col justify-between group hover:border-white/50 transition-colors">
          <div>
            <div className="flex items-center justify-between text-[10px] text-white/40 mb-4 uppercase">
              <span>MODULE // 03</span>
              <span>COMMUNICATION</span>
            </div>
            <h3 className="text-white text-lg font-bold font-sans uppercase mb-2">
              Instant Transmission
            </h3>
            <p className="text-white/60 text-[11px] leading-relaxed mb-6">
              One-click clipboard buffer injection with immediate HUD feedback.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={handleCopyEmail}
              className="w-full border border-white py-3 px-4 font-bold uppercase transition-all duration-300 hover:bg-white hover:text-black flex items-center justify-between text-xs"
              data-cursor="interactive"
            >
              <span>{copied ? 'BUFFER_COPIED ✓' : 'COPY TRANSMISSION EMAIL'}</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </FadeUp>
    </section>
  )
}
