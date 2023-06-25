import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"
import { PLANE_SIZE } from "../../app/const"
import { obstacles } from "../../app/state"

const Plane: Component<{
  scene: THREE.Scene
  color: THREE.Color
  /** obstacle id */
  oid: string
}> = props => {
  const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE)
  const material = new THREE.MeshLambertMaterial({ color: props.color })
  const plane = new THREE.Mesh(geometry, material)
  plane.rotateX((Math.PI / 180) * -90)
  plane.receiveShadow = true
  props.scene.add(plane)
  obstacles.set(props.oid, plane)

  onCleanup(() => {
    props.scene.remove(plane)
    geometry.dispose()
    material.dispose()
    obstacles.delete(props.oid)
  })

  return null
}

export default Plane
