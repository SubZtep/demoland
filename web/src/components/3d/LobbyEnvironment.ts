import * as THREE from "three"
import type CameraControls from "camera-controls"
import { onMount, onCleanup, type Component } from "solid-js"

const LobbyEnvironment: Component<{ scene: THREE.Scene; controls: CameraControls }> = props => {
  const ambient = new THREE.AmbientLight(0xffffff, 0.35)
  const light = new THREE.DirectionalLight(0xffffff, 0.5)
  const grid = new THREE.GridHelper(50, 50)

  light.castShadow = true
  light.position.set(-8, 15, 1)
  light.target.position.set(5, 10, -1)
  light.shadow.camera.near = 5
  light.shadow.camera.far = 25
  const side = 10
  light.shadow.camera.top = side
  light.shadow.camera.bottom = -side
  light.shadow.camera.left = side
  light.shadow.camera.right = -side

  onMount(() => {
    props.controls.setLookAt(-10, 2, 0, 0, 0, 0, false)

    loadSkybox().then(texture => {
      props.scene.background = texture
    })

    props.scene.add(
      ambient,
      light,
      grid,
      // new THREE.DirectionalLightHelper(light),
      // new THREE.CameraHelper(light.shadow.camera),
    )
  })

  onCleanup(() => {
    props.scene.remove(ambient, light, grid)
  })

  return null
}

export default LobbyEnvironment

async function loadSkybox(nr = 4): Promise<THREE.CubeTexture> {
  return new Promise((resolve, reject) => {
    if (nr < 1 || nr > 15) {
      return reject("a valid skybox number is between 1 and 15")
    }
    const loader = new THREE.CubeTextureLoader()
    const onError = (err: ErrorEvent) => reject(err)
    const onLoad = (texture: THREE.CubeTexture) => resolve(texture)
    const path = `/textures/skybox/${String(nr).padStart(2, "0")}/`
    const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map(side => `sky${nr}_${side}.webp`)
    loader.setPath(path).load(urls, onLoad, undefined, onError)
  })
}
