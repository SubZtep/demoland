import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"

const GridHelper: Component<{ scene: THREE.Scene; size: number }> = props => {
  const grid = new THREE.GridHelper(props.size, props.size)
  props.scene.add(grid)

  onCleanup(() => {
    props.scene.remove(grid)
  })

  return null
}

export default GridHelper
