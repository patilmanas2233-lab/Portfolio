import Scene from './components/Scene'
import Overlay from './components/Overlay'

export default function App() {
  return (
    <>
      {/* Full-screen fixed 3D canvas background */}
      <Scene />

      {/* Scrollable HTML UI layer over the canvas */}
      <Overlay />
    </>
  )
}
