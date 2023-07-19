import { css } from "@emotion/css"
import { Switch, Match, Show } from "solid-js"
import { gotoLobby, leaveLobby } from "../app/lobby"
import { sendMessage } from "../app/conn"
import { state, setState } from "../state"
import styles from "./App.module.css"

export default () => {
  return (
    <div
      class={
        styles.options +
        " " +
        css`
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          gap: 0.75rem;
          border-radius: var(--border-radius);

          input[type="radio"] {
            accent-color: pink;
          }

          label:has(input[type="radio"]):not(:first-of-type) {
            margin-left: 0.5rem;
          }
        `
      }
    >
      {/* <Switch>
        <Match when={!state.lobby}></Match>
        <Match when={state.lobby}>
          <button onClick={() => leaveLobby()}>Leave lobby</button>
        </Match>
      </Switch> */}
      <input
        type="text"
        value={/*@once*/ state.player.name}
        // disabled={state.broadcast}
        placeholder="Enter your name"
        class={css`
          padding: 0.5rem;
        `}
        onInput={ev => {
          setState("player", "name", ev.target.value)
          localStorage.setItem("name", ev.target.value)
        }}
      />

      <button onClick={() => setState("camera", !state.camera)}>
        <Switch>
          <Match when={!state.camera}>Turn On Camera</Match>
          <Match when={state.camera}>Turn Off Camera</Match>
        </Switch>
      </button>

      <button
        onClick={() => gotoLobby()}
        disabled={!state.connected || state.player.name.length === 0}
        class={
          css`
            text-transform: uppercase;
            font-size: 1.5rem;
            padding: 1rem;
            font-weight: 550;
            letter-spacing: 0.1rem;
          ` + " pulse"
        }
      >
        Start
      </button>

      <Show when={state.player.name.length > 0}>
        <div>
          Open
          <br />
          <strong>
            https://demo.land
            <br />/{state.player.name}
          </strong>
        </div>
      </Show>

      <fieldset disabled={state.camera}>
        <legend>Delegate</legend>
        <label>
          <input
            type="radio"
            name="delegate"
            value="CPU"
            checked={state.input.delegate === "CPU"}
            onChange={() => setState("input", "delegate", "CPU")}
          />{" "}
          CPU
        </label>
        <label>
          <input
            type="radio"
            name="delegate"
            value="GPU"
            checked={state.input.delegate === "GPU"}
            onChange={() => setState("input", "delegate", "GPU")}
          />{" "}
          GPU
        </label>
      </fieldset>

      <p>
        {state.input.width}x{state.input.height}
      </p>
      {/* <label>
        <input
          type="checkbox"
          checked={/ *@once* / state.broadcast}
          onChange={ev => setState("broadcast", ev.target.checked)}
        />
        Broadcast
      </label> */}
    </div>
  )
}
