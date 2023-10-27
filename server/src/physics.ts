import RAPIER from "@dimforge/rapier3d-compat"
import WebSocket from "ws"
import { Box } from "./objects/box.js"
import { obstacles } from "./state.js"
import { Player } from "./objects/player.js"

// const gravity = { x: 0.0, y: 0, z: 0.0 }
const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const frameLimit = 1000 / 30

let message: ServerMessage = {
  channel: "",
  // player,
  obstacles: [],
}

await RAPIER.init()
const world = new RAPIER.World(gravity)

const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
const groundCollider = world.createCollider(groundColliderDesc)
groundCollider.setTranslation({ x: 0, y: -0.1, z: 0 })

export const player = new Player(world)

export function startPhysics(server: WebSocket.Server) {
  const gameLoop = () => {
    world.step()

    // world.intersectionsWith(p.leftCollider, collider => console.log("Player left intersectred", collider))
    // world.intersectionsWith(p.rightCollider, collider => console.log("Player right intersectred", collider))

    message.player = player.serialize()

    obstacles.forEach(obstacle => {
      message.obstacles.push({
        id: obstacle.id,
        command: "move",
        position: obstacle.rigidBody.translation(),
        rotation: obstacle.rigidBody.rotation(),
      })
    })

    // console.log(JSON.stringify(message))

    // broadcast to all clients
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })

    message.obstacles = []

    setTimeout(gameLoop, frameLimit)
  }

  gameLoop()
}

setInterval(() => {
  if (obstacles.has("box")) {
    destroyBox("box")
  } else {
    createBox("box")
  }
}, 1500)

function createBox(id: string) {
  const box = new Box(world, id, { width: 0.5, height: 0.5, depth: 0.5 })
  box.position({ x: 0, y: 1, z: 0 })
  message.obstacles.push(box.serialize("create"))
  obstacles.set(id, box)
}

function destroyBox(id: string) {
  message.obstacles.push({ id, command: "destroy" })
  const box = obstacles.get(id)!
  world.removeCollider(box.collider, true)
  world.removeRigidBody(box.rigidBody)
  obstacles.delete(id)
}
