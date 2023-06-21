import * as THREE from "three"
import { createEffect, on, onMount, onCleanup, type Component } from "solid-js"
import { geometries, materials } from "../../assets"
import { HAND_CONNECTIONS } from "../../const"
import { state, players, myLandmarks } from "../../state"

const HandModel: Component<{ pid?: string; scene: THREE.Scene }> = props => {
  onMount(() => {
    console.log("HandModel onMount", props.pid)
  })
  onCleanup(() => {
    console.log("HandModel onCleanup", props.pid)
  })
  return null
}

export default HandModel
