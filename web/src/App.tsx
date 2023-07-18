import { Switch, Match, For } from "solid-js"
import { state } from "./state"
import Lobby from "./components/Lobby"
import Home from "./components/Home"
import HandSkeleton from "./components/3d/HandSkeleton"
import ThreeScene from "./components/ThreeScene"
import DirectionalLight from "./components/3d/DirectionalLight"
import GridHelper from "./components/3d/GridHelper"

export default () => {
  return (
    <Switch>
      <Match when={state.lobby}>
        <Lobby />
      </Match>
      <Match when={!state.lobby}>
        <Switch>
          <Match when={state.channel}>
            <ThreeScene lookAt={[10, 1, 10, 0, 1, 0]} width={state.input.width} height={state.input.height} alpha>
              {({ scene }) => (
                <>
                  <DirectionalLight scene={scene} />
                  <GridHelper scene={scene} size={3} />
                  <For each={state.player.handLandmarks}>
                    {landmarks => <HandSkeleton scene={scene} landmarks={landmarks} scale={4} />}
                  </For>
                </>
              )}
            </ThreeScene>
          </Match>
          <Match when={!state.channel}>
            <Home />
          </Match>
        </Switch>
      </Match>
    </Switch>
  )
}
