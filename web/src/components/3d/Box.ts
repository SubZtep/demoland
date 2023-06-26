import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"
import { obstacles } from "../../app/state"

const Box: Component<{
  scene: THREE.Scene
  /** obstacle id */
  oid: string
}> = props => {
  const box = obstacles.get(props.oid) as BoxObstacle
  const geometry = new THREE.BoxGeometry(box.dimensions.width, box.dimensions.height, box.dimensions.depth)
  const material = new THREE.MeshPhongMaterial({ color: box.color })
  box.object3d = new THREE.Mesh(geometry, material)
  box.object3d.rotation.setFromQuaternion(
    new THREE.Quaternion(box.rotation.x, box.rotation.y, box.rotation.z, box.rotation.w),
  )
  box.object3d.position.set(box.position.x, box.position.y, box.position.z)
  box.object3d.receiveShadow = true
  box.object3d.castShadow = true
  props.scene.add(box.object3d)
  obstacles.set(props.oid, box)

  onCleanup(() => {
    props.scene.remove(box.object3d!)
    geometry.dispose()
    material.dispose()
    obstacles.delete(props.oid)
  })

  return null
}

export default Box
