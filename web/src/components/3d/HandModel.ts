import * as THREE from "three"
import { createEffect, on, onCleanup, type Component } from "solid-js"
import { state } from "../../app/state"
import { geometries, materials } from "../../app/assets"
import usePlayer from "../../hooks/usePlayer"
import { HAND_CONNECTIONS } from "../../app/const"

const HandModel: Component<{ pid: string; scene: THREE.Scene }> = props => {
  const { player, isPlayerUpdated } = usePlayer(props.pid)
  const dots = new Map<number, THREE.Mesh>()
  const lines = new Map<number, THREE.Line>()
  const hand = new THREE.Group()

  props.scene.add(hand)
  hand.scale.set(-5, -5, -5)
  hand.translateY(0.5)

  // create joint dots
  const material = new THREE.MeshPhongMaterial({ color: player().colour })
  for (let i = 0; i < new Set(HAND_CONNECTIONS.flat()).size; i++) {
    const dot = new THREE.Mesh(geometries.get("dot"), material)
    dot.castShadow = true
    dots.set(i, dot)
    hand.add(dot)
  }

  const updateLandmarks = () => {
    material.color.set(player().colour)

    if (!player().landmarks) return

    // move joint dots
    player().landmarks!.forEach(({ x, y, z }, i) => {
      dots.get(i)?.position.set(x, y, z)
    })

    // remove old lines
    lines.forEach(line => props.scene.remove(line))

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
      line.scale.set(-5, -5, -5)
      line.translateY(0.5)
      lines?.set(i, line)
      props.scene.add(line)
    }
  }

  createEffect(
    on(
      () => state.lastPlayersUpdate,
      () => isPlayerUpdated() && updateLandmarks(),
    ),
  )

  onCleanup(() => {
    lines.forEach(line => props.scene.remove(line))
    dots.forEach(dot => props.scene.remove(dot))
    props.scene.remove(hand)
    material.dispose()
  })

  return null
}

export default HandModel
