// import { Show, Switch, Match, onCleanup } from "solid-js"
// import { state } from "./state"
// import Viewer from "./components/Viewer"
// import Home from "./components/Home"
// import useWebSocket from "./hooks/useWebSocket"
import Player from "./player/Player"

export default function App() {
  // return <div>Hello</div>
  // const { connected, disconnect, sendMessage, onMessageReceived } = useWebSocket(import.meta.env.VITE_WSPP)

  // onCleanup(() => disconnect())

  return <Player />

  // return (
  //   <Show when={connected}>
  //     <Switch>
  //       <Match when={state.channel}>
  //         <Viewer sendMessage={sendMessage} onMessageReceived={onMessageReceived} />
  //       </Match>
  //       <Match when={!state.channel}>
  //         <Home sendMessage={sendMessage} />
  //       </Match>
  //     </Switch>
  //   </Show>
  // )
}
