import * as THREE from "three"
import { produce } from "solid-js/store"
import { For, type Component } from "solid-js"
import { state, setState, players } from "../app/state"
import LobbyEnvironment from "./3d/LobbyEnvironment"
// import HandSkeleton from "./3d/HandSkeleton"
// import HandModel from "./3d/HandModel"
import Box from "./3d/Box"
import ThreeScene from "./ThreeScene"

const Lobby: Component = () => {
  const planeWidth = 10

  // setInterval(() => {
  //   setState(produce(s => s.playerIds.push(String(Math.random()))))
  // }, 1000)

  return (
    <ThreeScene colour="#8a0303" background={new THREE.Color(0x000000)} lookAt={[1.2, 0, 0, 0, 0, 0]} class="bg-colour">
      {({ scene, controls }) => (
        <>
          <LobbyEnvironment scene={scene} controls={controls} planeWidth={planeWidth} />
          <For each={state.playerIds}>
            {pid => (
              <>
                {/* <HandSkeleton pid={pid} scene={scene} /> */}
                {/* <HandModel pid={pid} scene={scene} /> */}
                <Box
                  scene={scene}
                  color={new THREE.Color(players.get(pid)!.colour)}
                  position={[players.get(pid)!.x, 0.25, players.get(pid)!.y]}
                />
              </>
            )}
          </For>
        </>
      )}
    </ThreeScene>
  )
}

export default Lobby
