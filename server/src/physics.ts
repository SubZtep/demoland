import RAPIER from "@dimforge/rapier3d-compat"
import WebSocket from "ws"
import { getSerializedObstacles, obstacles } from "./state"

// const gravity = { x: 0.0, y: -9.81, z: 0.0 }
const frameLimit = 1000 / 30
const message: UpdateMessage = { cmd: "update" }

await RAPIER.init()
// const world = new RAPIER.World(gravity)

export async function startPhysics(server: WebSocket.Server) {
  // createObstacles(world, obstacles)
  const gameLoop = () => {
    // world.step()

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
        client.send(JSON.stringify(message))
      }
    })

    setTimeout(gameLoop, frameLimit)
  }

  // gameLoop()
}


export function createPlayerCollider() {
  // const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2, depth / 2)
  // obstacle.collider = world.createCollider(colliderDesc, obstacle.rigidBody)
}

export const createPlayerPhysics = (player: Player) => {
  const rigidBodies: RigidBody[] = []
  const colliders: Collider[] = []
  // const { x: px, y: py, z: pz } = player.position
  // console.log("player pos", [px, py, pz])
  // for (const { x, y, z } of player.landmarks) {
  //   // console.log("landmark pos", [x, y, z])

  //   const rigidBodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(x, y, z)
  //   const rigidBody = world.createRigidBody(rigidBodyDesc)
  //   rigidBodies.push(rigidBody)

  //   const groundColliderDesc = RAPIER.ColliderDesc.ball(0.06).setTranslation(x, y, z - 0.4)
  //   const collider = world.createCollider(groundColliderDesc, rigidBody)
  //   colliders.push(collider)
  // }
  return { rigidBodies, colliders }
}
