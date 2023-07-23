import { Match, Switch } from "solid-js/web"
import { state, setState } from "../../state"

export default () => {
  return (
    <button onClick={() => setState("camera", !state.camera)}>
      <Switch>
        <Match when={!state.camera}>Turn On Camera</Match>
        <Match when={state.camera}>Turn Off Camera</Match>
      </Switch>
    </button>
  )
}
