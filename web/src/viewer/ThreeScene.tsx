import { useEffect, useRef } from "react"
import * as THREE from "three"
import CameraControls from "camera-controls"

CameraControls.install({ THREE })
type LookAt = [number, number, number, number, number, number]

interface Props {
  width: number
  height: number
  children: ({ scene, controls }: { scene: THREE.Scene; controls: CameraControls }) => JSX.Element
}

export default function ThreeScene({ width, height, children }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderer = useRef<THREE.WebGLRenderer>()
  const controls = useRef<CameraControls>()
  const camera = useRef(new THREE.PerspectiveCamera(60, width / height, 0.01, 100))
  const scene = useRef(new THREE.Scene())

  const setSize = (w: number, h: number) => {
    camera.current.aspect = w / h
    camera.current.updateProjectionMatrix()
    renderer.current?.setSize(w, h)
  }

  useEffect(() => {
    renderer.current = new THREE.WebGLRenderer({
      canvas: canvas.current!,
      antialias: true,
      logarithmicDepthBuffer: true,
    })
    renderer.current.setPixelRatio(window.devicePixelRatio)
    renderer.current.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.current.shadowMap.enabled = true

    controls.current = new CameraControls(camera.current, renderer.current.domElement)
    controls.current.minDistance = 0.5
    controls.current.maxDistance = 80
    controls.current.setLookAt(0, 2, -10, 0, 0, 0, false)

    scene.current.background = new THREE.Color("darkred")

    // setSize(width, height)
    const clock = new THREE.Clock()

    function animate() {
      const delta = clock.getDelta()
      controls.current?.update(delta)
      requestAnimationFrame(animate)
      renderer.current!.render(scene.current, camera.current)
    }
    animate()
  }, [])

  return (
    <>
      <canvas
        ref={canvas}
        // width={width}
        // height={height}
      />
      {children({ scene: scene.current, controls: controls.current! })}
    </>
  )
}
