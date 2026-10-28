import { Canvas } from '@react-three/fiber'
import { EffectComposer, Noise } from '@react-three/postprocessing'
import DitherSphere from './DitherSphere'
import OrbitStars from './OrbitStars'
import CameraRig from './CameraRig'

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0 !h-screen !w-screen z-0 pointer-events-none"
      camera={{ position: [0.8, 0, 5.2], fov: 50, near: 0.1, far: 50 }}
      eventSource={typeof document !== 'undefined' ? (document.getElementById('root') as HTMLElement) : undefined}
      eventPrefix="client"
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      {/* 
        Interactive 1-bit monochrome dithered sphere with physics tracking cursor
        bypassing standard Three.js lighting
      */}
      <DitherSphere radius={1.9} pixelSize={2.5} />

      {/* Dense field of delicate small glowing stars orbiting the central white circle responding to cursor movement */}
      <OrbitStars count={1400} radiusMin={2.12} radiusMax={5.6} />

      {/* Smooth camera parallax & scroll depth */}
      <CameraRig />

      {/* Subtle cinematic film grain noise pass across the WebGL background */}
      <EffectComposer>
        <Noise opacity={0.15} />
      </EffectComposer>
    </Canvas>
  )
}
