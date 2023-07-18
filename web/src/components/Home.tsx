import { css } from "@emotion/css"
import * as THREE from "three"
import { setState, state } from "../state"
import ThreeScene from "./ThreeScene"
import HandSkeleton from "./3d/HandSkeleton"
import CameraStream from "./CameraStream"
import OptionsFieldset from "./OptionsFieldset"
import useMediapipe from "../hooks/useMediapipe"
import { For, Match, Show, Switch } from "solid-js/web"
import GridHelper from "./3d/GridHelper"
import DirectionalLight from "./3d/DirectionalLight"
import useResizeObserver from "../hooks/useResizeObserver"
import { createEffect, createSignal, onMount } from "solid-js"

const Home = () => {
  const { init, start, stop, loading } = useMediapipe()
  const [debug, setDebug] = createSignal("")
  let screen: HTMLDivElement | undefined

  onMount(() => {
    useResizeObserver(screen, (width, height) => {
      setState({ input: { width, height } })
    })
  })

  createEffect(() => {
    setDebug(JSON.stringify(state.player.handLandmarks, null, 2))
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
            await init(video)
            await start()
          }}
          onStop={() => {
            stop()
          }}
        />
        {/* <ThreeScene lookAt={[10, 1, 10, 0, 1, 0]} width={state.input.width} height={state.input.height} alpha>
          {({ scene }) => (
            <>
              <DirectionalLight scene={scene} />
              <GridHelper scene={scene} size={3} />
              <For each={state.player.handLandmarks}>
                {landmarks => <HandSkeleton scene={scene} landmarks={landmarks} scale={4} />}
              </For>
            </>
          )}
        </ThreeScene> */}
        <pre>{debug()}</pre>
        <Show when={loading()}>
          <div
            class={css`
              color: #ff0;
              font-size: 2rem;
            `}
          >
            Loading
          </div>
        </Show>
      </div>
      <OptionsFieldset />
    </div>
  )
}

export default Home
