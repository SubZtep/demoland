import { useEffect, useRef } from "react"
import * as THREE from "three"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import CameraControls from "camera-controls"

CameraControls.install({ THREE })
type LookAt = [number, number, number, number, number, number]

interface Props {
  landmarks?: NormalizedLandmark[]
  width: number
  height: number
}

export default function ThreeScene({ landmarks, width, height }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderer = useRef<THREE.WebGLRenderer>()
  const controls = useRef<CameraControls>()
  const camera = useRef(new THREE.PerspectiveCamera(60, undefined, 0.01, 100))
  const scene = useRef(new THREE.Scene())

  useEffect(() => {
    renderer.current = new THREE.WebGLRenderer({
      canvas: canvas.current!,
      antialias: true,
      logarithmicDepthBuffer: true,
    })
    renderer.current.setPixelRatio(window.devicePixelRatio)
    renderer.current.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.current.shadowMap.enabled = true

    controls.current = new CameraControls(camera.current, canvas.current!)
    controls.current.minDistance = 0.5
    controls.current.maxDistance = 80
    controls.current.setLookAt(0.5, 1, 1, 0, 0.5, 0, false)

    scene.current.background = new THREE.Color("darkred")

    function animate() {
      requestAnimationFrame(animate)
      renderer.current!.render(scene.current, camera.current)
    }
    animate()
  }, [])

  return <canvas ref={canvas} width={width} height={height} />
}
