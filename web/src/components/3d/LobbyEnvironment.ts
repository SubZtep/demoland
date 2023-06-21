import * as THREE from "three"
import type CameraControls from "camera-controls"
import { createEffect, onMount, onCleanup, type Component } from "solid-js"
import { runForever, runOnce } from "../../lib/loop"
import { geometries, materials } from "../../assets"

const LobbyEnvironment: Component<{ scene: THREE.Scene, controls: CameraControls }> = props => {
  let light: THREE.DirectionalLight
  let helper: THREE.DirectionalLightHelper
  let grid: THREE.GridHelper
  let box: THREE.Mesh

  onMount(() => {
    props.controls.setLookAt(0, 5, 0, 0, 0, 0, false)

    light = new THREE.DirectionalLight()
    light.position.set(10, 10, 0)
    light.target.position.set(0, 5, 0)
    helper = new THREE.DirectionalLightHelper(light)
    grid = new THREE.GridHelper(1, 1)
    box = new THREE.Mesh(geometries.get("box"), materials.get("box"))
    
    runForever.add(deltaTime => { // TODO: remove this function on cleanup
      box.rotation.y += 0.05 * deltaTime
    })
    
    props.scene.add(light, helper, grid, box)
  })

  onCleanup(() => {
    props.scene.remove(light, helper, grid, box)
  })

  return null
}

export default LobbyEnvironment
