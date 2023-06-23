import { startMessageLoop, stopMessageLoop } from "../app/message"
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
          value={/*@once*/ state.colour}
          disabled={state.lobby}
          onInput={ev => {
            setState({ colour: ev.target.value })
            sendMessage({
              id: state.id,
              colour: state.colour,
              time: Date.now(),
            })
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
            const broadcast = ev.target.checked
            if (broadcast) {
              startMessageLoop(state.broadcastFPS)
              sendMessage({
                cmd: "list",
                id: state.id,
                colour: state.colour,
                time: Date.now(),
              })
            } else {
              sendMessage({
                cmd: "bye",
                id: state.id,
                time: Date.now(),
              })
              stopMessageLoop()
            }
            setState({ lobby: broadcast })
          }}
        />
        Go to lobby
      </label>
    </fieldset>
  )
}
