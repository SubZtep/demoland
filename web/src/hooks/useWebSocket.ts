import { createSignal } from "solid-js"
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision"
import { setState, state } from "../state"

function useWebSocket(url: string) {
  const socket = new WebSocket(url)
  const [connected, setConnected] = createSignal(false)

  socket.addEventListener("open", () => {
    setConnected(true)
  })

  socket.addEventListener("close", () => {
    setConnected(false)
  })

  return {
    connected,

    disconnect() {
      socket.close()
    },

    sendMessage(msg: ClientMessage) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg))
      }
    },

    onMessageReceived(cb: (msg: ServerMessage) => void) {
      socket.addEventListener("message", ({ data }) => {
        const msg = JSON.parse(data) as ServerMessage
        cb(msg)
      })
    },
  }
}

export default useWebSocket
