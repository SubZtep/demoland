import WebSocket from "ws"
import RAPIER from "@dimforge/rapier3d-compat"
import { players, obstacles, getSerializedObstacles } from "./state.js"
import { sendMessage } from "./conn.js"
import { createPlayerPhysics } from "./physics.js"
import { channels } from "./channels.js"

export function onMessage(data: WebSocket.RawData, binary: boolean, client: WebSocket, server: WebSocket.Server) {
  const msg = JSON.parse(data.toString()) as ClientMessage
  console.log("RECEIVED", msg)

  switch (msg.cmd) {
    case "viewer-hi":
      channels.get(msg.channel)?.viewers.add(client)
      sendMessage({
        cmd: "create-obstacles",
        obstacles: getSerializedObstacles(obstacles),
      }, client)
      break

    case "viewer-bye":
      channels.get(msg.channel)?.viewers.delete(client)
      break

    case "player-hi":
      if (channels.has(msg.player.name)) {
        sendMessage({
          cmd: "error",
          error: "Player already exists",
        }, client)
        break
      }
      channels.set(msg.player.name, {
        player: msg.player,
        world: new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0)),
        obstacles,
        viewers: new Set(),
      })
      break

    case "player-bye":
      channels.delete(msg.player.name)
      // FIXME: remove all references to this player
      break

    case "update":
      // msg.players?.filter(v => v.landmarks).forEach(player => {
      //   players.get(client)?.rigidBodies?.forEach((rigidBody, i) => {
      //     const { x, y, z } = player.landmarks![i]
      //     rigidBody.setTranslation(new RAPIER.Vector3(x, y, z), true)
      //   })
      // })
      break
  }

  console.log("CHANNELS", Array.from(channels.keys()))

  // broadcast to all clients
  // server.clients.forEach(v => {
  //   if (v.readyState === WebSocket.OPEN) {
  //     v.send(data, { binary })
  //   }
  // })
}
