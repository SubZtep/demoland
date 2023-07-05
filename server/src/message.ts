import WebSocket from "ws"
import RAPIER from "@dimforge/rapier3d-compat"
import { players, obstacles, getSerializedObstacles } from "./state.js"
import { sendMessage } from "./conn.js"
import { createPlayerPhysics } from "./physics.js"

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

      msg.players?.forEach(player => {
        players.set(client, {
          ...player,
          ...createPlayerPhysics(player),
        })
      })
      break

    case "update":
      msg.players?.forEach(player => {
        players.get(client)?.rigidBodies?.forEach((rigidBody, i) => {
          const { x, y, z } = player.landmarks[i]
          rigidBody.setTranslation(new RAPIER.Vector3(x, y, z), true)
        })
      })
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
