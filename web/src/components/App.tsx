import { For, Show, Switch, Match } from "solid-js"
import { state } from "../state"
import { HAND_ANGLES } from "../const"
import styles from "./App.module.css"
import Finger from "./Finger"
import CameraStream from "./CameraStream"
import OptionsFieldset from "./OptionsFieldset"
import Lobby from "./Lobby"
import Home from "./Home"

export default () => {
  return (
    <>
      <Show when={state.isDesktop}>
        <For each={HAND_ANGLES}>
          {item => (
            <>
              <Finger name={item[0]} />
            </>
          )}
        </For>
      </Show>

      <div
        class={`${styles.scenes}${state.broadcast ? ` ${styles.lobby}` : ""} ${
          state.isDesktop ? "grid-col-span-5" : "grid-col-span-2"
        }`}
      >
        <Switch>
          <Match when={state.broadcast}>
            <Lobby />
            {/* <For each={state.playerIds}>
              {pid => (
                <ThreeScene pid={pid} colour={players.get(pid)?.colour}>
                  {scene => (
                    <>
                      <HandEnvironment scene={scene} />
                      <HandModel pid={pid} scene={scene} />
                    </>
                  )}
                </ThreeScene>
              )}
            </For> */}
          </Match>
          <Match when={!state.broadcast}>
            <Home />
          </Match>
        </Switch>
      </div>

      <CameraStream class={`${styles.monitor}${state.isDesktop ? " grid-col-span-2" : ""}`} />

      <OptionsFieldset />

      <Show when={state.isDesktop}>
        <fieldset class="grid-col-span-2">
          <legend>Readme</legend>
          Lorem ipsum 🚧
          <ul>
            <li>The initial activation of the camera causes a slight delay during the loading of the ML model.</li>
            <li>
              The camera feed is processed locally in the browser, and only the hand coordinates are broadcasted via
              WebSocket.
            </li>
          </ul>
          Source code is available on <a href="https://github.com/SubZtep/demoland">GitHub</a>.
        </fieldset>
      </Show>
    </>
  )
}
