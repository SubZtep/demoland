import * as THREE from "three"
import { unwrap } from "solid-js/store"
import { createEffect, onCleanup, type Component } from "solid-js"
import { POSE_LANDMARKS } from "../../app/const"

const dotGeometry = new THREE.SphereGeometry(0.1, 4, 3)
const dotMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 })

const PoseSkeleton: Component<{
  pid?: string
  scene: THREE.Scene
  landmarks: Landmark[]
  position?: [number, number, number]
  scale?: number
}> = props => {
  const dots = new Map<number, THREE.Mesh>()
  const pose = new THREE.Group()

  if (props.position) {
    pose.position.set(...props.position)
  }

  if (props.scale) {
    pose.scale.set(props.scale, props.scale, props.scale)
  }

  // create joint dots
  for (let i = 0; i < POSE_LANDMARKS.length; i++) {
    const dot = new THREE.Mesh(dotGeometry, dotMaterial)
    dot.receiveShadow = true
    dot.castShadow = true
    dots.set(i, dot)
    pose.add(dot)
  }

  props.scene.add(pose)

  onCleanup(() => {
    dots.forEach(dot => pose.remove(dot))
    props.scene.remove(pose)
  })

  createEffect(() => {
    unwrap(props.landmarks).forEach(({ x, y, z }, i) => {
      dots.get(i)!.position.set(x, y, z)
    })
  })

  return null
}

export default PoseSkeleton
