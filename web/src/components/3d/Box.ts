import * as THREE from "three"
import { onMount, onCleanup, mergeProps, type Component, createEffect, on } from "solid-js"
import { runForever } from "../../lib/loop"
import { state, players } from "../../app/state";

const Box: Component<{ scene: THREE.Scene; color: THREE.Color, position: [number, number, number] }> = props => {
  let box: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: props.color }))
  box.position.set(...props.position)
  box.scale.set(1, 0.5, 1)
  box.castShadow = true
  const rotate = Math.random() - 0.5

  // runForever.add(deltaTime => { // TODO: remove this function on cleanup
  //   box.rotateY(rotate * deltaTime)
  // })

  onMount(() => {
    props.scene.add(box)
  })

  onCleanup(() => {
    props.scene.remove(box)
  })

  return null
}

export default Box
