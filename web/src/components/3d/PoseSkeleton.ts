import * as THREE from "three"
import { unwrap } from "solid-js/store"
import { createEffect, onCleanup, type Component } from "solid-js"
import { POSE_LANDMARKS } from "../../app/const"

const dotGeometry = new THREE.SphereGeometry(0.1)
const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }) // left hand
const redMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }) // right hand
const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })

const leftHandIndices = [16, 18, 20, 22]
const rightHandIndices = [15, 17, 19, 21]

const PoseSkeleton: Component<{
  pid?: string
  scene: THREE.Scene
  landmarks: Landmark[]
}> = props => {
  const dots = new Map<number, THREE.Mesh>()
  const pose = new THREE.Group()

  const createObjects = () => {
    // create joint dots
    for (let i = 0; i < POSE_LANDMARKS.length; i++) {
      const dot = new THREE.Mesh(
        dotGeometry,
        leftHandIndices.includes(i) ? blueMaterial : rightHandIndices.includes(i) ? redMaterial : whiteMaterial,
      )
      dot.receiveShadow = true
      dot.castShadow = true
      dots.set(i, dot)
      pose.add(dot)
    }
  }

  createObjects()
  props.scene.add(pose)

  onCleanup(() => {
    dots.forEach(dot => pose.remove(dot))
    props.scene.remove(pose)
  })

  createEffect(() => {
    props.landmarks
    console.log("landmarks", unwrap(props.landmarks))
    unwrap(props.landmarks).forEach(({ x, y, z }, i) => {
      dots.get(i)!.position.set(x, y, z)
    })
  })

  return null
}

export default PoseSkeleton
