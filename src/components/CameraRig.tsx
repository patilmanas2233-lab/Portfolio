import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraRig() {
  const { camera } = useThree()
  const scrollRef = useRef(0)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight || 1
      scrollRef.current = window.scrollY / maxScroll
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useFrame((_state, delta) => {
    const progress = Math.min(Math.max(scrollRef.current, 0), 1)

    // Camera targets responding to scroll and mouse
    const targetZ = THREE.MathUtils.lerp(5.2, 7.5, progress)
    const targetX = THREE.MathUtils.lerp(0.8, -1.2, progress) + mouseX.current * 0.35
    const targetY = THREE.MathUtils.lerp(0, -0.8, progress) - mouseY.current * 0.3

    const smoothing = 1 - Math.exp(-3 * delta)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, smoothing)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, smoothing)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, smoothing)

    // Subtle lookAt tracking
    camera.lookAt(0, 0, 0)
  })

  return null
}
