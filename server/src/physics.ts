import RAPIER from "@dimforge/rapier3d-compat"
import WebSocket from "ws"

const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const frameLimit = 1000 / 30
const obstacles = new Map<string, any>()
const message: any = {}

export async function initPhysics(server: WebSocket.Server) {
  await RAPIER.init()

  const world = new RAPIER.World(gravity)

  // Create the ground
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0)
  world.createCollider(groundColliderDesc)

  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 100.0, 0.0)
  const rigidBody = world.createRigidBody(rigidBodyDesc)

  const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
  const collider = world.createCollider(colliderDesc, rigidBody)

  obstacles.set("box", { rigidBody, collider })

  const gameLoop = () => {
    world.step()

    // generate message
    message.obstacles = []
    obstacles.forEach((obstacle, id) => {
      message.obstacles.push({
        id,
        position: obstacle.rigidBody.translation(),
        rotation: obstacle.rigidBody.rotation(),
      })
    })

    // broadcast to all clients
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })

    setTimeout(gameLoop, frameLimit)
  }

  gameLoop()
}
