import { For, Show, Switch, Match } from "solid-js"
import { HAND_ANGLES } from "../const"
import { state } from "../state"
import styles from "./App.module.css"
import Finger from "./Finger"
import CameraStream from "./CameraStream"
import OptionsFieldset from "./OptionsFieldset"
import Lobby from "./Lobby"
import Home from "./Home"
import Readme from "./Readme"

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
          </Match>
          <Match when={!state.broadcast}>
            <Home />
          </Match>
        </Switch>
      </div>

      <CameraStream />

      <OptionsFieldset />

      <Show when={state.isDesktop}>
        <Readme />
      </Show>
    </>
  )
}
