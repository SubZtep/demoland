import WebSocket from "ws"
import RAPIER from "@dimforge/rapier3d-compat"
import { obstacles, getSerializedObstacles, getSerializedPlayer } from "./state.js"
import { channels } from "./channels.js"
import { sendMessage } from "./conn.js"

const gravity = new RAPIER.Vector3(0, -9.81, 0)

export function onMessage(data: WebSocket.RawData, binary: boolean, client: WebSocket, server: WebSocket.Server) {
  const msg = JSON.parse(data.toString()) as ClientMessage
  console.log("RECEIVED", msg)

  switch (msg.cmd) {
    case "viewer-hi":
      const channel = channels.get(msg.channel)
      if (channel) {
        channel.viewers.add(client)
        sendMessage({ cmd: "create-obstacles", obstacles: getSerializedObstacles(obstacles) }, client)
        sendMessage({ cmd: "create-player", player: getSerializedPlayer(channel.player) }, client)
      } else {
        sendMessage({ cmd: "error", error: "Channel not found" }, client)
      }
      break

    case "viewer-bye":
      channels.get(msg.channel)?.viewers.delete(client)
      break

    case "player-hi":
      if (channels.has(msg.player.name)) {
        sendMessage({ cmd: "error", error: "Player already exists" }, client)
      } else {
        channels.set(msg.player.name, { player: msg.player, viewers: new Set(), world: new RAPIER.World(gravity) })
      }
      break

    case "player-bye":
      channels.delete(msg.player.name)
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

  // console.log("CHANNELS", Array.from(channels.keys()))

  // broadcast to all clients
  // server.clients.forEach(v => {
  //   if (v.readyState === WebSocket.OPEN) {
  //     v.send(data, { binary })
  //   }
  // })
}
