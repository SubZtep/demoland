import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"
import { PLANE_SIZE } from "../../app/const"
import { obstacles } from "../../app/state"

const Plane: Component<{
  scene: THREE.Scene
  /** obstacle id */
  oid: string
}> = props => {
  const obstacle = obstacles.get(props.oid)!
  const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE)
  const material = new THREE.MeshLambertMaterial({ color: obstacle.color })
  const plane = new THREE.Mesh(geometry, material)
  plane.rotateX((Math.PI / 180) * -90)
  plane.receiveShadow = true
  props.scene.add(plane)
  obstacles.set(props.oid, { ...obstacle, object3d: plane })

  onCleanup(() => {
    props.scene.remove(plane)
    geometry.dispose()
    material.dispose()
    obstacles.delete(props.oid)
  })

  return null
}

export default Plane
