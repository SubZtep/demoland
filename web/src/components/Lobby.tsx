import * as THREE from "three"
import { For, type Component } from "solid-js"
import { Dynamic } from "solid-js/web"
import { state, obstacles } from "../app/state"
import LobbyEnvironment from "./3d/LobbyEnvironment"
import HandModel from "./3d/HandModel"
import * as obss from "./3d/"
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
          <For each={state.obstacleIds}>
            {oid => {
              const obstacle = obstacles.get(oid)
              if (!obstacle) {
                console.log("Missing obstacle", [oid, obstacle])
                return null
              }
              return <Dynamic component={obss[obstacle.component]} oid={oid} scene={scene} />
            }}
          </For>
        </>
      )}
    </ThreeScene>
  )
}

export default Lobby
