import * as THREE from "three"
import { For, type Component, onMount, onCleanup, Show, createResource, createEffect } from "solid-js"
import { Dynamic } from "solid-js/web"
import { state } from "../state"
import * as obss from "./3d"
import LobbyEnvironment from "./3d/LobbyEnvironment"
import ThreeScene from "./gadgets/ThreeScene"
import { sendMessage } from "../app/conn"
import { unwrap } from "solid-js/store"
import PoseSkeleton from "./3d/PoseSkeleton"

const fetchChannel = async () => (await fetch(`${import.meta.env.VITE_API_HOST}/api/channel/${state.channel}`)).json()

const Viewer: Component = props => {
  const [channelData, { refetch }] = createResource(fetchChannel)

  createEffect(() => {
    state.channel
    refetch()
  })

  createEffect(() => {
    if (channelData()?.exists) {
      sendMessage({ cmd: "viewer-hi", channel: state.channel! })
    }
  })

  // createEffect(() => {
  //   console.log("obstacles", unwrap(state.obstacles))
  // })

  onCleanup(() => {
    sendMessage({ cmd: "viewer-bye", channel: state.channel! })
  })

  return (
    <Show when={channelData()?.exists} fallback={<h1>Waiting for Player</h1>}>
      <ThreeScene
        background={new THREE.Color(0x606060)}
        lookAt={[1.2, 0, 0, 0, 0, 0]}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        {({ scene, controls }) => (
          <>
            <LobbyEnvironment scene={scene} controls={controls} />

            {/* <For each={state.players}>
              {player => <HandSkeleton scene={scene} landmarks={player.landmarks} position={[0, 0, -0.7]} />}
            </For> */}

            <For each={state.obstacles}>
              {/* @ts-ignore */}
              {obstacle => <Dynamic component={obss[obstacle.component]} obstacle={obstacle} scene={scene} />}
            </For>

            <Show when={state.player.landmarks}>
              <PoseSkeleton scene={scene} landmarks={state.player.landmarks!} position={[0, 0, -0.7]} />
            </Show>
          </>
        )}
      </ThreeScene>
    </Show>
  )
}

export default Viewer
