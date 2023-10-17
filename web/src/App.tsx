import { useRef, useState } from "react"
import useWebSocket from "./hooks/useWebSocket"
import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import { POSE_LANDMARKS } from "./const"
import Player from "./player/Player"

export default function App() {
  // const channel = useRef(window.location.pathname.replaceAll("/", ""))
  const [message, setMessage] = useState<{ name: string; landmarks: NormalizedLandmark[] }>({
    name: "",
    landmarks: POSE_LANDMARKS,
  })
  const { connected, sendMessage } = useWebSocket(import.meta.env.VITE_WSPP, data => {
    // console.log("received", data)
    // setMessage(data)
  })

  return <Player sendMessage={sendMessage} />

  // // prettier-ignore
  // return connected && (
  //   channel.current
  //     ? <Viewer message={message} />
  //     : <Player sendMessage={sendMessage} />
  // )
}
