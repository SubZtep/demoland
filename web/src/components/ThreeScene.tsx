import * as THREE from "three"
import throttle from "lodash/throttle"
import CameraControls from "camera-controls"
import { type Component, type JSX, onMount, onCleanup, mergeProps } from "solid-js"
import { runForever } from "../lib/loop"
import { state } from "../app/state"

CameraControls.install({ THREE })
type LookAt = [number, number, number, number, number, number]

const ThreeScene: Component<{
  pid?: string
  colour?: string
  background?: THREE.Color
  alpha?: boolean
  /** Camera position and rotation */
  lookAt?: LookAt
  /** CSS class name */
  class?: string
  rotate?: boolean
  border?: boolean
  children: ({ scene, controls }: { scene: THREE.Scene; controls: CameraControls }) => JSX.Element
}> = rawProps => {
  const props = mergeProps({ colour: "#f3f6f9", lookAt: [1, 1, 1, 0, 0, 0] as LookAt, alpha: false }, rawProps)

  let renderer: THREE.WebGLRenderer
  let controls: CameraControls
  let resizer: ResizeObserver
  let wrapper: HTMLDivElement | undefined
  let canvas: HTMLCanvasElement | undefined

  const camera = new THREE.PerspectiveCamera(60, undefined, 0.01, 100)
  const scene = new THREE.Scene()

  if (props.background) {
    scene.background = props.background
  }

  onMount(() => {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: props.alpha,
      antialias: state.isDesktop,
      logarithmicDepthBuffer: state.isDesktop,
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    controls = new CameraControls(camera, canvas)
    controls.minDistance = 0.5
    controls.maxDistance = 80
    controls.setLookAt(...props.lookAt, false)
    if (props.rotate) {
      runForever.add(deltaTime => {
        controls.azimuthAngle += 3 * deltaTime * THREE.MathUtils.DEG2RAD
      })
    }

    runForever.add(delta => {
      controls.update(delta)
      renderer.render(scene, camera)
    })

    props.children({ scene, controls: controls! })

    const resizeRenderer = () => {
      const w = wrapper!.clientWidth - (props.border ? 4 : 0)
      const h = wrapper!.clientHeight - (props.border ? 4 : 0)
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    resizer = new ResizeObserver(throttle(resizeRenderer, 200))
    resizer.observe(wrapper!, { box: "content-box" })
  })

  onCleanup(() => {
    resizer?.disconnect()
  })

  return (
    <div ref={wrapper} data-pid={props.pid} style={`--colour: ${props.colour}`} class={props.class}>
      <canvas ref={canvas}></canvas>
    </div>
  )
}

export default ThreeScene
