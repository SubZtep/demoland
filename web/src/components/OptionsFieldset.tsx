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
          onInput={ev => {
            setState({ colour: ev.target.value })
          }}
          onChange={ev => {
            setState({ colour: ev.target.value })
            sendMessage({
              time: Date.now(),
              player: {
                id: state.id,
                colour: state.colour,
              },
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
                time: Date.now(),
                player: {
                  id: state.id,
                  colour: state.colour,
                  x: state.x,
                  y: state.y,
                },
              })
            } else {
              sendMessage({
                cmd: "bye",
                time: Date.now(),
                player: {
                  id: state.id,
                },
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
