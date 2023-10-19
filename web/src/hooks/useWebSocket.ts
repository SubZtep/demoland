import { type NormalizedLandmark } from "@mediapipe/tasks-vision"
import { useEffect, useRef, useState } from "react"

export default function useWebSocket(
  url: string,
  onMessage?: (data: { name: string; landmarks: NormalizedLandmark[] }) => void,
) {
  const [connected, setConnected] = useState(false)
  const ws = useRef<WebSocket>()

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.addEventListener("open", () => {
      setConnected(true)
    })

    ws.current.addEventListener("close", () => {
      setConnected(false)
    })

    ws.current.addEventListener("message", ({ data }) => {
      const msg = JSON.parse(data) // as ServerMessage
      onMessage?.(msg)
    })

    return () => {
      ws.current?.close()
    }
  }, [])

  return {
    connected,

    sendMessage(name: string, landmarks: NormalizedLandmark[]) {
      if (ws.current?.readyState === WebSocket.OPEN) {
        console.log("Sending", landmarks)
        ws.current.send(JSON.stringify({ name, landmarks }))
      }
    },
  }
}
