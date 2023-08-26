// import { Show, Switch, Match, onCleanup } from "solid-js"
// import { state } from "./state"
// import Viewer from "./components/Viewer"
// import Home from "./components/Home"
// import useWebSocket from "./hooks/useWebSocket"

export default function App() {
  return <h1>Hello</h1>
  // const { connected, disconnect, sendMessage, onMessageReceived } = useWebSocket(import.meta.env.VITE_WSPP)

  // onCleanup(() => disconnect())

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
