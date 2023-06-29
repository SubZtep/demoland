import * as THREE from "three"
import { For, type Component } from "solid-js"
import { Dynamic } from "solid-js/web"
import { state } from "../app/state"
import * as obss from "./3d/"
import LobbyEnvironment from "./3d/LobbyEnvironment"
import ThreeScene from "./ThreeScene"
import HandSkeleton from "./3d/HandSkeleton"

const Lobby: Component = () => {
  return (
    <ThreeScene background={new THREE.Color(0x606060)} lookAt={[1.2, 0, 0, 0, 0, 0]}>
      {({ scene, controls }) => (
        <>
          <LobbyEnvironment scene={scene} controls={controls} />

          <For each={state.players}>
            {player => <HandSkeleton scene={scene} landmarks={player.landmarks} />}
          </For>

          <For each={state.obstacles}>
            {/* @ts-ignore */}
            {obstacle => <Dynamic component={obss[obstacle.component]} obstacle={obstacle} scene={scene} />}
          </For>
        </>
      )}
    </ThreeScene>
  )
}

export default Lobby
