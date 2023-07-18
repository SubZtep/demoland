import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"

const DirectionalLight: Component<{ scene: THREE.Scene }> = props => {
  const light = new THREE.DirectionalLight()
  const helper = new THREE.DirectionalLightHelper(light)

  light.position.set(0, 10, 0)
  light.target.position.set(0, 5, 0)

  props.scene.add(light, helper)

  onCleanup(() => {
    props.scene.remove(light, helper)
  })

  return null
}

export default DirectionalLight
