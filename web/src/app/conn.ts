import { setState } from "../state"

export function createWebSocketConnection() {
  const socket = new WebSocket(import.meta.env.VITE_WSPP)

  socket.addEventListener("open", () => {
    setState({ connected: true })
  })

  socket.addEventListener("close", () => {
    setState({ connected: false, lobby: false })
  })

  const sendMessage = (msg: ClientMessage) => {
    if (socket.readyState === WebSocket.OPEN) {
      // console.log("sending", msg)
      socket.send(JSON.stringify(msg))
    }
  }

  return { socket, sendMessage }
}

export const { socket, sendMessage } = createWebSocketConnection()
