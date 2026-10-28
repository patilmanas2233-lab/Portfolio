import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MathUtils } from 'three'

interface OrbitStarsProps {
  count?: number
  radiusMin?: number
  radiusMax?: number
}

const starVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;

  attribute float aRadius;
  attribute float aTheta;
  attribute float aHeight;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aPhase;

  varying float vPhase;
  varying float vSpeed;

  void main() {
    vPhase = aPhase;
    vSpeed = aSpeed;

    // ─── GALAXY REVOLUTION FROM LEFT TO RIGHT (CALM & SLOWER PACE) ───
    // Calmer, majestic speed (0.68 multiplier)
    float orbitalVelocity = (0.68 / sqrt(aRadius)) * aSpeed;
    float currentAngle = aTheta + uTime * orbitalVelocity;

    // Coordinates in the horizontal galactic plane
    vec3 galacticPos = vec3(
      aRadius * sin(currentAngle),
      aHeight + sin(currentAngle * 2.5 + aPhase) * 0.05,
      aRadius * cos(currentAngle)
    );

    // Galactic tilt inclination: 26 degrees around X, -8 degrees around Z
    float tiltX = 0.45;
    float tiltZ = -0.14;
    mat3 rotX = mat3(
      1.0, 0.0, 0.0,
      0.0, cos(tiltX), -sin(tiltX),
      0.0, sin(tiltX), cos(tiltX)
    );
    mat3 rotZ = mat3(
      cos(tiltZ), -sin(tiltZ), 0.0,
      sin(tiltZ), cos(tiltZ), 0.0,
      0.0, 0.0, 1.0
    );

    vec3 pos = rotZ * rotX * galacticPos;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // ─── SCROLL DRIVEN SIZE: SMALL BY DEFAULT, SHRINKS ON SCROLL DOWN, RESTORES ON SCROLL UP ───
    float scrollScale = mix(1.0, 0.32, clamp(uScroll, 0.0, 1.0));
    float twinkle = 0.72 + 0.28 * sin(uTime * aSpeed * 2.0 + aPhase);
    float pSize = aSize * (28.0 / -mvPosition.z) * twinkle * scrollScale;

    // Delicate small micro-glints with glowing ambience by default, scaling down smoothly
    gl_PointSize = clamp(pSize, 1.2, 9.5 * scrollScale);
  }
`

const starFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;

  varying float vPhase;
  varying float vSpeed;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // 1. Needle-sharp luminous white star core
    float core = smoothstep(0.12, 0.0, dist) * 1.6;

    // 2. Concentrated luminous inner halo
    float innerGlow = smoothstep(0.30, 0.02, dist) * 0.85;

    // 3. Wide ambient glowing aura (soft cosmic ambience)
    float ambientGlow = pow(clamp(1.0 - dist * 2.0, 0.0, 1.0), 2.2) * 0.75;

    // 4. Subtle, delicate 4-point celestial diffraction cross
    float crossSpike = max(
      smoothstep(0.46, 0.0, abs(coord.x) * 5.5 + abs(coord.y)),
      smoothstep(0.46, 0.0, abs(coord.y) * 5.5 + abs(coord.x))
    ) * 0.45;

    // Twinkling pulsation
    float twinkle = 0.75 + 0.25 * sin(uTime * vSpeed * 2.2 + vPhase);

    // Composite glowing ambience
    float totalGlow = (core + innerGlow + ambientGlow + crossSpike) * twinkle;

    // Soft feathered outer edge
    float alpha = smoothstep(0.5, 0.12, dist) * clamp(totalGlow, 0.0, 1.0);

    // Pure monochrome white glowing star
    gl_FragColor = vec4(vec3(1.0), alpha * 0.95);
  }
`

export default function OrbitStars({
  count = 1400,
  radiusMin = 2.40,
  radiusMax = 6.2,
}: OrbitStarsProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollRef = useRef<number>(0)

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

  // Generate galactic disk and halo distribution
  const [radii, thetas, heights, speeds, sizes, phases, dummyPositions] = useMemo(() => {
    const rad = new Float32Array(count)
    const th = new Float32Array(count)
    const ht = new Float32Array(count)
    const sp = new Float32Array(count)
    const sz = new Float32Array(count)
    const ph = new Float32Array(count)
    const dummy = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // 1. Orbital radius: clustered around the central white circle with outward dispersion
      const r = radiusMin + Math.pow(Math.random(), 1.5) * (radiusMax - radiusMin)
      rad[i] = r

      // 2. Initial orbital azimuth angle
      th[i] = Math.random() * Math.PI * 2

      // 3. Height above galactic plane:
      // 75% in a realistic tilted galactic disk, 25% in outer spherical halo
      const isDisk = Math.random() < 0.75
      if (isDisk) {
        ht[i] = (Math.random() - 0.5) * 0.60 * (1.0 + (r - radiusMin) * 0.25)
      } else {
        ht[i] = (Math.random() - 0.5) * r * 0.75
      }

      // 4. Orbital speed multiplier
      sp[i] = 0.65 + Math.random() * 0.75

      // 5. Small, delicate star sizes by default (0.22 to 0.60)
      sz[i] = 0.22 + Math.random() * 0.38

      // 6. Twinkling phase
      ph[i] = Math.random() * Math.PI * 2

      // Initial positions for Three.js bounding calculations
      dummy[i * 3] = r * Math.sin(th[i])
      dummy[i * 3 + 1] = ht[i]
      dummy[i * 3 + 2] = r * Math.cos(th[i])
    }

    return [rad, th, ht, sp, sz, ph, dummy]
  }, [count, radiusMin, radiusMax])

  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.frustumCulled = false
    }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    []
  )

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const pointerX = state.pointer.x
    const pointerY = state.pointer.y
    const scroll = scrollRef.current

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
      materialRef.current.uniforms.uScroll.value = scroll
      materialRef.current.uniforms.uPointer.value.set(pointerX, pointerY)
    }

    if (groupRef.current) {
      // Interactive 3D tilt tracking cursor movement
      const targetRotY = pointerX * 0.85
      const targetRotX = -pointerY * 0.75
      const targetRotZ = pointerX * 0.18

      // Multi-layer parallax translation tracking cursor
      const targetPosX = pointerX * 0.55
      const targetPosY = pointerY * 0.45

      // Smooth dampening for physical buttery inertia
      groupRef.current.rotation.y = MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3.2,
        delta
      )
      groupRef.current.rotation.x = MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        3.2,
        delta
      )
      groupRef.current.rotation.z = MathUtils.damp(
        groupRef.current.rotation.z,
        targetRotZ,
        3.2,
        delta
      )

      groupRef.current.position.x = MathUtils.damp(
        groupRef.current.position.x,
        targetPosX,
        3.5,
        delta
      )
      groupRef.current.position.y = MathUtils.damp(
        groupRef.current.position.y,
        targetPosY,
        3.5,
        delta
      )

      // As you scroll down, the galaxy contracts/shrinks; scrolling back up smoothly returns it to original scale
      const targetGroupScale = MathUtils.lerp(1.0, 0.65, scroll)
      const currentScale = MathUtils.damp(groupRef.current.scale.x, targetGroupScale, 3.5, delta)
      groupRef.current.scale.setScalar(currentScale)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dummyPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-aRadius"
            args={[radii, 1]}
          />
          <bufferAttribute
            attach="attributes-aTheta"
            args={[thetas, 1]}
          />
          <bufferAttribute
            attach="attributes-aHeight"
            args={[heights, 1]}
          />
          <bufferAttribute
            attach="attributes-aSpeed"
            args={[speeds, 1]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[phases, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
