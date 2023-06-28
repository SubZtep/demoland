import * as THREE from "three"
import { unwrap } from "solid-js/store"
import { createEffect, onCleanup, type Component } from "solid-js"
import { geometries, materials } from "../../app/assets"
import { HAND_CONNECTIONS } from "../../app/const"

const HandSkeleton: Component<{ pid?: string; scene: THREE.Scene; landmarks: Landmark[]; scale?: number }> = props => {
  const dots = new Map<number, THREE.Mesh>()
  const lines = new Map<number, THREE.Line>()
  const hand = new THREE.Group()
  if (props.scale) {
    hand.scale.set(props.scale, props.scale, props.scale)
  }

  // create joint dots
  for (let i = 0; i < new Set(HAND_CONNECTIONS.flat()).size; i++) {
    const dot = new THREE.Mesh(geometries.get(props.scale ? "dot" : "sphere"), materials.get("dot"))
    dots.set(i, dot)
    hand.add(dot)
  }

  props.scene.add(hand)

  onCleanup(() => {
    lines.forEach(line => hand.remove(line))
    dots.forEach(dot => hand.remove(dot))
    props.scene.remove(hand)
  })

  const updateLandmarks = (landmarks: Landmark[]) => {
    // move joint dots
    landmarks.forEach(({ x, y, z }, i) => {
      dots.get(i)!.position.set(x, y, z)
    })

    // remove old lines
    lines.forEach(line => hand.remove(line))

    // create new lines
    for (let i = 0; i < HAND_CONNECTIONS.length; i++) {
      const join = HAND_CONNECTIONS[i]

      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...dots.get(join[0])!.position.toArray()),
          new THREE.Vector3(...dots.get(join[1])!.position.toArray()),
        ]),
        materials.get("line"),
      )
      lines.set(i, line)
      hand.add(line)
    }
  }

  createEffect(() => updateLandmarks(unwrap(props.landmarks)))

  return null
}

export default HandSkeleton
