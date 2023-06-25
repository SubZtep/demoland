import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"
import { obstacles } from "../../app/state"

const Box: Component<{
  scene: THREE.Scene
  color: THREE.Color
  /** obstacle id */
  oid: string
  // position: [number, number, number]
  // /** `[x, y, z, w]` */
  // rotation: [number, number, number, number]
}> = props => {
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshPhongMaterial({ color: props.color })
  const box: THREE.Mesh = new THREE.Mesh(geometry, material)
  // box.rotation.setFromQuaternion(new THREE.Quaternion(...props.rotation))
  // box.position.set(...props.position)
  // box.scale.set(1, 1, 1)
  box.translateY(0.5)
  box.receiveShadow = true
  box.castShadow = true
  props.scene.add(box)
  obstacles.set(props.oid, box)

  onCleanup(() => {
    props.scene.remove(box)
    geometry.dispose()
    material.dispose()
    obstacles.delete(props.oid)
  })

  return null
}

export default Box
