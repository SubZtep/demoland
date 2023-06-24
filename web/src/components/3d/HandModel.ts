import * as THREE from "three"
import { createEffect, on, onCleanup, type Component } from "solid-js"
import { state, getPlayer } from "../../app/state"
import { geometries } from "../../app/assets"

const HandModel: Component<{ pid: string; scene: THREE.Scene }> = props => {
  let player = getPlayer(props.pid)!
  const hand = new THREE.Group()
  props.scene.add(hand)

  const material = new THREE.MeshPhongMaterial({ color: player.colour })
  const box: THREE.Mesh = new THREE.Mesh(geometries.get("box"), material)
  box.position.set(player.x, 0.25, player.y)
  box.scale.set(1, 0.5, 1)
  box.castShadow = true
  hand.add(box)

  const updateModel = () => {
    player = getPlayer(props.pid, true)!
    if (!player) return

    // @ts-ignore
    box.material.color.set(player.colour)
  }

  updateModel()

  createEffect(
    on(
      () => state.lastPlayersUpdate,
      () => updateModel(),
    ),
  )

  onCleanup(() => {
    props.scene.remove(hand)
    material.dispose()
  })

  return null
}

export default HandModel
