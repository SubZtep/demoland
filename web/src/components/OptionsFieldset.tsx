import { gotoLobby, leaveLobby } from "../app/lobby"
import { sendMessage } from "../lib/websocket"
import { state, setState } from "../app/state"
import styles from "./App.module.css"

export default () => {
  return (
    <fieldset class={styles.options}>
      <legend>Options</legend>

      <label classList={{ disabled: state.lobby }}>
        <input
          type="color"
          value={/*@once*/ state.player.colour}
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

      <label classList={{ disabled: !state.connected }}>
        <input
          type="checkbox"
          disabled={!state.connected}
          checked={state.lobby}
          onChange={ev => {
            if (ev.target.checked) {
              gotoLobby()
            } else {
              leaveLobby()
            }
          }}
        />
        Go to lobby
      </label>
    </fieldset>
  )
}
