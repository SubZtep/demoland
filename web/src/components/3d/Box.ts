import * as THREE from "three"
import { onMount, onCleanup, type Component } from "solid-js"

const Box: Component<{ scene: THREE.Scene; color: THREE.Color, position: [number, number, number] }> = props => {
  let box: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: props.color }))
  box.position.set(...props.position)
  box.castShadow = true

  onMount(() => {
    props.scene.add(box)
  })

  onCleanup(() => {
    props.scene.remove(box)
  })

  return null
}

export default Box
