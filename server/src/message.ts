import WebSocket from "ws"
import { players } from "./state"

export function onMessage(data: WebSocket.RawData, binary: boolean, ws: WebSocket, wss: WebSocket.Server) {
  const { cmd, player } = JSON.parse(data.toString()) as Message

  if (player) {
    const isExists = players.has(ws)
    players.set(ws, isExists ? { ...players.get(ws)!, ...player } : (player as Player))

    if (!isExists) {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ cmd: "hi", player, time: Date.now() } as Message), { binary })
          // client.send(data, { binary })
        }
      })
    }
  }

  console.log("RECEIVED:", { cmd, player })

  if (cmd) {
    switch (cmd) {
      case "list":
        // console.log("SENDING:", JSON.stringify({ players: Array.from(players.values()) }))
        ws.send(JSON.stringify({ players: Array.from(players.values()) }))
        return
      case "bye":
        players.delete(ws)
        break
    }
  }

  // broadcast to all clients
  wss.clients.forEach(client => {
    // const isSender = client === ws
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, { binary })
    }
  })
}
