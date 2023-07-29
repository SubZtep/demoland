import { Switch, Match } from "solid-js"
import { state } from "./state"
import Viewer from "./components/Viewer"
import Home from "./components/Home"

export default () => {
  return (
    <Switch>
      <Match when={state.channel}>
        <Viewer />
      </Match>
      <Match when={!state.channel}>
        <Home />
      </Match>
    </Switch>
  )
}
