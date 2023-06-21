import * as THREE from "three"
import { For, Show, type Component } from "solid-js"
import { state } from "../state"
import LobbyEnvironment from "./3d/LobbyEnvironment"
import HandSkeleton from "./3d/HandSkeleton"
import HandModel from "./3d/HandModel"
import ThreeScene from "./ThreeScene"

const Lobby: Component = () => {
  return (
    <ThreeScene colour="#8a0303" background={new THREE.Color(0x000000)} lookAt={[1.2, 0, 0, 0, 0, 0]} class="bg-colour">
      {({ scene, controls }) => (
        <>
          <LobbyEnvironment scene={scene} controls={controls} />
          <For each={state.playerIds}>
            {pid => (
              <>
                {/* <HandSkeleton pid={pid} scene={scene} /> */}
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
