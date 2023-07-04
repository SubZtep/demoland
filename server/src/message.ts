import WebSocket from "ws"
import { players, obstacles, getSerializedObstacles } from "./state.js"
import { sendMessage } from "./conn.js"

export function onMessage(data: WebSocket.RawData, binary: boolean, client: WebSocket, server: WebSocket.Server) {
  const msg = JSON.parse(data.toString()) as ClientMessage

  switch (msg.cmd) {
    case "create":
      // send the current state to the new client
      sendMessage(
        {
          cmd: "create",
          players: Array.from(players.values()),
          obstacles: getSerializedObstacles(obstacles),
        },
        client,
      )
      // add the new client(s) to the list of players
      msg.players?.forEach(player => players.set(client, {
        ...player,
      }))
      break

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
