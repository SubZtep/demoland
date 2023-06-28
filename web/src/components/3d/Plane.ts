import * as THREE from "three"
import { onCleanup, type Component } from "solid-js"

const Plane: Component<{ scene: THREE.Scene; obstacle: PlaneObstacle }> = props => {
  const geometry = new THREE.PlaneGeometry(props.obstacle.dimensions.width, props.obstacle.dimensions.height)
  const material = new THREE.MeshLambertMaterial({ color: props.obstacle.color })
  const plane = new THREE.Mesh(geometry, material)

  plane.position.set(props.obstacle.position.x, props.obstacle.position.y, props.obstacle.position.z)
  plane.rotateX((Math.PI / 180) * -90)
  plane.receiveShadow = true
  props.scene.add(plane)

  onCleanup(() => {
    props.scene.remove(plane!)
    geometry.dispose()
    material.dispose()
  })

  return null
}

export default Plane
