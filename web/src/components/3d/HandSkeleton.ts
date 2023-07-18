import * as THREE from "three"
import { unwrap } from "solid-js/store"
import { createEffect, onCleanup, type Component } from "solid-js"
import { HAND_CONNECTIONS } from "../../app/const"
import { state } from "../../state"

const dotGeometry = new THREE.SphereGeometry(0.0065, 4, 3)
const bigDotGeometry = new THREE.SphereGeometry(state.player.dimensions.dotSize)
const dotMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 })
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 })

const HandSkeleton: Component<{
  pid?: string
  scene: THREE.Scene
  landmarks: Landmark[]
  position?: [number, number, number]
  scale?: number
}> = props => {
  const dots = new Map<number, THREE.Mesh>()
  const lines = new Map<number, THREE.Line>()
  const hand = new THREE.Group()

  if (props.position) {
    hand.position.set(...props.position)
  }

  if (props.scale) {
    hand.scale.set(props.scale, props.scale, props.scale)
  }

  // create joint dots
  for (let i = 0; i < new Set(HAND_CONNECTIONS.flat()).size; i++) {
    const dot = new THREE.Mesh(props.scale ? dotGeometry : bigDotGeometry, dotMaterial)
    dot.receiveShadow = true
    dot.castShadow = true
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
        lineMaterial,
      )
      lines.set(i, line)
      hand.add(line)
    }
  }

  createEffect(() => updateLandmarks(unwrap(props.landmarks)))

  return null
}

export default HandSkeleton
