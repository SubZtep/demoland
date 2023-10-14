// import { Show, Switch, Match, onCleanup } from "solid-js"
// import { state } from "./state"
// import Viewer from "./components/Viewer"
// import Home from "./components/Home"
// import useWebSocket from "./hooks/useWebSocket"
import { useRef, useState } from "react"
import useWebSocket from "./hooks/useWebSocket"
import Player from "./player/Player"
import Viewer from "./viewer/Viewer"

export default function App() {
  const channel = useRef(window.location.pathname.replaceAll("/", ""))
  const [message, setMessage] = useState({})
  const { connected, sendMessage } = useWebSocket(import.meta.env.VITE_WSPP, data => {
    console.log("received", data)
    setMessage(data)
  })

  // prettier-ignore
  return connected && (
    channel.current
      ? <Viewer message={message} />
      : <Player sendMessage={sendMessage} />
  )

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
