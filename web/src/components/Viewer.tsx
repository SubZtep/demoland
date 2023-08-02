import * as THREE from "three"
import { For, type Component, onMount, onCleanup, Show, createResource, createEffect, createSignal } from "solid-js"
import { Dynamic } from "solid-js/web"
import { setState, state } from "../state"
import * as obss from "./3d"
import LobbyEnvironment from "./3d/LobbyEnvironment"
import ThreeScene from "./gadgets/ThreeScene"
// import { sendMessage } from "../app/conn"
import { unwrap } from "solid-js/store"
import PoseSkeleton from "./3d/PoseSkeleton"

const fetchChannel = async () => (await fetch(`${import.meta.env.VITE_API_HOST}/api/channel/${state.channel}`)).json()

const Viewer: Component<{
  sendMessage: (msg: ClientMessage) => void
  onMessageReceived: (cb: (msg: ServerMessage) => void) => void
}> = props => {
  const [channelData, { refetch }] = createResource(fetchChannel)
  const [landmarks, setLandmarks] = createSignal<Landmark[]>([])

  createEffect(() => {
    state.channel
    refetch()
  })

  createEffect(() => {
    console.log(channelData())
    if (channelData()?.exists) {
      props.sendMessage({ cmd: "viewer-hi", channel: state.channel! })
    }
  })

  props.onMessageReceived(msg => {
    console.log("viewer msg", msg)
    switch (msg.cmd) {
      case "create-obstacles":
        setState("obstacles", msg.obstacles)
        break

      case "create-player":
        setState("player", msg.player)
        break

      case "error":
        setState({ error: msg.error })
        break

      case "update":
        if (msg.player?.landmarks) {
          setLandmarks(msg.player.landmarks)
        }
        break
    }
  })

  // createEffect(() => {
  //   // console.log("obstacles", unwrap(state.obstacles))
  // })

  onCleanup(() => {
    props.sendMessage({ cmd: "viewer-bye", channel: state.channel! })
  })

  return (
    <Show when={channelData()?.exists} fallback={<h1>Waiting for Player</h1>}>
      <ThreeScene
        background={new THREE.Color("0x606060")}
        lookAt={[1.2, 0, 0, 0, 0, 0]}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        {({ scene, controls }) => (
          <>
            <LobbyEnvironment scene={scene} controls={controls} />

            <For each={state.obstacles}>
              {/* @ts-ignore */}
              {obstacle => <Dynamic component={obss[obstacle.component]} obstacle={obstacle} scene={scene} />}
            </For>

            <Show when={state.landmarks}>
              <PoseSkeleton scene={scene} landmarks={landmarks()} />
            </Show>
          </>
        )}
      </ThreeScene>
    </Show>
  )
}

export default Viewer
