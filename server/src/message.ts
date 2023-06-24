import WebSocket from "ws"
import { players } from "./state"

export function onMessage(data: WebSocket.RawData, binary: boolean, client: WebSocket, server: WebSocket.Server) {
  const { cmd, player } = JSON.parse(data.toString()) as Message

  if (player) {
    const isExists = players.has(client)
    if (!isExists) {
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ cmd: "hi", player, time: Date.now() } as Message))
        }
      })
    }
    players.set(client, isExists ? { ...players.get(client)!, ...player } : (player as Player))
  }

  if (cmd) {
    switch (cmd) {
      case "list":
        client.send(JSON.stringify({ players: Array.from(players.values()) }))
        return
      case "bye":
        players.delete(client)
        break
    }
  }

  // broadcast to all clients
  server.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data, { binary })
    }
  })
}
