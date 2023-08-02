import { state, setState } from "../../state"
// import { gotoLobby, leaveLobby } from "../../app/lobby"
import { css } from "@emotion/css"
import { type Component, createEffect } from "solid-js"
import { Match, Switch } from "solid-js/web"

const Start: Component<{ disabled: boolean }> = props => {
  createEffect(() => {
    if (state.playing) {
      // gotoLobby()
    } else {
      // leaveLobby()
    }
  })

  const isUnprepared = () => !state.connected || state.player.name.length === 0

  return (
    <Switch>
      <Match when={!state.playing}>
        <button
          onClick={() => setState("playing", true)}
          disabled={props.disabled || isUnprepared()}
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
      </Match>
      <Match when={state.playing}>
        <button
          onClick={() => setState("playing", false)}
          disabled={props.disabled || isUnprepared()}
          class={css`
            text-transform: uppercase;
            font-size: 1.5rem;
            padding: 1rem;
            font-weight: 550;
            letter-spacing: 0.1rem;
          `}
        >
          Stop
        </button>
      </Match>
    </Switch>
  )
}

export default Start
