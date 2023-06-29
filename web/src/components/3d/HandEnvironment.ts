import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"

const light = new THREE.DirectionalLight()
const helper = new THREE.DirectionalLightHelper(light)
const grid = new THREE.GridHelper(1, 1)

light.position.set(0, 10, 0)
light.target.position.set(0, 5, 0)

const HandEnvironment: Component<{ scene: THREE.Scene }> = props => {
  props.scene.add(light, helper, grid)

  onCleanup(() => {
    props.scene.remove(light, helper, grid)
  })

  return null
}

export default HandEnvironment
