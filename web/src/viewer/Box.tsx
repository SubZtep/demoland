import { useEffect } from "react"
import * as THREE from "three"

interface Props {
  scene: THREE.Scene
}

export default function Box({ scene }: Props) {
  useEffect(() => {
    const geometry = new THREE.BoxGeometry(1, 0.5, 1)
    const material = new THREE.MeshPhongMaterial({ color: new THREE.Color("yellow") })
    const box = new THREE.Mesh(geometry, material)
    scene.add(box)

    return () => {
      scene.remove(box)
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return null
}
