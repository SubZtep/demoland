import { Switch, Match, Show } from "solid-js"
import { gotoLobby, leaveLobby } from "../app/lobby"
import { sendMessage } from "../app/conn"
import { state, setState } from "../app/state"
import styles from "./App.module.css"

export default () => {
  return (
    <fieldset class={styles.options}>
      <legend>Options</legend>

      <Switch>
        <Match when={!state.lobby}>
          <button onClick={() => gotoLobby()} class="pulse" disabled={!state.connected}>
            Go to lobby
          </button>
        </Match>
        <Match when={state.lobby}>
          <button onClick={() => leaveLobby()}>Leave lobby</button>
        </Match>
      </Switch>

      <Show when={!state.lobby}>
        <label classList={{ disabled: state.lobby }}>
          <input
            type="color"
            value={/*@once*/ state.player.colour}
            disabled={state.broadcast}
            onInput={ev => {
              setState("player", "colour", ev.target.value)
            }}
            onChange={ev => {
              setState("player", "colour", ev.target.value)
              sendMessage({ cmd: "update", players: [state.player] })
            }}
          />
          <span class="landscape">Your colour</span>
          <span class="portrait">Colour</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={/*@once*/ state.broadcast}
            onChange={ev => setState("broadcast", ev.target.checked)}
          />
          Broadcast
        </label>
      </Show>
    </fieldset>
  )
}
