import WebSocket from "ws"
import { players, obstacles } from "./state"
import { sendMessage } from "./init"

export function onMessage(data: WebSocket.RawData, binary: boolean, client: WebSocket, server: WebSocket.Server) {
  const msg = JSON.parse(data.toString()) as ClientMessage
  // console.log("received", msg)

  switch (msg.cmd) {
    case "hello":
      sendMessage(
        {
          cmd: "create",
          players: Array.from(players.values()),
          obstacles: Array.from(obstacles.values()),
        },
        client,
      )
      players.set(client, msg.player)
      sendMessage({
        cmd: "create",
        players: [msg.player],
      })
      return

    case "bye":
      players.delete(client)
      break
  }

  // broadcast to all clients
  server.clients.forEach(v => {
    if (v.readyState === WebSocket.OPEN) {
      v.send(data, { binary })
    }
  })
}
