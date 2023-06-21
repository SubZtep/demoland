import * as THREE from "three"
import { onMount, onCleanup, type Component } from "solid-js"

const HandEnvironment: Component<{ scene: THREE.Scene }> = props => {
  let light: THREE.DirectionalLight
  let helper: THREE.DirectionalLightHelper
  let grid: THREE.GridHelper

  onMount(() => {
    light = new THREE.DirectionalLight()
    light.position.set(0, 10, 0)
    light.target.position.set(0, 5, 0)
    helper = new THREE.DirectionalLightHelper(light)
    grid = new THREE.GridHelper(1, 1)
    props.scene.add(light, helper, grid)
  })

  onCleanup(() => {
    props.scene.remove(light, helper, grid)
  })

  return null
}

export default HandEnvironment
