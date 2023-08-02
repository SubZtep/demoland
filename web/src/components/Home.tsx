import { css } from "@emotion/css"
import { setState, state } from "../state"
import CameraStream from "./gadgets/CameraStream"
import OptionsPanel from "./OptionsPanel"
import usePose from "../hooks/usePose"
import useResizeObserver from "../hooks/useResizeObserver"
import { type Component, createEffect, createSignal, onMount } from "solid-js"
import { produce } from "solid-js/store"
import PoseCanvas from "./gadgets/PoseCanvas"
import Text from "./gadgets/Text"

const Home: Component<{ sendMessage: (msg: ClientMessage) => void }> = props => {
  const { init, start, stop, loading } = usePose(landmarks => {
    if (state.playing) {
      props.sendMessage({ cmd: "update", player: { name: state.player.name, landmarks } })
    }
    setState("player", "landmarks", landmarks)
  })

  const [debug, setDebug] = createSignal("")
  let screen: HTMLDivElement | undefined

  onMount(() => {
    useResizeObserver(screen, (width, height) => {
      setState(
        produce(state => {
          state.input.width = width
          state.input.height = height
        }),
      )
    })
  })

  createEffect(() => {
    setDebug(JSON.stringify(state.player.landmarks, null, 2))
  })

  return (
    <div
      class={css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        @media (orientation: portrait) {
          flex-direction: column;
        }
      `}
    >
      <div
        ref={screen}
        class={css`
          background-color: #369;
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          > * {
            border: 2px dashed yellow;
            position: absolute;
          }
        `}
      >
        <CameraStream
          enabled={state.camera}
          onStart={async video => {
            await init(video, state.input.model, state.input.delegate)
            await start()
          }}
          onStop={() => {
            stop()
          }}
        />

        <PoseCanvas landmarks={state.player.landmarks} width={state.input.width} height={state.input.height} />

        <pre
          class={css`
            scale: 0.2;
          `}
        >
          {debug()}
        </pre>

        <Text visible={loading()}>Loading</Text>
      </div>

      <OptionsPanel />
    </div>
  )
}

export default Home
