import * as THREE from "three"
import { css } from "@emotion/css"
import CameraControls from "camera-controls"
import { type Component, type JSX, onMount, onCleanup, mergeProps, createEffect } from "solid-js"
import { runForever } from "../../lib/loop"
import { state } from "../../state"

CameraControls.install({ THREE })
type LookAt = [number, number, number, number, number, number]

const ThreeScene: Component<{
  width: number
  height: number
  pid?: string
  background?: THREE.Color
  alpha?: boolean
  /** Camera position and rotation */
  lookAt?: LookAt
  /** CSS class name */
  class?: string
  rotate?: boolean
  children: ({ scene, controls }: { scene: THREE.Scene; controls: CameraControls }) => JSX.Element
}> = rawProps => {
  const props = mergeProps({ lookAt: [0.5, 1, 1, 0, 0.5, 0] as LookAt, alpha: false }, rawProps)

  let renderer: THREE.WebGLRenderer
  let controls: CameraControls
  // let resizer: ResizeObserver
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.shadowMap.enabled = true

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

    // const resizeRenderer = () => {
    //   const w = wrapper!.clientWidth
    //   const h = wrapper!.clientHeight
    //   renderer.setSize(w, h)
    //   camera.aspect = w / h
    //   camera.updateProjectionMatrix()
    // }

    // resizer = new ResizeObserver(throttle(resizeRenderer, 200))
    // resizer.observe(wrapper!, { box: "content-box" })
  })

  createEffect(() => {
    // console.log("THREE", [props.width, props.height])
    renderer.setSize(props.width, props.height)
    camera.aspect = props.width / props.height
    camera.updateProjectionMatrix()
  })

  // onCleanup(() => {
  //   resizer?.disconnect()
  // })

  return (
    <div
      ref={wrapper}
      data-pid={props.pid}
      class={[
        css`
          line-height: 0;
        `,
        props.class,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <canvas ref={canvas}></canvas>
    </div>
  )
}

export default ThreeScene
