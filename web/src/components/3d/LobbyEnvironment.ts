import * as THREE from "three"
import type CameraControls from "camera-controls"
import { onMount, onCleanup, type Component } from "solid-js"

const LobbyEnvironment: Component<{ scene: THREE.Scene; controls: CameraControls, planeWidth: number }> = props => {
  let light: THREE.DirectionalLight
  let helper: THREE.DirectionalLightHelper
  let grid: THREE.GridHelper
  let box: THREE.Mesh

  onMount(() => {
    props.controls.setLookAt(-10, 2, 0, 0, 0, 0, false)

    loadSkybox(4).then(texture => {
      props.scene.background = texture
    })

    light = new THREE.DirectionalLight()
    light.castShadow = true
    light.position.set(-5, 10, 0)
    light.target.position.set(0, 5, 0)
    helper = new THREE.DirectionalLightHelper(light)
    grid = new THREE.GridHelper(50, 50)

    const geometry = new THREE.PlaneGeometry(props.planeWidth, props.planeWidth)
    const material = new THREE.MeshLambertMaterial({ color: 0xffff00 })
    const plane = new THREE.Mesh(geometry, material)
    plane.rotateX((Math.PI / 180) * -90)
    plane.receiveShadow = true

    props.scene.add(light, helper, grid, plane)
  })

  onCleanup(() => {
    props.scene.remove(light, helper, grid)
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
