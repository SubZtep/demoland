import * as THREE from "three"
import { createEffect, on, onCleanup, type Component } from "solid-js"
import { state, players } from "../../app/state"
import { geometries } from "../../app/assets"

const HandModel: Component<{ pid: string; scene: THREE.Scene }> = props => {
  let player = players.get(props.pid)!
  if (!player) {
    throw new Error(`Player ${props.pid} not found`)
  }
  // console.log("player", player)
  const hand = new THREE.Group()
  props.scene.add(hand)

  const material = new THREE.MeshPhongMaterial({ color: player.colour })
  const box: THREE.Mesh = new THREE.Mesh(geometries.get("box"), material)
  hand.add(box)

  box.position.set(player.x, 0.25, player.y)
  box.scale.set(1, 0.5, 1)
  box.castShadow = true
  // const rotate = Math.random() - 0.5

  createEffect(
    on(
      () => state.lastPlayersUpdate,
      () => {
        const newPlayer = players.get(props.pid)
        if (!newPlayer) {
          console.log("player not found", props.pid)
          return
        }
        // @ts-ignore
        box.material.color.set(player.colour)
        // if (player.colour && player.colour !== newPlayer.colour) {
        //   // @ts-ignore
        //   box.material.color.set(player.colour)
        // }

        player = newPlayer
      },
    ),
  )

  onCleanup(() => {
    props.scene.remove(hand)
  })

  return null
}

export default HandModel
