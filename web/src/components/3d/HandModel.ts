import * as THREE from "three"
import { createEffect, on, onMount, onCleanup, type Component } from "solid-js"
import { state, players, myLandmarks } from "../../app/state"
import { geometries, materials } from "../../app/assets"
import { HAND_CONNECTIONS } from "../../app/const"

const HandModel: Component<{ pid?: string; scene: THREE.Scene }> = props => {
  const hand = new THREE.Group()
  let box: THREE.Mesh

  onMount(() => {
    console.log("HandModel onMount", props.pid)
    box = new THREE.Mesh(geometries.get("box"), materials.get("box"))
    hand.add(box)
    props.scene.add(hand)
  })

  onCleanup(() => {
    console.log("HandModel onCleanup", props.pid)
    // props.scene.remove(box)
    props.scene.remove(hand)
  })

  return null
}

export default HandModel
