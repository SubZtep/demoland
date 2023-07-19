import { css } from "@emotion/css"
import { setState, state } from "../state"
import CameraStream from "./CameraStream"
import OptionsPanel from "./OptionsPanel"
import usePose from "../hooks/usePose"
import useResizeObserver from "../hooks/useResizeObserver"
import { createEffect, createSignal, onMount } from "solid-js"
import { produce } from "solid-js/store"
import Loading from "./Loading"

const Home = () => {
  const { init, start, stop, loading } = usePose()
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
            await init(video, state.input.delegate)
            await start()
          }}
          onStop={() => {
            stop()
          }}
        />

        <pre>{debug()}</pre>

        <Loading visible={loading()} />
      </div>

      <OptionsPanel />
    </div>
  )
}

export default Home
