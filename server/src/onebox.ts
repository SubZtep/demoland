import RAPIER from "@dimforge/rapier3d-compat"
import WebSocket from "ws"
import { Player } from "./objects/player.js"
import { Box } from "./objects/box.js"

await RAPIER.init()
const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const world = new RAPIER.World(gravity)

const player = new Player(world)
const box1 = new Box(world)

export function onMessage(data: WebSocket.RawData, client: WebSocket, server: WebSocket.Server) {
  const { name, landmarks } = JSON.parse(data.toString()) as {
    name: string
    landmarks: { x: number; y: number; z: number }[]
  }

  const [right, left] = landmarks!
    .filter((_, index) => [19, 20].includes(index))
    .map(v => ({ x: v.x * -2, y: v.y * -2 + 1, z: v.z * -2 }))

  player.position({ x: left!.x, y: left!.y, z: left!.z }, { x: right!.x, y: right!.y, z: right!.z })

  world.step()

  if (world.intersectionPair(player.rightCollider, box1.collider)) {
    console.log("Bxox")
  }

  const sendMsg: ServerMessage = {
    channel: name,
    player: { left: left!, right: right! },
    obstacles: [],
  }

  // broadcast to all clients
  server.clients.forEach(c => {
    if (c !== client && c.readyState === WebSocket.OPEN) {
      c.send(JSON.stringify(sendMsg))
    }
  })
}
