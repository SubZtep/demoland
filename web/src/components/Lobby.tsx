import * as THREE from "three"
import { For, type Component } from "solid-js"
import { state } from "../app/state"
import LobbyEnvironment from "./3d/LobbyEnvironment"
// import HandSkeleton from "./3d/HandSkeleton"
import HandModel from "./3d/HandModel"
// import Box from "./3d/Box"
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
                {/* <HandSkeleton pid={pid} scene={scene} /> */}
                <HandModel pid={pid} scene={scene} />
                {/* <Box
                  scene={scene}
                  color={new THREE.Color(players.get(pid)!.colour)}
                  position={[players.get(pid)!.x, 0.25, players.get(pid)!.y]}
                /> */}
              </>
            )}
          </For>
        </>
      )}
    </ThreeScene>
  )
}

export default Lobby
