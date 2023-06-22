import * as THREE from "three"
import { For, type Component } from "solid-js"
import { state } from "../app/state"
import LobbyEnvironment from "./3d/LobbyEnvironment"
// import HandSkeleton from "./3d/HandSkeleton"
// import HandModel from "./3d/HandModel"
import Box from "./3d/Box"
import ThreeScene from "./ThreeScene"

const Lobby: Component = () => {
  const planeWidth = 10
  return (
    <ThreeScene colour="#8a0303" background={new THREE.Color(0x000000)} lookAt={[1.2, 0, 0, 0, 0, 0]} class="bg-colour">
      {({ scene, controls }) => (
        <>
          <LobbyEnvironment scene={scene} controls={controls} planeWidth={planeWidth} />
          <For each={state.playerIds}>
            {pid => {
              const posX = Math.random() * planeWidth - planeWidth / 2
              const posY = Math.random() * planeWidth - planeWidth / 2
              return (
                <>
                  {/* <HandSkeleton pid={pid} scene={scene} /> */}
                  {/* <HandModel pid={pid} scene={scene} /> */}
                  <Box scene={scene} color={new THREE.Color("#0000ff")} position={[posX, 0.25, posY]} />
                </>
              )
            }}
          </For>
        </>
      )}
    </ThreeScene>
  )
}

export default Lobby
