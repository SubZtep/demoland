import { css } from "@emotion/css"
import { createEffect, createResource, createSignal } from "solid-js"
import { Show, Switch, Match } from "solid-js/web"
import { setState, state } from "../state"
import Name from "./options/Name"
import Camera from "./options/Camera"
import TaskSettings from "./options/TaskSettings"
import Start from "./options/Start"
import Debug from "./gadgets/Debug"

const fetchChannel = async () =>
  (await fetch(`${import.meta.env.VITE_API_HOST}/api/channel/${state.player.name}`)).json()

export default () => {
  const [channelData, { refetch }] = createResource(fetchChannel)

  createEffect(() => {
    state.player.name
    refetch()
  })

  createEffect(() => {
    setState("error", channelData()?.error)
  })

  return (
    <div
      class={css`
        padding: 0.5rem;
        display: grid;
        gap: 0.75rem;

        @media (orientation: portrait) {
          grid-template-columns: 1fr 1fr;
          & > *:nth-child(n + 3) {
            grid-column: 2 span;
          }
        }
      `}
    >
      <Name />

      <Camera />

      <TaskSettings />

      <Start disabled={state.player.name.length === 0 || channelData()?.error || channelData()?.exists} />

      {/* <Debug var={channelData()} /> */}

      <div>
        <Switch>
          <Match when={state.playing}>
            Open
            <br class="portrait" />{" "}
            <strong>
              {import.meta.env.VITE_APP_HOST}
              <br class="portrait" />/{state.player.name} 🎊
            </strong>
          </Match>
          <Match when={state.error}>{state.error}</Match>
          <Match when={!state.playing && !state.error!}>o.o</Match>
        </Switch>
      </div>

      {/* <p>
        {state.input.width}x{state.input.height}
      </p> */}
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
