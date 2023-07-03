import RAPIER from "@dimforge/rapier3d-compat"
import WebSocket from "ws"
import { getSerializedObstacles, obstacles } from "./state"

const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const frameLimit = 1000 / 30
const message: UpdateMessage = { cmd: "update" }

export async function initPhysics(server: WebSocket.Server) {
  await RAPIER.init()

  const world = new RAPIER.World(gravity)

  // create obstacles
  obstacles.forEach((obstacle, id) => {
    if (id === "ground") {
      // create the ground
      const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
      obstacle.rigidBody = world.createRigidBody(rigidBodyDesc)

      const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0).setTranslation(0.0, -0.1, 0.0)
      world.createCollider(groundColliderDesc, obstacle.rigidBody)
      obstacle.collider = groundColliderDesc
    } else {
      // create the box
      const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 10.0, 0.0)
      obstacle.rigidBody = world.createRigidBody(rigidBodyDesc)

      const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setDensity(2.0)
      obstacle.collider = world.createCollider(colliderDesc, obstacle.rigidBody)
    }
  })

  const gameLoop = () => {
    world.step()

    obstacles.forEach(obstacle => {
      if (obstacle.rigidBody) {
        obstacle.position = obstacle.rigidBody.translation()
        obstacle.rotation = obstacle.rigidBody.rotation()
      }
    })

    message.obstacles = getSerializedObstacles(obstacles).filter(v => v.id !== "ground")

    // broadcast to all clients
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // console.log("sending (physics.ts)", JSON.stringify(message))
        client.send(JSON.stringify(message))
      }
    })

    setTimeout(gameLoop, frameLimit)
  }

  gameLoop()
}
