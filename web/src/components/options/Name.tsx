import { css } from "@emotion/css"
import { state, setState } from "../../state"

export default () => {
  return (
    <input
      type="text"
      value={/*@once*/ state.player.name}
      disabled={state.camera}
      placeholder="Enter your name"
      class={css`
        padding: 0.5rem;
      `}
      onInput={ev => {
        setState("player", "name", ev.target.value)
        localStorage.setItem("name", ev.target.value)
      }}
    />
  )
}
