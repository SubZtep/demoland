import * as THREE from "three"
import { For, type Component } from "solid-js"
import { state } from "../app/state"
import LobbyEnvironment from "./3d/LobbyEnvironment"
import HandModel from "./3d/HandModel"
import Box from "./3d/Box"
import ThreeScene from "./ThreeScene"
import { PLANE_SIZE } from "../app/const"

const Lobby: Component = () => {
  return (
    <ThreeScene background={new THREE.Color(0x606060)} lookAt={[1.2, 0, 0, 0, 0, 0]}>
      {({ scene, controls }) => (
        <>
          <LobbyEnvironment scene={scene} controls={controls} planeWidth={PLANE_SIZE} />
          <For each={state.playerIds}>
            {pid => (
              <>
                <HandModel pid={pid} scene={scene} />
              </>
            )}
          </For>
          <Box scene={scene} color={new THREE.Color("pink")} position={[-2, 1, -3]} />
        </>
      )}
    </ThreeScene>
  )
}

export default Lobby
