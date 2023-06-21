import * as THREE from "three"
import type CameraControls from "camera-controls"
import { createEffect, onMount, onCleanup, type Component } from "solid-js"
import { runForever, runOnce } from "../../lib/loop"
import { geometries, materials } from "../../assets"

const LobbyEnvironment: Component<{ scene: THREE.Scene; controls: CameraControls }> = props => {
  let light: THREE.DirectionalLight
  let helper: THREE.DirectionalLightHelper
  let grid: THREE.GridHelper
  let box: THREE.Mesh

  onMount(() => {
    props.controls.setLookAt(-5, -2, 0, 0, 0, 0, false)

    loadSkybox(4).then(texture => {
      props.scene.background = texture
    })

    light = new THREE.DirectionalLight()
    light.position.set(-5, 10, 0)
    light.target.position.set(0, 5, 0)
    helper = new THREE.DirectionalLightHelper(light)
    grid = new THREE.GridHelper(20, 20)
    // box = new THREE.Mesh(geometries.get("box"), materials.get("box"))

    // runForever.add(deltaTime => { // TODO: remove this function on cleanup
    //   box.rotation.y += 0.05 * deltaTime
    // })

    props.scene.add(
      light,
      helper,
      grid,
      // box
    )
  })

  onCleanup(() => {
    props.scene.remove(
      light,
      helper,
      grid,
      // box
    )
  })

  return null
}

export default LobbyEnvironment

async function loadSkybox(nr = 1): Promise<THREE.CubeTexture> {
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
