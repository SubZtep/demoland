import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"
import { obstacles } from "../../app/state"

const Plane: Component<{
  scene: THREE.Scene
  /** obstacle id */
  oid: string
}> = props => {
  const plane = obstacles.get(props.oid) as PlaneObstacle
  const geometry = new THREE.PlaneGeometry(plane.dimensions.width, plane.dimensions.height)
  const material = new THREE.MeshLambertMaterial({ color: plane.color })
  plane.object3d = new THREE.Mesh(geometry, material)
  plane.object3d.position.set(plane.position.x, plane.position.y, plane.position.z)
  plane.object3d.rotateX((Math.PI / 180) * -90)
  plane.object3d.receiveShadow = true
  props.scene.add(plane.object3d)
  obstacles.set(props.oid, plane)

  onCleanup(() => {
    props.scene.remove(plane.object3d!)
    geometry.dispose()
    material.dispose()
    obstacles.delete(props.oid)
  })

  return null
}

export default Plane
