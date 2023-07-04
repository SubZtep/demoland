import * as THREE from "three"
import { createEffect, onCleanup, type Component } from "solid-js"

const Box: Component<{ scene: THREE.Scene; obstacle: BoxObstacle }> = props => {
  const geometry = new THREE.BoxGeometry(
    props.obstacle.dimensions.width,
    props.obstacle.dimensions.height,
    props.obstacle.dimensions.depth,
  )
  const material = new THREE.MeshPhongMaterial({ color: props.obstacle.color })
  const box = new THREE.Mesh(geometry, material)
  box.receiveShadow = true
  box.castShadow = true
  box.position.set(props.obstacle.position.x, props.obstacle.position.y, props.obstacle.position.z)
  if (props.obstacle.rotation) {
    box.rotation.setFromQuaternion(
      new THREE.Quaternion(
        props.obstacle.rotation.x,
        props.obstacle.rotation.y,
        props.obstacle.rotation.z,
        props.obstacle.rotation.w,
      ),
    )
  }
  props.scene.add(box)

  onCleanup(() => {
    props.scene.remove(box!)
    geometry.dispose()
    material.dispose()
  })

  createEffect(() => {
    box.position.set(props.obstacle.position.x, props.obstacle.position.y, props.obstacle.position.z)
  })

  createEffect(() => {
    if (props.obstacle.rotation) {
      box.rotation.setFromQuaternion(
        new THREE.Quaternion(
          props.obstacle.rotation.x,
          props.obstacle.rotation.y,
          props.obstacle.rotation.z,
          props.obstacle.rotation.w,
        ),
      )
    }
  })

  return null
}

export default Box
