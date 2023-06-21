import * as THREE from "three"
import { For, type Component } from "solid-js"
import { state } from "../state"
import HandEnvironment from "./3d/HandEnvironment"
import HandSkeleton from "./3d/HandSkeleton"
import HandModel from "./3d/HandModel"
import ThreeScene from "./ThreeScene"

const Lobby: Component = () => {
  return (
    <ThreeScene colour="#8a0303" background={new THREE.Color(0x000000)} lookAt={[1.2, 0, 0, 0, 0, 0]} class="bg-colour">
      {scene => (
        <>
          <HandEnvironment scene={scene} />
          <For each={state.playerIds}>
            {pid => (
              <>
                <HandSkeleton pid={pid} scene={scene} />
                <HandModel pid={pid} scene={scene} />
              </>
            )}
          </For>
        </>
      )}
    </ThreeScene>
  )
}

export default Lobby
