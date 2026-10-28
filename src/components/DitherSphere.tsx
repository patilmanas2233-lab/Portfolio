import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { MathUtils } from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vPosition = position;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPixelSize;
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vViewPosition;

  // 8x8 Bayer Matrix for smooth 1-bit monochrome dithering
  float bayer8(vec2 p) {
    int x = int(mod(p.x, 8.0));
    int y = int(mod(p.y, 8.0));
    int idx = x + y * 8;
    float b8[64] = float[64](
       0.0/64.0, 32.0/64.0,  8.0/64.0, 40.0/64.0,  2.0/64.0, 34.0/64.0, 10.0/64.0, 42.0/64.0,
      48.0/64.0, 16.0/64.0, 56.0/64.0, 24.0/64.0, 50.0/64.0, 18.0/64.0, 58.0/64.0, 26.0/64.0,
      12.0/64.0, 44.0/64.0,  4.0/64.0, 36.0/64.0, 14.0/64.0, 46.0/64.0,  6.0/64.0, 38.0/64.0,
      60.0/64.0, 28.0/64.0, 52.0/64.0, 20.0/64.0, 62.0/64.0, 30.0/64.0, 54.0/64.0, 22.0/64.0,
       3.0/64.0, 35.0/64.0, 11.0/64.0, 43.0/64.0,  1.0/64.0, 33.0/64.0,  9.0/64.0, 41.0/64.0,
      51.0/64.0, 19.0/64.0, 59.0/64.0, 27.0/64.0, 49.0/64.0, 17.0/64.0, 57.0/64.0, 25.0/64.0,
      15.0/64.0, 47.0/64.0,  7.0/64.0, 39.0/64.0, 13.0/64.0, 45.0/64.0,  5.0/64.0, 37.0/64.0,
      63.0/64.0, 31.0/64.0, 55.0/64.0, 23.0/64.0, 61.0/64.0, 29.0/64.0, 53.0/64.0, 21.0/64.0
    );
    for (int i = 0; i < 64; i++) {
      if (i == idx) return b8[i];
    }
    return 0.0;
  }

  void main() {
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Completely bypassing standard Three.js lighting
    // Calculate custom internal directional lighting vector
    vec3 light = normalize(uLightDir);
    float diff = max(dot(norm, light), 0.0);

    // Blinn-phong specular highlight
    vec3 halfVec = normalize(light + viewDir);
    float spec = pow(max(dot(norm, halfVec), 0.0), 28.0);

    // Subtle edge rim/fresnel
    float fresnel = pow(1.0 - max(dot(norm, viewDir), 0.0), 3.0);

    // Brutalist topographical latitude bands moving across surface
    float bands = sin(vPosition.y * 12.0 + uTime * 0.7) * 0.07 +
                  cos(vPosition.x * 8.0 - uTime * 0.4) * 0.04;

    // Total procedural luminance
    float luminance = clamp(diff * 0.8 + spec * 0.5 + fresnel * 0.25 + bands + 0.05, 0.0, 1.0);

    // Screen-space 1-bit Bayer dither thresholding
    vec2 ditherCoord = floor(gl_FragCoord.xy / uPixelSize);
    float threshold = bayer8(ditherCoord);

    // 1-bit output: strictly 1.0 (white) or 0.0 (black)
    float bit = luminance > threshold ? 1.0 : 0.0;

    gl_FragColor = vec4(vec3(bit), 1.0);
  }
`

interface DitherSphereProps {
  radius?: number
  pixelSize?: number
}

export default function DitherSphere({ radius = 2.4, pixelSize = 2.5 }: DitherSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollRef = useRef<number>(0)
  const { size } = useThree()

  // Track global scroll position for scroll-driven scaling
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight || 1
      scrollRef.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelSize: { value: pixelSize },
      uLightDir: { value: new THREE.Vector3(1.2, 1.5, 1.0).normalize() },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [pixelSize, size.width, size.height]
  )

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Interactive Sphere Physics: Tracks mouse coordinates while calmly revolving like a galaxy from left to right by default
      const pointerX = state.pointer.x
      const pointerY = state.pointer.y
      const scroll = scrollRef.current

      // Central star rotates calmly around its polar axis from left to right (+ elapsedTime * 0.18)
      // while sharing the galactic inclination tilt (0.45 around X, -0.14 around Z)
      const targetRotY = pointerX * 0.85 + state.clock.elapsedTime * 0.18
      const targetRotX = -pointerY * 0.75 + 0.45
      const targetRotZ = -pointerX * 0.25 - 0.14

      // Apply smooth dampening with MathUtils.damp for a buttery, physical rolling delay
      const dampFactor = 3.5 // Lower number = more buttery inertia / slight physical delay
      meshRef.current.rotation.x = MathUtils.damp(meshRef.current.rotation.x, targetRotX, dampFactor, delta)
      meshRef.current.rotation.y = MathUtils.damp(meshRef.current.rotation.y, targetRotY, dampFactor, delta)
      meshRef.current.rotation.z = MathUtils.damp(meshRef.current.rotation.z, targetRotZ, dampFactor, delta)

      // Shrinks smoothly as you scroll down; returns to original scale on scroll up
      const targetSphereScale = MathUtils.lerp(1.0, 0.65, scroll)
      meshRef.current.scale.setScalar(
        MathUtils.damp(meshRef.current.scale.x, targetSphereScale, 3.5, delta)
      )
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  })

  return (
    <Sphere ref={meshRef} args={[radius, 128, 128]} position={[0, 0, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </Sphere>
  )
}
