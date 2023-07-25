import { Switch, Match } from "solid-js"
import { state } from "./state"
import Viewer from "./components/Viewer"
import Home from "./components/Home"
import ThreeScene from "./components/gadgets/ThreeScene"
import DirectionalLight from "./components/3d/DirectionalLight"
import GridHelper from "./components/3d/GridHelper"

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
