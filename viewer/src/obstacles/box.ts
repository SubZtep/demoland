import * as THREE from "three"

const blueMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color("#9999ff") })

interface Props {
  scene: THREE.Scene
  dimensions: Dimensions
  position: Position
  rotation: Rotation
}

export class Box {
  #scene: THREE.Scene
  box: THREE.Mesh

  constructor({ scene, dimensions: { width, height, depth }, position, rotation }: Props) {
    this.#scene = scene
    const geometry = new THREE.BoxGeometry(width, height, depth)
    this.box = new THREE.Mesh(geometry, blueMaterial)
    this.position(position)
    this.rotation(rotation)
    this.#scene.add(this.box)
  }

  position({ x, y, z }: Position) {
    this.box.position.set(x, y, z)
  }

  rotation({ x, y, z, w }: Rotation) {
    this.box.rotation.setFromQuaternion(new THREE.Quaternion(x, y, z, w))
  }

  destroy() {
    this.#scene.remove(this.box)
    this.box.geometry.dispose()
  }
}
